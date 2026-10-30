---
name: pixel-explainer
version: 1.0.0
description: 拿 visual-brief-design 的动画设计脚本，用「像素风」实现成 Remotion 代码动画（5×5 美术像素栅格、有限调色板、逐帧步进、禁一切柔化）。消费导演设计的每拍"呈现什么"，用面板/阶梯线/字符格/16×16 sprite 落地，保持内容驱动运动（禁装饰晃动）。当用户要把 visual-brief 的动画设计用像素风实现、或做像素风/复古终端/8-bit 科普动画时，必须使用本 skill。
---

# Pixel Explainer：像素风实现 visual-brief 的动画设计

拿 visual-brief-design（导演）的动画设计脚本——每拍"呈现什么"（风格无关创意 + 内容驱动运动）——用像素风**实现**成 Remotion 代码。

本 skill 不设计"呈现什么"（导演的活），负责：**用像素画法把导演设计落地，并且守住栅格**。

## 和同族引擎差在哪

这套 skill 现在有五个能用的引擎：doodle（rough.js 手绘）、sticker（硬边贴纸）、modern-tech（浅暖 tech）、dark-botanical（暗底暖金）、pixel（整数格 + 有限色）。它们吃同一份 brief、同一套 themeRef 规则，区别只在"用什么画法落地"。

下表只比最常和 pixel 互相切换的两个（doodle / sticker），因为这三个共享同一份 theme-catalog 和同一张出场词表：

| | doodle | sticker | pixel |
| --- | --- | --- | --- |
| 坐标 | 连续，任意小数 | 连续，任意小数 | 只允许整数美术像素，逻辑画布 384×216 |
| 形状与容器 | 圆角（≥16）+ 3px 描边 | 方角 + 硬偏移阴影 | 1 格硬边框，无圆角无阴影 |
| 字号 | 自由，但有下限：字幕 ≥56 / 辅助 ≥32 / 关键词 ≥64 | 同左 | 只有两档：60 / 120，没有中间值 |
| 运动 | 默认 spring 弹入，可用缓动 | 同左 | 逐帧步进，禁 spring、禁 Easing |
| 转场 | 滑动 / 硬切 / 淡入 + 高级四式 | 同左 | 硬切 / 1 帧白闪 / 抖点消融 |
| 渐变 | 全禁 | 全禁 | 全禁（这条三家一样，不是差异点） |
| 模糊 | 元素层禁，三处例外：镜头运动模糊、虚焦接力、`(纹理)` 文字虚化 | 同左 | 全禁，没有任何例外 |
| 3D | Seg 标 `维度:3D` 时走 Three.js | 同左 | 不支持 |
| 一屏字数 | 由字号下限自然约束，压得下就能放 | 同左 | 硬上限：两行约 40 字，压不下 |

**同一份 brief 三家都能落地，但 pixel 要改写一部分运动词汇。** 导演标 `flip` / `blur-in` / `rotate-in` / `shimmer` 四个出场词，以及 `rack` / `orbit` 两个镜头，pixel 做不出来，必须换成等价语义的做法，并在交付说明里点出来（逐词替代见 `references/motion-recipes.md` §1）。

还有一条没写进表里，但选型时最该先问：**加一个新概念的代价不一样。** doodle 和 sticker 靠形状自由组合，任何抽象概念都能拼出来；pixel 里抽象概念靠面板 + 阶梯线 + 字，只有具象对象（锁、芯片、手、机器人）才值得手画一张 16×16 sprite。所以判断标准是"这一集要讲的东西里，有多少是必须一眼认出来的实体"——实体多就吃 sprite 的工作量，全是抽象概念则图元够用。

## 实现原则

1. **忠实导演设计**：每拍按 brief 的呈现概念实现，不擅自改概念。场景时长、转场类型、音画偏移以导演为准。
2. **栅格优先于构图**：宁可把元素挪一格、缩一格，也不要出现半像素。所有坐标过 `u()`，所有尺寸是整数。
3. **内容驱动运动，禁装饰晃动**：动效服务于内容（落位/生长/打字/点亮）；禁止呼吸、浮动、扫描线整屏扫动这类装饰性运动。
4. **anti-PPT 靠格子级变化**：方块和直线天生像流程图，必须靠"打字机推进 / 线长出一节 / 一个格子被点亮 / 面板换一阶"维持活性，>3 秒无变化就是 PPT。
5. **preview-first**：全片前先挑 1~3 个关键场景渲染极短 demo，确认主题与骨架，认可后才做全片。

## 工作流

### 第 0.5 步：素材预检

brief 里出现截图、Logo、复杂插画时，先查 `public/` 有没有现成素材。像素风有一条硬限制：**外部图片必须是逻辑尺寸的整数倍，并开 `imageRendering: pixelated`**，否则图片会成为全片唯一一处非像素内容，抽帧校验直接红。

代码画不动、且必须有的图片，交 `asset-generation`（传 engine=pixel）。但优先考虑：能不能用面板 + 字符格 + 阶梯线把这件事说清楚？像素风里，能用图元说清的就不该用图。

### 第 1 步：消费 brief → 实现规划

对每拍：

- **判断"东西"还是"关系"**：东西（文件夹、锁、芯片）用 sprite + 面板；关系（调用、映射、依赖）用面板 + 阶梯线。判断错整拍就废
- **选骨架**：`references/templates.md` 八种，参考非菜单
- **焦点控制**：brief 给 focus / split / pulse / stamp / hold / freeze，映射成——focus=其余降到 `soot` + 目标 `Bracket`；split=左右双栏；pulse=1 帧换高亮色；stamp=错位 2 格后跳到目标位 + 1 帧白闪；hold=不动；freeze=定格 + 括号圈注
- **布局**：brief 给的是相对空间关系（左/右/上/下/居中），坐标自己算。brief 若给精确坐标，视为导演越权，重算
- **出场方式**：按 `references/motion-recipes.md` §1 的词表落地。做不了的词换等价做法并记下来
- **镜头**：brief 给推近/拉远/横移/升降/侧掠/视差，包进父层做 transform，**缩放只能整数倍**，位移只能整数格。orbit/rack/3D 退回给导演改分镜
- **文字两态**：brief 标 `(要读)` 的用 `bone`（亮阶），标 `(纹理)` 的用 `soot`（暗阶）并降密度——本引擎没有字号和模糊两档可用，只能靠颜色阶区分
- **表格**：用字符格 + 面板，不用 HTML table
- **时序**：按 cue 对齐，含音画偏移（提前 -9 帧 / 同步 / 滞后 +6 帧）

### 第 2 步：关键场景 demo（必做）

从 brief 挑 1~3 个关键场景（开场钩子 + 一个核心转折），每个只做布局 + 主题 + 主要元素的落位，不做全部 cue。

```bash
npm run dev                                   # Studio 里看
npx remotion render <Id> out/preview.mp4 --frames=<场景帧区间> --image-format=png --crf=14
node scripts/check-pixel-frame.mjs out/f150.png   # 顺手验一帧
```

给用户看的时候说清三件事：这是哪几个场景、用的哪套主题、骨架选的哪个。认可后进全片。

### 第 3 步：实现自检（轻量）

判断对不对：sprite 用在了该用的地方（具象对象）而不是概念上？每拍只有一类关系？出场词该换的换了？没有 >3 秒的静帧？

### 第 4 步：生成全片代码

画法见 `references/style-guide.md`，几何见 `references/geometry.md`。

### 第 5 步：渲染自检（两道闸，都硬）

```bash
node scripts/lint-pixel.mjs src/           # 必须 pixel issues: 0
npx remotion still <Id> out/f.png --frame=150 --image-format=png
node scripts/check-pixel-frame.mjs out/f.png   # 每个 5×5 块同色 + 色数极少
```

再检查：

- **布局**：元素 bounding box 不重叠（连线除外）、在 `SAFE` 内、文字不溢出
- **字高**：字幕 60px（`t` 档），标题 120px（`T` 档）。没有中间档，别硬造
- **确定性**：无 `Date.now()` / `Math.random()`，seed 从 index 派生
- **用色**：全部来自当前主题，没有临时 hex

### 第 6 步：brief 忠实度校验（调 brief-check skill）

渲染自检通过后，调 `brief-check` 对照分镜逐 Seg 校验（元素完整性 / 动作匹配 / 色码贯穿 / 时序偏移 / 素材使用）。不匹配就打回修，重渲染再查。

交付说明里要专门列一行：**哪些 brief 词在本引擎被替换了，换成了什么**。

## 与 visual-brief-design 衔接

visual-brief 出每拍"呈现什么"（风格无关）；本 skill 拿 brief 落地。不重新切场景、不选主题（themeRef 是 brief 给的），只决定"用像素画法怎么实现它"。

有一条要反向提醒导演：像素引擎的字数上限比别的引擎低。一屏两行字幕大约 40 字，人物台词、长定义句会被迫拆拍。如果 brief 里有大段解说，建议在 brief 阶段就标成两拍。

## 文件导航

| 文件 | 何时读 |
| --- | --- |
| `references/style-guide.md` | 写代码前（六类图元 / sprite 规则 / 文字与色彩纪律 / 禁止清单） |
| `references/geometry.md` | 画任何东西前（`u()` / 阶梯线 API / 字符格 / 安全区 / 两道闸门 / 出片编码） |
| `references/motion-recipes.md` | 实现动效时（出场词表映射 / 相机 / 转场 / anti-PPT / 确定性） |
| `references/templates.md` | 选骨架时 |
| `references/examples.md` | 看 brief → 代码的推理链 |
| `references/theme-catalog.md` | 解析 themeRef、新增主题时 |
| `kit/` | 几何层（栅格断言 / 阶梯线 / 字符画转路径 / 整数对齐文字 / 调色板），拷进工程 `src/` 直接用。面板与字幕按 style-guide 自写 |

## 主题（themeRef）解析

- brief 写 `themeRef: pico8 + pixel` → `themeById('pico8')`，包进 `PixelThemeProvider`
- brief 没写 → 默认 `pico8`
- brief 给的是别的引擎的主题（`playful` / `block-frame` 之类）→ 提示换像素主题或换引擎，不要硬套
- 改主题色只改 `kit/themes.ts` 与 master 的 `theme-catalog.json`，不要在场景代码里单改

## 什么时候不该用这个引擎

像素风不是万能皮。这几种情况换别的引擎：柔和题材换 doodle，要硬边 pop 换 sticker，要架构图和代码高亮换 modern-tech，要数据感和高级感换 dark-botanical。

- 内容本身很软（情绪、关系、成长、职场），像素的硬边会把语气压成"系统日志"
- 需要大量有机形状或插画（人物、风景、手绘示意）
- 需要连续运镜或 3D
- 一屏信息量很大（像素只有两档字号，塞不进去）

它最出彩的地带是：机器、代码、系统内部、协议、硬件、协议栈、复古计算、逆向与安全。
