# Sticker Theme Catalog（sticker-explainer 自带副本）

> 本文件是 `narraforgeskills/skills/theme-catalog/` 的分发副本，只含 engines 含 `sticker` 的主题。
> **改主题只改 master（narraforgeskills/skills/theme-catalog/theme-catalog.json + theme-catalog.md），再同步本副本**；别在本文件里直接改色值。
> 色值来自 frontend-slides bold-template-pack 真实 design.md，未编造。

## 主题解析规则

- brief 给 `themeRef: <id> + sticker` → 查下表取 BG/GRID/INK/PALETTE/ACCENT + lineConfig 绑进渲染。
- brief 没写 → 默认 `block-frame + sticker`（新粗野，本引擎招牌）。
- brief 给 doodle 专属主题（playful/retro-zine）→ 提示换 doodle 引擎 skill，别硬套。

## 主题表

### block-frame（默认）
- 调性：4px 黑边 + 8px 硬阴影 + 方角 + 五粉彩。pop 图形感、独立发布、锐利断言。
- 配色：
  - `BG=#FFFDF5`, `GRID=#F0EADF`(BG 压暗 4%), `INK=#000000`
  - `PALETTE=[#FE90E8, #C0F7FE, #99E885, #F7CB46, #FFDC8B]`
  - `ACCENT=[#000000]`
- lineConfig：strokeWidth 4, cornerRadius 0(方角), hardShadow 8px 8px 0 INK(零模糊), 允许倾斜装饰
- signature：4px 黑边、8px 硬阴影、方角、倾斜装饰形状(星/矩形/徽章)
- 注意：⚠ 原主题用 Inter 800-900 标题，违反 frontend-slides 自家黑名单——落成片时标题换 Archivo Black，或保留 Space Grotesk 标签体系。

### creative-mode
- 调性：奶油底 + 四色 flat + 24px 硬阴影 + 大写极紧。设计主导、创意向。
- 配色：
  - `BG=#EFE9D9`, `GRID=#E4DCC4`(cream-2), `INK=#0F0F0F`
  - `PALETTE=[#1F8A4C, #F06CA8, #E85A1F, #F5C518]`
  - `ACCENT=[#1F8A4C]`
- lineConfig：strokeWidth 4, cornerRadius 0(方角), hardShadow 24px 24px 0 同色(featured 加 4px INK 边), 每页只用四色中两到三色
- signature：方角扁平色块、24px 硬偏移阴影(riso 同色偏移)、Archivo Black 大写 0.92 行高
- 注意：比 block-frame 略温和，无被禁 Inter。

### scatterbrain（两边共享）
- 调性：便利贴 + 图钉 + 胶带 + 软木板，workshop 感。头脑风暴/进行中的思考。
- 配色：
  - `BG=#FAF8F3`, `GRID=#F0EBE0`(BG 压暗 5%), `INK=#2D2A26`
  - `PALETTE=[#FFE066, #A5D8FF, #FFC9C9, #B2F2BB, #FFCC80]`
  - `ACCENT=[#C92A2A]`（图钉红）
- lineConfig：strokeWidth 3, cornerRadius 12, 便利贴交替 ±3° 旋转, 图钉/胶带装饰, 软阴影
- signature：便利贴（彩色贴纸卡 + 旋转）、图钉/胶带、软木板/纸/暖渐变三底
- sticker 落地：便利贴 = 硬边矩形色块 + 旋转 + 硬/软阴影均可；图钉胶带照抄。

### daisy-days（两边共享）
- 调性：奶油底 + 粉彩 + 手绘雏菊星星彩虹 + 3px 炭描边。教育/轻松科普。
- 配色：
  - `BG=#F5F0E6`, `GRID=#EAE3D5`(BG 压暗 7%), `INK=#2D2D2D`
  - `PALETTE=[#7ECDC0, #F7C8D4, #FDE68A, #A8E6CF, #D4A5E8, #FFCBA4, #A8D8F0]`
  - `ACCENT=[#F8635F]`（珊瑚）
- lineConfig：strokeWidth 3, cornerRadius 卡片 20-28/badge pill, hardShadow 6px 6px 0 INK, 手绘装饰
- signature：3px 炭描边包裹每个形状、硬偏移阴影、手绘 SVG 装饰
- sticker 落地：本就是"贴纸机制"（3px 描边 + 硬偏移阴影），几乎是贴纸引擎的原生表达。
- 注意：偏童书/kawaii，严肃技术片慎用。

### capsule（两边共享）
- 调性：全药丸形 + 2px 描边 + Bodoni 糖果色。模块化 Y2K。
- 配色：
  - `BG=#F5F5F0`, `GRID=#EDEDE5`(BG 压暗 5%), `INK=#1E1E1E`
  - `PALETTE=[#E85D4E, #C4D94E, #C5B5E0, #8BB4F7]`
  - `ACCENT=[#E85D4E]`
- lineConfig：strokeWidth 2, cornerRadius 全 pill(9999px)/大面板 2rem, hardShadow 4/6/8/12px 右下
- signature：万物药丸形、2px 描边、漂浮药丸装饰
- sticker 落地：药丸扁平硬阴影正是贴纸引擎的强项。

### stencil-tablet（两边共享）
- 调性：骨白底 + stencil 断墨字体 + 大地色块。田野手册感/档案向。
- 配色：
  - `BG=#E2DCC9`, `GRID=#D5CFBA`(BG 压暗 6%), `INK=#0A0A0A`
  - `PALETTE=[#A06A3C, #C73B7A, #EE7A2E, #2D7E73, #3F73B7, #D8A93B, #6F7A2E]`
  - `ACCENT=[#C73B7A]`
- lineConfig：strokeWidth 3, cornerRadius 卡片 22-26, stencil 字体（断墨质感）
- signature：stencil 断墨字体撑身份、巨型数字 160-540px、大地色色块排版
- sticker 落地：色块排版 + 扁平填充正是贴纸引擎的强项；stencil 字体需引入。

## 选型速记（对应 visual-brief 推荐）

- 锐利断言/发布/自信 → block-frame（默认）或 creative-mode
- 设计主导/创意向 → creative-mode
- 发散/workshop → scatterbrain
- 教育/科普/温暖 → daisy-days
- 模块/参数/并列 → capsule
- 手册/档案/严谨 → stencil-tablet
