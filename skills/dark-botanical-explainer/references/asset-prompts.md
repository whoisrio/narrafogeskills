# AI 素材生成指导:暗底风格的截图与产品图

暗金风是数据驱动风格,**默认全部代码绘制**(图表、数字、卡片、代码面板),很少需要插画类 AI 素材。
真正需要 AI/外部素材的场景主要是两类:产品截图、UI 界面图(用于「实际效果展示」);以及极少数无法用几何拼出的 Logo/吉祥物。
本文件规定这类素材怎么准备和接入,保证它们和暗金画布无缝同框。

## 判断标准:什么时候需要外部素材

- 数字、图表、卡片、代码、标题、字幕 -> 全部代码绘制,走构件族
- 「看一下实际产品长这样」「这是 xxx 的界面」-> 产品截图(直接截,不生成)
- 需要展示某个真实 Logo/品牌标识 -> 取原版 SVG/PNG,不要用 AI 重画(AI 画 Logo 必走样)
- 吉祥物/插画角色 -> 暗金风极少用;若必须,走 AI 生成(见下),但要暗化处理融入画布

## 素材准备:截图类

截图是暗金风最常见的外部素材(产品演示场景)。处理规则:

- **暗化处理**:截图通常亮度高,直接贴暗底画布会刺眼。用 `ImgCard` 组件渲染,或包一层 `filter: brightness(0.85) contrast(1.05)` + 半透深色遮罩 `background: rgba(15,15,15,0.15)` 让它融入
- **圆角 + 阴影**:`borderRadius: 10` + `boxShadow: '0 8px 50px rgba(0,0,0,0.5)'`(ImgCard 已内置),不要硬边
- **加 caption**:`ImgCard` 的 `caption` 参数,mono 字体 + `C.textMuted` 色,标「xxx 界面 · 2025」
- **入场动效**:与代码元素一致,spring 缩放 0.92->1 + 淡入(delay 对齐旁白)

## Prompt 结构(AI 生成插画时)

暗金风若用 AI 插画(罕见),prompt = 暗金风格前缀 + 元素描述。

### 风格前缀(每次必带)

```
Dark elegant infographic illustration, deep black background #0f0f0f,
warm gold accent #d4a574, subtle glowing light orbs, serif typography
aesthetic, muted desaturated palette, soft radial glows, no bright
colors, no gradients on shapes, centered composition, premium
documentary style
```

前缀锁死暗底 + 暖金 + 柔光,生成物才能和暗金画布同框。
**文字一律不交给图像模型**:标题/标签永远代码绘制(BigText/Tag)。

### 元素描述(后半段)

写清主体、识别特征、姿态、视角。
不要写明亮环境、强光照--会破坏暗调统一。

## Few-shot 示例

### 示例 1:产品截图接入(最常见,直接截不用 AI)

需求:展示「某数据库的控制台界面」。

做法:直接截图 -> 放 `public/images/console.png` -> 用 `ImgCard` 渲染:

```tsx
<ImgCard src="images/console.png" width={900} caption="控制台 · 2025" delay={40} />
```

ImgCard 自动暗化圆角阴影 + spring 入场。无需 AI 生成。

### 示例 2:AI 插画(吉祥物,罕见)

需求:一个金色机器人吉祥物,暗底用。

```
(暗金风格前缀)- a minimal robot mascot, dark charcoal body with warm
gold accents on joints and eyes, soft golden glow emanating from chest
core, three-quarter view, floating
```

### 示例 3:抽象概念图(数据流可视化,罕见)

需求:「KV cache」概念 -> 半透明缓存层 + 流动金色数据点。

```
(暗金风格前缀)- a stacked translucent cache layers visualization,
warm gold data points flowing between layers, dark background, soft
glow on active layer
```

## 生成与接入规则

- **截图优先**:能截图就截图 + ImgCard 暗化,不要 AI 生成真实界面(AI 画 UI 必出错字)
- **prompt 落盘**:若用 AI 生成,把 prompt 写到 `assets/prompts/<素材名>.md`(含用途)
- **格式**:截图 PNG;AI 插画优先透明背景 PNG,其次纯黑底 #0f0f0f(暗金画布直接贴)
- **去文字**:prompt 不要求图中文字;标题/标签代码绘制叠加
- **暗化验收**:贴入后检查是否刺眼--若亮度过高,加 `filter: brightness(0.8~0.9)` 或半透深色遮罩;暗金画布上的素材不应有亮区跳出
- **接入 Remotion**:文件放 `public/`,`staticFile()` 引用,`<Img>` 渲染;套 spring 缩放 + 淡入(ImgCard 已内置),动效与代码元素一致
