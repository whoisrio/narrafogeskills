---
name: modern-tech-explainer
description: 拿 visual-brief-design 的动画设计脚本,用「浅暖现代 Tech」风格实现成 Remotion 代码动画(浅暖米底 + 白卡硬偏移阴影 + SVG 弯曲边 + token 流动 + Shiki 代码高亮)。消费导演设计的每拍"呈现什么",选本风格的模板/组件去落地,保持内容驱动运动(禁装饰晃动)。当用户要把 visual-brief 的动画设计用现代 tech 风实现、或做架构图/数据流/技术演讲类动画时,必须使用本 skill。
---

# Modern Tech Explainer:浅暖现代风实现 visual-brief 的动画设计

拿 visual-brief-design(导演)的动画设计脚本--每拍"呈现什么"(风格无关创意 + 内容驱动运动)--用浅暖现代 Tech 风格**实现**成 Remotion 代码。
本 skill 不设计"呈现什么"(导演的活),负责:**用现代 tech 模板/组件/运动把导演设计落地,保持内容驱动运动、禁 PPT 感**。

## 实现原则
1. **忠实导演设计**:每拍按 visual-brief 的呈现概念实现,不擅自改。
2. **内容驱动运动,禁装饰晃动**:动效服务于内容(节点入场/边绘制/token 流动/段高亮),禁止无意义背景晃动。
3. **anti-PPT**:节点先于边、边先于 token、回流最后闭合、每 cue 一个变化、>3s 静态即 PPT。
4. **风格落地**:配色从 theme(C/PATTERN_COLORS);每条边 color 需在 GraphScene arrowColors 注册;Shiki 用 useShikiTokens(delayRender+缓存);字体 IBM Plex Sans/Mono/Noto Serif SC。

## 工作流
### 第 1 步:消费 visual-brief 设计 -> 实现规划
输入:visual-brief 每拍设计(呈现概念 + 内容驱动运动)+ 风格=现代 tech。对每拍:概念 -> 选模板(`references/templates.md`,参考非菜单)+ 组件(GraphScene/Node/Edge/TokenFlow/PatternTitle/CodePanel)+ 动效;时序对齐 cue(节点先于边先于 token)。
### 第 2 步:实现自检
忠实导演概念?运动内容驱动无装饰晃动?节点先于边先于 token?无 >3s 静态?Shiki 用 useShikiTokens?
### 第 3 步:生成代码
风格细节见 `references/style-guide.md`。
### 第 4 步:渲染自检
拓扑清晰、边不交叉、token 流向正确、Shiki 高亮段正确、内容驱动运动到位、无 PPT 静态段。

## 参考实现
- 组件库:`src/components/modern-tech/`(graph: GraphScene/Node/Edge/TokenFlow/PatternTitle/pathUtil;CodePanel;useShikiTokens;theme;highlight)。
- 完整工程:`src/examples/modern-tech/`(agent-loop/code-deep-read)。

## 与 visual-brief-design 衔接
visual-brief 出每拍"呈现什么"(风格无关);本 skill 拿设计 + 现代 tech 风格 -> 落地。不选主题/不设计呈现概念,只决定"用现代 tech 的什么模板/组件/运动实现它"。

## 文件导航
| 文件 | 何时读 |
| --- | --- |
| `references/style-guide.md` | 写代码前(含 anti-PPT 运动规则) |
| `references/components.md` | 选组件实现导演概念时 |
| `references/templates.md` | 选模板时(参考非菜单) |
| `references/examples.md` | 看实现推理 |
| `references/asset-prompts.md` | 极少用;默认全代码绘制 |
