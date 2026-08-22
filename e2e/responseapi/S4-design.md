# S4「Responses API 定位」场景设计(dark-botanical-explainer 第 1 步产出)

> 输入:S4 的 SRT cue(00:00-00:28.2,定位 + agent loop + 内置工具 vs 自定义)。
> 取 S4 的前 28s(定位这一拍),完整 S4 的角色变化部分(28s 后)留给后续。
> 风格:模板 B 暗底暖金,实现 skill dark-botanical-explainer。

## SRT cue(输入)

```
00:00.0-01.3   2025 年 3 月,/v1/responses 来了。
00:01.3-02.8   它的定位是:一个请求,
00:02.8-04.8   承载一个完整的 agent loop。
00:04.8-12.7   用户发话、模型推理、要工具就调、拿到结果继续、返回最终回复。
00:12.7-13.7   对内置工具,
00:13.7-18.9   比如web_search、file_search、code_interpreter,这个循环服务端自动跑完。
00:18.9-21.2   对自定义 function call,函数执行还是你做。
00:21.2-28.2   但消息拼装、上下文传递被大幅简化。
```

## 场景提取(3 个场景,由旁白节拍决定)

### 场景 1(cue 00:00-04.8,模板 1 数据冲击/标题揭幕)

旁白:「2025年3月,/v1/responses来了。定位:一个请求,承载一个完整的 agent loop。」
- 元素(从词句提取):
  - 「Responses API」-> Tag eyebrow(delay 0)
  - 「一个请求 = 一个 agent loop」-> BigText punch(delay 8,衬线金)
  - 「2025.3」-> CounterUp 年份(delay 4,小号金)或 SubText
  - GoldLine 分隔(delay 14)
- 时序(对齐 cue):0s Tag,1.3s「一个请求」开始,2.8s BigText「一个 agent loop」punch(对齐「承载一个完整的 agent loop」),4.8s 转场
- 模板:暗金模板 1(数据冲击/标题揭幕)变体--用 BigText 替代 CounterUp 作主角

### 场景 2(cue 00:04.8-12.7,模板 2 流程管道·agent loop)

旁白:「用户发话、模型推理、要工具就调、拿到结果继续、返回最终回复。」
- 元素(从词句提取,全代码绘制):
  - 「用户发话」-> FlowNode(用户,delay 对齐 4.8s)
  - 「模型推理」-> FlowNode(model,special 双描边,delay 对齐 6s)
  - 「要工具就调」-> FlowNode(tools,delay 对齐 8s)
  - 「拿到结果继续」-> FlowArrow loop 回流(tools->model,delay 对齐 10s)--强调「继续」=循环
  - 「返回最终回复」-> FlowNode(回复,delay 对齐 11s)
  - 节点间正向 FlowArrow(用户->模型->工具->回复)
  - Tag「一个请求,服务端跑完」常驻顶角
- 时序(对齐 cue):4.8s 用户,6s 模型,8s 工具,10s 回流弧闭合,11s 回复
- 模板:暗金模板 2(流程管道·环形变体)--agent loop 闭环
- 关键:节点先于边、回流弧最后闭合(时序铁律)

### 场景 3(cue 00:12.7-28.2,模板 4 痛点对比)

旁白:「内置工具(web_search等)服务端自动跑完;自定义function call函数执行还是你做,但消息拼装上下文传递被大幅简化。」
- 元素(从词句提取):
  - GoldLine 竖分屏(delay 12.7s)
  - 左:FeatureCard「内置工具」(web_search/file_search/code_interpreter,服务端自动跑,微光,胜方)(delay 13.7s)
  - 右:FeatureCard「自定义 function call」(你执行函数,但消息拼装简化)(delay 18.9s)
  - 右侧 SubText「消息拼装/上下文传递 大幅简化」(delay 21.2s)
  - 底部 BigText 结论「一个请求,跑完整个 loop」punch(delay 26s)
- 时序(对齐 cue):12.7s 分屏,13.7s 左卡,18.9s 右卡,21.2s 右侧简化说明,26s 结论
- 模板:暗金模板 4(痛点对比)变体--非痛点,是两种调用方式对比

## 转场

场景间用 GoldLine 生长 + 淡入(暗金风不用横向滑动,用 opacity 交叉 + 常驻 BotanicalBg 光圈连续感)。

## 字幕

Karaoke 逐字金贴底,逐句对齐 cue。本拍字幕就用 SRT 原文(中文)。

## 总时长

约 30s(3 场景,4.8 + 7.9 + 15.5s,场景间转场重叠)。30fps -> ~900 帧。
