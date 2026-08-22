# TODO

按优先级排序。组件提取的来源详见盘点结论(2026-08-07),每批提取后在对应风格文件夹建 demo Composition 并渲染静帧验证。

## 组件提取(video_prjs -> 本仓库)

- [x] 通用层 -> `src/` 根级(SceneScaler / MicroMotion / SRT 解析 / animationHelpers)
- [x] 模板 B 暗底暖金 -> `src/components/dark-botanical/`(Primitives/Charts/CodePanel/Karaoke/Caption/Backdrop/ProgressBar/useSegmentCaption)
- [x] 模板 A 浅暖 Modern Tech -> `src/components/modern-tech/`(graph 全家套 GraphScene/Node/Edge/TokenFlow/PatternTitle + CodePanel + useShikiTokens;带 shiki 依赖)
  - 说明:字体改为声明 font-name 走系统回退(不依赖 @remotion/google-fonts,离线安全);AgentLoop 示例的 GraphEdge/TokenFlow 必须放 GraphScene 的 svgChildren prop(SVG 图层),不能当 children
- [ ] 模板 D 手绘白板(hand.tsx 753 行 + DoodleChar)--> 晚点再做

## AI/ML 基本构件对齐(2026-08-07 新增)

按「每种风格覆盖同一套 AI/软件开发基本构件」对齐,补齐流程件 / 数据件 / ML 件 / 文本对话件 / 引导件 / 高级特效。先做 doodle + dark-botanical。

- [x] doodle 补:Container / Table / Matrix / Vector / TokenSequence / ChatBubble / Formula / Magnifier / ParticleAssembly(A 档 + B 档全齐)
- [x] dark-botanical 补:FlowNode / FlowArrow / Container / Table / Matrix / Vector / TokenSequence / ChatBubble / Formula / Magnifier / ParticleAssembly(全齐)
- [x] 共享 `hooks/useScatterAssemble.ts`(散布->聚合 粒子运动,风格无关;各风格 ParticleAssembly 是其渲染器)
- [x] 每风格 `references/components.md` 构件目录(旁白措辞 -> 构件速查 + 适合场景,按类分组)
- [ ] modern-tech / hand-drawn 的对应构件补齐(晚点)
- [ ] doodle 的 Chart / Counter 仍缺(可借 dark-botanical 的,或后续补)

## skill 完善(SRT 驱动,改完同步 ~/.agents/skills/ 双副本)

- [x] 第 1 步从「自由文案主观拆关键词(3~8 硬约束)」改为「吃 visual-brief-design 的 SRT 片段 -> 按话题节拍切场景(个数随内容不预设)-> 每场景元素只从该段旁白词句提取 -> 入场对齐 SRT 时间戳」(doodle + dark-botanical 已改)
- [x] examples.md 改为真实 SRT few-shot(doodle + dark-botanical 已改)
- [x] modern-tech-explainer skill 已建(SRT 驱动待同步;组件已含)
- [ ] hand-drawn-explainer skill(随模板 D 提取一起做)
- [ ] 补 brief 校验清单(消费 visual-brief 输出时的合理性检查)
- [ ] StickerImage 接入真实 AI 素材的场景示例(替换占位笑脸)
- [ ] 注意 .gitignore 目前忽略 public/,正式用 AI 素材后需放开

## 端到端验证

- [ ] 跑一次完整链路:langgraph 旁白稿 -> visual-brief-design(subjects + assets,待用户挪过来)-> doodle/dark-botanical explainer 实现成片
- [x] 各风格 e2e 参考示例已建并渲染静帧验证:doodle(vector-search/agent-loop/code-walk/attention)、dark-botanical(training-cost/quantize-code/attention-calc)、modern-tech(agent-loop/code-deep-read)

## 收尾

- [ ] git commit 固化本仓库(需用户确认)
- [ ] 可选:跑 doodle/dark-botanical explainer 的 skill eval(skill-creator 流程:测试 prompt + with/without skill 对比)
