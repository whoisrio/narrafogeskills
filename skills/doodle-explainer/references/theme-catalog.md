# Doodle Theme Catalog（doodle-explainer 自带副本）

> 本文件是 `narraforgeskills/skills/theme-catalog/` 的分发副本，只含 engines 含 `doodle` 的主题。
> **改主题只改 master（narraforgeskills/skills/theme-catalog/theme-catalog.json + theme-catalog.md），再同步本副本**；别在本文件里直接改色值。
> 色值来自 frontend-slides bold-template-pack 真实 design.md，未编造。

## 主题解析规则

- brief 给 `themeRef: <id> + doodle` → 查下表取 BG/GRID/INK/PALETTE/ACCENT + lineConfig 绑进渲染。
- brief 没写 → 默认 `playful + doodle`（手账桃土）。
- brief 给 sticker 专属主题（block-frame/creative-mode）→ 提示换 sticker 引擎 skill，别硬套。

## 主题表

### playful（默认）
- 调性：桃土底 + 唯一炭黑，blob 圆角手摆旋转。轻松/独立/友好。
- 配色：
  - `BG=#F0C8A0`, `GRID=#E8B88E`(BG 压暗 8%), `INK=#1A1A1A`
  - `PALETTE=[#F7DEC6, #F0C8A0, #E8B88E]`
  - `ACCENT=[#1A1A1A]`（唯一色纪律，强调即炭黑）
- lineConfig：strokeWidth 3, roughness 0.6, 圆角 blob 不对称 24-32, 无硬阴影, ±0.5-3° 手摆旋转
- signature：双层描边偏移（3px 主边 + 6-8px ghost 边）、scribbled 涂鸦

### retro-zine
- 调性：米黄纸 + 森林绿 + 颗粒叠层，riso 手工感。复古复盘。
- 配色：
  - `BG=#C8B99A`, `GRID=#B8A98A`(BG 压暗 6%), `INK=#1A1A1A`
  - `PALETTE=[#F4EFE6, #C8B99A, #B8A98A]`
  - `ACCENT=[#008F4D, #00A85D]`（森林绿系）
- lineConfig：strokeWidth 3, roughness 0.7, 圆角 16, 颗粒叠层 0.07
- signature：纸压纸偏移卡片（绿 slab 垫白卡 12px）、Caveat 手写强调、旋转印章

### scatterbrain
- 调性：便利贴 + 图钉 + 软木板，workshop 感。头脑风暴/进行中的思考。
- 配色：
  - `BG=#FAF8F3`, `GRID=#F0EBE0`(BG 压暗 5%), `INK=#2D2A26`
  - `PALETTE=[#FFE066, #A5D8FF, #FFC9C9, #B2F2BB, #FFCC80]`
  - `ACCENT=[#C92A2A]`（图钉红）
- lineConfig：strokeWidth 3, roughness 0.6, 圆角 12, 便利贴交替 ±3° 旋转, 图钉/胶带装饰
- signature：便利贴（彩色贴纸卡 + 旋转）、软木板/纸/暖渐变三底、高密度散布

### daisy-days
- 调性：奶油底 + 粉彩 + 手绘雏菊星星彩虹。教育/轻松科普。
- 配色：
  - `BG=#F5F0E6`, `GRID=#EAE3D5`(BG 压暗 7%), `INK=#2D2D2D`
  - `PALETTE=[#7ECDC0, #F7C8D4, #FDE68A, #A8E6CF, #D4A5E8, #FFCBA4, #A8D8F0]`
  - `ACCENT=[#F8635F]`（珊瑚）
- lineConfig：strokeWidth 3, roughness 0.5, 圆角 卡片 20-28/badge pill, 硬阴影 6px 6px 0 INK
- signature：3px 炭描边包裹每个形状、手绘 SVG 装饰角落簇、高圆角
- 注意：偏童书/kawaii，严肃技术片慎用。

### capsule
- 调性：全药丸形 + 2px 描边 + Bodoni 糖果色。模块化 Y2K。
- 配色：
  - `BG=#F5F5F0`, `GRID=#EDEDE5`(BG 压暗 5%), `INK=#1E1E1E`
  - `PALETTE=[#E85D4E, #C4D94E, #C5B5E0, #8BB4F7]`
  - `ACCENT=[#E85D4E]`
- lineConfig：strokeWidth 2, roughness 0.4, 圆角 全 pill(9999px)/大面板 2rem, 硬阴影 4/6/8/12px 右下
- signature：万物药丸形、漂浮药丸装饰
- 注意：需 doodle 支持"全 pill"变体——风格承诺，不是换 PALETTE。

### stencil-tablet
- 调性：骨白底 + stencil 断墨字体 + 大地色块。田野手册感/档案向。
- 配色：
  - `BG=#E2DCC9`, `GRID=#D5CFBA`(BG 压暗 6%), `INK=#0A0A0A`
  - `PALETTE=[#A06A3C, #C73B7A, #EE7A2E, #2D7E73, #3F73B7, #D8A93B, #6F7A2E]`
  - `ACCENT=[#C73B7A]`
- lineConfig：strokeWidth 3, roughness 0.5, 圆角 卡片 22-26, stencil 字体（断墨质感）
- signature：stencil 断墨字体撑身份、巨型数字 160-540px、大地色色块排版
- 注意：stencil 字体是身份核心，需引入 stencil 风显示字体才像。

## 选型速记（对应 visual-brief 推荐）

- 轻松/独立 → playful（默认最稳）
- 复古/手工/复盘 → retro-zine
- 发散/workshop → scatterbrain
- 教育/科普/温暖 → daisy-days
- 模块/参数/并列 → capsule
- 手册/档案/严谨 → stencil-tablet
