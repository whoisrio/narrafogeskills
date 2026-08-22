# 手绘风格动画制作一致性要素 · 应用示例

> 配套 `SKILL.md` 的「手绘风格动画制作一致性要素」与 `references/visual-brief-prompt.md` 的 §4.7 动效模式库。
> 下列示例展示如何把一个「流处理管道」章节的 brief 写成符合我们达成一致的手绘动画规范。
> 风格上下文采用 `style-context-templates.md` 的「模板 D · 手绘 / 白板风」。

---

## 一、对应的 8 条一致性要素（速查）

1. 功能区块必须自解释 → 管道里每一层都写明「转换层 A / B / C」
2. 标签锚定在所属容器内部 → 层标签写在带子内部下沿，不贴带子上沿外侧
3. 同层并列元素统一尺寸与间距 → 三个转换层统一宽 220、统一间距
4. 成片转场至少两种 → 章间用 `ink_sweep`，小节内用 `panel_wipe`
5. 标题降格 → 章节标题开场大字号，2s 后缩到左上角常驻小标签
6. 笔描揭示 → 三个转换层框用 `draw_svg_trace` 沿线画出
7. 套准错位强调 → 关键结论用 `riso_print_hits` 一闪
8. line-boil 只用于 rough 描边 → 三个层框和连线施加 `line_boil`，标题文字不施加

---

## 二、应用示例（brief 节选）

输入：chapter「流处理管道」，segment 0（入口）→ 1（三个转换层）→ 2（投影输出）→ 3（结论）
style context：模板 D（手绘 / 白板风）

```json
{
  "scenes": [
    {
      "scene_id": "s1",
      "chapter_position": 2,
      "segment_range": [0, 2],
      "duration_sec": 14,
      "scene_type": "diagram_build",
      "layout": {
        "background": "#f7f4ec",
        "arrangement": "top_bottom",
        "notes": "顶部常驻降格标题；中部一条转换带内含三个等宽转换层；底部投影输出。标签全部在带子内部。"
      },
      "elements": [
        {
          "element_id": "e_title",
          "type": "text",
          "content": "流处理管道",
          "source_ref": null,
          "position": {"x": "left", "y": "top", "width_hint": "auto", "z_index": 3},
          "style": {"font": "hand", "size_px": 88, "weight": "bold", "color": "#2b2b2b"},
          "animation": {
            "pattern": "title_demote_to_label",
            "property": "scale", "from": 1, "to": 0.42,
            "duration_sec": 0.8, "easing": "ease_out",
            "notes": "开场大字号居中，2s 后缩到左上角常驻小标签"
          }
        },
        {
          "element_id": "e_band",
          "type": "node",
          "content": "转换带（虚线 rough 框，内含三层）",
          "source_ref": null,
          "position": {"x": "center", "y": "center", "width_hint": "80%", "z_index": 0},
          "style": {"font": null, "size_px": null, "weight": null, "color": "#2b2b2b"},
          "animation": {"pattern": "line_boil", "property": "stroke", "from": 0, "to": 1, "duration_sec": 0.6, "easing": "linear", "notes": "rough 描边常驻轻微抖动（仅描边元素）"}
        },
        {
          "element_id": "e_t1",
          "type": "node",
          "content": "转换层 A",
          "source_ref": null,
          "position": {"x": "left_30%", "y": "center", "width_hint": "220px", "z_index": 1},
          "style": {"font": "hand", "size_px": 28, "weight": "semibold", "color": "#2b2b2b"},
          "animation": {"pattern": "draw_svg_trace", "property": "strokeDashoffset", "from": 1, "to": 0, "duration_sec": 1.0, "easing": "ease_out", "notes": "标签写在框内下沿，不与上方 e_band 重叠"}
        },
        {
          "element_id": "e_t2",
          "type": "node",
          "content": "转换层 B",
          "source_ref": null,
          "position": {"x": "center", "y": "center", "width_hint": "220px", "z_index": 1},
          "style": {"font": "hand", "size_px": 28, "weight": "semibold", "color": "#2b2b2b"},
          "animation": {"pattern": "draw_svg_trace", "property": "strokeDashoffset", "from": 1, "to": 0, "duration_sec": 1.0, "easing": "ease_out", "notes": "与 e_t1 等宽等距"}
        },
        {
          "element_id": "e_t3",
          "type": "node",
          "content": "转换层 C",
          "source_ref": null,
          "position": {"x": "right_70%", "y": "center", "width_hint": "220px", "z_index": 1},
          "style": {"font": "hand", "size_px": 28, "weight": "semibold", "color": "#2b2b2b"},
          "animation": {"pattern": "draw_svg_trace", "property": "strokeDashoffset", "from": 1, "to": 0, "duration_sec": 1.0, "easing": "ease_out", "notes": "与 e_t1 等宽等距"}
        },
        {
          "element_id": "e_out1",
          "type": "node",
          "content": "投影 1",
          "source_ref": null,
          "position": {"x": "left_30%", "y": "bottom", "width_hint": "200px", "z_index": 1},
          "style": {"font": "hand", "size_px": 24, "weight": "regular", "color": "#2b2b2b"}
        },
        {
          "element_id": "e_out2",
          "type": "node",
          "content": "投影 2",
          "source_ref": null,
          "position": {"x": "center", "y": "bottom", "width_hint": "200px", "z_index": 1},
          "style": {"font": "hand", "size_px": 24, "weight": "regular", "color": "#2b2b2b"}
        },
        {
          "element_id": "e_out3",
          "type": "node",
          "content": "投影 3",
          "source_ref": null,
          "position": {"x": "right_70%", "y": "bottom", "width_hint": "200px", "z_index": 1},
          "style": {"font": "hand", "size_px": 24, "weight": "regular", "color": "#2b2b2b"}
        }
      ],
      "timeline": [
        {
          "time_sec": 0,
          "narration_cue": "「一条流进来，先经过转换带」",
          "element_states": {
            "e_title": {"state": "highlighted", "note": "大字号开场"},
            "e_band": {"state": "visible", "note": ""},
            "e_t1": {"state": "hidden", "note": ""},
            "e_t2": {"state": "hidden", "note": ""},
            "e_t3": {"state": "hidden", "note": ""},
            "e_out1": {"state": "hidden", "note": ""},
            "e_out2": {"state": "hidden", "note": ""},
            "e_out3": {"state": "hidden", "note": ""}
          }
        },
        {
          "time_sec": 2.0,
          "narration_cue": "「标题降为角落标签，看三层怎么转」",
          "element_states": {
            "e_title": {"state": "dimmed", "note": "已降格为左上角常驻小标签"},
            "e_band": {"state": "visible", "note": ""},
            "e_t1": {"state": "highlighted", "note": "draw_svg_trace 画出 + 标签在框内"},
            "e_t2": {"state": "highlighted", "note": "draw_svg_trace 画出"},
            "e_t3": {"state": "highlighted", "note": "draw_svg_trace 画出"}
          }
        },
        {
          "time_sec": 8.0,
          "narration_cue": "「转完分别投影出去」",
          "element_states": {
            "e_title": {"state": "dimmed", "note": ""},
            "e_t1": {"state": "visible", "note": "恢复正常"},
            "e_t2": {"state": "visible", "note": ""},
            "e_t3": {"state": "visible", "note": ""},
            "e_out1": {"state": "highlighted", "note": "panel_wipe 切入"},
            "e_out2": {"state": "highlighted", "note": "panel_wipe 切入"},
            "e_out3": {"state": "highlighted", "note": "panel_wipe 切入"}
          }
        }
      ],
      "transitions": [
        {
          "from_time": 2.0, "to_time": 8.0, "duration_sec": 0.5,
          "pattern": "panel_wipe",
          "description": "e_out1/2/3 从 hidden → highlighted，用 panel_wipe（小节内转场）"
        }
      ]
    },
    {
      "scene_id": "s2",
      "chapter_position": 2,
      "segment_range": [3, 3],
      "duration_sec": 4,
      "scene_type": "closing",
      "layout": {
        "background": "#f7f4ec",
        "arrangement": "centered",
        "notes": "关键结论，riso 错位一闪"
      },
      "elements": [
        {
          "element_id": "e_concl",
          "type": "text",
          "content": "管道让转换可组合、可复用",
          "source_ref": null,
          "position": {"x": "center", "y": "center", "width_hint": "auto", "z_index": 1},
          "style": {"font": "hand", "size_px": 56, "weight": "bold", "color": "#c0473a"},
          "animation": {
            "pattern": "riso_print_hits",
            "property": "color", "from": "#c0473a", "to": "#c0473a",
            "duration_sec": 1.8, "easing": "linear",
            "notes": "色版错位硬切一闪即回（红版 + 蓝版轻微偏移）"
          }
        }
      ],
      "timeline": [
        {
          "time_sec": 0,
          "narration_cue": "「所以这条管道的价值，是可组合、可复用」",
          "element_states": {
            "e_concl": {"state": "accented", "note": "riso_print_hits 强调"}
          }
        }
      ],
      "transitions": [
        {
          "from_time": 0, "to_time": 0, "duration_sec": 1.0,
          "pattern": "ink_sweep",
          "description": "s1 → s2 章间转场用 ink_sweep（墨迹扫过揭幕）"
        }
      ]
    }
  ]
}
```

---

## 三、怎么读这个示例

- **要素 1 + 2 + 3**：三个转换层都写明标签（自解释），标签在框内下沿（不溢出），三个层等宽 220（统一）。
- **要素 4**：s2 的章间转场是 `ink_sweep`，s1 内部输出切入是 `panel_wipe` —— 两种风格。
- **要素 5**：`e_title` 用 `title_demote_to_label`，开场大字号、2s 后缩到角落。
- **要素 6**：`e_t1/2/3` 用 `draw_svg_trace`（`strokeDashoffset` 1→0）沿线画出。
- **要素 7**：`e_concl` 用 `riso_print_hits` 错位硬切强调。
- **要素 8**：`line_boil` 只加在 `e_band`（rough 描边），标题 `e_title` 不施加。
