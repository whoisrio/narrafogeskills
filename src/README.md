# Doodle UI Kit

「涂鸦信息图」风格的 Remotion 参考组件库,配合 `skills/doodle-explainer` 使用,可整目录拷贝进任何 Remotion 工程。
配色集中在 `theme.ts`(预设 A 马卡龙手账 / 预设 B 黑板粉笔,换预设只改该文件末尾一行)。
所有组件内置 spring 弹入(`usePopIn`)与呼吸浮动(`useFloat`),时序语法见 `skills/doodle-explainer/references/style-guide.md`。

## 目录结构(按风格分层)

- `components/<style>/` —— 组件按风格分目录:`doodle/`(涂鸦贴纸)、`dark-botanical/`(暗底暖金);以后新风格另起平级目录。
- `demo/<style>/` —— 每个组件一个独立 demo Composition;`examples/<style>/` —— 完整 e2e 示例。
- 根级跨风格复用:`rough.tsx` / `theme.ts` / `text.ts` / `hooks/`(usePopIn、microMotion)/ `SceneScaler.tsx`(低分辨率场景自动放大)/ `srt.ts`(SRT 解析)/ `animationHelpers.ts`(spring/easing/stagger 工厂)。
- Studio 侧栏同步分层:`components/<style>`、`examples/<style>` 两级文件夹(见 `Root.tsx`)。

### dark-botanical(暗底暖金)清单

| 文件 | 功能 |
| --- | --- |
| `theme.ts` | 色板/字号/SPRING/BEAT 预设 + EDITOR(代码面板)/CAPTION(字幕)/BLUEPRINT(蓝图金背景)token |
| `Primitives.tsx` | BotanicalBg 光圈背景、Tag、Reveal、PunchIn、BigText、SubText、RedCircle、GoldLine、GlowBg、CounterUp、ImgCard、Card、FeatureCard、SceneLayout |
| `Charts.tsx` | 柱状/折线/对比/仪表盘/堆叠/数字翻牌/横条图表全家桶 |
| `CodePanel.tsx` | 深色代码面板,逐行擦除 + 行高亮(lines 传 HTML,token class 着色) |
| `Karaoke.tsx` / `Caption.tsx` | 逐字字幕两个变体(贴底左排 / 居中大字),吃 {text, progress} |
| `Backdrop.tsx` / `ProgressBar.tsx` | 蓝图金漂移网格背景 / 顶部金色进度条 |
| `useSegmentCaption.ts` | 按全局帧命中字幕 cue(cues 数组由 props 传入) |
| `FlowNode.tsx` / `FlowArrow.tsx` / `Container.tsx` | 暗金风流程件:节点(身份条/special双描边/active脉冲) / 弯曲边箭头 / 虚线金分组框 |
| `Table.tsx` / `Matrix.tsx` / `Vector.tsx` | 数据/ML 件:暗金表格(逐行) / 矩阵(强度着色逐格) / 向量盒 |
| `TokenSequence.tsx` / `ChatBubble.tsx` | LLM 件:token 流(active金高亮+attention弧) / user-assistant 对话气泡 |
| `Formula.tsx` / `Magnifier.tsx` / `ParticleAssembly.tsx` | 公式(token上色) / 放大聚焦包装器 / 打散重组粒子(用共享 useScatterAssemble) |

## 组件清单(均位于 `components/doodle/`)

| 文件 | 功能 | 对应叙事模板 |
| --- | --- | --- |
| `GridBackground.tsx` | 纸面底色 + 手绘网格背景 | 全部 |
| `PillBadge.tsx` | 药丸徽章(ACCENT 底 + 贴纸边 + 超粗字) | 1 / 3 / 5 / 6 |
| `DoodleCard.tsx` | 圆角粗描边容器卡片 | 1 / 4 |
| `LinkedBlocks.tsx` | 彩色方块连线序列图形节点(逐个弹入) | 1 / 2 / 4 |
| `DatabaseCylinder.tsx` | 数据库圆柱图形节点 | 5 |
| `CircleNode.tsx` | 同心圆图形节点(实心圆盘 + 圆点) | 1 / 5 |
| `WrenchGear.tsx` | 扳手+齿轮工具节点(手写 SVG path 路线) | 2 |
| `CodeCard.tsx` | 代码卡片:等宽字体逐行点亮 + ACCENT 高亮条 + 讲完行回落;`variant="dark"` 为 VSCode 窗口风(顶栏三点 + 暗底 + 极简语法着色) | 7 |
| `DashedArrow.tsx` | 虚线弧箭头连接线(虚线缓慢流动,`grow` 开启生长动画) | 2 / 5 / 7 |
| `BigTitle.tsx` | 超大标题,逐词弹入,关键词 ACCENT 高亮 | 6 |
| `SplitDivider.tsx` | 中缝虚线,从上往下生长 | 3 |
| `StepBadge.tsx` | 圆形序号角标(粗描边圆 + 数字) | 2 |
| `StickerImage.tsx` | AI 素材包装器(staticFile + Img + 贴纸边 + 统一弹入/浮动) | asset-prompts.md 接入规则 |
| `hooks/usePopIn.ts`(src 根) | `usePopIn` / `useFloat` / `useFadeIn` 动效 hook | 全部 |
| `rough.tsx`(src 根) | rough.js 封装(固定 seed;含 ellipse/circle 填充路径闭合 + nonzero 修复) | 全部 |
| `theme.ts`(src 根) | 配色 Token:`presetA` / `presetB` / 当前 `theme` | 全部 |

## 用法

- `npm install` 后 `npm run dev` 打开 Studio:侧栏 `components/doodle` 下每个组件一个独立 Composition(`Gallery` 画廊在最前),可单独预览/调参;`examples/doodle` 下是完整 e2e 示例。
- `npm run stills` 渲染组件画廊与 e2e 示例静帧到 `out/`。
- e2e 参考示例见 `src/examples/doodle/`(`vector-search` 概念拆解/规模/地图三场景,`agent-loop` 流程闭环,`code-walk` 逐行讲代码),演示如何只用本组件库搭完整场景。
- 拷贝使用:复制 `src/` 整个目录,素材图放工程 `public/` 下用 `StickerImage` 引用。

## 风格与 AI/ML 构件扩展(2026-08-07)

本仓库已从单一 doodle 风格扩展为多风格 + AI/ML 构件库,配套 SRT 驱动的 explainer skill。

### 三种风格(按 visual-brief-design 模板字母对齐)

- `components/doodle/`(模板 H·涂鸦贴纸):rough.js 手绘,贴纸边,spring 弹入 + 呼吸。
- `components/dark-botanical/`(模板 B·暗底暖金):暗底光圈,衬线金标题,数字翻牌,图表论证。
- `components/modern-tech/`(模板 A·浅暖现代):浅暖米底,白卡硬偏移阴影,SVG 弯曲边 + token 流动,Shiki 代码高亮。

### AI/ML 主题基本构件(跨风格对齐)

每个风格都覆盖 AI/软件开发主题常用的基本构件,选型见各 skill 的 `references/components.md`(旁白措辞 -> 构件速查 + 适合场景):

- 流程类:FlowNode / FlowArrow / Container(分组框)
- 数据类:Table / Chart / Counter
- ML 特化:Matrix(矩阵) / Vector(向量) / TokenSequence(token 流 + attention 弧)
- 文本/对话:CodeBlock / Formula(公式) / ChatBubble(LLM 对话)
- 引导:Callout / Magnifier(放大聚焦)
- 高级特效:ParticleAssembly(打散重组,运动用共享 `useScatterAssemble` hook)

### SRT 驱动的 explainer skill

`skills/<style>-explainer/` 是各风格的实现端 skill,工作流改为 SRT 驱动:第 1 步吃 visual-brief-design 给的旁白 SRT 片段 -> 按话题节拍切场景(个数随内容,不预设)-> 每场景从旁白词句提取要呈现的元素(查 components.md 速查表)-> 入场对齐 SRT 时间戳。每个 skill 含 SKILL.md + references/{templates, components, examples, style-guide, asset-prompts}.md。

### 共享根级

- `hooks/useScatterAssemble.ts`:散布 -> 聚合 粒子运动 hook(风格无关),各风格的 ParticleAssembly 是它的渲染器。
- `hooks/usePopIn.ts`(usePopIn/useFloat/useFadeIn)、`rough.tsx`、`theme.ts`、`srt.ts`、`animationHelpers.ts`、`SceneScaler.tsx`:跨风格复用。
