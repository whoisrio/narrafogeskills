# S2 三代 API 动画设计（visual-brief-design v2 认真重跑）

## 第 0 步：查素材

**A. public/**：`logo/openai.png`（GPT-3/3.5 厂商）、`logo/deepseek-color.png`/`logo/qwen-ai-logo.png`/`logo/minimax-color.png`/`logo/bytedance-color.svg`（各家适配）

**B. 原始文档**：`docs/从Completions到Responses-LLM-API演化与多Provider适配.md`

逐段翻原文 §1（completions）和 §2（chat/completions）：

- **§1 completions**：原文只有两段散文，**没有代码块**。写的是"一个prompt进去一个text出来，仅此而已"+"没有system prompt/多轮/角色/function call"。第一代没有代码可引用。
- **§2 chat/completions**：有 **cb-01**（请求 JSON，messages 数组含 system/user/assistant/tool 四角色）和 **cb-02**（返回 JSON，choices[0].message + finish_reason + usage）。
- **cb-03**（手动拼 agent loop 的 Python）：在 §2 的**痛点段落**里，是讲第二代 chat/completions 的痛点（手动 messages.append），**不是第一代的**。上一版把它用在 Seg5（第一代"历史全搬"）是**错的**--第一代根本没有 messages 数组，是整个 prompt 重发。

**色码贯穿**：一代=灰蓝(#7C9FD6)；二代=青绿(#5FB8A5)；缺失/否定=红(ACCENT)；OpenAI=厂商标识。

## 第 1 步：识别旁白结构

**演进叙事**，且有**平行结构**：
- 一代：出现 -> 做什么(简单) -> 缺什么(4项) -> 类比(笔友写信)
- 二代：出现 -> 变了什么(1条) -> 有什么(角色+fc+返回) -> 统治
- 转折：质疑 -> 否定 -> 预告

## 第 2 步：定视觉系统

- 元件：timeline、api_block、version_tag、feature_list(✗)、analogy_sequence(4帧)、code_snippet(cb-01/cb-02)、logo_block、myth_stamp
- 镜头：zoom_to(新API)、side_by_side(一代vs二代)、hold(类比)、stamp(转折)

---

## 分镜脚本

### Seg 1 [00:00-00:03.0]
- 旁白：先说全景。LLM API 这六年，一共三代。
- 动作：全景=演进 -> timeline.draw
- 镜头：static
- 分镜：上部(y=120)水平轴从左(x=200)到右(x=1720)绘制。三个刻度(x=480/960/1440)。标题"LLM API 六年三代"(x=960,y=80)。
- 音画偏移：提前0.3s
- 素材：无

### Seg 2 [00:03.9-00:06.8]
- 旁白：第一代，2020 年，GPT-3，叫 /v1/completions。
- 动作：出现 -> api_block.pop + version_tag.pop
- 镜头：zoom_to(api_block)
- 分镜：第一刻度(x=480)弹 version_tag"2020 · GPT-3"(y=220)。下方弹 api_block(x=480,y=300,w=360,h=120,灰蓝色)写"/v1/completions"。左侧贴 OpenAI logo(x=340,y=300,w=60)。入场：version_tag先->api_block次->logo最后。
- 音画偏移：提前0.3s
- 素材：`public/logo/openai.png`

### Seg 3 [00:08.3-00:12.0]
- 旁白：说白了就是：你扔一段话进去，它吐一段文本出来。仅此而已。
- 动作：扔->吐=流动 -> arrow_flow；仅此而已=强调 -> stamp/pulse
- 镜头：static
- 分镜：api_block下方(y=480)，左侧输入块"一段话"(x=350,w=200,h=60,灰蓝)，箭头指向右侧输出块"一段文本"(x=610,w=200,h=60,灰蓝)。12.0s"仅此而已"时，整个一代表示区轻微缩小+底部弹出小字"仅此而已"(x=480,y=560)，语气是"就这？"的轻蔑。
- 音画偏移：扔吐同步；"仅此而已"滞后0.2s
- 素材：无

### Seg 4 [00:12.9-00:25.6]
- 旁白：没有 system prompt。你想约束模型？把指令写最前面，自己拼。没有多轮对话。没有 function call。连"系统/用户/助手"这三种角色都不分。
- 动作：没有=缺失 -> feature_list with ✗
- 镜头：static
- 分镜：api_block右侧(x=950-1450,y=280-520)竖排四条，逐条弹入(stagger 0.8s)：1.✗system prompt 2.✗多轮对话 3.✗function call 4.✗角色不分。红色✗=否定色码，贯穿全片。
- 音画偏移：同步
- 素材：无
- **注意**：原文 §1 无代码块，这里不用任何代码，纯 feature_list。

### Seg 5 [00:19.9-00:22.3]
- 旁白：每一轮你都得把历史全搬一遍，搬到最后 token 上限爆掉。
- 动作：搬=重复流动 -> 堆积 -> 爆炸
- 镜头：zoom_to(堆积区)
- 分镜：输入块下方(y=580-680)，3-4个重叠的 prompt 文本块(灰蓝，向上堆叠，每个标"第N轮全发")。最后弹红色标签"💥 token 爆掉"(x=480,y=700)。
- 音画偏移：同步
- 素材：无
- **纠正**：上一版用了 cb-03（messages.append），但 cb-03 是第二代代码，第一代根本没有 messages 数组。第一代是整个 prompt 重发，用纯视觉堆积表达，不用代码块。

### Seg 6 [00:28.7-00:36.7]
- 旁白：类比一下你就懂了。这就像你给笔友写信。每次都得把前面聊过的全部重写一遍。对方回一句，你再从头抄。累不累?
- 动作：类比=对比 -> analogy **4帧序列**（不是静态块）
- 镜头：hold
- 分镜：屏幕中央(x=760-1160,y=300-600)画 4 帧序列，按旁白节奏依次出现：
  1. 信封图标 + "笔友写信"(28.7s)
  2. 信封旁叠 3 封信纸，标"前面聊过的全抄"(31.6s)
  3. 右侧弹小气泡"对方回一句"(34.6s)
  4. 信纸重新堆叠标"从头抄"(35.6s)
  底部大字"累不累?"(x=960,y=700,ACCENT色,36.7s)。
- 音画偏移：每帧同步旁白；"累不累?"滞后0.3s
- 素材：无
- **改进**：上一版是一个静态 analogy_block。这版按旁白的 4 个动作拆成 4 帧序列，每帧对齐一句旁白。

### Seg 7 [00:36.7-00:41.8]
- 旁白：第二代，2023 年 3 月，GPT-3.5-Turbo，叫 /v1/chat/completions。
- 动作：出现 -> api_block.pop + version_tag.pop
- 镜头：zoom_to(第二刻度)
- 分镜：第二刻度(x=960)弹 version_tag"2023.3 · GPT-3.5-Turbo"(y=220)。下方弹 api_block(x=960,y=300,w=420,h=120,青绿色)写"/v1/chat/completions"。**一代的 api_block + feature_list 淡化(opacity 0.3)**，形成新旧对比。色码：二代=青绿 vs 一代=灰蓝。
- 音画偏移：提前0.3s
- 素材：`public/logo/openai.png`

### Seg 8 [00:43.6-00:48.6]
- 旁白：这一代的核心变化只有一条：把"对话"变成原生的数据结构，不再靠你拼字符串。
- 动作：变成=状态变化 -> morph(A->B)；不再=否定旧 -> ✗ on "拼字符串"
- 镜头：static
- 分镜：左侧"潦草手写纸条"(x=560,y=460,w=280,h=120,灰蓝,歪斜"拼字符串")。48.6s"不再靠你拼"时纸条上弹红色✗。右侧"规整表格"(x=1360,y=460,w=360,h=160,青绿,4行网格)。中间 morph 箭头(700->1180,y=460)。入场：纸条先->✗次->表格次->箭头最后。
- 音画偏移：提前0.3s（纸条先出现）；"不再"处✗滞后0.2s
- 素材：无
- **改进**：上一版只有 morph 没有 ✗。"不再靠你拼字符串"里的"不再"是否定动词，该有 ✗。

### Seg 9 [00:50.2-00:54.4]
- 旁白：说白了就是：以前聊天记录是你手写的潦草小纸条。现在变成一张规整的表格。
- 动作：变成=状态变化 -> morph 强化
- 镜头：static
- 分镜：Seg 8 完成态保持。纸条上标"以前"(x=560,y=400)，表格上标"现在"(x=1360,y=380)。
- 音画偏移：同步
- 素材：无

### Seg 10 [00:56.5-00:59.1]
- 旁白：system、user、assistant、tool，四种角色各就各位。
- 动作：各就各位=层级 -> code_snippet 展示 cb-01 原文 JSON
- 镜头：zoom_to(code_snippet)
- 分镜：用原文 cb-01 的 messages JSON，CodeCard 展示(x=840,y=380,w=500)。逐行点亮(stagger 0.3s)，"role"字段高亮。上方标"四种角色各就各位"(x=1090,y=350)。
- 音画偏移：提前0.3s
- 素材：原文 cb-01

### Seg 11 [00:60.8-00:63.0]
- 旁白：配上 tools 就能 function calling。
- 动作：配上=新增 -> ✓ 弹入
- 镜头：static
- 分镜：CodeCard 右侧(x=1380,y=460)弹绿色✓"function calling"。引线指向 cb-01 的 tools 行。
- 音画偏移：同步
- 素材：无

### Seg 12 [00:63.0-00:68.8]
- 旁白：返回的东西收在 choices[0].message 里。finish_reason 告诉你为啥停，usage 给你 token 统计。
- 动作：收在=层级 -> code_snippet 展示 cb-02 原文 JSON
- 镜头：zoom_to(code_snippet)
- 分镜：用原文 cb-02 的返回 JSON，CodeCard 展示(x=660,y=620,w=600)。逐行高亮(stagger 0.5s)，旁注"返回内容"/"为啥停"/"token统计"(x=1300,y=660/740/780)。
- 音画偏移：同步
- 素材：原文 cb-02

### Seg 13 [00:70.6-00:76.5]
- 旁白：这套接口统治了 2023 年到今天。到现在还是各家 Provider 适配的主流。
- 动作：统治=持续 -> timeline 高亮 + logo 排
- 镜头：pull_out 到全貌
- 分镜：时间轴第二刻度到右端高亮金色区域。上方标"2023-至今 · 统治期"(x=1340,y=80)。下方一排厂商 logo(DeepSeek x=560/通义 x=880/MiniMax x=1200/字节 x=1520,y=850)，每个标"✓ 兼容"。
- 音画偏移：提前0.3s
- 素材：4 个厂商 logo

### Seg 14 [00:76.5-00:81.4]
- 旁白：那么问题就来了--它真的完美吗? 不。它有五个绕不开的痛点。每一个，都能把你写代码写到崩溃。
- 动作：问题=转折 -> stamp("不") + pain_hint
- 镜头：stamp + shake
- 分镜：所有元素淡出(opacity 0.2)。大字"完美?"(x=960,y=400,白字)。红色"不"stamp砸上+shake(x=960,y=400)。下方"5个绕不开的痛点"(x=960,y=600)。五个✗排一行(x=560/760/960/1160/1360,y=720,红色)。底部"写到崩溃"(x=960,y=820)。
- 音画偏移：滞后0.2s（旁白说"不"后红章砸下）
- 素材：无

---

## 自检
- [x] 结构（演进叙事+平行结构）？节奏？
- [x] 视觉系统？风格无关？
- [x] 查 public/？openai logo + 4 厂商 logo
- [x] 查原始文档？cb-01(Seg10) + cb-02(Seg12)。**cb-03 不用**（是第二代痛点代码，不是第一代）
- [x] 每句一段？隐藏动词映射？
- [x] 可画面化分镜？x/y/w/h？
- [x] 否定带证据？
- [x] 背景不动+信息轰炸？
- [x] 镜头服务于认知？
- [x] 布局？安全区？无重叠？
- [x] 音画偏移？每段标了？
- [x] 色码贯穿？一代灰蓝/二代青绿/否定红？
