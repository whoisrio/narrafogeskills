---
name: frame-check
description: 用本地 Ollama 视觉模型逐帧检查渲染出来的动画视频有没有布局问题(文字重叠/溢出/超界/连线断裂/大面积空白/连线没居中连到节点)。自动从视频按每秒 1 帧抽帧、逐帧喂模型,产出带时间戳的 Markdown + JSON 报告,每条问题都标清"哪个视频 + 第几帧 + 时间戳",没问题的视频也明确写"无问题"。当用户渲染完动画想验收画面、想找布局 bug、提到抽帧/帧检查/布局检查/视觉验收/QA 动画/检查文字重叠或溢出或连线断裂、或问"这段动画有没有画崩"时,必须使用本 skill。
---

# Frame Check:动画视频逐帧布局检查

把渲染出来的动画视频,**逐帧**用本地 Ollama 视觉模型(qwen3.5:4b)查布局问题,写成报告说清"哪个视频的哪一帧有什么问题"。

## 它解决什么

人眼逐帧拖视频找布局 bug 很累还容易漏。本 skill 把这事自动化:抽帧 -> 模型逐帧查 6 类布局问题 -> 报告标清每条问题对应的视频和帧。
模型只查"布局"层面(文字重叠/溢出/超界/连线断裂/空白/连线居中),不查内容语义对不对--那是导演的活。

## 前置依赖

- ffmpeg / ffprobe(抽帧 + 取时长)
- Python 3 + `requests` + `Pillow`
- 一个跑着的 Ollama,且已拉视觉模型:`ollama pull qwen3.5:4b`
  - 服务地址默认 http://localhost:11434,可用环境变量 `OLLAMA_URL` 改
  - 模型默认 qwen3.5:4b,可用 `--model` 或环境变量 `FRAME_CHECK_MODEL` 改

## 工作流

### 第 1 步:找到(或先渲染)要检查的视频

先看项目里有没有现成视频(本项目是 Remotion 工程,渲染产物约定放 `out/`):

```
find out -maxdepth 2 -type f \( -name '*.mp4' -o -name '*.mov' -o -name '*.webm' -o -name '*.mkv' \)
```

**如果没有视频,先渲染**:

```
npx remotion render <CompositionId> out/<name>.mp4
```

CompositionId 见 `src/Root.tsx`(如 `AgentLoop`、`VectorSearch`、`DarkBotanicalTrainingCost`、`ModernTechAgentLoop` 等)。
渲染较慢;检查布局通常只需短片段,可加 `--frames=0-90` 只渲前几秒加速。

也支持直接传单张 PNG/JPG(当 1 帧检查),适合已经导出静帧的情况。

### 第 2 步:跑检查

> ⚠️ **输出位置很重要**:报告和抽出的帧默认写到**运行脚本时的工作目录(CWD)下的 `out/`**——也就是你正在检查的项目的 `out/`,**不是 skill 自己的目录**。所以**务必在你要检查的项目根目录下运行**脚本(或用 `--out-dir <项目绝对路径>/out` 显式指定),否则会把报告写进 `~/.agents/skills/frame-check/out/` 污染 skill。脚本启动时会打印绝对输出目录,留意确认它指向项目而不是 skill 目录。

本 skill 自带脚本 `scripts/frame-check.py`(随 skill 分发在 skill 目录的 `scripts/` 下;引用时按 skill 相对路径解析为绝对路径)。在**项目根目录**运行:

```
# 检查指定视频(scripts/frame-check.py 是 skill 自带脚本;out/... 是项目里的视频)
python3 scripts/frame-check.py out/agent-loop.mp4

# 递归发现 out/ 下所有视频一起检查(自动排除 node_modules 和历史轮次目录)
python3 scripts/frame-check.py --dir out

# 也支持图片(当 1 帧)
python3 scripts/frame-check.py out/dl-tokenseq.png

# 多个一起
python3 scripts/frame-check.py out/a.mp4 out/b.mp4 'out/*.png'
```

常用选项:

- `--fps N` 抽帧速率,默认 1(每秒 1 帧)
- `--model NAME` / `--ollama-url URL` 换模型或服务地址
- `--no-keep-frames` 检查完删掉抽出的帧(默认保留,见下文“轮次目录”)
- `--out-dir DIR` 报告输出目录,默认 `out`

脚本会逐帧实时打印 `✓`(OK)/ `✗`(ISSUE)/ `?`(模型没给明确结论,需人工复核)。

### 第 3 步:读报告

每次运行(一轮)在 `out/` 下建一个**轮次目录** `frame-check-YYYYMMDD-HHMMSS/`,把这一轮的报告和抽出的帧都放进去,按轮次互不覆盖——可以回看任意一轮的帧图片,不会被下一轮覆盖:

```
out/frame-check-20260813-104432/
├── frame-check-report-20260813-104432.md   # 人读
├── frame-check-report-20260813-104432.json  # 程序读
└── frames/                                  # 抽出的帧(--no-keep-frames 时删)
    └── <视频名>/
        ├── frame_000001.png
        └── ...
```

报告文件名同样带时间戳;轮次目录名和报告文件名共用同一个时间戳,方便对应。

Markdown 报告结构:

- 顶部汇总表:每个输入一行(类型 / 时长 / 抽帧数 / 结果)
- 每个输入一节:
  - **有问题的帧**:每帧标 `帧 N (M:SS)`,列模型逐项描述 + 修复方向,附帧图片路径
  - **待复核的帧**:模型没给明确结论的(标 `?`)
  - **通过的帧**:列出帧号
  - **没问题的视频也会明确写"全部 N 帧检查通过,未发现布局问题。"** — 不会因为没问题就略过

退出码:全部帧 OK -> `0`;有任一帧 ISSUE 或待复核 -> `1`。可在 CI / 脚本里据此判断。

## 检查的 6 类布局问题

0. 明显的布局问题
1. 文字重叠
2. 文字溢出容器或不清晰
3. 元素超界(超出画布/容器边界)
4. 连线断裂
5. 大面积空白
6. 流程图连线起止点未连到节点对应边的中心

模型对每项回答有/没有并描述位置,最后输出 `VERDICT: OK` 或 `VERDICT: ISSUE` 供脚本解析。

## 怎么用结果修 bug

报告里每条问题都带"帧号 + 时间戳 + 帧图片路径"。对照帧图片定位问题:

- 文字重叠 / 溢出 -> 调组件 layout / 字号 / 容器尺寸
- 元素超界 -> 检查 `SceneScaler` 或绝对定位坐标
- 连线断裂 / 未居中 -> 检查 FlowArrow / Edge 的起止点坐标计算
- 大面积空白 -> 考虑拆分该帧对应的场景,或加内容驱动运动

修完重渲该片段,再跑一次本 skill 验证。

## 注意

- 小模型(qwen3.5:4b)会偶发误判,`?` 待复核的帧务必人工看一眼;关键帧建议配合人眼复查。
- 默认每秒 1 帧,适合查“静态布局”类问题;动画过程中的瞬时错位(亚秒级)可能抽不到,需要时用 `--fps 2` 加密。
- 每轮输出一个 `out/frame-check-<时间戳>/` 目录(报告 + 帧);历史轮次会累积,定期清:`rm -rf out/frame-check-*`。`--no-keep-frames` 只删帧、留报告。
- 脚本实现 + 单元/集成测试随 skill 分发在 `scripts/frame-check.py` 与 `scripts/test_frame_check.py`(可用 `python3 scripts/test_frame_check.py` 回归)。
