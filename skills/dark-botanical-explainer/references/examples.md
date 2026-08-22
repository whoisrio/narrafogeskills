# 工作示例(Few-shot):内容驱动设计推理

示例展示「内容 -> key point -> 定制视觉 -> 运动计划」的推理,不是"cue -> 模板 -> 构件"的机械映射。
**模板只是参考,视觉从内容定。** 旁白有缺漏时视觉补 + 列修订建议。

## 示例 1:开场提年份 + 文档讲三代演化 -> 光绘时间轴

旁白片段(SRT):
```
00:00.0  2025 年 3 月,/v1/responses 来了。
00:02.8  它的定位是:一个请求,承载一个完整的 agent loop。
```
上下文:整篇文档讲三代 API 演化(completions 2020 / chat-completions 2023 / responses 2025.3)。

设计稿:
- **key point**:responses 不是凭空出现,是 API 随模型能力演进的第三代。开场要建立这个演化 context。
- **定制视觉**(从内容定,非模板):**光绘时间轴**。一条金色轴由移动光点从左往右绘制(带拖尾光晕),光点到达每个年份时里程碑绽放:大字衬线年份(CounterUp)+ API path + 签名小图(completions=prompt->text / chat-completions=3 角色 chip / responses=loop 图)。responses(2025.3)最后到达,光晕爆光 + 「来了」高亮。
- **运动计划**:光点持续移动画轴(持续运动);里程碑绽放是 cue 事件;光点到达 responses 时镜头已缓推向它;里程碑光晕呼吸常驻。多层:镜头推 + 光点移 + 光晕脉 + 年份翻牌。
- **cue 对齐**:0s 轴开始绘 + 2020 里程碑;2.8s 光点到 responses,绽放。
- 旁白修订建议:无(开场钩子 OK)。

## 示例 2:「一个请求 agent loop」-> key point 是"不用拼 message" -> 代码对比

旁白片段(SRT):
```
00:04.8  用户发话、模型推理、要工具就调、拿到结果继续、返回最终回复。
```
原文代码块:cb-03(Chat Completions 手拼 messages)+ cb-09(Responses 不用拼)。

设计稿:
- **key point**:旁白只描述了通用 agent loop,没说出 Responses 的真·区别--**不用手拼 message 列表**(Chat Completions 要 messages.append 来回拼,Responses 靠 previous_response_id 引用上轮)。视觉必须传达这个真 key point。
- **定制视觉**(从内容定):**手拼 vs 不用拼 代码对比**。左 CodePanel cb-03,高亮两行 `messages.append`(红✗「中转站打工人」);右 CodePanel cb-09,高亮 `previous_response_id`(绿✓「一个请求·不用拼」)。两面板逐行擦出,焦点行金高亮常亮。右侧一个干净 token 流入(对比左侧手动拼的沉重)。
- **运动计划**:代码逐行擦出(cue 事件);焦点行金高亮 + warn 闪;右 token repeat 环流(持续运动);镜头缓推。多层:镜头 + 行擦出 + 高亮脉 + token 流。
- **cue 对齐**:4.8s 左面板起;6.8s 右面板起;7.6s 左 messages.append 高亮;9.6s 右 previous_response_id 高亮。
- **旁白修订建议**:「一个请求承载 agent loop」没说出关键能力(不用拼 message),建议旁白补一句"不用再手动拼装 messages"。

## 示例 3:「内置工具服务端自动跑」-> key point 是"你不用管外部搜索" -> 自跑 loop

旁白片段(SRT):
```
00:13.7  比如 web_search、file_search、code_interpreter,服务端自动跑完。
00:21.2  对自定义 function call,函数执行还是你做。
```

设计稿:
- **key point**:内置工具服务端托管(你不用对接外部搜索/限流),自定义才需你执行。对比两种调用负担。
- **定制视觉**:**左右双 loop 对比**。左「内置」:3 个工具节点(web_search/file_search/code_interpreter)+ 用户->工具->回复,token 自动环流(服务端自跑,标注"自动")。右「自定义」:model->你的函数->回填,token 在"你的函数"节点停顿(你执行),再回填。
- **运动计划**:两侧 token 都环流(左自动连续、右在"你"停顿一下再走,节奏差异传达负担差);节点呼吸;镜头缓推;分屏线光带流动。
- **cue 对齐**:13.7s 3 工具节点依次;19.8s 左自跑 token;21.2s 右自定义;22.9s 右 token 停"你"。
- 旁白修订建议:无。

## 示例 4:「29 种 item 类型,靠 type 不靠 role」-> key point 是 input 是 typed 数组 -> 类型网格

旁白片段(SRT):
```
00:82.9  官方列了约 29 种 item 类型。
00:85.4  比如 file_search_call、web_search_call、code_interpreter_call、reasoning。
00:94.1  它们靠 type 区分,不靠 role。
```

设计稿:
- **key point**:input 不止 message,是 typed item 数组,靠 type 字段区分不靠 role。
- **定制视觉**:**item 类型彩色 chip 网格**。按类别分色(消息类金/调用类粉/推理类青/内置类绿),chip 节奏揭示(每个 cue 出一批)。收尾「靠 type」高亮、「不靠 role」划掉(role 打叉)。
- **运动计划**:chip 缩放弹入(cue 事件);chip 常驻微浮;镜头缓推;「type vs role」对比动效。
- **cue 对齐**:82.9s「29」CounterUp + 网格起;85.4s 4 个 chip;94.1s type 高亮 role 划掉。
- 旁白修订建议:无。

## 通用:每拍都先问三句

1. 这段旁白真要说的是什么(key point)?旁白说全了吗?
2. 什么定制视觉最能传达它(从内容定,不挑模板)?
3. 这拍怎么持续动(镜头+环境+流+cue 事件,多层叠加)?
答完再写设计稿,设计稿过自检再写代码。
