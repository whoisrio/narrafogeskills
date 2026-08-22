# 风格语法(Style Guide)

写代码前读完本文件。
所有颜色一律引用 `theme.ts` 的 `C / EDITOR / CAPTION / BLUEPRINT`,正文和代码中禁止出现硬编码色值。

## 变量区结构

### 内容变量

- 主题:如「大模型推理成本」
- 关键词列表:拆出的 3~8 个概念词
- 画幅:默认横屏 1920x1080(FHD),30fps
- 框架:默认 Remotion + TypeScript
- 总时长:单场景 4~6 秒 × 场景数(暗金风节奏比涂鸦稍慢,给数字翻牌和图表留时间)

### 配色变量

预设 A「暗金」(默认):

- 背景底色 `C.bg=#0f0f0f`,`C.bgSubtle=#1a1a1a`,卡片底 `C.bgCard=rgba(255,255,255,0.03)`
- 暖金组 `C.gold=#c9b896` / `C.goldBright=#d4a574` / `C.goldDim=#8b7635`;主强调 `C.warm=#d4a574`
- 辅助点缀 `C.pink=#e8b4b8`(次)/ `C.deep=#b87333`(铜)/ `C.cyan` / `C.green` / `C.orange` / `C.purple`(图表分色)
- 文本 `C.text=#e8e4df` / `C.textDim=#9a9590` / `C.textMuted=#5a5550`;边线 `C.border=rgba(255,255,255,0.06)`
- 警示 `C.red=#e63946`(RedCircle 痛点标注专用)

预设 B「蓝图金」(BLUEPRINT token,用于代码/架构场景):

- 背景 `BLUEPRINT.bg=#0b1220`(深海军蓝渐变 `bgTop=#12203b` -> `bgBottom=#070d18`)+ 金色漂移网格 `BLUEPRINT.grid`
- 用 `Backdrop` 组件铺设,顶部配 `ProgressBar` 金色进度条

自定义色板规则:bg 与 text 对比度 ≥7:1;gold 系列只用于标题/数字/强调,不铺大面;图表分色从 cyan/green/orange/purple 取,同明度中饱和。

### 字体变量

- `FONT.display`:衬线(Noto Serif SC),标题专用,weight 900,letter-spacing -0.02em--这是暗金风的识别符,禁用无衬线当大标题
- `FONT.body`:无衬线(Noto Sans SC),正文/副标/卡片描述
- `FONT.mono`:等宽(JetBrains Mono),数字(CounterUp)/代码(CodePanel)/Tag eyebrow
- 字号基准 `SIZE`:hero 96 / h1 72 / h2 52 / h3 40 / body 32 / bodySm 26 / caption 22 / tag 20

### 动效变量(有默认值,一般不改)

- spring:`SPRING.punch`(damping12/stiff200,冲击)/ `SPRING.slide`(damping15/stiff150,上滑)/ `SPRING.bounce`(damping10/stiff180,弹)/ `SPRING.gentle`(damping20/stiff100,柔)
- beat:`BEAT.fast=30f` / `mid=60f` / `slow=90f` / `hold=120f`

## 设计基调(Token)

- 背景:`C.bg` 深底 + `BotanicalBg` 浮动光圈(radial-gradient 暖金/粉,opacity 0.05~0.10,每帧 sin/cos 微动,降频每 3 帧更新一次减重绘)+ 细竖线装饰
- 标题:衬线 weight 900,暖金色,带 `textShadow: 0 0 60px ${color}30` 柔光;关键词可用金色高亮底(`linear-gradient(180deg, transparent 55%, gold20 55%)`)
- 装饰线:`GoldLine` 从 0 生长到目标宽度,渐变 `linear-gradient(90deg, gold, transparent)`
- 卡片:`C.bgCard` 半透 + 1px `C.border` + 12px radius + 微光 `boxShadow: 0 0 30px ${color}08`;不用粗描边(区别于涂鸦风)
- 数字:`CounterUp` 等宽 weight 900 + `textShadow: 0 0 80px ${color}25` 发光
- 字幕安全区:底部留 `SUBTITLE_SAFE=54px`,内容区 `CONTENT_H=1026px`

## 造型语法(构件族)

1. **eyebrow/标签**:`Tag`--大写字距 0.3em,mono,暖金色,场景开场信号
2. **大标题**:`BigText`--衬线 weight 900,暖金,punch 弹入 + 发光;`SubText` 副标
3. **数字**:`CounterUp`--等宽 weight 9,从 0 翻到目标值,带发光;**数字是本风格灵魂,文案里的数字必须翻牌**
4. **信息卡**:`Card`(title+value 统计卡)/ `FeatureCard`(icon+title+desc 功能卡)--半透底 + 微光
5. **图表**:`Charts` 全家桶--柱状/折线/对比/仪表盘/堆叠/数字翻牌/横条,数据论据专用
6. **代码**:`CodePanel`--深色面板 + 窗口栏(三色点)+ 逐行 clip-path 擦除 + 金色行高亮(inset 3px 左条)
7. **标注**:`RedCircle`--红圈 dasharray 绘制 + 脉冲,痛点/强调专用;`GoldLine`--装饰分隔
8. **背景层**:`BotanicalBg`(光圈)/ `GlowBg`(中心光斑)/ `Backdrop`(蓝图金网格)/ `ProgressBar`(顶部进度)
9. **字幕**:`Karaoke`(逐字金,贴底左排)/ `Caption`(居中大字)/ `useSegmentCaption`(cue 命中)

造型规则:扁平、半透、微光、大圆角(≥12px);不描粗边、不画手绘线(那是涂鸦/手绘风的活)。
暗金风靠**对比与留白**立质感,不靠装饰堆砌。

## 动画语法(动效族)

1. **弹入**:spring 驱动--`Reveal`(淡入 + 上滑 40->0)/ `PunchIn`(缩放 0.5->1,冲击感);所有入场
2. **生长**:`GoldLine`(宽度 0->target,bezier 0.16,1,0.3,1)/ 图表柱体/折线绘制 / `RedCircle`(dashoffset 200->0)
3. **翻牌**:`CounterUp`(0->to,bezier 0.16,1,0.3,1,duration 35f);数字必翻
4. **呼吸**:`BotanicalBg` 光圈 sin/cos 微动常驻 / `GlowBg` 脉冲 / `RedCircle` 落定后 sin 脉冲--画面永远微动
5. **擦除**:`CodePanel` 逐行 clip-path inset 从右往左擦出 + 行 translateY 9->0

细节:生长类用 `Easing.bezier(0.16, 1, 0.3, 1)`(快出慢收);弹入用 spring。
禁止任何匀速线性动画;禁止元素落定后完全静止(至少光圈在动)。

## 时序语法(与内容无关的铁律)

- 元素按阅读顺序逐个入场,相邻元素 delay 间隔 6~10 帧
- **数字先于结论**:CounterUp 翻完(delay + 35f)后才弹结论徽章/金句
- **图表先于标注**:图表绘制完成后再弹 RedCircle/标签指向
- **代码逐行对齐旁白**:每行 `at[i]` 对齐旁白对应句子出现时刻;高亮行 `hl[i]` 在讲该行时点亮常亮
- 已入场元素常驻(光圈呼吸 / 脉冲),不消失,直到整组转场
- 单场景 4~6 秒(比涂鸦慢,给数字和图表留观赏时间)

## 禁止项

- 禁浅底亮背景(除非用 Blueprint 预设的深海军蓝);本风格是暗底
- 禁无衬线当大标题;标题必衬线 weight 900
- 禁把数字写成静态文本;数字必 CounterUp 翻牌
- 禁粗描边贴纸风(那是涂鸦风)/ hachure 手绘(那是手绘风);本风格是半透卡片 + 微光
- 禁匀速线性动画、禁元素落定后全静止、禁一屏静态排版
- 禁在 theme 文件之外出现任何硬编码颜色值

## 交付要求

- 配色集中为单一 `theme.ts`,全部从变量区映射;换预设只允许改这一个文件
- 可复用组件:Primitives 全套、Charts、CodePanel、Karaoke/Caption、Backdrop/ProgressBar
- 每个场景渲染关键帧静帧自检:暗底对比度、衬线权重、暖金不泛滥、数字/图表可读、字幕不压主体
- 提供 dev 预览、stills、render 三个脚本

## Anti-PPT 运动铁律(必守)

PPT 感 = 元素出现后静态坐着 + 定镜头切幻灯片。以下铁律消除它:

1. **所有元素入场后持续环境运动**:节点呼吸(±2-3% scale)+ 浮动(±3-4px)+ 发光脉动;数字翻完常驻微动;标题落定后光晕呼吸。禁止任何元素"出现即死"。
2. **所有连线画完后 marching 流动**:strokeDashoffset = -frame * speed,线永远在"流"。禁止死线。
3. **持续镜头运动**:每个 phase 包裹层加 transform:缓推(scale 1.0->1.07)+ 双轴漂移(sin/cos ±10-14px)。禁止定镜头。
4. **每 cue 一个可见变化**:40 个 SRT cue = 40 个变化点,不是 4 个大静态场景。连续演化时间线,phase 交叉淡入不硬切。
5. **多层运动叠加**:镜头 + 元素环境运动 + 连线流动 + token 环流 + 光晕呼吸,同时进行。画面任意时刻至少 3 层在动。
6. **自检**:任一拍 >3s 无运动变化 = PPT,拆分或加运动。

## 视觉丰富度(用足招牌效果)

- **光绘**:移动光点 + 拖尾绘制线/轴(strokeDashoffset draw + 领头光点 + 拖尾发光圆)。用于时间轴、流程连线、揭示。
- **大字衬线数字**:CounterUp 翻牌 + `textShadow` 发光,年份/规模/参数必用。
- **光晕绽放**:radial-gradient 圆 + 透明度脉冲,里程碑/焦点/收束用。
- **发光描边**:boxShadow `0 0 Npx color` + drop-shadow,节点/卡片边缘发光。
- **签名小图**:每个概念给一个迷你视觉(不只文字标签)--如 API 用其结构签名(messages 数组/loop 图)、工具用图标。
- **流光 token**:FlowToken 沿边发光流动 + 拖尾,agent loop/数据流必用,且 repeat 常驻环流。
