# 叙事模板库

> **参考模式库,不是菜单。** 先按内容定视觉(见 SKILL.md 第一原则 + examples.md),这些模板只在卡住或想偷懒时参考。不要把"选模板"当设计入口。

模板只定义「布局 + 构件 + 时序」,内容槽位用 `{}` 占位。
时序按 30fps 标注,全部遵守 style-guide.md 的时序语法(数字先于结论、图表先于标注、delay 间隔 6~10 帧)。
暗金风节奏比涂鸦慢,单场景 4~6 秒,给数字翻牌和图表绘制留时间。

## 文案 -> 模板选择线索

| 文案中出现的措辞 | 模板 |
| --- | --- |
| 「万亿 / 亿级 / 每秒 N 次 / N 倍 / 降到」(含具体数字) | 模板 1 数据冲击 |
| 「三个原因 / 由…组成 / 几个特性 / 关键在」 | 模板 2 要点拆解 |
| 「增长 / 下降 / 曲线 / 趋势 / 对比数据」 | 模板 3 图表论证 |
| 「传统 vs / 痛点 / 问题在于 / 之前 vs 之后」 | 模板 4 痛点对比 |
| 「看这段代码 / 实现 / 源码 / 函数」 | 模板 5 代码逐行 |
| 「演进 / 路线图 / 里程碑 / 从 v1 到 v3」 | 模板 6 里程碑演进 |
| 「总之 / 一句话 / 本质是 / 核心」(收尾) | 模板 7 金句收束 |

典型整片组合:模板 1(数字开场) -> 模板 2 或 3(拆解/图表论证) -> 模板 4(痛点对比) -> 模板 7(金句收束)。
含代码的主题在中间插模板 5;含版本演进的用模板 6。

## 模板 1:数据冲击(Data Punch)

用一个震撼数字开场。适合「XX 万亿」「成本降到 N 分」。

- 布局:`SceneLayout` 居中;顶部 `Tag` eyebrow -> 中央 `CounterUp` 巨型数字(等宽 weight 900 + 发光)-> 数字下方 `SubText` 单位/解释 -> 可选 `GoldLine` 分隔 -> 底部 `BigText` 结论
- 构件:Tag ×1、CounterUp ×1、SubText ×1、GoldLine ×1、BigText ×1
- 时序(~5s):
  - 0f:Tag 弹入(Reveal)
  - 8f:CounterUp 开始翻牌(duration 35f),8~43f 数字滚动
  - 50f:SubText 淡入(数字翻完才解释)
  - 60f:GoldLine 生长
  - 75f:BigText 结论 punch 弹入
  - 90f+:BotanicalBg 光圈常驻呼吸
- 变体:两个数字对比(左旧右新,中间 GoldLine,CounterUp 交错 15f);数字带前缀/后缀(`prefix`/`suffix`,如 `$`/`/M tokens`)

## 模板 2:要点拆解(Breakdown)

把一个概念拆成 N 个要点。适合「XX 快的三个原因」。

- 布局:`SceneLayout`;顶部 `Tag` + `BigText` 主题 -> 下方一行 N 张 `FeatureCard`(icon + title + desc),N>3 改两行网格
- 构件:Tag ×1、BigText ×1、FeatureCard ×N
- 时序(N=3,~5s):
  - 0f:Tag -> 8f BigText punch
  - 25f:FeatureCard 1 Reveal -> 35f / 45f 卡片 2、3 依次(delay 间隔 10f)
  - 80f+:全体光圈呼吸,卡片微光常驻
- 变体:每张卡片配一个 `CounterUp` 数字(如「3x」「90%」),数字在卡片入场后 8f 翻牌

## 模板 3:图表论证(Chart Proof)

用数据图表支撑论点。适合「增长曲线」「对比数据」。

- 布局:左 `BigText` 论点 + 右 `Charts` 图表;或顶部论点 + 底部通栏图表
- 构件:BigText ×1、Charts ×1(柱状/折线/对比/仪表盘按数据形态选)、可选 RedCircle ×1(指向峰值/转折)
- 时序(~5s):
  - 0f:BigText 论点 punch
  - 15f:图表绘制(柱体生长 / 折线 pathLength 0->1,duration 40f)
  - 60f:图表绘制完成,RedCircle 弹向峰值/转折点(dasharray 绘制 + 脉冲)
  - 80f:可选 `SubText` 数据来源淡入
- 变体:多图接力(柱状 -> 折线,Series 串接,每图 50f);仪表盘单值强调(配 CounterUp)

## 模板 4:痛点对比(Versus)

两个方案对比,突出痛点。适合「传统 XX 的问题」「优化前后」。

- 布局:中缝 `GoldLine` 竖线分屏;左 `{方案A}` 右 `{方案B}`;每侧 FeatureCard + 标签;痛点侧叠 `RedCircle` 红圈 + 暗化;胜侧底部 `BigText` 结论
- 构件:GoldLine ×1、FeatureCard ×2~4、RedCircle ×1~2、BigText ×1
- 时序(~5.5s):
  - 0f:GoldLine 竖向生长
  - 12f:左侧卡片 Reveal -> 40f 右侧卡片 Reveal
  - 75f:痛点侧 opacity 0.5 + RedCircle 弹向痛点(dasharray + 脉冲)
  - 100f:胜侧 BigText 结论 punch
- 变体:三方对比改三栏,痛点圈错开 8f;无明确胜方时去掉结论,只留痛点标注

## 模板 5:代码逐行(Code Walk)

逐行讲代码,金色高亮当前行。适合「看这段实现」「这个函数」。

- 布局:`SceneLayout` 或全屏;中央 `CodePanel`(窗口栏 + 逐行擦除 + 金高亮);旁白字幕贴底(`Karaoke` 或 `Caption`)
- 构件:CodePanel ×1、字幕 ×1、可选 Tag eyebrow(场景标题)
- 时序(总长 5~7s,按代码行数):
  - 0f:CodePanel 面板淡入(translateY 16->0)
  - 8f 起:逐行 clip-path 擦出,每行 `at[i]` 对齐旁白句子;讲到的行 `hl[i]` 点亮金色左条 + 背景着色,常亮不回落
  - 讲完的行保持 70% 透明度常驻
  - 任何时刻只有一行处于金高亮焦点(守「一个时刻一个焦点」)
- 变体:长代码配自动滚动(CodePanel 内置 scrollOffset);痛点行配 RedCircle 圈住 + warn 红框;配 Blueprint 预设背景(BLUEPRINT token)强化「架构代码」感

## 模板 6:里程碑演进(Timeline)

版本/里程碑时间线。适合「从 v1 到 v3」「演进路线」。

- 布局:横向 `GoldLine` 主轴 -> 轴上 N 个节点(FeatureCard 或 Card + CounterUp 版本号);每个节点 delay 依次入场
- 构件:GoldLine ×1(主轴)、Card/FeatureCard ×N、可选 CounterUp ×N(版本号/年份)
- 时序(N=4,~5s):
  - 0f:GoldLine 主轴从左生长到右(duration 30f)
  - 20f 起:节点 1 Reveal -> 35f/50f/65f 节点依次(delay 15f)
  - 每节点入场后 6f:版本号 CounterUp 翻牌
  - 100f+:全体光圈呼吸
- 变体:竖向时间线(左轴右卡,适合移动端截图);分支演进(主轴分叉,用 Charts 堆叠或自定义 SVG)

## 模板 7:金句收束(Punchline)

收尾定调,一句话点题。适合视频结尾或章节收束。

- 布局:`SceneLayout` + `GlowBg` 中心光斑;中央 `BigText` 金句(衬线 weight 900 + 发光);上方可选 `Tag` eyebrow;下方可选 `SubText` 注脚
- 构件:GlowBg ×1、BigText ×1、可选 Tag ×1、SubText ×1
- 时序(~4s):
  - 0f:GlowBg 淡入 + 脉冲
  - 10f:BigText punch 弹入(scale 0.4->1)
  - 30f:Tag/SubText 淡入
  - 50f+:GlowBg 持续脉冲,光圈呼吸,金句常驻发光
- 变体:金句为数字时改用 CounterUp(模板 1 变体);双句对比(上旧下新,新句 punch 旧句暗化)

## 如何新增模板

模板库是开放集合,发现新的叙事结构就追加。新增模板必须遵守:

1. 放在本文件末尾,编号顺延,标题格式:`模板 N:名称(英文名)`
2. 必须包含四个部分:一句话适用场景、布局、构件清单、帧级时序;变体可选
3. 只能使用 style-guide.md 的构件族和动效族,不得引入新构件类型
4. 时序必须遵守时序语法铁律(数字先于结论、图表先于标注、delay 间隔 6~10 帧)
5. 在选择线索表中补充对应的文案措辞特征
6. 单场景时长保持 4~6 秒
