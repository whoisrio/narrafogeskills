# S1 开场动画设计（visual-brief-design 信息可视化导演产出）

## 第 0 步：查 public/ 素材
- `public/deepseekv4announce.png`：DeepSeek V4 发布公告截图（含"支持 Responses API"官宣）
- `public/ds-response-api-unsupport-funcs.png`：不支持的功能列表（= 阉割版证据）
- `public/logo/`：openai.png / deepseek-color.png / moonshot.png / qwen-ai-logo.png（厂商 logo，用于"抢适配"段）

## 第 1 步：识别旁白结构
**复盘+辟谣**：发布事实 -> 附加动作(阉割) -> 抛疑问 -> 泼冷水破除误解 -> 收束底层判断
节奏：前段陈述(中速) -> 中段悬念(断点) -> 后段否定(爆发) -> 收束(定格)

## 第 2 步：定视觉系统（风格无关）
- **信息元件**：screenshot_block（截图框）、version_tag（版本标签）、api_block（API 矩形块）、logo_block（厂商 logo）、myth_stamp（红 ❌ 印章）、items_tree（树状分叉）、funnel（漏斗）、arrow_flow（虚线箭头）
- **镜头语法**：zoom_to（聚焦新概念）、split（对比）、stamp+shake（辟谣）、hold（断点）、converge（收束）。禁情绪推拉摇移。

---

## 分镜脚本（9 段，逐句对齐 cue）

### Seg 1 [00:00-00:01.3]
- 旁白：2026 年 7 月，
- 实体：时间(2026.7)
- 动作：出现 -> date.pop
- 镜头：static
- 分镜：画面中央偏上，一个日期标签"2026.7"弹出（scale 0->1 spring）。背景干净，无其他元素。
- 素材：无

### Seg 2 [00:01.3-00:03.9]
- 旁白：DeepSeek-V4-flash 正式版发布。
- 实体：V4-flash(版本) / 正式版(状态) / 发布公告(截图)
- 动作：发布 = 出示证据 -> screenshot.slide_in + annotation.draw
- 镜头：zoom_to(screenshot) 轻微
- 分镜：日期标签移到左上角变小。屏幕中央偏左，截图 `deepseekv4announce.png` 从右滑入停住（带圆角边框，像贴上去的截图）。截图上一条引线从"正式版发布"字样指出，线尾弹出一个 version_tag 标签写"正式版发布"。截图右下角型号名"DeepSeek-V4-Flash"打字机逐字出现。
- 素材：`public/deepseekv4announce.png`

### Seg 3 [00:03.9-00:08.0]
- 旁白：DeepSeek 顺手官宣：为了满足大家对 Codex 的需求，开始支持 Responses API。
- 实体：Responses API(新模块) / Codex(需求来源) / DeepSeek(厂商)
- 动作：支持 = 新增 -> api_block.pop + arrow_flow 连线
- 镜头：static（信息已在屏，不移动）
- 分镜：同一截图上，第二条引线指向"支持 Responses API"那句，线尾弹出 api_block 矩形块写"Responses API"。截图右下角弹出一个小的 Codex logo（`logo/codex-color.png`），一条虚线箭头从 Codex 指向 Responses API 块（=为满足 Codex 需求）。三个元素（截图 + Responses API 块 + Codex logo + 箭头）同屏。
- 素材：`public/deepseekv4announce.png`、`public/logo/codex-color.png`

### Seg 4 [00:08.0-00:12.5]
- 旁白：虽然是阉割版的 Responses，但聊胜于无。
- 实体：Responses API(块) / 阉割(降级状态) / 不支持功能(证据)
- 动作：阉割 = 降级 -> grey_overlay.fade + screenshot.slide_in（证据）+ checkmark.bounce
- 镜头：split（左：发布公告 / 右：不支持功能列表）
- 分镜：8.0s 截图1（发布公告）缩小左移让出右侧。8.5s 截图2 `ds-response-api-unsupport-funcs.png` 从右滑入停在右侧。10.3s 在 Responses API 块上盖一层半透明灰罩（opacity 0.55），右上角角标写"阉割版 / partial"。同时截图2 上引线标"不支持的功能"。12.5s 底部弹出一个绿色小 ✓ 写"聊胜于无"。两截图并置 = 官宣支持 vs 实际阉割。
- 素材：`public/deepseekv4announce.png`、`public/ds-response-api-unsupport-funcs.png`

### Seg 5 [00:12.5-00:16.8]
- 旁白：那么问题就来了--Responses API 到底做了哪些改进，
- 实体：问题(悬念) / Responses API(待解对象)
- 动作：抛疑问 = 断点 -> all_dim(0.3) + ?.pulse
- 镜头：hold（节奏断点，强制观众注意力集中）
- 分镜：所有现有元素（截图、块、标签）fade 到 opacity 0.3（变暗，不再抢注意力）。画面正中弹出一个超大"?"，pulse 两次（scale 1->1.15->1 循环）。底部小字"Responses API 到底做了哪些改进？"淡入。
- 素材：无

### Seg 6 [00:16.8-00:21.7]
- 旁白：为什么大家都在抢着适配它？
- 实体：各家厂商(OpenAI/DeepSeek/通义/Moonshot) / 抢适配(涌入)
- 动作：抢适配 = 涌入 -> logo.queue_in（多厂商 logo 排队弹入）
- 镜头：static
- 分镜："?"保持居中但缩小到上方。下方从左到右依次弹出 4 个厂商 logo 块（`logo/openai.png`、`logo/deepseek-color.png`、`logo/qwen-ai-logo.png`、`logo/moonshot.png`），每个间隔 0.8s，每个弹入时下方标"✓ 适配"。4 个 logo 排成一排，都指向中央的"Responses API"块。底部字幕"为什么大家都在抢着适配？"。
- 素材：`public/logo/openai.png`、`public/logo/deepseek-color.png`、`public/logo/qwen-ai-logo.png`、`public/logo/moonshot.png`

### Seg 7 [00:21.7-00:29.5]
- 旁白：不过先泼盆冷水：很多人一看各家开始兼容，就觉得"这是升级版 Chat Completions，以后全用它就完了"。
- 实体：误解("Responses API = 升级版 Chat Completions") / 冷水(否定预告)
- 动作：误解出现 -> equation.pop（伪等式出现）
- 镜头：static
- 分镜：21.7s logo 和"?"都 fade 出。22.0s 屏幕中央出现一个伪等式（白字）："Responses API = 升级版 Chat Completions"，等号两边各一个块。25.3s 等式下方弹出小字"以后全用它就完了"。28.0s 画面上方弹出一个橙色标签"泼冷水"（预告否定即将到来）。伪等式保持，等待被否定。
- 素材：无

### Seg 8 [00:29.5-00:34.1]
- 旁白：错！大错特错！它真有那么神吗？咱们扒完再下结论。
- 实体：误解(否定) / Chat Completions vs Responses(对比证据)
- 动作：错 = 否定 -> stamp.hit + shake + 证据对比(split) ；扒 = 揭示 -> zoom_to items_tree
- 镜头：stamp + shake（2px 0.2s）-> split（证据对比）-> zoom_to（揭示内部）
- 分镜：
  - 29.5s 一个红色 ❌ 印章从大缩到正常砸在伪等式的"="号上，画面 shake 2px 0.2s。"错！大错特错！"红字 punch 弹出在上方。
  - 30.5s 伪等式消失。屏幕 split 左右：左侧 api_block"Chat Completions"下列三行属性（无状态 / messages[] 手拼 / 推理丢弃）；右侧 api_block"Responses"下列三行（有状态 / items[] 不用拼 / 推理保留）。中间一个大"≠"连接。每行属性逐行弹出（stagger 0.4s），让观众看清差异。
  - 33.0s zoom_to 右侧 Responses 块，块外壳半透明(opacity 0.25)，露出内部 items_tree 树状分叉（message / function_call / reasoning 三枝），= "扒完"内部结构。
- 素材：无（代码绘制对比块 + items 树）

### Seg 9 [00:34.1-00:40.0]
- 旁白：它们背后其实只指向一件事：模型能干什么，API 就得长成什么样。
- 实体：模型能力(Agent/工具调用/多模态) / API 形态(输出) / 因果(指向)
- 动作：指向 = 因果收束 -> funnel.converge + text.settle
- 镜头：pull_out 到全貌，定格
- 分镜：左右对比和 items 树都 fade 出。左侧出现三个 flow_node 节点纵向排列（"Agent 能力" / "工具调用" / "多模态推理"），各伸出一根线。三根线在画面中央汇入一个漏斗形（上宽下窄的梯形），漏斗右侧吐出一个 api_block 写"API 形态"。38.0s 漏斗上方落版大字"模型能力 → API 形态"（逐字弹出，最后一字 ACCENT 色）。画面定格 2s 收束。
- 素材：无（代码绘制节点 + 漏斗 + 线）

---

## 自检
- [x] 识别结构（复盘+辟谣）？节奏跟着结构走（陈述->断点->爆发->收束）？
- [x] 定了视觉系统（screenshot_block/version_tag/api_block/logo_block/myth_stamp/items_tree/funnel + zoom/split/stamp/hold/converge）？风格无关？
- [x] 查了 public/？用了截图(2张) + logo(4个)？
- [x] 每句一个 segment（9 段/40s）？每段写了隐藏动词->视觉动作（发布->slide_in/支持->pop/阉割->overlay/疑问->dim+?/抢适配->queue/误解->equation/错->stamp+证据/扒->zoom_to+tree/指向->funnel）？
- [x] 每段分镜可画面化（元素/位置/形状/运动具体）？非口号？
- [x] 否定段带证据对比（Chat Completions ≠ Responses 三行差异 + items 树揭示）？
- [x] 背景无装饰晃动？信息持续轰炸（每 1-2s 有新元素/变化）？
- [x] 镜头服务于认知（zoom/split/stamp/hold/converge），非情绪？
- [x] 风格无关？素材标来源？动效对齐 cue？
