# 引擎风格前缀与素材接入规则

AI 插画生成时取对应引擎的风格前缀,色值**从 themeRef 对应主题取**(INK/PALETTE/ACCENT/BG),不写死。截图/Logo 接入按对应引擎的容器规则。

## doodle(涂鸦贴纸:rough 圆角 + 手绘)

### 插画前缀

```
Flat 2D cartoon sticker illustration, thick dark outline ({INK}, 3-4px),
rounded corners, solid pastel flat colors only ({PALETTE[0..2]}),
{ACCENT} accent, white sticker border, {BG} background,
playful tech explainer video style, no gradients,
no shadows, no 3D, centered composition
```

### 截图接入

- 截图亮度高直接贴浅底会突兀:包一层白贴纸边(白边 + 圆角 12~16 + 轻微旋转),或加同 BG 色外描边形成贴纸感
- 入场动效与代码元素一致:spring scale 0→1 带 overshoot + 淡入

## sticker(扁平硬边:方角 + 硬偏移阴影)

### 插画前缀

```
Flat 2D sticker illustration, thick black outline ({INK}, 3-4px),
hard square corners, solid flat colors only ({PALETTE[0..2]}),
hard offset shadow ({INK} solid, no blur), {BG} background,
neobrutalist sticker style, no gradients, no soft shadows, no 3D,
centered composition
```

### 截图接入

- 硬边方角(圆角 0 或主题 lineConfig 定的值)+ `boxShadow: Npx Npx 0 INK`(硬偏移零模糊,偏移量按主题)
- 白底容器:`background: #fff` + 1px 细边(如主题是浅底),或直接 INK 描边
- 入场:spring scale 0.85→1 + 淡入

## dark-botanical(暗金:深底 + 暖金 + 数据驱动)

### 插画前缀(罕见,本引擎默认全代码绘制)

```
Dark elegant infographic illustration, deep black background {BG},
warm gold accent {ACCENT[0]}, subtle glowing light orbs, serif typography
aesthetic, muted desaturated palette, soft radial glows, no bright
colors, no gradients on shapes, centered composition, premium
documentary style
```

### 截图接入(最常见——产品演示场景)

- **暗化处理**:截图亮度高,直接贴暗底刺眼。`filter: brightness(0.85) contrast(1.05)` + 半透深色遮罩 `rgba(15,15,15,0.15)`
- **圆角 + 阴影**:`borderRadius: 10` + `boxShadow: 0 8px 50px rgba(0,0,0,0.5)`,不要硬边
- **加 caption**:mono 字体 + 弱化色,标「xxx 界面 · 2025」
- 入场:spring scale 0.92→1 + 淡入

## modern-tech(浅暖现代:白卡 + 硬偏移阴影 + 拓扑)

### 插画前缀(极罕见,本引擎默认全代码绘制)

```
Flat 2D modern tech illustration, warm cream background {BG}, white cards
with hard offset shadow (8px 8px 0 {INK}), thin 1px borders,
14px rounded corners, 3px colored accent bar on top ({ACCENT[0]}),
clean minimal, no gradients, no soft shadows, no 3D, centered composition
```

### 截图接入

- 白底容器:`background: #fff` + 1px 细边 + `borderRadius: 14` + `boxShadow: 8px 8px 0` 硬偏移(与 GraphNode 一致)
- 尺寸与同场景 GraphNode 同高,视觉权重一致
- 入场:spring scale 0.85→1 + 淡入,与节点动效一致

## 素材判断速记

- 几何能拼 → 代码画
- 真实截图 → 直接截,不生成,按引擎包容器
- 真实 Logo → 取原版,不 AI 重画
- 图标 → lucide/Heroicons SVG
- 吉祥物/设备/有机曲线 → AI 插画(本文件前缀 + themeRef 色)
- 文字 → 永远代码画,不进图
