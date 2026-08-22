# 工作示例(Few-shot):从 visual-brief 场景到 sticker 代码

示例展示「**brief 场景 -> 实现推理 -> Remotion 代码**」的思考链。**输入是导演(visual-brief)已输出的 brief 场景**(元素角色 + 相对布局 + 动效类型 + cue 时间戳 + 音画偏移),**不是 SRT 原文**——切场景是导演的活,explainer 只消费,不重新切。

**最终交付物是 Remotion 代码 + 渲染产物(视频/静帧),不是任何中间表格。** 下面示例里的"推理过程"是思考示范,不是输出格式——explainer 实际产出的是一段能渲染的动画代码。

**三条铁律贯穿所有示例:**

1. **导演给的精确坐标/色值是越权,只取意图**:brief 里若出现 `x=480,y=300,w=360,灰蓝色` 这类具体值,坐标忽略重算(安全区 80px/54px + 碰撞检查),颜色只当"意图",实际取 theme 对应色。
2. **颜色一律从 theme 取**:brief 的 themeRef(如 `block-frame + sticker`)决定 BG/GRID/INK/PALETTE/ACCENT,代码里不出现硬编码色值。
3. **入场时机 = cue 时间戳 + 音画偏移换算帧**:提前 0.3s=delay-9帧,同步=不变,滞后 0.2s=delay+6帧(30fps)。

---

## 示例 1:对比·两方案(block-frame 主题)

**输入:visual-brief 的 brief 片段**(对比分析结构,themeRef 已定 `block-frame + sticker`):

```
场景 1: A vs B [00:00-00:05.0]
  布局: 中缝分屏,左 A 右 B
  节奏: 铺垫
  转场: 无(开场)

  Seg 1 [00:00-00:02.5]
    旁白: 传统方案要手写 agent loop,Responses 一个请求跑完。
    动效: 出现 -- split 分屏 + 两侧弹入
    分镜: 中缝分割线生长;左 A 徽章+节点,右 B 徽章+节点。
    音画偏移: 提前0.3s
  Seg 2 [00:03.0-00:05.0]
    旁白: 一个跑完,一个手写。高下立判。
    动效: 对比 -- 败方 dim + 结论徽章
    分镜: 左 A 整体 opacity 0.4;右 B 底部弹结论徽章。
    音画偏移: 滞后0.2s
```

**实现推理(思考过程,非交付物):**

- 中缝分割线 → 画法:硬边竖线,INK(黑),pathLength 从上到下生长
- 左 A 徽章 → 画法:硬边色块 + 超粗字,PALETTE[0](粉)底 + INK 字;spring 弹入,delay=0s-9帧
- 左 A 节点 → 图形节点画法:PALETTE[1](蓝);spring 弹入,delay=0.5s-9帧
- 右 B 徽章/节点 → 同上,PALETTE[2]/[3],delay=1.0s/1.5s-9帧
- 败方 dim → 左 A 整体 opacity→0.4,delay=3.0s+6帧(滞后)
- 结论徽章 → ACCENT(黑)底 + BG 字,delay=3.5s+6帧
- **产出**:一个 Composition(如 `SceneAVsB`),以上元素按 delay/颜色/画法写成 Remotion 代码(硬边 + `8px 8px 0 INK` 硬偏移阴影),渲染验证

**贴纸风要点:**
- 所有卡片带硬偏移阴影(block-frame 的 lineConfig:8px 8px 0 INK,零模糊)。
- 方角 0px,无圆角。
- 连接线用实线箭头生长,不用虚线流动。
- 卡片颜色从 PALETTE 五色里挑,不硬编码。

---

## 示例 2:否定·盖章(creative-mode 主题)

**输入:brief 片段**(辟谣结构,themeRef `creative-mode + sticker`):

```
场景 1: 否定 [00:00-00:04.0]
  Seg 2 [00:01.5-00:03.0]
    旁白: 不是升级版,是另一个东西。
    动效: 否定 -- stamp.hit + shake
    分镜: 中央概念块盖红色 ✗ 印章,整体 shake。
    音画偏移: 滞后0.2s
```

**实现推理:**

- 概念块 → 卡片画法:PALETTE[0](绿),spring 弹入,delay=0s
- 红章 ✗ → 否定意图:creative-mode 的四色里没有红,用与 BG 对比最强的色(F06CA8 粉)充当"错误信号";scale 3→1 砸下,delay=1.5s+6帧(滞后)
- shake → 概念块 wrapper 振荡 3-5f

**推理要点:**
- 这就是"颜色取意图、从 theme 落地":导演说"红色否定",explainer 看 theme 里哪个色最像"错误",用它,不硬编码红。

---

## 示例 3:preview-first(全片前先出 demo)

**正确流程示范**(这是工作流的第 2 步,不是示例 1/2 的替代):

- brief 有 8 个场景 → 挑 3 个关键:开场钩子(场景 1)+ 核心转折(key 场景)+ 收束金句
- 每个只做最简版:布局 + 主题配色 + 主要元素入场,不做全部 cue 细节
- 渲染:`npx remotion render PreviewComposition out/preview-scene1.mp4 --frames=0-60`(1~2s)
- 给用户看:这是场景 1 用 `block-frame + sticker` 主题的效果,布局是否符合预期
- 用户认可 → 做全片;不认可 → 调主题/布局后重出 demo

**demo 的克制原则**:demo 确认的是"主题/布局/配色",不是全片预演——不做所有 cue 的动效,不做完整转场。否则 preview 成本接近全片,失去意义。

---

## 反面示例:explainer 常见错误

| 错误 | 为什么错 | 正确做法 |
| --- | --- | --- |
| 从 SRT 原文自己重新切场景 | 切场景是导演的活,重复劳动且可能跟导演不一致 | 直接消费 brief 的场景定义 |
| 照抄 brief 里的 `x=480,y=300` | 坐标是导演越权产物,尺寸/碰撞没验证 | 按安全区+碰撞重算 |
| 给贴纸元素加软阴影/渐变 | 贴纸风=硬偏移阴影零模糊,软阴影是另一个风格 | 用硬偏移阴影(OffsetShadow 规则) |
| 用 rough.js 画线 | sticker 是硬边引擎,roughness 是 doodle 的 | 硬边直线,无手绘抖动 |
| brief 标「硬切」却只用滑动 | 转场类型是导演的节奏工具 | 按导演标的实现硬切/滑动/淡入 |
| 在代码里写死 #000000 | 违反"禁硬编码色值" | 引用 theme 变量 |
| 输出一份"实现卡"文档当交付物 | 交付物是 Remotion 代码 + 渲染产物,不是表格 | 直接写代码,推理只在脑子里/注释里 |
| 全片直接做,跳过 demo | preview-first 是流程铁律,用户要先看关键场景效果 | 第 2 步先出关键场景 demo,认可后再做全片 |
