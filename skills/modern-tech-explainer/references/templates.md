# 叙事模板库

模板只定义「拓扑 + 构件 + 时序」,内容槽位用 `{}` 占位。
时序按秒标注(本风格组件用秒为 appearAt 单位),全部遵守 style-guide.md 的时序铁律(节点先于边、边先于 token、回路最后闭合)。
单场景 5~7 秒,给拓扑摆位和 token 流动留时间。

## 文案 -> 模板选择线索

| 文案中出现的措辞 | 模板 |
| --- | --- |
| 「模式 / PATTERN / 第 N 种」(章节开场) | 模板 1 模式揭晓 |
| 「由…组成 / 结构 / 架构 / 拓扑 / 这些组件」 | 模板 2 架构拓扑 |
| 「数据流向 / 请求从…到… / 流转 / 经过」 | 模板 3 数据流 |
| 「如果…就…/ 条件 / 路由 / 分支 / 否则」 | 模板 4 决策路由 |
| 「反馈 / 评估 / 循环 / 打回 / 重试」 | 模板 5 反馈回路 |
| 「看这段代码 / 实现 / 源码 / 函数 / 逐段」 | 模板 6 代码深读 |
| 「对比两种 / vs / 区别 / 前者后者」 | 模板 7 模式对比 |

典型整片组合:模板 1(模式揭晓) -> 模板 2(架构拓扑) -> 模板 3(数据流) -> 模板 5(反馈回路)。
含代码的在中间插模板 6;含条件分支的用模板 4。

## 模板 1:模式揭晓(Pattern Reveal)

章节开场,揭晓模式名。适合「PATTERN · 01/06」「第 N 种模式」。

- 布局:`GraphScene` 浅暖底;左上 `PatternTitle`(kicker + 衬线大字 mask reveal + accent bar + 副标);可配合右下 `scenario`
- 构件:PatternTitle ×1
- 时序(~3s):
  - 0.0s:kicker 淡入 + 上移
  - 0.2s:大字 mask reveal(clip-path inset 100%->0,spring)+ 微升
  - 0.6s:accent bar 从 0 生长到 88px
  - 0.9s:副标淡入 + 上移
- 变体:大字为多词时逐词 mask(每词错 0.15s);accent bar 颜色 = 模式色

## 模板 2:架构拓扑(Topology)

展示静态结构图。适合「XX 由这些组成」「架构是这样的」。

- 布局:`GraphScene`;N 个 `GraphNode` 按拓扑摆位(rect 普通 / special 特殊);`GraphEdge` 连接(solid)
- 构件:GraphNode ×N、GraphEdge ×(N-1)
- 时序(N=4,~5s):
  - 0.0s:第一个节点 appearAt(spring 入场)
  - 之后每个节点错 0.4~0.5s 依次入场
  - 每个节点入场后 0.2~0.3s:连出它的边 dashoffset 绘制(drawDur 0.4s)
  - 全部就位后:常驻(可加微弱 active 脉冲暗示「活着」)
- 变体:决策点用 diamond;关键组件用 special 双描边;节点带 sub 副标(mono 大写)

## 模板 3:数据流(Token Flow)

展示数据/请求沿边流动。适合「请求从 A 流到 B」「数据经过这些节点」。

- 布局:基于模板 2 的拓扑(节点+边先就位);`TokenFlow` 沿边依次流动
- 构件:GraphNode ×N、GraphEdge ×N、TokenFlow ×N
- 时序(~5s):
  - 0~2.5s:拓扑建立(节点 + 边,同模板 2)
  - 2.5s 起:token 串联流动,前一条到达后再放后一条(间隔 0.5~0.8s)
  - token 到达节点时:该节点 active 脉冲(activeAt = token appearAt,0.8s)
- 变体:多 token 并行(分支处同时分叉);token 颜色按数据类型区分

## 模板 4:决策路由(Decision)

条件分支。适合「如果…就路由到 A,否则到 B」。

- 布局:`GraphNode` diamond 决策节点 + 多条 `GraphEdge` 出边;未激活分支 `faded`(灰 + opacity 0.4)
- 构件:GraphNode(diamond) ×1、GraphNode(rect) ×N、GraphEdge ×N(部分 faded)
- 时序(~5s):
  - 0~1.5s:决策节点 + 各分支节点入场
  - 1.5s:所有出边绘制(激活的实色,未激活的 faded 灰)
  - 2.5s:token 进入决策节点 -> 沿激活分支流出(active 脉冲);未激活分支保持 faded
- 变体:多轮路由(不同条件激活不同分支,每轮 token 不同色)

## 模板 5:反馈回路(Feedback Loop)

循环/反馈。适合「评估后打回重试」「循环直到满足」。

- 布局:正向链路 + 一条 `GraphEdge` type="loop" 回流弧(向上凸起);回流 token 沿 loop 流
- 构件:GraphNode ×N、GraphEdge(solid 正向 + loop 回流)、TokenFlow(正向 + loop 回流)
- 时序(~6s):
  - 0~2.5s:正向链路建立(节点 + solid 边)
  - 2.5s:回流 loop 边绘制(最后闭合,drawDur 0.5s),强调「循环形成」
  - 3.0s:token 跑一圈:正向链 -> 回流 loop -> 回到起点(active 脉冲)
- 变体:多圈循环(token 每圈换色或递增编号);终止条件(满足后 loop 边 faded)

## 模板 6:代码深读(Code Walk)

逐段讲代码,Shiki 高亮。适合「看这段实现」「逐段拆解」。

- 布局:`PatternTitle`(章节)+ `CodePanel`(Shiki 高亮,按段 current/past/future 三态)
- 构件:PatternTitle ×1、CodePanel ×1
- 时序(总长 5~7s,按段数):
  - 0.0s:PatternTitle 揭晓 + CodePanel 面板淡入
  - 按讲解推进 currentSectionIndex:current 段金色左条 + 背景着色 + 全亮,past 段 0.55,future 段 0.18
  - 每段 highlightAt 时刻点亮;一次只亮一段(一个时刻一个焦点)
  - 长代码:CodePanel 自动滚动(scrollOffset 跟随 current 段)
- 变体:痛点段配 warn;多文件用多个 CodePanel 串接

## 模板 7:模式对比(Versus)

两种架构/模式并排对比。适合「A vs B」「前者后者」。

- 布局:左右两个小 `GraphScene` 或同一场景左右两组节点;各自 accent 色(如 chain 蓝 vs router 绿)
- 构件:GraphNode ×N×2、GraphEdge ×N×2、PatternTitle ×2(或对比标签)
- 时序(~6s):
  - 0~2s:左侧模式拓扑建立(accent 色 A)
  - 2~4s:右侧模式拓扑建立(accent 色 B)
  - 4s:两侧 token 各跑一次,对比流向差异
  - 5s:结论文字(可选)
- 变体:三方对比改三栏;胜方高亮败方 faded

## 如何新增模板

模板库是开放集合,发现新的叙事结构就追加。新增模板必须遵守:

1. 放在本文件末尾,编号顺延,标题格式:`模板 N:名称(英文名)`
2. 必须包含四个部分:一句话适用场景、布局、构件清单、帧级时序;变体可选
3. 只能使用 style-guide.md 的构件族和动效族,不得引入新构件类型
4. 时序必须遵守时序语法铁律(节点先于边、边先于 token、回路最后闭合)
5. 在选择线索表中补充对应的文案措辞特征
6. 单场景时长保持 5~7 秒
