# Theme Catalog（主题目录索引）

> 机器读数据见同目录 `theme-catalog.json`。本文件是人读索引，供 visual-brief 推荐主题用。
> 分发规则：visual-brief 读**索引视图**（下表）；explainer 读**完整条目**（json 里的 palette/lineConfig/signature）。

## 快速一览

| id | 引擎 | 调性一句话 | 适合 | 慎用 |
| --- | --- | --- | --- | --- |
| playful | doodle | 桃土底 + 唯一炭黑，blob 圆角手摆旋转 | 轻松解释、独立感、想显友好的技术片 | 需要机构可信度 |
| retro-zine | doodle | 米黄纸 + 森林绿 + 颗粒叠层，riso 手工感 | 复古复盘、想显印刷温度的片 | 需要数字精致感 |
| scatterbrain | doodle + sticker | 便利贴 + 图钉 + 软木板，workshop 感 | 头脑风暴、创意流程、进行中的思考 | 需要精确与重量 |
| daisy-days | doodle + sticker | 奶油底 + 粉彩 + 手绘雏菊星星彩虹 | 教育、轻松科普、温暖即信息 | 权威与精度优先 |
| capsule | doodle + sticker | 全药丸形 + 2px 描边 + Bodoni 糖果色 | 模块化 Y2K、pop 清晰度的 demo | 传统机构重量 |
| stencil-tablet | doodle + sticker | 骨白底 + stencil 断墨字体 + 大地色块 | 田野手册感、档案向 | 数字精致或 playful pop |
| block-frame | sticker | 4px 黑边 + 8px 硬阴影 + 方角 + 粉彩 | pop 图形感、独立 SaaS 发布 | 安静机构克制 |
| creative-mode | sticker | 奶油底 + 四色 flat + 24px 硬阴影 + 大写 | 设计主导、创意向 | 机构克制与安静权威 |

## 选型速记（visual-brief 用）

- 旁白轻松/亲切/独立 → `playful`（doodle 原生，最稳）
- 旁白复古/手工/复盘 → `retro-zine`（doodle 原生）
- 旁白有 brainstorm/发散/进行中的语气 → `scatterbrain`
- 旁白教育/科普/温暖 → `daisy-days`
- 旁白模块化/参数/并列结构 → `capsule`
- 旁白手册感/档案/严谨 → `stencil-tablet`
- 旁白锐利断言/发布/自信 → `block-frame` 或 `creative-mode`（sticker 专属，需要 sticker 引擎）

## 引擎归属

- `doodle` 专属：playful、retro-zine
- `doodle + sticker`：scatterbrain、daisy-days、capsule、stencil-tablet
- `sticker` 专属：block-frame、creative-mode

## 使用约定（防止重蹈 style-context-templates.md 孤儿覆辙）

1. **visual-brief 只写 `themeRef`（一行 id + engine），不写任何色值**——保持色盲导演。
2. **explainer 拿到 themeRef 后查自己 references/ 里的完整条目**，把 palette/lineConfig 绑进渲染。
3. **改主题只改本 master（json + 本 md），再同步副本到各 explainer 的 references/**。别在 explainer 里直接改色值。
4. 每个主题的色值全部来自 frontend-slides bold-template-pack 真实 design.md，**未编造**；GRID 用 derived 规则（BG 压暗 N%）而不是硬编码。
