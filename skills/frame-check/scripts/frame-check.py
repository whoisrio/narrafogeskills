#!/usr/bin/env python3
"""
动画视频帧布局检查。

工作流:
  1. 找到视频(项目里 out/ 下的 .mp4/.mov/.webm/.mkv,或直接传入路径)。
  2. 用 ffmpeg 按每秒 1 帧(default)抽帧到临时目录。
  3. 把每一帧喂给本地 Ollama 视觉模型(qwen3.5:4b),逐项查布局问题。
  4. 汇总成 Markdown 报告 + JSON 摘要,文件名带时间戳,落到 out/。
     报告里每一条问题都标清"哪个视频 + 第几帧 + 时间戳";
     没问题的视频也明确写"无问题"。

用法(本脚本随 frame-check skill 分发,路径见该 skill 的 SKILL.md):
  python3 frame-check.py <视频或图片路径> [...] [选项]
  python3 frame-check.py --dir out/            # 递归发现 out/ 下所有视频
  python3 frame-check.py out/agent-loop.mp4
  python3 frame-check.py out/*.png             # 也支持单张图片(当 1 帧)

选项:
  --fps N          抽帧速率,默认 1(每秒 1 帧)
  --model NAME     Ollama 模型,默认 qwen3.5:4b(可用环境变量 FRAME_CHECK_MODEL)
  --ollama-url URL Ollama 服务地址,默认 http://localhost:11434(或环境变量 OLLAMA_URL)
  --dir DIR        递归发现该目录下的所有视频(可重复)
  --keep-frames    保留抽出的帧到 out/.frame-check-frames/<视频名>/(默认即保留)
  --no-keep-frames 检查完删除抽出的帧
  --out-dir DIR    报告输出目录,默认 out

环境变量:
  OLLAMA_URL           Ollama 地址
  FRAME_CHECK_MODEL    模型名

依赖: ffmpeg/ffprobe, Python requests + Pillow, 一个跑着的 Ollama。

退出码: 全部帧都 OK -> 0;有任一帧 ISSUE 或无法判定(UNKNOWN) -> 1。
"""

import sys
import os
import io
import re
import json
import base64
import shutil
import argparse
import subprocess
import warnings
from pathlib import Path
from datetime import datetime

# 系统 Python 的 urllib3 v2 对 LibreSSL 会发一条无害警告,在 import requests 前屏蔽掉,保持输出干净。
warnings.filterwarnings("ignore", message="urllib3 v2 only supports")

import requests

# --------------------------------------------------------------------------- #
# 常量
# --------------------------------------------------------------------------- #

DEFAULT_FPS = 1
DEFAULT_MODEL = os.environ.get("FRAME_CHECK_MODEL", "qwen3.5:4b")
DEFAULT_OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")
DEFAULT_OUT_DIR = "out"
FRAMES_FOLDER = "frames"  # 每轮目录内存放抽出帧的子目录名

VIDEO_EXTS = {".mp4", ".mov", ".webm", ".mkv", ".avi", ".m4v"}
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}

# 让模型逐项查布局,并在末尾输出一行机器可解析的结论。
PROMPT = """你是动画截图布局检查员。逐项检查这张动画截图是否存在以下布局问题:
0. 明显的布局问题
1. 文字重叠
2. 文字溢出容器或不清晰
3. 元素超界(超出画布或容器边界)
4. 连线断裂
5. 大面积空白
6. 流程图连线起止点未连到节点对应边的中心

逐项回答:有问题就简述位置和现象,没问题说"无"。
最后必须单独输出一行结论,严格用以下两种格式之一:
VERDICT: OK
VERDICT: ISSUE
(OK = 上述所有项均无问题; ISSUE = 任一项有问题)"""


# --------------------------------------------------------------------------- #
# 纯函数(可单测,不依赖外部服务)
# --------------------------------------------------------------------------- #

def format_timestamp(seconds):
    """秒数 -> "M:SS"。"""
    total = int(round(seconds))
    return f"{total // 60}:{total % 60:02d}"


def is_video(path):
    return Path(path).suffix.lower() in VIDEO_EXTS


def is_image(path):
    return Path(path).suffix.lower() in IMAGE_EXTS


def parse_verdict(text):
    """从模型输出里解析结论行。返回 'OK' / 'ISSUE' / 'UNKNOWN'。

    要求形如 'VERDICT: OK' 的独立 token,避免把正文中碰巧出现的字样误判。
    """
    if not text:
        return "UNKNOWN"
    m = re.search(r"verdict\s*:\s*([A-Za-z]+)", text, re.IGNORECASE)
    if not m:
        return "UNKNOWN"
    token = m.group(1).strip().lower()
    if token in ("ok", "pass", "good"):
        return "OK"
    if token in ("issue", "issues", "problem", "bad", "fail", "failed", "no"):
        return "ISSUE"
    return "UNKNOWN"


def report_filename(when, ext="md"):
    """生成带时间戳的报告文件名: frame-check-report-YYYYMMDD-HHMMSS.<ext>。"""
    stamp = when.strftime("%Y%m%d-%H%M%S")
    return f"frame-check-report-{stamp}.{ext}"


def round_dir_name(when):
    """每轮检查的目录名: frame-check-YYYYMMDD-HHMMSS。

    一轮的报告(frame-check-report-<ts>.md/.json)和抽出的帧(frames/<视频名>/)
    都放在这个目录里,按轮次互不覆盖,方便对照回看。
    """
    return f"frame-check-{when.strftime('%Y%m%d-%H%M%S')}"


def display_path(path):
    """返回更适合展示的路径:在当前工作目录下就用相对路径,否则原样返回。

    报告里用相对路径(如 out/foo.mp4)比绝对路径更易读;
    项目外的文件(如 /tmp/xxx)保持原样。
    """
    try:
        return str(Path(path).resolve().relative_to(Path.cwd()))
    except ValueError:
        return str(path)


def discover_videos(paths_or_dirs):
    """递归发现视频,自动排除 node_modules / .frame-check-frames / 隐藏目录。

    paths_or_dirs 可以混用文件和目录;传入文件时若是视频则直接收录。
    返回去重、排序后的绝对路径列表。
    """
    found = set()
    for p in paths_or_dirs:
        path = Path(p)
        if path.is_file():
            if is_video(path):
                found.add(str(path.resolve()))
            continue
        if not path.is_dir():
            continue
        for f in path.rglob("*"):
            if not f.is_file() or not is_video(f):
                continue
            parts = {x.lower() for x in f.parts}
            if "node_modules" in parts:
                continue
            # 跳过历史轮次目录(里面只有抽出的 png,不是真视频)
            if any(p.startswith("frame-check-") for p in parts):
                continue
            found.add(str(f.resolve()))
    return sorted(found)


def build_markdown_report(results, generated_at, model, ollama_url, fps):
    """把检查结果渲染成 Markdown 字符串。"""
    lines = []
    lines.append("# 动画帧布局检查报告")
    lines.append("")
    lines.append(f"- 生成时间: {generated_at}")
    lines.append(f"- 检查模型: {model} (ollama @ {ollama_url})")
    lines.append(f"- 抽帧速率: {fps} 帧/秒")
    lines.append(f"- 检查输入: {len(results)} 个")
    lines.append("")
    lines.append("## 汇总")
    lines.append("")
    lines.append("| 输入 | 类型 | 时长 | 抽帧数 | 结果 |")
    lines.append("| --- | --- | --- | --- | --- |")
    for r in results:
        dur = format_timestamp(r["duration_seconds"]) if r["duration_seconds"] is not None else "—"
        n = len(r["frames"])
        if r["ok"]:
            status = "✓ 无问题"
        else:
            issue_n = sum(1 for f in r["frames"] if f["verdict"] == "ISSUE")
            unknown_n = sum(1 for f in r["frames"] if f["verdict"] == "UNKNOWN")
            status = f"✗ 有问题 ({issue_n} 帧有问题"
            if unknown_n:
                status += f", {unknown_n} 帧待复核"
            status += ")"
        lines.append(f"| {r['path']} | {r['kind']} | {dur} | {n} | {status} |")
    lines.append("")
    lines.append("---")
    lines.append("")

    for r in results:
        lines.append(f"## {r['path']}")
        lines.append("")
        if r["duration_seconds"] is not None:
            meta = (f"- 类型: {r['kind']} · 时长 {format_timestamp(r['duration_seconds'])}"
                    f" · 抽帧 {len(r['frames'])} 张 (每秒 {r['fps']} 帧)")
        else:
            meta = f"- 类型: {r['kind']} · 共 {len(r['frames'])} 张"
        lines.append(meta)
        if r.get("frames_dir"):
            lines.append(f"- 帧目录: {r['frames_dir']}")
        lines.append(f"- 结果: {'✓ 无问题' if r['ok'] else '✗ 有问题'}")
        lines.append("")

        issue_frames = [f for f in r["frames"] if f["verdict"] == "ISSUE"]
        unknown_frames = [f for f in r["frames"] if f["verdict"] == "UNKNOWN"]
        ok_frames = [f for f in r["frames"] if f["verdict"] == "OK"]

        if issue_frames:
            lines.append("### 有问题的帧")
            lines.append("")
            for f in issue_frames:
                lines.append(f"**帧 {f['frame']} ({f['timestamp']})**")
                lines.append("")
                for line in f["report"].splitlines():
                    lines.append(f"> {line}" if line else ">")
                if f.get("frame_path"):
                    lines.append("")
                    lines.append(f"_帧图片: {f['frame_path']}_")
                lines.append("")

        if unknown_frames:
            lines.append("### 待复核的帧(模型未给出明确结论)")
            lines.append("")
            for f in unknown_frames:
                lines.append(f"**帧 {f['frame']} ({f['timestamp']})**")
                lines.append("")
                for line in f["report"].splitlines():
                    lines.append(f"> {line}" if line else ">")
                if f.get("frame_path"):
                    lines.append("")
                    lines.append(f"_帧图片: {f['frame_path']}_")
                lines.append("")

        if ok_frames:
            lines.append("### 通过的帧")
            lines.append("")
            joined = "、".join(f"帧 {f['frame']} ({f['timestamp']})" for f in ok_frames)
            lines.append(joined)
            lines.append("")

        if r["ok"]:
            lines.append(f"全部 {len(r['frames'])} 帧检查通过,未发现布局问题。")
            lines.append("")

        lines.append("---")
        lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def build_json_report(results, generated_at, model, ollama_url, fps):
    return {
        "generated_at": generated_at,
        "model": model,
        "ollama_url": ollama_url,
        "fps": fps,
        "input_count": len(results),
        "all_ok": all(r["ok"] for r in results),
        "videos": [
            {
                "path": r["path"],
                "kind": r["kind"],
                "duration_seconds": r["duration_seconds"],
                "fps": r["fps"],
                "frame_count": len(r["frames"]),
                "ok": r["ok"],
                "frames": r["frames"],
            }
            for r in results
        ],
    }


# --------------------------------------------------------------------------- #
# I/O 函数(ffmpeg / ollama)
# --------------------------------------------------------------------------- #

def get_duration(video_path):
    """用 ffprobe 取视频时长(秒),失败返回 None。"""
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", str(video_path)],
            capture_output=True, text=True, check=True,
        )
        return float(out.stdout.strip())
    except Exception:
        return None


def extract_frames(video_path, fps, out_dir):
    """用 ffmpeg 按 fps 抽帧到 out_dir。

    返回 [{frame, timestamp, frame_path}, ...],frame 从 0 开始,
    timestamp 为该帧在视频中的秒数(M:SS 由调用方按需格式化)。
    """
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    pattern = str(out_dir / "frame_%06d.png")
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
         "-i", str(video_path), "-vf", f"fps={fps}", pattern],
        check=True,
    )
    files = sorted(out_dir.glob("frame_*.png"))
    frames = []
    for i, f in enumerate(files):
        # ffmpeg 从 1 开始编号;第 N 个文件对应 t=(N-1)/fps 秒
        sec = i / fps
        frames.append({
            "frame": i,
            "timestamp": format_timestamp(sec),
            "frame_path": str(f),
        })
    return frames


def _image_to_b64(image_path, max_width=960):
    """打开图片,超过 max_width 则等比缩小,返回 base64 PNG。"""
    from PIL import Image
    img = Image.open(image_path).convert("RGB")
    if img.width > max_width:
        img.thumbnail((max_width, int(max_width * img.height / img.width)))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()


def check_frame(image_path, model, ollama_url, timeout=120):
    """把单帧交给 Ollama 视觉模型,返回模型原文。"""
    img_b64 = _image_to_b64(image_path)
    resp = requests.post(
        f"{ollama_url}/api/chat",
        json={
            "model": model,
            "messages": [
                {"role": "system", "content": "/no_think"},
                {"role": "user", "content": PROMPT, "images": [img_b64]},
            ],
            "stream": False,
            "think": False,
            "options": {"num_ctx": 4096, "num_predict": 500, "temperature": 0.1},
        },
        timeout=timeout,
    )
    resp.raise_for_status()
    return resp.json()["message"]["content"].strip()


# --------------------------------------------------------------------------- #
# 流程编排
# --------------------------------------------------------------------------- #

def check_input(path, fps, model, ollama_url, round_dir):
    """检查单个输入(视频或图片),返回一个 result dict。

    视频抽出的帧放到 round_dir/frames/<视频名>/;图片直接用原文件,不复制。
    帧的保留/删除由 main 统一处理(便于清空整个 frames/ 目录)。
    """
    path = Path(path)
    frames_dir = None
    raw_frames = []  # [{frame, timestamp, frame_path}]

    if is_image(path):
        # 图片当成单帧,直接用原文件路径
        raw_frames = [{"frame": 0, "timestamp": "静帧", "frame_path": display_path(path)}]
        kind = "image"
        duration = None
    else:
        kind = "video"
        duration = get_duration(path)
        frames_dir = Path(round_dir) / FRAMES_FOLDER / path.stem
        if frames_dir.exists():
            shutil.rmtree(frames_dir)
        raw_frames = extract_frames(path, fps=fps, out_dir=frames_dir)

    checked = []
    for rf in raw_frames:
        fpath = rf["frame_path"]
        print(f"  · 帧 {rf['frame']} ({rf['timestamp']}) ...", end=" ", flush=True)
        try:
            report = check_frame(fpath, model, ollama_url)
        except Exception as e:
            print("✗ 模型调用失败")
            checked.append({**rf, "frame_path": display_path(rf["frame_path"]), "verdict": "UNKNOWN", "report": f"[模型调用失败] {e}"})
            continue
        verdict = parse_verdict(report)
        mark = {"OK": "✓", "ISSUE": "✗", "UNKNOWN": "?"}[verdict]
        print(f"{mark} {verdict}")
        checked.append({**rf, "frame_path": display_path(rf["frame_path"]), "verdict": verdict, "report": report})

    ok = all(c["verdict"] == "OK" for c in checked) and len(checked) > 0

    return {
        "path": display_path(path),
        "kind": kind,
        "duration_seconds": duration,
        "fps": fps,
        "frames_dir": display_path(frames_dir) if (is_video(path) and frames_dir) else "",
        "frames": checked,
        "ok": ok,
    }


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="动画视频帧布局检查:抽帧 + Ollama 视觉模型逐帧查布局,输出带时间戳的 Markdown/JSON 报告。"
    )
    parser.add_argument("inputs", nargs="*", help="视频或图片路径(支持通配符)")
    parser.add_argument("--dir", dest="dirs", action="append", default=[],
                        help="递归发现该目录下的所有视频(可重复)")
    parser.add_argument("--fps", type=float, default=DEFAULT_FPS, help=f"抽帧速率,默认 {DEFAULT_FPS}")
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"Ollama 模型,默认 {DEFAULT_MODEL}")
    parser.add_argument("--ollama-url", default=DEFAULT_OLLAMA_URL, help="Ollama 地址")
    parser.add_argument("--out-dir", default=DEFAULT_OUT_DIR, help="报告输出目录,默认 out")
    frame_group = parser.add_mutually_exclusive_group()
    frame_group.add_argument("--keep-frames", dest="keep_frames", action="store_true", default=True,
                             help="保留抽出的帧(默认)")
    frame_group.add_argument("--no-keep-frames", dest="keep_frames", action="store_false",
                             help="检查完删除抽出的帧")
    args = parser.parse_args(argv)

    # 收集要检查的输入(视频 + 图片)
    videos = []
    for d in args.dirs:
        videos.extend(discover_videos([d]))
    for pat in args.inputs:
        # 支持 shell 通配符与直接路径
        from glob import glob
        matches = glob(pat) or ([pat] if Path(pat).exists() else [])
        for m in matches:
            if is_video(m) or is_image(m):
                videos.append(str(Path(m).resolve()))
    # 去重保序
    seen = set()
    inputs = []
    for v in videos:
        if v not in seen:
            seen.add(v)
            inputs.append(v)

    if not inputs:
        parser.error(
            "没有找到可检查的视频或图片。\n"
            "  先渲染一个视频: npx remotion render <Composition> out/<name>.mp4\n"
            f"  再检查:          python3 {sys.argv[0]} out/<name>.mp4\n"
            f"  或自动发现:      python3 {sys.argv[0]} --dir out"
        )

    # 前置检查
    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            print(f"[错误] 缺少 {tool},请先安装 ffmpeg。", file=sys.stderr)
            sys.exit(2)

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # 每轮检查一个目录:报告 + 抽出的帧都放这里,按轮次互不覆盖
    now = datetime.now()
    round_dir = out_dir / round_dir_name(now)
    round_dir.mkdir(parents=True, exist_ok=True)
    generated_at = now.strftime("%Y-%m-%d %H:%M:%S")

    print(f"检查 {len(inputs)} 个输入,模型 {args.model},抽帧 {args.fps} fps")
    print(f"输出目录: {out_dir.resolve()}  ← 报告和帧都写到这里(务必是你要检查的项目的 out/)")
    print(f"本轮目录: {display_path(round_dir)}")
    results = []
    for p in inputs:
        print(f"\n=== {display_path(p)} ===")
        try:
            results.append(check_input(p, fps=args.fps, model=args.model,
                                       ollama_url=args.ollama_url, round_dir=round_dir))
        except subprocess.CalledProcessError as e:
            print(f"  ✗ 抽帧失败: {e}")
            results.append({
                "path": display_path(p), "kind": "video" if is_video(p) else "image",
                "duration_seconds": None, "fps": args.fps, "frames_dir": "",
                "frames": [], "ok": False,
            })

    # --no-keep-frames: 删除本轮抽出的所有帧,并清空报告里的帧路径引用
    # (图片输入的 frame_path 指向用户原文件,仍然有效,不动)
    if not args.keep_frames:
        shutil.rmtree(round_dir / FRAMES_FOLDER, ignore_errors=True)
        for r in results:
            if r["kind"] == "video":
                r["frames_dir"] = ""
                for f in r["frames"]:
                    f["frame_path"] = ""

    md_path = round_dir / report_filename(now, "md")
    json_path = round_dir / report_filename(now, "json")

    md = build_markdown_report(results, generated_at, args.model, args.ollama_url, args.fps)
    md_path.write_text(md, encoding="utf-8")
    json_path.write_text(
        json.dumps(build_json_report(results, generated_at, args.model,
                                     args.ollama_url, args.fps),
                   ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    all_ok = all(r["ok"] for r in results)
    print(f"\n报告: {display_path(md_path)}")
    print(f"JSON: {display_path(json_path)}")
    print(f"结果: {'全部正常 ✓' if all_ok else '有问题 ✗'}")
    sys.exit(0 if all_ok else 1)


if __name__ == "__main__":
    main()
