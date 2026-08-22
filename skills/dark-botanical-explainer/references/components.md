# 构件目录与适合场景

写代码前选构件时查本文件。
按类分组,每个构件列:用途、适合场景(什么旁白内容/AI 主题用它)、关键 props。
顶部的「旁白措辞 -> 构件」速查表供 SRT 场景提取时快速定位。

## 旁白措辞 -> 构件 速查

| 旁白里出现 | 用构件 |
| --- | --- |
| 组件名(LLM/检索器/数据库/工具)、流程步骤 | FlowNode |
| 送到/流向/经过/调用/连到 | FlowArrow |
| 这一层/这个模块/子系统/一组 | Container |
| 循环/打回/重试/反馈/回流 | FlowArrow(type=loop) |
| 参数表/配置项/对比表/benchmark | Table |
| 增长曲线/分布/占比/趋势 | Charts |
| 具体大数字(亿/万/倍) | CounterUp |
| attention 矩阵/权重矩阵/相似度矩阵 | Matrix |
| 向量/embedding/表示/QKV | Vector |
| token/序列/上下文窗口/注意力范围 | TokenSequence |
| 函数/源码/这一行/实现 | CodePanel |
| 公式/softmax/attention 计算/loss | Formula |
| 用户问/模型答/prompt/response/对话 | ChatBubble |
| 关键词/步骤号/痛点/强调 | Tag/RedCircle |
| 放大看/仔细看这块/聚焦 | Magnifier |
| 打散/重组/分解/汇聚/拼接 | ParticleAssembly |

## 流程类(Flow/Structure)

### FlowNode

- 用途:暗金风白卡节点(半透 bgCard + 1px 边 + 顶部 3px 金色身份条),spring punch 入场,active 时金色脉冲环。
- 适合场景:旁白提到具体组件名或流程步骤。
  - AI 主题:agent 架构、RAG 组件、pipeline 阶段。
- 关键 props:`x/y`(中心)、`label`、`sub`、`shape`(rect/diamond/special)、`color`、`delay`、`active/activeAt`。
- 选型:决策/路由用 `diamond`;关键组件用 `special`(双描边);普通用 `rect`。

### FlowArrow

- 用途:SVG 弯曲边 + 金色 arrow marker + dashoffset 绘制动画,自带 AbsoluteFill 图层。
- 适合场景:旁白提到"送到/流向/经过/调用/连到"。
- 关键 props:`from/to`、`type`(solid/dashed/loop)、`color`、`delay`、`drawDur`、`faded`。
- 变体:`loop` 回环弧(反馈回路),`dashed`+`faded`(未激活分支)。

### Container

- 用途:虚线金色圆角边框 + 顶部 mono 金色标签。
- 适合场景:旁白提到"这一层/这个模块/子系统/一组"。
  - AI 主题:transformer 层、encoder/decoder 分组。
- 关键 props:`x/y/w/h`、`label`、`children`。

## 数据类(Data/Numeric)

### Table

- 用途:暗金风数据表,表头金底深字,数据行半透 bgCard,逐行 spring 上滑,highlightRow 金色 tint。
- 适合场景:旁白提到参数表、配置项、对比表、benchmark。
  - AI 主题:模型参数对比、超参表、benchmark 得分。
- 关键 props:`headers`、`rows`、`colWidths`、`highlightRow`。

### Charts(柱状/折线/对比/仪表盘/堆叠/数字翻牌/横条)

- 用途:数据图表全家桶,数据论据专用。
- 适合场景:旁白提到增长曲线、分布、占比、趋势。
  - AI 主题:loss 曲线、scaling law、benchmark 柱状。
- 关键 props:见各图表组件(`AnimatedBarChart`/`AnimatedLineChart`/`AnimatedComparison`/`AnimatedGauge` 等)。

### CounterUp

- 用途:数字翻牌(0->to),等宽 weight 9 + 发光。**暗金风铁律:凡数字必翻牌**。
- 适合场景:旁白提到具体大数字(亿/万/倍)。
  - AI 主题:参数量、训练成本、token 数。
- 关键 props:`to`、`size`、`color`、`suffix/prefix`、`delay`。

## ML 特化类(ML-specific)

### Matrix

- 用途:暗金风格子矩阵,逐格 reveal,cell 填充透明度按 |值| 缩放(金色强度)。
- 适合场景:旁白提到 attention 矩阵、权重矩阵、相似度矩阵。
  - AI 主题:attention 可视化、权重热力。
- 关键 props:`data: number[][]`、`label`、`rowDim/colDim`、`color`、`cellSize`。

### Vector

- 用途:一行格子向量,逐格弹入,金色边框。
- 适合场景:旁白提到向量、embedding、Q/K/V。
  - AI 主题:embedding、QKV 向量。
- 关键 props:`label`、`values`、`dimLabel`、`color`。

### TokenSequence

- 用途:一行圆点 token,active 金色高亮放大,可选 attention 弧线指向历史 token。
- 适合场景:旁白提到 token、序列、上下文窗口、注意力范围。
  - AI 主题:LLM token 流、滑动窗口 attention。
- 关键 props:`count`、`activeToken`、`showAttention`、`windowSize`、`labels`。

## 文本/代码/对话类(Text/Code/Chat)

### CodePanel

- 用途:深色代码面板 + 窗口栏 + 逐行 clip-path 擦除 + 金色行高亮。
- 适合场景:旁白提到函数、源码、这一行、实现。
- 关键 props:`title`、`lines`(html)、`at`(每行秒)、`hl`(高亮行)。

### Formula

- 用途:数学式按 token 类型上色(var=金/num=金亮/fn=粉/op=text),可选金色下划线强调。
- 适合场景:旁白提到公式、softmax、attention 计算、loss。
- 关键 props:`parts: {t, kind, sub}[]`、`underlineIndex`。

### ChatBubble

- 用途:user(左)/assistant(右)对话气泡,半透 bgCard + 金色角色标签 + 尾巴。
- 适合场景:旁白提到用户问、模型答、prompt、对话。
  - AI 主题:LLM 对话、prompt 工程。
- 关键 props:`role`、`text`、`w`、`delay`。

## 引导类(Guidance/Emphasis)

### Tag / RedCircle

- 用途:Tag(mono 大写金色 eyebrow)/ RedCircle(红圈 dasharray + 脉冲,痛点标注)。
- 适合场景:旁白提到关键词、痛点、强调。
- 关键 props:`children`/`cx/cy`、`delay`。

### Magnifier

- 用途:focusAt 时刻把子元素放大推到中心 + 金色发光 + 提层,聚焦后回落。
- 适合场景:旁白提到"放大看/仔细看这块/聚焦"。
- 关键 props:`children`、`focusAt`、`focusDuration`、`maxScale`。

## 高级特效(Advanced)

### ParticleAssembly

- 用途:一组粒子先散布漂浮,再聚合到目标网格位,配 scale/opacity/rotation/glow,渲染为金色发光圆点。
- 适合场景:旁白提到"打散/重组/分解/汇聚/拼接"。
  - AI 主题:MLA 压缩(KV 打散成 latent 再重组)、QKV 聚合、特征重组。
- 关键 props:`targets` 或 `rows/cols`、`values`、`color`、`delay`、`floatDuration`、`assembleDuration`、`spread`。
- 运动用共享 `useScatterAssemble` hook(风格无关),本构件是 dark-botanical 的粒子渲染器。
