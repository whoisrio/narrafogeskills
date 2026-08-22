# 风格语法(Style Guide)

写代码前读完本文件。
所有颜色一律引用 `theme.ts` 的 `C / PATTERN_COLORS`,正文和代码中禁止出现硬编码色值。

## 变量区结构

### 内容变量

- 主题:如「Agent Loop 模式」
- 关键词列表:拆出的 3~8 个概念词(将映射成节点)
- 画幅:默认横屏 1920x1080(FHD),30fps
- 框架:默认 Remotion + TypeScript + Shiki(代码高亮)
- 总时长:单场景 5~7 秒 × 场景数(架构图需要时间看清拓扑 + token 流动)

### 配色变量

- 主背景 `C.bg=#f5efe4`(浅暖米),`C.panel=#ffffff`(白卡)
- 文本 `C.text=#1a1917` / `C.textDim=#4a453e` / `C.textMuted=#8a8478`
- 品牌金 `C.gold=#c47a3a`(强调/工具节点)
- 边线 `C.line=#2a2620` / `C.lineSoft=rgba(26,25,23,0.15)`
- 阴影 `C.shadow=8px 8px 0 rgba(26,25,23,0.85)`(硬偏移,本风格识别符) / `C.shadowSoft`
- 模式色 `PATTERN_COLORS`:chain 深蓝 #2b4d7e / router 青绿 #2d7a6e / orch 紫 #5b3d8a / genEval 橙金 #c47a3a / subgraph 紫罗兰 #7d3d8f / loop 深绿 #2f6d4d

自定义色板规则:同冷色不同色相避免撞色;每个模式/节点类型一种身份色;token 颜色 = 其所属边的颜色。

### 字体变量

- `FONT.display`:衬线(Noto Serif SC),PatternTitle 大标题,weight 700,letter-spacing -2.5--识别符
- `FONT.sans`:Inter Tight,节点标签 weight 600 / 副标
- `FONT.mono`:JetBrains Mono,kicker(letter-spacing 5,大写)/ 代码 / 序号
- 想要精确字体自行引入 `@remotion/google-fonts`;默认声明 font-name 走系统回退(离线安全)

## 设计基调(Token)

- 背景:`C.bg` 浅暖米底,纯净无网格(区别于涂鸦/手绘的纸面网格)
- 节点:白卡 `#ffffff` + 1px `rgba(0,0,0,0.08)` 边 + 14px radius + 三层软阴影 + 顶部 3px 彩色身份条(节点类型识别);`special` 形状加双描边
- 边:2px SVG path,轻微弯曲(贝塞尔,比直线精致);实线/虚线/回环弧三种;末端 arrow marker
- token:亮色小圆点 r=8,沿边贝塞尔路径滑动,带拖尾(2 个渐淡小点)+ `drop-shadow(0 0 8px color80)` 发光
- 标题:PatternTitle--kicker(mono 大写色字) + 衬线大字 mask reveal(clip-path inset 从右往左揭) + accent bar 从 0 生长到 88px + 副标
- 右下角:可选 `典型场景 · {scenario}` 小字(mono, muted)

## 造型语法(构件族)

1. **节点**:`GraphNode`--shape `rect`(普通)/ `diamond`(决策,旋转45°)/ `special`(特殊,双描边);3px 身份色条;label + 可选 sub(mono 大写)
2. **边**:`GraphEdge`--type `solid`(实线+绘制动画)/ `dashed`(虚线,条件分支)/ `loop`(回环弧,反馈回路);color 决定 arrow marker
3. **token**:`TokenFlow`--沿边从起点滑到终点的发光圆点 + 拖尾;表达数据/请求流向
4. **标题**:`PatternTitle`--kicker + 衬线 mask reveal 大字 + accent bar + 副标;章节/模式揭晓
5. **代码**:`CodePanel`--Shiki 语法高亮 + 按段高亮(current/past/future 三态)+ 自动滚动 + 金色左条焦点
6. **容器**:`GraphScene`--SVG 图层(边+token)+ HTML 图层(节点+标题)双坐标系,共享 1920x1080

造型规则:扁平白卡、硬偏移阴影、3px 色条、弯曲边;不描粗黑边(那是涂鸦风)、不 hachure(那是手绘风)、不暗底(那是暗金风)。
modern-tech 靠**拓扑清晰 + 流向明确**立专业感,不靠装饰。

## 动画语法(动效族)

1. **入场**:spring(damping14/stiff100/mass1)--节点 scale 0.85->1.02->1 + 淡入;PatternTitle 大字 mask reveal
2. **绘制**:edge 用 dashoffset(totalLen -> 0)从起点向终点生长;accent bar spring 生长 0->88px
3. **流动**:token 沿贝塞尔路径 `pointOnPath(t)` 滑动,flowDur 内 0->1,带拖尾(t-0.08/t-0.16)+ 发光
4. **脉冲**:节点 `active` 在 token 到达时(activeAt)0.8s 内 0->1->0,box-shadow 加 4px 色环
5. **高亮**:CodePanel 段高亮 current 行金色左条 + 背景着色,past 行 0.55 透明,future 行 0.18

细节:绘制用 spring 或 cubic;token 发光用 drop-shadow。
禁止匀速线性;禁止节点落定后全静止(token 流动 / active 脉冲维持画面活力)。

## 时序语法(与内容无关的铁律)

- **节点先于边**:节点 appearAt 后 0.2~0.3s 才画连出它的边;边等两端节点就位才绘制
- **边先于 token**:边绘制完(drawDur)后才放 token 流动
- **回流回路最后闭合**:loop 类边延迟到正向链路建完后才画,强调「循环形成」
- **token 串联**:多条 token 按流向顺序 appearAt 串联,前一条到达后再放后一条(间隔 0.5~0.8s)
- **代码段一段一段**:currentSectionIndex 按讲解推进,一次只亮一段(守「一个时刻一个焦点」)
- 单场景 5~7 秒(拓扑 + 流动需要观赏时间)

## 禁止项

- 禁暗底亮背景;本风格是浅暖米底
- 禁软模糊阴影;用硬偏移 `8px 8px 0`(本风格识别符)
- 禁粗黑描边贴纸风(涂鸦)/ hachure 手绘(手绘风);本风格是白卡 + 细边 + 色条
- 禁直线边;用弯曲贝塞尔(直线显廉价)
- 禁匀速线性动画、禁 token 无拖尾无发光(裸圆点显单薄)
- 禁在 theme 文件之外出现任何硬编码颜色值

## 交付要求

- 配色集中为单一 `theme.ts`;每条边 color 需在 GraphScene `arrowColors` 注册对应 marker
- 可复用组件:GraphScene/Node/Edge/TokenFlow/PatternTitle/CodePanel/useShikiTokens
- Shiki 代码高亮必须用 `useShikiTokens`(delayRender 阻塞,结果缓存),不要在每帧重算
- 每个场景渲染关键帧静帧自检:拓扑清晰、边不交叉、token 流向正确、标题揭示到位、浅暖底不刺眼
- 提供 dev 预览、stills、render 三个脚本
