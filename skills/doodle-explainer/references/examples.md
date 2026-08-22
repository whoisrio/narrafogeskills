# 工作示例(Few-shot):从 visual-brief 场景到 doodle 代码

示例展示「**brief 场景 -> 实现推理 -> Remotion 代码**」的思考链。**输入是导演(visual-brief)已输出的 brief 场景**(元素角色 + 相对布局 + 动效类型 + cue 时间戳 + 音画偏移),**不是 SRT 原文**——切场景是导演的活,explainer 只消费,不重新切。

**最终交付物是 Remotion 代码 + 渲染产物(视频/静帧),不是任何中间表格。** 下面示例里的"推理过程"是思考示范,不是输出格式——explainer 实际产出的是一段能渲染的动画代码。

**三条铁律贯穿所有示例:**

1. **导演给的精确坐标/色值是越权,只取意图**:brief 里若出现 `x=480,y=300,w=360,灰蓝色` 这类具体值,坐标忽略重算(安全区 80px/54px + 碰撞检查),颜色只当"意图",实际取 theme 对应色。
2. **颜色一律从 theme 取**:brief 的 themeRef(如 `playful + doodle`)决定 BG/GRID/INK/PALETTE/ACCENT,代码里不出现硬编码色值。
3. **入场时机 = cue 时间戳 + 音画偏移换算帧**:提前 0.3s=delay-9帧,同步=不变,滞后 0.2s=delay+6帧(30fps)。

---

## 示例 1:演进叙事·第一代登场(真实 brief 片段)

**输入:visual-brief 的 brief 片段**(来自 e2e/responseapi/S2 真实产物,演进叙事):

```
场景 1: 一代登场 [00:00-00:06.8]
  布局: timeline 横轴(上) + api_block(左下) + logo
  节奏: 铺垫
  转场: 无(开场)

  Seg 2 [00:03.9-00:06.8]
    旁白: 第一代,2020 年,GPT-3,叫 /v1/completions。
    动效: 出现 -- api_block.pop + version_tag.pop
    分镜: 第一刻度下方弹 version_tag"2020 · GPT-3";下方弹 api_block 写"/v1/completions";
          左侧贴 OpenAI logo。入场顺序:version_tag 先 -> api_block 次 -> logo 最后。
    音画偏移: 提前0.3s
    素材: public/logo/openai.png
```

**实现推理(思考过程,非交付物):**

- timeline(场景级,Seg1 已建)→ 画法规则:背景网格 + 手绘横轴,GRID 色,pathLength 生长
- version_tag"2020 · GPT-3" → 徽章画法:全圆角色块 + 超粗字,ACCENT[0] 底 + BG 字;spring 弹入,delay=3.9s-9帧
- api_block"/v1/completions" → 卡片画法:圆角粗描边容器;PALETTE 里选"冷静感"色(导演说灰蓝=意图);spring 弹入,delay=4.2s-9帧
- OpenAI logo → public 已有素材,不换色;淡入+scale,delay=4.5s-9帧
- **产出**:一个 Composition(如 `Scene1DaiDaiDengChang`),以上元素按上述 delay/颜色/画法写成 Remotion + rough.js 代码,渲染验证

**推理要点:**
- brief 里"第一刻度下方/左侧贴"是**相对关系**,保留;若给绝对坐标则忽略重算。
- "灰蓝色"是导演的**意图**(冷静感),explainer 从当前 theme 的 PALETTE 里选一个低饱和色,不硬编码。
- 入场顺序照 brief(version_tag→api_block→logo),间隔对齐 cue;音画偏移"提前 0.3s"→ 每个 delay 减 9 帧。

---

## 示例 2:悬念 + 否定(2 个场景)

**输入:brief 片段**(复盘+辟谣结构):

```
场景 1: 钩子 [00:00-00:02.5]
  Seg 1 [00:00-00:02.5]
    旁白: 为什么 TCP 建立连接要三次握手,而不是两次?
    动效: 出现 -- BigTitle 逐词弹入 + 图形节点带「?」脉冲
    分镜: 中央大字问题,关键词「三次」强调;下方两个 CircleNode 隔空相对,带「?」脉冲两次。
    音画偏移: 同步
场景 2: 否定 [00:02.7-00:09.0]
  Seg 3 [00:05.0-00:06.0]
    旁白: 两步就够?错。
    动效: 否定 -- stamp.hit(红章) + shake
    分镜: 两个 CircleNode 之间砸下一个红色 ✗ 印章,整体轻微 shake。
    音画偏移: 滞后0.2s
```

**实现推理:**

- 问题大字 → 画法:文字直书背景(不用徽章),INK 色;逐词弹入,每词间隔 5-8f
- 「三次」强调 → 同词内 span 用 ACCENT[0] 色,色码贯穿
- 两个节点 → 图形节点画法:两个圆隔空相对;PALETTE[0]/PALETTE[1];spring 弹入,delay=0.5s 同步
- 「?」脉冲 → 节点上叠加,scale 1→1.3→1 ×2
- 红章 ✗ → 否定意图:用 theme 的"错误信号"色(通常是 ACCENT 红系);scale 3→1 砸下,delay=5.2s+6帧(滞后)
- shake → 节点组 wrapper 振荡 3-5f,滞后触发

**推理要点:**
- 否定段"滞后 0.2s"→ 红章 delay=旁白时间+6帧,先听"错"再看章砸。
- 红章不是新元素设计,是"否定意图 → theme 取色"落地。

---

## 示例 3:preview-first(全片前先出 demo)

**正确流程示范**(这是工作流的第 2 步,不是示例 1/2 的替代):

- brief 有 8 个场景 → 挑 3 个关键:开场钩子(场景 1)+ 核心转折(key 场景)+ 收束金句
- 每个只做最简版:布局 + 主题配色 + 主要元素入场,不做全部 cue 细节
- 渲染:`npx remotion render PreviewComposition out/preview-scene1.mp4 --frames=0-60`(1~2s)
- 给用户看:这是场景 1 用 `playful + doodle` 主题的效果,布局是否符合预期
- 用户认可 → 做全片;不认可 → 调主题/布局后重出 demo

**demo 的克制原则**:demo 确认的是"主题/布局/配色",不是全片预演——不做所有 cue 的动效,不做完整转场。否则 preview 成本接近全片,失去意义。

---

## 反面示例:explainer 常见错误

| 错误 | 为什么错 | 正确做法 |
| --- | --- | --- |
| 从 SRT 原文自己重新切场景 | 切场景是导演的活,重复劳动且可能跟导演不一致 | 直接消费 brief 的场景定义 |
| 照抄 brief 里的 `x=480,y=300` | 坐标是导演越权产物,尺寸/碰撞没验证 | 按安全区+碰撞重算 |
| 把 brief 里"灰蓝色"当字面 hex | 颜色意图≠色值,主题可能没这个色 | 从 theme PALETTE 取同意图色 |
| brief 标「硬切」却只用滑动 | 转场类型是导演的节奏工具 | 按导演标的实现硬切/滑动/淡入 |
| 在代码里写死 #F0C8A0 | 违反"禁硬编码色值" | 引用 theme 变量 |
| 输出一份"实现卡"文档当交付物 | 交付物是 Remotion 代码 + 渲染产物,不是表格 | 直接写代码,推理只在脑子里/注释里 |
| 全片直接做,跳过 demo | preview-first 是流程铁律,用户要先看关键场景效果 | 第 2 步先出关键场景 demo,认可后再做全片 |
