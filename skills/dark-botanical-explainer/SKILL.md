---
name: dark-botanical-explainer
description: 拿 visual-brief-design 的动画设计脚本,用「暗底暖金」风格实现成 Remotion 代码动画。深色画布 + 浮动光圈 + 衬线大标题 + 暖金点缀 + 数据图表。消费导演设计的每拍"呈现什么",选本风格的模板/组件/运动去落地,保持内容驱动运动(禁装饰晃动)+ anti-PPT。当用户要把 visual-brief 的动画设计用暗金风实现、或做暗金风数据驱动/高级感科普动画时,必须使用本 skill。
---

# Dark Botanical Explainer:暗金风实现 visual-brief 的动画设计

拿 visual-brief-design(导演)产出的动画设计脚本--每拍的"呈现什么"(风格无关创意概念 + 内容驱动运动)--用暗底暖金风格**实现**成 Remotion 代码。
本 skill 不设计"呈现什么"(那是导演的活),本 skill 负责:**用暗金模板/组件/运动把导演的设计落地,且保持内容驱动运动、禁 PPT 感**。

## 实现原则

1. **忠实导演设计**:每拍按 visual-brief 的"呈现设计"概念实现,不擅自改概念。导演说"时间轴"就做时间轴,说"✗否定"就做✗否定。
2. **内容驱动运动,禁装饰晃动**:实现时每个动效服务于内容(揭幕/滑入/盖章/否定/因果/对比),**禁止无意义背景晃动**(漂移光球/火花/镜头无目的晃动)。运动来自内容,不是装饰。
3. **anti-PPT**:元素入场后持续环境运动(呼吸/浮动)+ 连线 marching 流动 + 镜头运动(服务于焦点,不是乱晃)+ 每 cue 一个可见变化。任一拍 >3s 无运动变化 = PPT,要拆分或加(内容驱动的)运动。
4. **风格落地**:配色只从 theme.ts(C/EDITOR/CAPTION/BLUEPRINT);标题衬线 weight 900;数字 CounterUp;用招牌效果(光绘/大字衬线数字/光晕绽放/发光描边/流光 token)。
5. **高级动效/转场配方**:导演可能标高级词汇(批量加速错峰 stagger/定格标注/变速/crash-zoom/侧掠/穿窗/虚焦接力/黑场字卡/甩镜/文字两态),实现参数与命门见 `references/motion-recipes.md`,按本风格语汇落地(如圈注用光晕圈)。

## 工作流

### 第 1 步:消费 visual-brief 设计 -> 实现规划

输入:visual-brief 的动画设计脚本(每拍:字幕范围 + key point + 呈现设计 + 内容驱动运动)+ 风格=暗金。

对每拍,做实现规划:
- 导演的"呈现设计"概念 -> 选哪个暗金模板(`references/templates.md`,参考非菜单)+ 哪些组件(`references/components.md`)去实现
- 导演的"内容驱动运动" -> 落成具体暗金动效(用 FlowToken/CounterUp/光绘/marching 等),保持内容驱动
- 时序对齐 cue 时间戳

实现规划可审,再写代码。

### 第 2 步:实现自检(写代码前)
- [ ] 每拍忠实导演的呈现概念?没擅自改?
- [ ] 运动是内容驱动(讲内容),无装饰晃动(光球/火花/镜头乱晃)?
- [ ] 每拍持续运动,无 >3s 静态?
- [ ] 用了暗金招牌效果?配色从 theme?

### 第 3 步:生成代码

风格细节(配色/字体/构件 API/动效族/时序铁律/禁止项)在 `references/style-guide.md`(含 Anti-PPT 运动铁律 + 视觉丰富度)。

### 第 4 步:渲染自检

渲染关键帧目检:暗底对比度、衬线权重、暖金不泛滥、**内容驱动运动到位、无 PPT 静态段**(可用运动能量指标自检)。

## 参考实现

- 组件库:`src/components/dark-botanical/`--Primitives/Charts/CodePanel/Karaoke/Caption/Backdrop/ProgressBar;流程/AI 件:FlowNode/FlowArrow/FlowToken/Container/Table/Matrix/Vector/TokenSequence/ChatBubble/Formula/Magnifier/ParticleAssembly。跨风格共享 useScatterAssemble 在 `src/hooks/`。
- 完整工程:`src/examples/dark-botanical/`。

## 与 visual-brief-design 衔接

visual-brief-design(导演)出每拍"呈现什么"(风格无关);本 skill(实现)拿设计 + 暗金风格 -> 落地。本 skill 不选主题/不设计呈现概念(导演的活),只决定"用暗金的什么模板/组件/运动实现它"。

## 文件导航

| 文件 | 何时读 |
| --- | --- |
| `references/style-guide.md` | 写代码前;含 Anti-PPT 运动铁律 + 视觉丰富度 |
| `references/motion-recipes.md` | 实现高级动效/转场时(参数/曲线/命门) |
| `references/components.md` | 选组件实现导演概念时(旁白措辞 -> 构件 + 适合场景) |
| `references/templates.md` | 选模板实现时(参考模式库,非菜单) |
| `references/examples.md` | 看实现推理 |
| `references/asset-prompts.md` | 出现截图/产品图等 AI 素材时 |
