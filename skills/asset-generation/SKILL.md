---
name: asset-generation
description: 动画工程的外部素材统一入口——先查现成素材(public/ 截图/Logo/已生成插画),没有才处理或生成:截图/Logo 按引擎风格接入,复杂插画按引擎前缀 + themeRef 色值生成 AI 素材。判断标准、prompt 结构、验收、接入规则都在这,explainer 不用各自维护。当动画里需要产品截图、Logo、AI 插画(吉祥物/设备/道具),或要判断"这个元素代码画还是用素材"时,必须使用本 skill。
---

# Asset Generation:动画外部素材的统一入口

所有 explainer(doodle/sticker/dark-botanical/modern-tech)共用本 skill 处理外部素材。
**先查现成素材,没有才生成/处理**——不要一上来就生成。

## 素材判断(什么走素材,什么代码画)

| 内容 | 处理方式 |
| --- | --- |
| 几何能拼的(矩形/圆/圆柱/连线) | 代码绘制,不走本 skill |
| 真实产品截图(「这是 xxx 界面」) | **截图接入**(不生成):按引擎风格包容器 |
| 真实 Logo/品牌标识 | 取原版 SVG/PNG(不 AI 重画,AI 画 Logo 必走样) |
| 有机曲线/多细节/辨识度靠外形的(吉祥物/设备/大脑/灯泡) | AI 生成插画(按引擎前缀 + themeRef 色) |
| 图标库能解决的(lucide/Heroicons SVG) | 图标库,不走 AI |

**铁律:文字一律不交给图像模型**——标题/标签永远代码绘制(AI 图里出现文字几乎必然出错字)。

## 工作流

### 第 1 步:查现成素材(先查再用)

按顺序查:
1. **`public/` 目录**:截图/图片/图标/logo/之前生成过的插画。有就直接用,标文件路径
2. **brief 里素材字段**:visual-brief 第 0 步已经查过 public/,标的路径直接引用
3. 没有的、且判定为需要素材的,才进入下一步

### 第 2 步:截图/Logo 类 -> 按引擎风格接入

调用方传入 engine 名,按对应引擎的接入规则处理(截图暗化/圆角/阴影/容器,见 `references/engine-prefixes.md` 的「截图接入」分节)。

### 第 3 步:复杂插画 -> AI 生成

调用方传入 `engine` + `themeRef`:
1. 从 `references/engine-prefixes.md` 取该引擎的风格前缀模板
2. 色值从 themeRef 对应主题取(INK/PALETTE/ACCENT/BG),**不写死**
3. 拼成完整 prompt:风格前缀 + 元素描述(主体/识别特征/姿态/视角,不写背景环境光照)
4. 生成(要改色/再编辑出 SVG,直接贴用出 PNG 优先透明背景)
5. prompt 落盘到工程 `assets/prompts/<素材名>.md`

### 第 4 步:验收与接入

- **验收**:描边够粗?无渐变/软阴影漏网(贴纸风)/无亮色破坏暗调(暗金风)?颜色在 theme 色板内?不合格改 prompt 重生成,不凑合
- **接入**:文件放 `public/`,用 `staticFile()` 引用,`<Img>` 渲染,套统一弹入 hook(与代码元素一致)
- **角色一致性**:同一角色多角度时,把第一张成品图喂回模型当参考图

## 与 explainer 的衔接

- explainer 的 style-guide **不内嵌**素材生成逻辑,需要素材时调用本 skill(传 engine + themeRef)
- explainer 工作流第 0.5 步做素材预检:查 public/ 有就用,没有的复杂插画调本 skill
- 本 skill 只处理"素材",不碰"动画逻辑"——素材就位后交给 explainer 引用

## 文件导航

| 文件 | 何时读 |
| --- | --- |
| `references/engine-prefixes.md` | 生成插画时(取引擎风格前缀 + 截图接入规则) |
