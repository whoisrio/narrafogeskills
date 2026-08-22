---
name: animation-design-extraction
description: 从任意视频中提取动画设计思路——用 ffmpeg scene 检测 + srt 字幕反查 + 密抽帧 + 人工标注,产出"旁白→动画设计"对照表与设计规范。用于学某个视频号的视觉语言、做视频设计规范沉淀、跨视频横向对比。当用户给一个视频(本机或刚下载)要分析它的动画设计思路/视觉语言、或下载了一组参考视频想反推共性设计范式时,使用本 skill。
---

# Animation Design Extraction:从视频反推动画设计

## 适用场景

- 看到一个视频想学它的动画设计语言(如"小白 debug"风格)
- 下载了一个参考视频,想反推它的设计规范
- 想做横向对比(多条视频的设计差异 / 同一视频号跨期一致性)
- 验证某些设计模式是否在多个视频中一致出现

## 输入

- 视频文件(MP4,本地路径)
- 配套字幕文件(SRT,可用 funasr 自动生成,见 `douyin-video-download` skill)
- 目标节拍类型列表(可选,默认启发式自动分类)

## 5 步流程

### 第 1 步:scene 检测(全切点)

```bash
ffmpeg -i input.mp4 -filter:v "select='gt(scene,0.08)',showinfo" -f null - 2>&1 | grep pts_time
```

- 阈值 0.08:经验值,适合刚/中切换镜头(RAG/Harness 30+ 切点/10 分钟)
- 阈值 0.05:适合大量平滑过渡的镜头(Transformer 那种,20 切点/11 分钟)
- 过滤 0.5s 内连续切点(动画中间帧抖动)

**输出**:全视频切点列表(精确到毫秒)

### 第 2 步:srt 反查(切点 → 旁白)

每个切点反查它落在哪个 srt 句子里。srt 解析用 7 个 capture group 的正则:

```python
re.match(r"(\d+):(\d+):(\d+),(\d+)\s*-->\s*(\d+):(\d+):(\d+),(\d+)", line)
```

**输出**:每个切点对应"旁白原文 + 起始/结束时间"。

### 第 3 步:节拍分类(关键词启发式 + 人工核对)

```python
def classify(text):
    if "点赞" in text or "关注" in text or "扣个一" in text: return "互动提示"
    if "全网资料参差不齐" in text or "如有差异" in text: return "免责声明"
    if text.startswith(("以图","为什么","什么是","是什么","是怎么")): return "概念提问"
    if text.startswith(("所以","接下来","但是","因此")): return "转折/推进"
    if text.startswith(("比如","想象","比如说","这就像")): return "类比举例"
    if "算法" in text or "组合" in text or "搜索" in text: return "算法/结论"
    return "讲解"
```

**关键**:人工核对一两个分错的样本,关键词分类的精确率通常 70~85%。

### 第 4 步:密抽帧(看入场过程)

每类选 2~3 代表切点,前后 1s × 5fps 抽帧(共 10 张)。**单帧采样看不到入场过程**,必须密抽。

```bash
ffmpeg -ss {cut_t-1.0} -i input.mp4 -t 2.0 -vf "fps=5,scale=1280:-1" -q:v 4 f%02d.jpg
```

**输出**:每个代表切点的 10 张序列帧,可用来看"骨架→元素→标签"的入场顺序。

### 第 5 步:跨节拍提炼设计模式

按 5 类节拍各看 2~3 个对照样本后,提炼:
- **入场顺序范式**(骨架先行/数据次之/标签殿后)
- **色码复用表**(每概念固定颜色)
- **留白节拍**(何时空镜 + 多久)
- **拟人化节拍**(何时角色镜 + 持续多久)
- **收束节拍**(何时一镜到底 + 多少元素)

## 输出物

1. **切点 + 旁白映射表**(`<video>_cuts.json`):全切点 + 对应旁白 + 节拍类型
2. **代表切点对照表**(`<video>-动画设计对照表.md`):每类 2~3 个样本 + 元素清单 + 入场范式
3. **跨视频横向对比**(若跑多条):哪些设计范式跨视频一致,哪些是某视频独有

## 关键坑(必看)

| 坑 | 原因 | 应对 |
|---|---|---|
| 切点数被认为偏少 | 视频用平滑过渡,scene change 值低 | 阈值降到 0.05,或结合音频能量检测 |
| 留白镜被漏掉 | 留白 = 无变化 = scene change 值 = 0 | 用旁白关键词二次过滤("点赞/关注/扣个一"=互动提示) |
| 启发式分类只覆盖 3~5 类 | 关键词匹配天然粗 | 人工标注 20~30 个样本后用规则 |
| 单帧采样看不到入场 | 入场 = 一段时间内连续变化 | 必须前后 1s × 5fps 密抽 |
| srt 时间戳全部匹配失败 | 正则 capture group 数错 | 必须 7 个:HH:MM:SS,mmm |
| 抽样率 0.3% 不够 | 视觉密度偏好 → 漏掉留白/钩子 | 必须用 scene 检测反查,不能按视觉密度挑 |

## 跑通 RAG/Harness/Transformer 三视频实测结果

| 视频 | 时长 | 切点 | 命中旁白 | 代表切点 |
|---|---|---|---|---|
| RAG(向量数据库) | 9:45 | 38 | 28 | 13 |
| Harness Engineering | 8:41 | 31 | 27 | 12 |
| Transformer | 11:15 | 20 | 10 | 7 |

**Transformer 切点稀疏**说明了它大量用平滑过渡——这是它的设计特点,不是方法缺陷,但需要降阈值到 0.05 才能搞全。

## 配套脚本

完整版脚本(阈值、过滤、抽帧、密抽全部组合)见本仓库 `examples/doodle-patterns/` 旁边的工作流说明,或 `scripts/extract_animation_designs.py`(若已落盘)。

## 参考输出

- `examples/doodle-patterns/`:5 个关键设计范式的 doodle 风格 HTML demo
- 实跑对照表样例:`小白debug-动画设计规范-三视频对比.md`

## 与其他 skill 的衔接

- **douyin-video-download**:下载视频后用本 skill 提取设计
- **narration-transcript**:从 md 笔记生成 SRT 后用本 skill 分析别人视频
- **visual-brief-design**:本 skill 输出的设计规范,可用作 visual-brief 的输入(反向工程)
- **doodle-explainer / dark-botanical-explainer / modern-tech-explainer**:这些 skill 消费 visual-brief;本 skill 产出可以被它们复用
