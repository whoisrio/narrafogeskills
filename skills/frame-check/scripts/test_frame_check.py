#!/usr/bin/env python3
"""
frame-check.py 的单元 + 集成测试。
纯函数(时间格式/判定/报告生成/发现)走 unittest;
抽帧走集成测试(用 ffmpeg 生成 3s 合成视频,验证 1fps 抽帧数量与命名)。

运行:
  python3 scripts/test_frame_check.py
"""

import os
import sys
import json
import shutil
import subprocess
import tempfile
import unittest
from datetime import datetime
from pathlib import Path

# 让测试能 import 同目录的 frame-check.py(文件名带连字符,不是合法模块名,用 importlib 加载)
import importlib.util
_script_path = Path(__file__).resolve().parent / "frame-check.py"
_spec = importlib.util.spec_from_file_location("frame_check", _script_path)
fc = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(fc)  # noqa: E402


class TestFormatTimestamp(unittest.TestCase):
    def test_zero(self):
        self.assertEqual(fc.format_timestamp(0), "0:00")

    def test_single_digit_seconds(self):
        self.assertEqual(fc.format_timestamp(7), "0:07")

    def test_roll_over_minute(self):
        self.assertEqual(fc.format_timestamp(65), "1:05")

    def test_two_digits_seconds(self):
        self.assertEqual(fc.format_timestamp(59), "0:59")

    def test_multi_minute(self):
        self.assertEqual(fc.format_timestamp(125), "2:05")


class TestPathClassification(unittest.TestCase):
    def test_video_extensions(self):
        for ext in (".mp4", ".mov", ".webm", ".mkv", ".MP4", ".WebM"):
            self.assertTrue(fc.is_video(f"a{ext}"), ext)

    def test_non_video(self):
        self.assertFalse(fc.is_video("a.png"))
        self.assertFalse(fc.is_video("a.txt"))

    def test_image_extensions(self):
        for ext in (".png", ".jpg", ".jpeg", ".webp", ".PNG", ".Jpg"):
            self.assertTrue(fc.is_image(f"a{ext}"), ext)

    def test_non_image(self):
        self.assertFalse(fc.is_image("a.mp4"))
        self.assertFalse(fc.is_image("a.txt"))


class TestParseVerdict(unittest.TestCase):
    def test_ok(self):
        self.assertEqual(fc.parse_verdict("各项检查...\nVERDICT: OK"), "OK")

    def test_issue(self):
        self.assertEqual(fc.parse_verdict("文字重叠...\nVERDICT: ISSUE"), "ISSUE")

    def test_case_insensitive(self):
        self.assertEqual(fc.parse_verdict("verdict: ok"), "OK")
        self.assertEqual(fc.parse_verdict("Verdict: Issue"), "ISSUE")

    def test_no_verdict_line(self):
        self.assertEqual(fc.parse_verdict("没有任何结论行"), "UNKNOWN")

    def test_verdict_must_be_on_its_own_token(self):
        # "VERDICTOK" 不应误判
        self.assertEqual(fc.parse_verdict("someVERDICTOK text"), "UNKNOWN")


class TestReportFilename(unittest.TestCase):
    def test_md_filename_has_timestamp(self):
        ts = datetime(2026, 8, 12, 15, 30, 45)
        name = fc.report_filename(ts, ext="md")
        self.assertEqual(name, "frame-check-report-20260812-153045.md")

    def test_json_filename_has_timestamp(self):
        ts = datetime(2026, 8, 12, 8, 5, 9)
        name = fc.report_filename(ts, ext="json")
        self.assertEqual(name, "frame-check-report-20260812-080509.json")


class TestRoundDirName(unittest.TestCase):
    def test_round_dir_has_timestamp(self):
        ts = datetime(2026, 8, 12, 15, 30, 45)
        self.assertEqual(fc.round_dir_name(ts), "frame-check-20260812-153045")


class TestBuildMarkdownReport(unittest.TestCase):
    def _video_result(self, ok=False):
        # 一个 3 帧、第 1 帧有问题的视频结果
        frames = [
            {"frame": 0, "timestamp": "0:00", "verdict": "OK",
             "report": "全部无问题\nVERDICT: OK", "frame_path": "out/.f/f0.png"},
            {"frame": 1, "timestamp": "0:01", "verdict": "ISSUE",
             "report": "文字重叠: 是。\nVERDICT: ISSUE", "frame_path": "out/.f/f1.png"},
            {"frame": 2, "timestamp": "0:02", "verdict": "OK",
             "report": "无\nVERDICT: OK", "frame_path": "out/.f/f2.png"},
        ]
        return {
            "path": "out/agent-loop.mp4",
            "kind": "video",
            "duration_seconds": 3.0,
            "fps": 1,
            "frames_dir": "out/.frame-check-frames/agent-loop",
            "frames": frames,
            "ok": ok,
        }

    def test_contains_video_path_and_frame_and_timestamp(self):
        md = fc.build_markdown_report(
            results=[self._video_result(ok=False)],
            generated_at="2026-08-12 15:30:45",
            model="qwen3.5:4b",
            ollama_url="http://localhost:11434",
            fps=1,
        )
        # 必须说清楚"哪个视频" + "哪一帧" + 时间戳
        self.assertIn("out/agent-loop.mp4", md)
        self.assertIn("帧 1", md)
        self.assertIn("0:01", md)
        # 汇总表里要标有问题
        self.assertIn("有问题", md)

    def test_clean_video_explicitly_says_no_problem(self):
        clean = {
            "path": "out/vector-search.mp4", "kind": "video",
            "duration_seconds": 2.0, "fps": 1,
            "frames_dir": "out/.frame-check-frames/vector-search",
            "frames": [
                {"frame": 0, "timestamp": "0:00", "verdict": "OK",
                 "report": "无\nVERDICT: OK", "frame_path": "..."},
                {"frame": 1, "timestamp": "0:01", "verdict": "OK",
                 "report": "无\nVERDICT: OK", "frame_path": "..."},
            ],
            "ok": True,
        }
        md = fc.build_markdown_report(
            results=[clean],
            generated_at="2026-08-12 15:30:45",
            model="qwen3.5:4b",
            ollama_url="http://localhost:11434",
            fps=1,
        )
        # 没问题的视频也必须明确写"无问题"
        self.assertIn("out/vector-search.mp4", md)
        self.assertIn("无问题", md)


class TestBuildJsonReport(unittest.TestCase):
    def test_structure(self):
        res = self._clean_result()
        data = fc.build_json_report(
            results=[res],
            generated_at="2026-08-12T15:30:45",
            model="qwen3.5:4b",
            ollama_url="http://localhost:11434",
            fps=1,
        )
        self.assertIn("generated_at", data)
        self.assertIn("videos", data)
        self.assertEqual(data["videos"][0]["path"], "out/v.mp4")
        self.assertTrue(data["videos"][0]["ok"])
        self.assertTrue(data["all_ok"])
        # json 可序列化
        json.dumps(data)

    def _clean_result(self):
        return {
            "path": "out/v.mp4", "kind": "video", "duration_seconds": 1.0,
            "fps": 1, "frames_dir": "x",
            "frames": [{"frame": 0, "timestamp": "0:00", "verdict": "OK",
                        "report": "VERDICT: OK", "frame_path": "x/f0.png"}],
            "ok": True,
        }


class TestDiscoverInputs(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        d = Path(self.tmp)
        (d / "a.mp4").write_bytes(b"")
        (d / "b.MOV").write_bytes(b"")
        (d / "c.png").write_bytes(b"")
        (d / "d.txt").write_bytes(b"")
        (d / "sub").mkdir()
        (d / "sub" / "e.webm").write_bytes(b"")
        (d / "node_modules").mkdir()
        (d / "node_modules" / "f.mp4").write_bytes(b"")
        # 历史轮次目录里的"视频"不应被发现(里面本该是抽出的 png)
        (d / "frame-check-20260101-120000").mkdir()
        (d / "frame-check-20260101-120000" / "frames").mkdir()
        (d / "frame-check-20260101-120000" / "frames" / "x").mkdir()
        (d / "frame-check-20260101-120000" / "frames" / "x" / "leftover.mp4").write_bytes(b"")

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_discovers_videos_recursively_excluding_node_modules(self):
        vids = fc.discover_videos([self.tmp])
        names = sorted(Path(v).name for v in vids)
        self.assertEqual(names, ["a.mp4", "b.MOV", "e.webm"])


class TestExtractFramesIntegration(unittest.TestCase):
    """用 ffmpeg 造一个 3s 合成视频,验证 1fps 抽帧。"""

    @classmethod
    def setUpClass(cls):
        if not shutil.which("ffmpeg"):
            raise unittest.SkipTest("ffmpeg not installed")
        cls.tmp = tempfile.mkdtemp()
        cls.video = str(Path(cls.tmp) / "synth.mp4")
        # testsrc 生成 3s 视频, 1fps 采样 => 期望 3 帧(t=0,1,2)
        subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
             "-f", "lavfi", "-i", "testsrc=size=320x240:rate=30",
             "-t", "3", "-pix_fmt", "yuv420p", cls.video],
            check=True,
        )

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.tmp, ignore_errors=True)

    def test_extract_frames_count_and_naming(self):
        out_dir = Path(self.tmp) / "frames"
        out_dir.mkdir()
        frames = fc.extract_frames(self.video, fps=1, out_dir=out_dir)
        # 3s @ 1fps => 3 帧
        self.assertEqual(len(frames), 3)
        # 帧索引 0-based,时间戳 0:00 / 0:01 / 0:02
        self.assertEqual(frames[0]["frame"], 0)
        self.assertEqual(frames[0]["timestamp"], "0:00")
        self.assertEqual(frames[1]["frame"], 1)
        self.assertEqual(frames[1]["timestamp"], "0:01")
        self.assertEqual(frames[2]["frame"], 2)
        self.assertEqual(frames[2]["timestamp"], "0:02")
        # 帧文件确实存在
        for f in frames:
            self.assertTrue(Path(f["frame_path"]).exists())

    def test_duration(self):
        dur = fc.get_duration(self.video)
        self.assertAlmostEqual(dur, 3.0, places=1)


if __name__ == "__main__":
    unittest.main(verbosity=2)
