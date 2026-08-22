# 视觉分镜蓝图 · 从 Completions 到 Responses(e2e 验证)

> 基于 `responseapi/public/audio/` 8 段旁白 SRT + 原文 `从Completions到Responses-LLM-API演化与多Provider适配.md` 的 16 个代码样例,跑 visual-brief-design 产出。
> 实现 skill:`dark-botanical-explainer`(模板 B)。本 brief 的 Step 3(动画方案)跳过--细分设计交给 impl skill 走「SRT -> 场景提取 -> 代码」。

## 1. 风格(锁定:B 暗底暖金 Dark Botanical)

**选定理由**:
- 内容是 API/代码密集型(JSON/Python 代码样例多、对比多、痛点/改进条目多),暗金风的 CodePanel(逐行擦除+金高亮)、Charts、Table、CounterUp 正好覆盖。
- responseapi 本就是 dark-botanical 组件(CodePanel/Karaoke/Backdrop)的提取来源,风格血缘对得上。
- 暗金的「沉稳·数据感·有温度的科技」情绪坐标,匹配这篇「扒完再下结论、泼冷水」的克制技术叙事。

**风格板**:见 `skills/visual-brief-design/references/style-context-templates.md` 模板 B + `skills/dark-botanical-explainer/references/style-guide.md`。
**风格 demo**:仓库 `src/demo/dark-botanical/` 已有 14 个 demo Composition(DarkBotanical 总览 / Charts / CodeCaption / FlowNode / Matrix / Table / ...),直接当风格 demo 看。
**实现 skill**:`dark-botanical-explainer`--每个 subject 的旁白 SRT 走它的「SRT -> 场景提取 -> 代码」流程。

## 2. 旁白主体识别(subjects,8 个)

按 SRT 段切,每段一个主体。`key:true` 的是全片叙事转折/核心概念(共 4 个),impl skill 应重点设计。

| id | SRT 段(时长) | 主体对象 | 叙事意图 | 建议视觉类型 | key | 源代码块 |
| --- | --- | --- | --- | --- | --- | --- |
| S1 钩子 | 01(40s) | Responses API 是什么、为什么抢着适配 | 抛悬念:它真有那么神吗?扒完再下结论 | 标题钩子(BigText+Tag) | false | - |
| S2 三代API | 02(81s) | 三代 API 演化(completions 2020 -> chat/completions 2023 -> responses 2025) | 模型能力推动 API 形态演进 | 时间线(GoldLine+节点+CounterUp 年份) | **true** | cb-01 cb-02 |
| S3 五痛点 | 03(112s) | Chat Completions 五个痛点(手拼loop/嵌套深/streaming猜/reasoning丢/system混) | 痛点铺陈,为后面改进对应做锚 | 要点拆解(FeatureCard×5)+代码+RedCircle | **true** | cb-03 cb-04 |
| S4 Responses定位 | 04(99s) | Responses API 定位(一个请求跑完 agent loop)+ 两处角色变化(system->developer, tool角色消失->function_call item) | 讲清 Responses 的核心定位与角色模型变化 | 流程图(FlowNode agent loop)+角色对比 | **true** | cb-05 cb-06 cb-07 cb-08 |
| S5 六个改进 | 05(154s) | 六个改进(一一对应痛点)+ 服务端内置工具新能力 | 核心:每条改进如何治痛点,配代码对比 | 拆解(FeatureCard×6)+代码对比(CodePanel) | **true** | cb-09 cb-10 cb-11 cb-12 cb-13 |
| S6 代价局限 | 06(117s) | 七个代价(可移植/数据出域/TTL/streaming重/instructions不继承/生态年轻/计费) | 泼冷水:每条改进都带代价 | 要点拆解(FeatureCard×7)+RedCircle痛点 | false | - |
| S7 其他Provider | 07(82s) | Anthropic + Gemini API 结构差异 | 对比御三家 API 设计分叉 | 对比表(Table 三栏)+代码 | false | cb-14 cb-15 cb-16 |
| S8 收尾 | 08(35s) | 总结金句:Responses 是 Agentic 利器但非银弹 | 定调收束 | 金句(BigText+GlowBg) | false | - |

**典型整片节奏**:S1 钩子 -> S2 三代演进(背景) -> S3 五痛点(铺) -> S4 Responses 定位(转) -> S5 六改进(核心,最长) -> S6 代价(冷) -> S7 其他家(延展) -> S8 金句收。

## 3. 动画方案

**跳过**--模板 B 有专属实现 skill `dark-botanical-explainer`,Step 3 的细分设计交给它。
impl skill 拿到每个 subject 的 SRT cue(带时间戳)+ 上表的「主体/视觉类型/源代码块」-> 走「SRT 场景提取 -> 选叙事模板 -> 代码」。technique 可直接引用 dark-botanical-explainer 的模板编号(如「模板 1 数据冲击」「模板 2 要点拆解」「模板 5 代码逐行」「模板 4 痛点对比」「模板 7 金句收束」)。

## 4. 素材清单

**全 A 类(代码可直接绘制),无 B 类外部素材**。
原文的 mermaid 图、所有代码块、API 对比,全部用 dark-botanical 构件在 Remotion 里还原(CodePanel 渲染代码 / FlowNode+FlowArrow 还原 agent loop / Table 还原对比表 / Charts 还原数据)。不需要 excalidraw 或外部图片。

**可用源代码块(16 个,从原文提取,impl skill 的 CodePanel 直接引用)**:

| source_block | 语言 | 内容 | 归属 subject |
| --- | --- | --- | --- |
| cb-01 | json | chat/completions 请求(messages+tools) | S2 |
| cb-02 | json | chat/completions 返回(choices[0].message.tool_calls) | S2/S3 |
| cb-03 | python | 手动拼 agent loop(解析arguments->执行->拼回messages->二次请求) | S3(痛点一) |
| cb-04 | text | streaming SSE chunk(data事件混 delta) | S3(痛点三) |
| cb-05 | json | responses 请求(input+instructions+tools) | S4 |
| cb-06 | json | responses 返回(output[type=function_call]) | S4 |
| cb-07 | json | function_call_output 回填(previous_response_id) | S4 |
| cb-08 | json | responses 最终回复(output[type=message]) | S4 |
| cb-09 | python | responses 改进一(output[0]拿tool call+previous_response_id) | S5(改进一) |
| cb-10 | python | web_search 内置工具(声明+output_text带结果) | S5(改进二) |
| cb-11 | json | typed output items(reasoning/function_call/message) | S5(改进三) |
| cb-12 | python | reasoning 跨轮(previous_response_id 保留思考) | S5(改进五) |
| cb-13 | text | 语义化 streaming 事件(命名事件) | S5(改进六) |
| cb-14 | json | Anthropic /v1/messages 请求(system顶层+max_tokens必填) | S7 |
| cb-15 | json | Anthropic 返回(content数组+type) | S7 |
| cb-16 | json | Gemini generateContent(contents+systemInstruction+parts) | S7 |

**字幕**:旁白是中文、SRT 也是中文,屏幕做「当前句亮 + 关键词金高亮」(Karaoke 逐字金),不做双语层。字幕贴底,避让主体。

---

## 跑 brief 时发现的 gap(给 visual-brief-design 反馈)

1. **subject 的 SRT 引用方式**:本 brief 用「SRT 段文件名 + 时长」指代 subject 的旁白。impl skill 需要带时间戳的 cue 数组--建议 visual-brief-design 的 subjects schema 加一个 `srt_ref` 字段(指向 SRT 文件 + 该 subject 的 cue 起止秒),让 impl skill 直接拿 cue 数组做场景提取,不用再回查 SRT。
2. **源代码块传递**:本 brief 用 `cb-XX` id 引用原文代码块,但代码块内容在原文 md 里。建议 visual-brief-design 的 source_blocks schema 里直接内联代码内容(或要求 impl skill 从原文提取),避免 impl skill 还要再去翻原文。
3. **key subject 的「视觉类型」够不够**:本 brief 给了「视觉类型」(时间线/拆解/流程图/对比表/金句),但 impl skill 的 components.md 速查表已经能从「旁白措辞 -> 构件」定位。两者衔接 OK,visual-brief-design 的「视觉类型」是粗粒度提示,细粒度交给 impl skill 的 components.md--符合「brief 是参考不是契约」。
