# 源代码块(从原文提取,impl skill 的 CodePanel 直接引用)


## cb-01 (json)

```json
{
  "model": "gpt-5.5",
  "messages": [
    {"role": "system", "content": "你是一个天气助手"},
    {"role": "user", "content": "北京今天天气怎么样？"}
  ],
  "tools": [{
    "type": "function",
    "function": {
      "name": "get_weather",
      "description": "查询指定城市的天气",
      "parameters": {
        "type": "object",
        "properties": {"city": {"type": "string"}},
        "required": ["city"]
      }
    }
  }],
  "tool_choice": "auto"
}
```


## cb-02 (json)

```json
{
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": null,
      "tool_calls": [{
        "id": "call_abc123",
        "type": "function",
        "function": {
          "name": "get_weather",
          "arguments": "{\"city\": \"北京\"}"
        }
      }]
    },
    "finish_reason": "tool_calls"
  }],
  "usage": {"prompt_tokens": 150, "completion_tokens": 30, "total_tokens": 180}
}
```


## cb-03 (python)

```python
# 第一轮
resp = client.chat.completions.create(model="gpt-5.5", messages=messages, tools=tools)
msg = resp.choices[0].message

# 手动解析 JSON string
fn_args = json.loads(msg.tool_calls[0].function.arguments)

# 执行工具，拿到结果
tool_result = call_weather_api(fn_args["city"])

# 手动拼回 messages
messages.append(msg.model_dump())
messages.append({"role": "tool", "tool_call_id": msg.tool_calls[0].id, "content": tool_result})

# 第二轮
resp2 = client.chat.completions.create(model="gpt-5.5", messages=messages)
print(resp2.choices[0].message.content)
```


## cb-04 (text)

```text
data: {"choices":[{"delta":{"content":"今天"},"index":0}]}
data: {"choices":[{"delta":{"content":"天气"},"index":0}]}
data: {"choices":[{"delta":{"tool_calls":[{"function":{"arguments":"{\"ci"}}]}},"index":0}]}
```


## cb-05 (json)

```json
POST /v1/responses
{
  "model": "gpt-5.5",
  "input": "北京今天天气怎么样？",
  "instructions": "你是一个天气助手，用户问天气时先调工具查数据再回复。",
  "tools": [{
    "type": "function",
    "name": "get_weather",
    "description": "查询指定城市的实时天气",
    "parameters": {
      "type": "object",
      "properties": {
        "city": {"type": "string", "description": "城市名称"}
      },
      "required": ["city"]
    }
  }],
  "tool_choice": "auto",
  "temperature": 0.7
}
```


## cb-06 (json)

```json
{
  "id": "resp_abc123def456",
  "object": "response",
  "created_at": 1722758400,
  "status": "completed",
  "model": "gpt-5.5-2026-06-15",
  "output": [
    {
      "id": "fc_abc123",
      "type": "function_call",
      "call_id": "call_xyz789",
      "name": "get_weather",
      "arguments": "{\"city\": \"北京\"}",
      "status": "completed"
    }
  ],
  "usage": {
    "input_tokens": 120,
    "output_tokens": 25,
    "total_tokens": 145
  }
}
```


## cb-07 (json)

```json
POST /v1/responses
{
  "model": "gpt-5.5",
  "input": [{
    "type": "function_call_output",
    "call_id": "call_xyz789",
    "output": "{\"temperature\": 25, \"condition\": \"晴\", \"humidity\": 45}"
  }],
  "previous_response_id": "resp_abc123def456"
}
```


## cb-08 (json)

```json
{
  "id": "resp_def456ghi789",
  "object": "response",
  "status": "completed",
  "model": "gpt-5.5-2026-06-15",
  "output": [
    {
      "id": "msg_abc123",
      "type": "message",
      "role": "assistant",
      "status": "completed",
      "content": [{
        "type": "output_text",
        "text": "北京今天晴，气温 25°C，湿度 45%，适合户外活动。",
        "annotations": []
      }]
    }
  ],
  "usage": {
    "input_tokens": 60,
    "output_tokens": 30,
    "total_tokens": 90
  }
}
```


## cb-09 (python)

```python
import json

response = client.responses.create(
    model="gpt-5.5",
    input="北京天气怎么样？",
    instructions="你是一个天气助手",
    tools=[{"type": "function", "name": "get_weather", ...}]
)

# output 直接拿到 tool call
tool_call = response.output[0]          # type: function_call
args = json.loads(tool_call.arguments)  # arguments 仍是 JSON string
city = args["city"]

# 传入结果，引用上轮
response2 = client.responses.create(
    model="gpt-5.5",
    input=[{
        "type": "function_call_output",
        "call_id": tool_call.call_id,
        "output": json.dumps({"temp": 25, "condition": "晴"})
    }],
    previous_response_id=response.id
)

print(response2.output_text)            # 不再写 choices[0].message.content
```


## cb-10 (python)

```python
# 1) 最小用法：声明工具类型，OpenAI 服务端自动执行搜索
response = client.responses.create(
    model="gpt-5.5",
    input="最近有什么关于 AI Agent 的新闻？",
    tools=[{"type": "web_search"}],
)
print(response.output_text)            # 已带联网检索结果

# 2) 带选项的用法
response = client.responses.create(
    model="gpt-5.5",
    input="伦敦今天有什么活动？",
    tools=[{
        "type": "web_search",
        "search_context_size": "medium",          # low / medium / high
        "user_location": {                          # 按地理位置优化结果
            "type": "approximate",
            "country": "GB",
            "city": "London",
            "region": "London",
        },
    }],
)

# 3) 输出里多了一个 web_search_call 项，最终消息带引用标注
for item in response.output:
    if item.type == "web_search_call":
        print("搜索动作：", item.action)          # 如 {"type": "search", "query": "..."}
    if item.type == "message":
        text = item.content[0].text
        cites = item.content[0].annotations        # 类型为 url_citation，含 url/title
        print(text, cites)
```


## cb-11 (json)

```json
{
  "output": [
    {"type": "reasoning", "summary": [...]},
    {"type": "function_call", "call_id": "...", "name": "get_weather", "arguments": "{\"city\": \"北京\"}"},
    {"type": "message", "content": [{"type": "output_text", "text": "北京今天..."}]}
  ]
}
```


## cb-12 (python)

```python
resp1 = client.responses.create(
    model="gpt-5",
    input="这段代码的 bug 在哪里？[长代码...]",
    reasoning={"effort": "high"}
)

# 第二轮：模型还记得上轮的分析过程
resp2 = client.responses.create(
    model="gpt-5",
    input="好，帮我修复",
    previous_response_id=resp1.id
)
```


## cb-13 (text)

```text
event: response.output_text.delta              → 文本增量
event: response.function_call_arguments.delta  → 工具调用参数增量
event: response.reasoning_summary_part.added   → 推理摘要
```


## cb-14 (json)

```json
POST /v1/messages
{
  "model": "claude-sonnet-4-20250514",
  "system": "你是一个天气助手",
  "messages": [
    {"role": "user", "content": "北京天气怎么样？"}
  ],
  "max_tokens": 1024
}
```


## cb-15 (json)

```json
{
  "id": "msg_xxx",
  "type": "message",
  "role": "assistant",
  "content": [
    {"type": "text", "text": "北京今天晴，25°C"}
  ],
  "stop_reason": "end_turn",
  "usage": {"input_tokens": 50, "output_tokens": 20}
}
```


## cb-16 (json)

```json
POST /v1beta/models/gemini-2.5-flash:generateContent
{
  "systemInstruction": {
    "parts": [{"text": "你是一个天气助手"}]
  },
  "contents": [{
    "role": "user",
    "parts": [{"text": "北京天气怎么样？"}]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 1024
  }
}
```
