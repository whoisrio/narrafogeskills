# 工作示例(Few-shot):从文案到变量区和场景规划

三个示例覆盖不同的模板组合。
注意其中的推理模式:**先按选择线索定模板,再把文案实体映射成图拓扑(节点/边/流向),最后按模板时序填秒数**。
实体映射规则:概念/组件 -> GraphNode(选 shape);关系/流向 -> GraphEdge(选 type);数据/请求 -> TokenFlow;模式名 -> PatternTitle;代码 -> CodePanel。
modern-tech 铁律:**节点先于边、边先于 token、回流回路最后闭合**,拓扑摆位先在规划里画清坐标草图。

## 示例 1:模式揭晓 + 反馈回路

输入文案:

> 这是第五种模式,Agent Loop,自循环智能体。
> START 进去先到 model 节点,有 tool_calls 就去 tools,没 tool_calls 就到 END;
> tools 执行完把结果喂回 model,循环就形成了。

提取变量区:

- 主题:Agent Loop 模式
- 关键词列表:[START, model, tools, END, tool_calls, stop, result]
- 画幅/框架/配色:默认;模式色 PATTERN_COLORS.loop(深绿 #2f6d4d),tools 用品牌金
- 总时长:1 场景 ≈ 6.5 秒

场景规划:

- 场景 1(模板 1 + 模板 5,模式揭晓 + 反馈回路):
  - 0.0s:PatternTitle(kicker「PATTERN · 05 / 06」+ 大字「Agent Loop」mask reveal + accent bar 深绿 + 副标「自循环智能体」)
  - 节点拓扑坐标草图:START(240,540) - model(760,540,special) - tools(1380,540) - END(760,820)
  - 1.0s:START 节点 -> 1.5s model(special,深绿) -> 2.0s tools(金) -> 2.4s END
  - 边:1.2s START->model(solid) -> 1.8s model->tools(solid,tool_calls) -> 2.3s tools->model(loop 回流弧,result,最后闭合) -> 2.6s model->END(solid,stop)
  - token 跑一圈:3.4s START->model -> 4.1s model->tools -> 4.9s tools->model(loop 回流) -> 5.8s model->END
  - model 在 token 到达时 active 脉冲(3.4s 和 4.9s)
- AI 素材清单:无(全代码绘制)

## 示例 2:架构拓扑 + 数据流

输入文案:

> RAG 系统由四部分组成:用户提问、检索器、知识库、生成模型。
> 请求从用户进来,检索器去知识库查相关文档,再把文档和问题一起喂给生成模型出答案。

提取变量区:

- 主题:RAG 架构与数据流
- 关键词列表:[用户, 检索器, 知识库, 生成模型]
- 配色:模式色 PATTERN_COLORS.chain(深蓝);知识库用 genEval 金
- 总时长:1 场景 ≈ 6 秒

场景规划:

- 场景 1(模板 2 + 模板 3,架构拓扑 + 数据流):
  - 节点拓扑:用户(300,540) - 检索器(760,540) - 知识库(1220,540,special) - 生成模型(1520,540,special)
  - 0.5s 起节点依次入场(错 0.5s),每个 +0.2s 连出边(solid)
  - 3.0s 起 token 串联:用户->检索器 -> 检索器->知识库(查) -> 知识库->检索器(返回文档,反向) -> 检索器->生成模型 -> 生成模型出答案
  - 知识库 token 到达时 active 脉冲;反向流(知识库->检索器)用不同色区分「查询」vs「返回」
- AI 素材清单:无

## 示例 3:代码深读(模板 6)

输入文案:

> 看 agent_loop 这个函数。先看签名,接收 state。
> 中间是循环体:只要有 tool_calls,就执行工具,把结果塞回 messages。
> 最后一行 return state,循环结束才返回。

提取变量区:

- 主题:agent_loop 函数逐段拆解
- 关键词列表:[签名, 循环体, return]
- 配色:模式色 PATTERN_COLORS.chain(深蓝)
- 总时长:1 场景 ≈ 6 秒

场景规划:

- 场景 1(模板 6,代码深读):
  - 0.0s:PatternTitle(kicker「源码 · agent_loop」+ 大字「Code Walk」+ 副标「逐段拆解循环体」)
  - 0.0s:CodePanel 面板淡入,Shiki 高亮就位(用 useShikiTokens,delayRender 阻塞)
  - 代码分三段:段0(签名,startLine0-0)、段1(循环体,startLine1-3)、段2(return,startLine4-4)
  - 1.5s:currentSectionIndex=0,签名段点亮(金左条 + 全亮)
  - 3.0s:currentSectionIndex=1,循环体段点亮(签名段降为 past 0.55)
  - 5.0s:currentSectionIndex=2,return 段点亮
  - 一次只亮一段(一个时刻一个焦点)
- AI 素材清单:无

注意本示例的判断逻辑:讲代码的段落,代码本身就是主体,设计重心在段高亮的推进节奏;「先看…中间…最后」这种措辞 = 段切换的信号;Shiki 高亮让代码自带语法色,只需控制段三态(current/past/future)的明暗。
