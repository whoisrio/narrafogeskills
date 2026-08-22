# AI 素材生成指导:modern-tech 默认全代码绘制

modern-tech 是图论/架构风格,**默认全部代码绘制**--节点是白卡(GraphNode)、边是 SVG path(GraphEdge)、流动是圆点(TokenFlow)、代码是 Shiki 高亮(CodePanel)。
本风格几乎不需要 AI 插画素材:架构图的美感来自拓扑清晰 + 流向明确 + 硬偏移阴影,不来自插画。
本文件只在极少数情况下(需要真实 Logo、产品截图、无法用几何拼的图标)才启用。

## 判断标准:什么时候需要外部素材

- 节点、边、token、标题、代码 -> 全部代码绘制,走构件族
- 需要展示真实产品 Logo -> 取原版 SVG/PNG,不要 AI 重画
- 需要展示真实产品截图(「这是 xxx 的界面」)-> 直接截图,圆角 + 硬偏移阴影接入
- 无法用几何拼且辨识度依赖外形的图标 -> 用图标库(如 lucide/Heroicons 的 SVG),不走 AI 生成

## 素材接入:截图/Logo 类

modern-tech 接入外部图的原则:保持白卡 + 硬偏移阴影的统一感。

- **圆角 + 硬阴影**:`borderRadius: 14` + `boxShadow: C.shadow`(8px 8px 0 硬偏移),与 GraphNode 一致
- **白底容器**:截图包一层 `background: #fff` + 1px 细边,融入白卡体系
- **尺寸**:与同场景 GraphNode 同高,视觉权重一致
- **入场**:spring scale 0.85->1 + 淡入,与节点动效一致

## Prompt 结构(极少用 AI 插画)

若必须 AI 生成插画(本风格几乎不发生),prompt = 浅暖现代风格前缀 + 元素描述。

### 风格前缀(每次必带)

```
Flat 2D modern tech illustration, warm cream background #f5efe4, white cards
with hard offset shadow (8px 8px 0 rgba(26,25,23,0.85)), thin 1px borders,
14px rounded corners, 3px colored accent bar on top, clean minimal, no
gradients, no soft shadows, no 3D, centered composition
```

**文字一律不交给图像模型**:标签/kicker 永远代码绘制(PatternTitle/GraphNode label)。

## Few-shot 示例

### 示例 1:产品截图接入(最常见,直接截不用 AI)

需求:展示「某数据库控制台」。

做法:截图 -> `public/images/console.png` -> 包白卡 + 硬阴影:

```tsx
<div style={{
  background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 14, boxShadow: C.shadow, overflow: 'hidden', padding: 8,
}}>
  <Img src={staticFile('images/console.png')} style={{width: 600, borderRadius: 8}}/>
</div>
```

无需 AI 生成。

### 示例 2:图标库接入(替代 AI)

需求:节点用「数据库」图标。

做法:用 lucide-react 的 `<Database/>` 图标,颜色 = 节点身份色,放 GraphNode 内。不走 AI。

## 生成与接入规则

- **截图/图标优先**:能截图就截图,能图标库就图标库,不要 AI 生成(AI 画 UI/图标必走样)
- **prompt 落盘**:若用 AI 生成,把 prompt 写到 `assets/prompts/<素材名>.md`
- **格式**:截图 PNG;AI 插画优先透明背景 PNG,其次纯奶油底 #f5efe4
- **去文字**:prompt 不要求图中文字;标签代码绘制叠加
- **风格验收**:贴入后检查是否带渐变/软阴影(破坏硬偏移风格);不合格就换截图/图标库
- **接入 Remotion**:文件放 `public/`,`staticFile()` 引用,`<Img>` 渲染;套 spring scale + 淡入,动效与节点一致
