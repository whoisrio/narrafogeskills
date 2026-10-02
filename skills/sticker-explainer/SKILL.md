---
name: sticker-explainer
description: 拿 visual-brief-design 的动画设计脚本,用「扁平贴纸信息图」风格实现成 Remotion 代码动画(硬边方角 + 硬偏移阴影 + 纯色块,无 roughness)。消费导演设计的每拍"呈现什么",选本风格的模板/组件去落地,保持内容驱动运动(禁装饰晃动)。当用户要把 visual-brief 的动画设计用贴纸/扁平风实现、或用新粗野(neobrutalist)风格做科普动画时,必须使用本 skill。
---

# Sticker Explainer:贴纸风实现 visual-brief 的动画设计

拿 visual-brief-design(导演)的动画设计脚本--每拍"呈现什么"(风格无关创意 + 内容驱动运动)--用扁平贴纸风格**实现**成 Remotion 代码。
本 skill 不设计"呈现什么"(导演的活),负责:**用贴纸模板/组件/运动把导演设计落地,保持内容驱动运动、禁 PPT 感**。

## 与 doodle-explainer 的关系

doodle(rough.js 手绘圆角)和本 skill(扁平硬边)是**并列的两个渲染引擎**,共享同一份主题目录数据(theme-catalog),但画法不同:

| | doodle-explainer | sticker-explainer |
| --- | --- | --- |
| 线条 | rough.js 手绘,roughness 0.5~0.8 | 硬边直线,roughness 0,无手绘抖动 |
| 圆角 | ≥16px,大圆角 | 方角(0px)或固定小圆角(见主题 lineConfig) |
| 阴影 | 禁阴影 | **硬偏移阴影**(8~24px,零模糊,同色或 INK) |
| 描边 | 3px 圆润 | 3~4px 硬边(主题 lineConfig 定) |
| 视觉语 | 手账/涂鸦/贴纸簿 | 贴纸/新粗野/flat 色块 |

**同一份 brief,两套引擎都能落地**——选哪个由 themeRef 的 engine 决定:brief 给 `playful + doodle` 走 doodle,给 `block-frame + sticker` 走本 skill。**本 skill 只吃 engines 含 `sticker` 的主题**(scatterbrain/daisy-days/capsule/stencil-tablet/block-frame/creative-mode)。

## 实现原则
1. **忠实导演设计**:每拍按 visual-brief 的呈现概念实现,不擅自改概念。导演标的场景时长/转场类型/音画偏移以导演为准。
2. **内容驱动运动,禁装饰晃动**:动效服务于内容(弹入/生长/流动);禁止无意义背景晃动,也禁止物体入场后的无目的上下左右抖动(除非服务表达:错误 shake/情绪强调)。镜头语言(内容驱动的推拉/横移)不在此列。
3. **anti-PPT**:每 cue 一个变化、信息持续进场;已就位元素保持静止,靠新信息推进维持活力,>3s 无变化即 PPT。
4. **风格落地**:配色从 theme(BG/GRID/INK/PALETTE/ACCENT,见 `references/theme-catalog.md`);硬边方角 + 硬偏移阴影;flat 色块排版;画法规则见 `references/style-guide.md`;spring 弹入+转场(基础三式滑动/硬切/淡入 + 高级四式穿窗/虚焦接力/黑场字卡/甩镜,按导演标;配方见 `references/motion-recipes.md`)。
5. **preview-first**:全片实现前,先挑 brief 里的关键场景渲染极短 demo(每场景 1~2s 动效片段)给用户确认主题/布局/配色,认可后才做全片。

## 工作流
### 第 0.5 步:素材预检(先查再用,需要素材时)
brief 或场景里出现截图/Logo/复杂插画需求时,先查 `public/` 有没有现成素材(visual-brief 第 0 步标的路径优先)→ 有直接用 → 没有的、且判定为"代码画不动"的,调用 `asset-generation` skill(传 engine=sticker + themeRef)。判断标准/前缀/接入规则都在那边,本 skill 不内嵌。

### 第 1 步:消费 visual-brief 设计 -> 实现规划
输入:visual-brief 每拍设计(呈现概念 + 焦点控制 + 内容驱动运动 + 相对空间关系)+ 风格=贴纸。

对每拍:
- 概念 -> 选结构骨架(`references/templates.md` 的结构模式,参考非菜单)+ 按 `references/style-guide.md` 画法规则自由组合元素
- **焦点控制**:brief 给 focus/split/pulse/stamp/hold/freeze 指令,映射到贴纸实现(focus=元素高亮+其他dim/split=flex并排/pulse=scale弹/stamp=✗砸+shake/hold=不动/freeze=定格+圈注,帧号 remap+硬边直角标注,配方见 `references/motion-recipes.md`)
- **布局**:brief 给相对空间关系(左/右/上/下/居中/竖排/横排),explainer 根据元素实际尺寸算精确坐标 + 安全区 + 碰撞检查。**brief 若给精确坐标,视为导演越权,重算**
- **出场方式**:brief 给每段 `出场方式`(pop/slide/dissolve/rush-in/typewriter/flip/wipe/stagger/blur-in/draw/scale-up/rotate-in/shimmer/snap),映射到硬边实现——pop=spring 弹入 + 硬偏移阴影落定;slide=直角 translate 滑入;dissolve=opacity 0->1+blur;rush-in=高速滑入 + 轻微 overshoot;typewriter=逐字 clip 揭示;flip=rotateX 翻出(硬边无圆角);wipe=硬边 mask 擦除;stagger=批量同类元素**加速错峰**(间隔递减+收尾静止 0.5s,配方见 `references/motion-recipes.md`,等间隔读作机械复读);blur-in=blur 降由虚变实;draw=stroke 生长;scale-up=平滑放大(无 spring);rotate-in=rotate 落定;shimmer=扫光(不群发,一镜最多主角一次,裁进硬边边界,见 motion-recipes 光效纪律);snap=磁吸归位。默认 pop,但按语义挑,不全程弹入。各词详细参数/曲线/命门见 `references/motion-recipes.md`
- **镜头语言**:brief 给场景 `镜头`(推近/拉远/横移/升降/orbit/whip/parallax/rack/crash-zoom/侧掠),把场景内容包进父 Group 做 scale+translate(2D 模拟相机);crash-zoom=快速冲推+末帧 snap(配方见 motion-recipes);侧掠=透视参数全程常数、内容自身 translateX 滑过固定取景框(物动镜不动,配方见 motion-recipes);若 Seg 标 `维度:3D` 则走 Three.js 真实相机(见下)
- **文字两态**:brief 标 `(要读)` 的文字,实现保证有效字高(量渲染帧实际像素,字幕 ≥56px/辅助 ≥32px,方法见 motion-recipes);标 `(纹理)` 的文字明显虚化/降亮度,不抢读。未标默认"要读"
- **表格**:brief 给 `table`(列数×行数+表头),用 Table 组件(硬边方角+硬偏移阴影)渲染;表格动效(表头先落/逐行弹入/单元格高亮/列强调/行排序/数字跳动)按 brief 标的做
- **3D 维度**:brief 对 Seg 标 `维度:3D(Three.js)` 时,该 Seg 走 Three.js/r3f 渲染路径(点云/曲面/粒子流/3D柱/几何体morph/爆炸视图/3D节点图),不用 2D 冒充。若工程尚未建该路径,标注 TODO 并提示用户
- **时序对齐 cue**(含音画偏移:提前-9帧/同步/滞后+6帧)。**场景时长/转场类型以导演为准**

### 第 2 步:关键场景 demo(preview-first,必做)
全片代码前,先让用户看到"这个主题+这个布局落到这个内容上长什么样":

- 从 brief 挑 **1~3 个关键场景**:开场钩子(第一个场景)+ 核心转折/收束(如果 brief 标了节奏标签或 key 场景,优先选)
- 每个场景做**最简版**:只实现该场景的布局 + 主题配色 + 主要元素入场,不做全部 cue 细节
- 渲染极短片段:`npx remotion render <CompositionId> out/preview-<场景名>.mp4 --frames=<该场景帧范围>`(1~2s 足够)
- **给用户看 + 说明**:这是哪几个场景、用的什么主题(themeRef)、布局是否符合预期。用户认可后进入全片;不认可则调主题/布局后重出 demo
- **克制**:demo 是确认"主题/布局/配色"用的,不是全片预演——只做关键场景,不做全片所有 cue 的动效

### 第 3 步:实现自检(轻量)
忠实导演概念?出场方式/镜头/表格/3D 按 brief 落地?运动内容驱动、物体入场后无无目的晃动(除非服务表达:错误 shake/情绪强调)?无 >3s 静态?配色从 theme?硬偏移阴影规格正确?
**轻量自检即可,重校验交给第 6 步的 brief-check。(brief-check 会逐项核出场方式/镜头/表格/3D 是否按 brief 做)**

### 第 4 步:生成全片代码
风格细节见 `references/style-guide.md`。

### 第 5 步:渲染自检
渲染关键帧静帧,检查:
- **布局自检**:提取所有元素 bounding box,程序化检查不重叠 + 在安全区内(80px边距/54px字幕区) + 文字不溢出。不通过则定点修后重验。
- **有效字高**:量渲染帧上的实际像素(fontSize × 祖先 scale × 透视压缩,不看代码 fontSize),字幕 ≥56px、辅助文字 ≥32px;brief 标 `(纹理)` 的字应明显虚化/降亮度(方法见 `references/motion-recipes.md`)
- **确定性渲染**:代码无 `Date.now()`/`Math.random()`,伪随机一律固定种子(mulberry32/哈希,seed 从 index 派生)
- 用色来自 PALETTE/ACCENT
- 阴影全是硬偏移(零模糊)?无渐变?
- 内容驱动运动到位、无 PPT 静态段

### 第 6 步:brief 忠实度校验(调 brief-check skill)
渲染自检通过后,调用 `brief-check` skill 对照 visual-brief 分镜逐 Seg 校验(元素完整性/动作匹配/色码贯穿/时序偏移/素材使用)。有不匹配 → 打回修,重渲染再查;全匹配 → 交付。


## 与 visual-brief-design 衔接
visual-brief 出每拍"呈现什么"(风格无关,含场景/布局/节奏/转场/音画偏移);本 skill 拿 brief -> 落地。**不重新切场景、不选主题配色**(themeRef 是 brief 给的),只决定"用贴纸画法实现它"。brief 若给出精确坐标或具体色值,视为导演越权:坐标重算(安全区+碰撞),颜色取意图、从 theme 落地。

## 文件导航
| 文件 | 何时读 |
| --- | --- |
| `references/theme-catalog.md` | 选主题时(themeRef 解析 + 各主题配色/线条) |
| `references/style-guide.md` | 写代码前(硬边/方角/硬阴影画法 + anti-PPT 运动) |
| `references/templates.md` | 选结构骨架时(参考非菜单) |
| `references/motion-recipes.md` | 实现高级动效/转场时(stagger 加速错峰/定格标注/变速/crash-zoom/侧掠/穿窗/虚焦接力/黑场字卡/甩镜/缩放清晰度/光效纪律/有效字高/确定性渲染的参数与命门) |
| `references/examples.md` | 看 brief->代码 推理链 |

## 主题(themeRef)解析
- **brief 里有 themeRef**(如 `block-frame + sticker`):查 `references/theme-catalog.md`,取该主题的 BG/GRID/INK/PALETTE/ACCENT + lineConfig 绑进渲染。**不写色值在代码里,一律引用主题变量。**
- **brief 没写 themeRef**:默认 `block-frame + sticker`(新粗野,本引擎的招牌),除非用户明确指定。
- **只吃 engines 含 `sticker` 的主题**:如 brief 给的是 doodle 专属主题(playful/retro-zine),提示换用 doodle 引擎 skill,别硬套。
- 改主题色只改 master(`narraforgeskills/skills/theme-catalog/`),再同步本副本;不要在 style-guide 里单改色值。
