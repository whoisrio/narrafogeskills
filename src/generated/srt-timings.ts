// === srt_02 === (auto-generated from /Users/rio/repos/video_prjs/responseapi/public/audio/02._1._v1_completions（2020，GPT-3）：没有「对话」这回事.srt, do not edit)
export const srt_02 = {
  "cues": [
    {
      "index": 0,
      "text": "第一代的 /v1/completions，",
      "startSec": 0,
      "endSec": 1.932,
      "startFrame": 0,
      "endFrame": 58,
      "durationFrames": 58
    },
    {
      "index": 1,
      "text": "是 2020 年跟着 GPT-3 一起出现的。",
      "startSec": 1.932,
      "endSec": 5.3,
      "startFrame": 58,
      "endFrame": 159,
      "durationFrames": 101
    },
    {
      "index": 2,
      "text": "它最原始的形态：一个 prompt 送进去，",
      "startSec": 5.3,
      "endSec": 8.048,
      "startFrame": 159,
      "endFrame": 241,
      "durationFrames": 82
    },
    {
      "index": 3,
      "text": "一段 text 出来，",
      "startSec": 8.048,
      "endSec": 9.258,
      "startFrame": 241,
      "endFrame": 278,
      "durationFrames": 36
    },
    {
      "index": 4,
      "text": "就这么简单。",
      "startSec": 9.258,
      "endSec": 10.247,
      "startFrame": 278,
      "endFrame": 307,
      "durationFrames": 30
    },
    {
      "index": 5,
      "text": "屏幕上的代码把这次交互讲得很清楚。",
      "startSec": 10.247,
      "endSec": 13.23,
      "startFrame": 307,
      "endFrame": 397,
      "durationFrames": 89
    },
    {
      "index": 6,
      "text": "请求里你写上 model 是 davinci，",
      "startSec": 13.23,
      "endSec": 15.808,
      "startFrame": 397,
      "endFrame": 474,
      "durationFrames": 77
    },
    {
      "index": 7,
      "text": "prompt 是「写一个冰淇淋店的标语」，",
      "startSec": 15.808,
      "endSec": 18.14,
      "startFrame": 474,
      "endFrame": 544,
      "durationFrames": 70
    },
    {
      "index": 8,
      "text": "再带上 max_tokens、temperature 这些参数。",
      "startSec": 18.14,
      "endSec": 21.262,
      "startFrame": 544,
      "endFrame": 638,
      "durationFrames": 94
    },
    {
      "index": 9,
      "text": "返回的是一个 text_completion 对象，",
      "startSec": 21.262,
      "endSec": 23.814,
      "startFrame": 638,
      "endFrame": 714,
      "durationFrames": 77
    },
    {
      "index": 10,
      "text": "choices 里就是生成的文本，",
      "startSec": 23.814,
      "endSec": 25.895,
      "startFrame": 714,
      "endFrame": 777,
      "durationFrames": 62
    },
    {
      "index": 11,
      "text": "外加一个 usage 字段告诉你用了多少 token。",
      "startSec": 25.895,
      "endSec": 29.15,
      "startFrame": 777,
      "endFrame": 875,
      "durationFrames": 98
    },
    {
      "index": 12,
      "text": "整段交互就这一来一回。",
      "startSec": 29.15,
      "endSec": 31.141,
      "startFrame": 875,
      "endFrame": 934,
      "durationFrames": 60
    },
    {
      "index": 13,
      "text": "这一代根本没有 system prompt 这个概念。",
      "startSec": 31.141,
      "endSec": 33.874,
      "startFrame": 934,
      "endFrame": 1016,
      "durationFrames": 82
    },
    {
      "index": 14,
      "text": "你想约束模型的行为，",
      "startSec": 33.874,
      "endSec": 35.505,
      "startFrame": 1016,
      "endFrame": 1065,
      "durationFrames": 49
    },
    {
      "index": 15,
      "text": "只能把指令写在 prompt 最前面。",
      "startSec": 35.505,
      "endSec": 38.015,
      "startFrame": 1065,
      "endFrame": 1140,
      "durationFrames": 75
    },
    {
      "index": 16,
      "text": "也没有多轮对话——每一轮上下文都得你自己拼，",
      "startSec": 38.015,
      "endSec": 41.73,
      "startFrame": 1140,
      "endFrame": 1252,
      "durationFrames": 111
    },
    {
      "index": 17,
      "text": "拼到 token 上限为止。",
      "startSec": 41.73,
      "endSec": 43.485,
      "startFrame": 1252,
      "endFrame": 1305,
      "durationFrames": 53
    },
    {
      "index": 18,
      "text": "更没有 system、user、assistant 这种角色分工，",
      "startSec": 43.485,
      "endSec": 47.083,
      "startFrame": 1305,
      "endFrame": 1412,
      "durationFrames": 108
    },
    {
      "index": 19,
      "text": "也没有 function call。",
      "startSec": 47.083,
      "endSec": 48.328,
      "startFrame": 1412,
      "endFrame": 1450,
      "durationFrames": 37
    },
    {
      "index": 20,
      "text": "想构造一段对话，",
      "startSec": 48.328,
      "endSec": 49.68,
      "startFrame": 1450,
      "endFrame": 1490,
      "durationFrames": 41
    },
    {
      "index": 21,
      "text": "得自己在 prompt 里拼，",
      "startSec": 49.68,
      "endSec": 51.343,
      "startFrame": 1490,
      "endFrame": 1540,
      "durationFrames": 50
    },
    {
      "index": 22,
      "text": "角色边界全靠约定，",
      "startSec": 51.343,
      "endSec": 53.014,
      "startFrame": 1540,
      "endFrame": 1590,
      "durationFrames": 50
    },
    {
      "index": 23,
      "text": "特别容易漂移。",
      "startSec": 53.014,
      "endSec": 54.251,
      "startFrame": 1590,
      "endFrame": 1628,
      "durationFrames": 37
    },
    {
      "index": 24,
      "text": "屏幕里这个手机客服的例子就很典型：你手动在 prompt 里写「用户：我的手机开不了机」「客服：请长按电源键」，",
      "startSec": 54.251,
      "endSec": 62.819,
      "startFrame": 1628,
      "endFrame": 1885,
      "durationFrames": 257
    },
    {
      "index": 25,
      "text": "全靠字符串拼出来，",
      "startSec": 62.819,
      "endSec": 64.426,
      "startFrame": 1885,
      "endFrame": 1933,
      "durationFrames": 48
    },
    {
      "index": 26,
      "text": "模型其实分不清哪句是系统指令、哪句是用户。",
      "startSec": 64.426,
      "endSec": 68.343,
      "startFrame": 1933,
      "endFrame": 2050,
      "durationFrames": 118
    },
    {
      "index": 27,
      "text": "也正因为这样，",
      "startSec": 68.343,
      "endSec": 69.478,
      "startFrame": 2050,
      "endFrame": 2084,
      "durationFrames": 34
    },
    {
      "index": 28,
      "text": "OpenAI 后来宣布会永久停用 completions 接口；",
      "startSec": 69.478,
      "endSec": 73.202,
      "startFrame": 2084,
      "endFrame": 2196,
      "durationFrames": 112
    },
    {
      "index": 29,
      "text": "而国产开源模型，",
      "startSec": 73.202,
      "endSec": 74.728,
      "startFrame": 2196,
      "endFrame": 2242,
      "durationFrames": 46
    },
    {
      "index": 30,
      "text": "其实从来就没支持过这一版 API。",
      "startSec": 74.728,
      "endSec": 77.466,
      "startFrame": 2242,
      "endFrame": 2324,
      "durationFrames": 82
    },
    {
      "index": 31,
      "text": "completions 这代太原始，",
      "startSec": 77.466,
      "endSec": 79.329,
      "startFrame": 2324,
      "endFrame": 2380,
      "durationFrames": 56
    },
    {
      "index": 32,
      "text": "对话时代到底是怎么开启的？",
      "startSec": 79.329,
      "endSec": 81.541,
      "startFrame": 2380,
      "endFrame": 2446,
      "durationFrames": 66
    }
  ],
  "totalDuration": 2446,
  "fps": 30
} as const;

