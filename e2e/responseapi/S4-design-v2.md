# S4 设计稿 v2(按修订后 dark-botanical-explainer 的 Step 1 产出)

> 先于代码、可审。每拍: key point(真·观点,非表面词)+ 定制视觉(内容驱动,非挑模板)+ 运动计划 + cue 对齐 + 旁白缺漏建议。
> 旁白源:responseapi SRT 04(96.6s,44 cue)。风格:暗金(模板 B)。

## 设计自检(写代码前过)
- [ ] 每拍 key point 是区别性观点,不是表面词?
- [ ] 视觉从内容定,不是挑模板?
- [ ] 旁白缺漏处视觉补 + 列修订建议?
- [ ] 每拍持续运动(镜头+环境+流+cue 事件),无 >3s 静态?
- [ ] 用招牌效果(光绘/大字衬线数字/光晕绽放/发光描边/签名小图/流光 token)?

---

## 拍 A:开场 + 定位(0-12.7s)

cue:0s「2025年3月 /v1/responses来了」/ 2.8s「一个请求承载agent loop」/ 6.84s「用户发话、模型推理、要工具就调、拿到结果继续、返回最终回复」

- **key point**:Responses 是三代 API 演进的最新一代(建立 context);它的真·关键能力是**不用手拼 message 列表**(Chat Completions 要 messages.append 来回拼)。
- **旁白缺漏**:「一个请求承载 agent loop」只描述了通用 loop,**没说出"不用拼 message"这个真区别**。视觉补上。修订建议:旁白这句后补"不用再手动拼装 messages"。
- **定制视觉**(内容驱动,2 子拍):
  - A1(0-4.77s)**光绘时间轴**:金轴由移动光点从左绘到右(带拖尾光晕),光点到达 2020/2023/2025.3 时里程碑绽放--大字衬线年份 + API path + 签名小图(completions=`prompt->text` / chat-completions=3 角色 chip / responses=loop 图)。responses(2025.3)最后到达,光晕爆光 + 「来了」。
  - A2(4.77-12.7s)**手拼 vs 不用拼 代码对比**:左 CodePanel(cb-03)逐行擦出,高亮两行 `messages.append`(红✗「中转站打工人」);右 CodePanel(cb-09)高亮 `previous_response_id`(绿✓「一个请求·不用拼」)。右侧干净 token 流入对比左侧沉重。
- **运动计划**:光点持续绘轴(持续运动);里程碑绽放是 cue 事件;光点到 responses 时镜头已缓推向它;代码逐行擦出 + 焦点行金高亮脉动 + warn 闪;右 token repeat 环流;环境光球漂;里程碑光晕呼吸。多层叠加。
- **cue 对齐**:0s 轴起绘+2020;2.8s 光点到 responses 绽放;4.77s 切代码对比;6.84s 右面板起;7.6s 左 messages.append 高亮;9.6s 右 previous_response_id 高亮。

## 拍 B:内置工具 vs 自定义(12.7-28.2s)

cue:12.68s「对内置工具」/ 13.71s「web_search、file_search、code_interpreter」/ 19.8s「服务端自动跑完」/ 21.23s「自定义function call」/ 22.9s「函数执行还是你做」/ 27.07s「消息拼装大幅简化」

- **key point**:内置工具**服务端托管**(你不用对接外部搜索/限流),自定义 function call 才需你执行(但消息拼装也简化了)。对比两种调用负担。
- **定制视觉**:**左右双 loop 对比**。左「内置」:3 工具节点(web_search/file_search/code_interpreter)+ 用户->工具->回复,token **自动连续环流**(服务端自跑,标"自动")。右「自定义」:model->你的函数->回填,token 在「你的函数」节点**停顿一下**(你执行)再回填。底部:chat 手拼杂乱 -> responses input 简化 对比条。
- **运动计划**:两侧 token 环流(左连续/右停顿,节奏差传达负担差);节点呼吸;分屏光带流动(marching);镜头缓推;3 工具节点依次弹入。
- **cue 对齐**:12.68s 分屏;13.71s 3 工具依次;19.8s 左自跑 token;21.23s 右自定义;22.9s 右 token 停「你」;27.07s 简化对比条。
- **旁白缺漏**:无。

## 拍 C:第一处角色变化(28.2-50.2s)

cue:28.18s「两处角色变化」/ 31.8s「应用指令不再用system角色」/ 34.91s「system平台自用」/ 38.46s「instructions顶层参数」/ 43.03s「developer角色消息」/ 47.61s「从system收敛到developer」

- **key point**:应用指令角色从 **system 收敛到 developer**(instructions 顶层参数 或 developer 消息,system 留给平台)。
- **定制视觉**:左 CodePanel(cb-05 responses 请求)逐行擦出,高亮 `instructions` 行(顶层,金)+ 标「优先级高于 input」。右角色图:system 节点(变灰,标「平台用·别占」)-> developer 节点,中间**收敛箭头**绘制(system->developer)。底部「收敛」标注。
- **运动计划**:代码逐行擦出 + instructions 高亮脉;角色节点滑入;收敛箭头绘制后 marching;system 节点渐灰;镜头缓推;环境光球。
- **cue 对齐**:28.6s 代码起;31.8s system 节点;34.91s system 变灰+「平台用」;38.46s instructions 高亮;43.03s developer 节点;47.61s 收敛箭头。
- **旁白缺漏**:无。

## 拍 D:第二处角色变化 + 29 item 类型(50.2-96.6s)

cue:50.24s「第二处·工具结果不再是带role消息」/ 53.41s「tool角色消失」/ 56.32s「function_call item」/ 58.62s「function_call_output」/ 62.97s「call_id关联」/ 68.32s「message角色仍4种」/ 73.31s「user/assistant/system/developer」/ 82.99s「29种item类型」/ 85.43s「file_search_call/web_search_call/...」/ 94.12s「靠type不靠role」/ 96.2s「具体改进了啥?六条」

- **key point**:工具结果从「tool 角色消息」变成 **function_call/function_call_output item(靠 call_id 关联,无 role)**;且 input 不止 message,是 **typed item 数组(约 29 种,靠 type 区分不靠 role)**。
- **定制视觉**(2 子拍):
  - D1(50.2-67.6s)**角色消失图**:tool 角色节点 -> ✗ 划掉 -> function_call item 节点 + function_call_output item 节点,中间 **call_id 连线**。标「这一环压根没 role」。
  - D2(67.6-96.6s)**补充 + item 网格**:message 角色仍 4 种(4 角色徽章,system 标「合法·别占」)-> 视野扩展「不止 message」-> **「29」CounterUp + item 类型彩色 chip 网格**(消息类金/调用类粉/推理类青/内置类绿,节奏揭示)-> 收尾「靠 type」高亮、「不靠 role」划掉 -> 「六条改进」hook。
- **运动计划**:tool ✗ 划掉动效;item 节点滑入;call_id 连线绘制+marching;4 角色徽章弹入;chip 缩放弹入(每 cue 一批)+ 常驻微浮;CounterUp 翻牌;type/role 对比动效;镜头缓推;环境光球;结尾「六条」punch。
- **cue 对齐**:53.41s tool✗;56.32s function_call;58.62s output;62.97s call_id 连线;73.31s 4 角色徽章;82.99s「29」+网格;85.43s 4 chip;94.12s type高亮role划掉;96.2s「六条」hook。
- **旁白缺漏**:无。

---

## 整片运动兜底(anti-PPT)
- 全程环境光球漂(AmbientOrbs,4 大球大幅漂移)
- 每拍镜头缓推(1.0->1.12)+ 双轴漂移(±28/±18)
- 所有节点呼吸(±5%)+ 浮动(±6px)
- 所有连线 marching 流动
- token 环流 repeat 常驻
- 每 cue 一个可见变化,phase 交叉淡入不硬切
- 自检:无 >3s 静态段(用运动能量指标验证)

## 旁白修订建议(反馈上游)
- 拍 A:「一个请求承载 agent loop」没说出关键能力,建议补"不用再手动拼装 messages"。
