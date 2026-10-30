# 从 brief 到代码（Examples）

三个真实推理链。看的是"怎么决定"，不是"抄代码"。

---

## 例 1：双击一个图标，其实发生了三件事

**brief 片段**：`Seg 03 ｜ 9s ｜ 图标 → 进程 → 系统调用 ｜ 出场：pop / draw ｜ 镜头：推近`

**判断**：这一拍要讲的是"关系"（谁唤起谁），不是"东西"。所以不能靠三个 sprite 摆一排，要用面板 + 阶梯线。图标只在第一拍出现一次，作为起点。

**骨架**：面板 + 阶梯线（模板 2）。三个面板横向排，间距 6 格，`y` 对齐 96。

**代码**：

```tsx
import React from 'react'
import {
  PixelText, PixelSprite, Rects, SPRITES,
  dirArrow, growWire, staged, u, usePixel, wireRoute,
} from '../kit'

// 面板不进库（就是几行 div），写法按 style-guide「自写组件」：
// 1 格边框 + 纯色底，内容从 x+2 起，不要圆角不要阴影
const Panel: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => {
  const { palette } = usePixel()
  return (
    <div
      style={{
        position: 'absolute',
        left: u(x),
        top: u(y),
        width: u(w),
        height: u(h),
        boxSizing: 'border-box',
        background: palette.panel,
        border: `${u(1)}px solid ${palette.line}`,
      }}
    />
  )
}

export const DoubleClick: React.FC<{ frame: number }> = ({ frame }) => {
  const { palette } = usePixel()

  // 三个节点：图标面板、进程面板、内核面板。宽度写死整数，不靠 flex 平分
  const nodes = [
    { x: 32, y: 96, w: 64, h: 40, label: '双击' },
    { x: 112, y: 96, w: 80, h: 40, label: '装载进程' },
    { x: 208, y: 96, w: 80, h: 40, label: '系统调用' },
  ]

  const seg1 = wireRoute({ x: 96, y: 116 }, { x: 112, y: 116 }, 104)
  const seg2 = wireRoute({ x: 192, y: 116 }, { x: 208, y: 116 }, 200)

  // 生长距离走台阶：0 帧不动，40 帧长出 8 格，52 帧到 16 格
  const d1 = staged(frame, [[36, 0], [44, 8], [52, 16]])
  const d2 = staged(frame, [[64, 0], [72, 8], [80, 16]])

  return (
    <>
      {nodes.map((n, i) => {
        // 面板按 8 帧一级落位，第 i 个晚 8 帧
        const at = i * 8
        const shown = frame >= at
        if (!shown) return null
        return (
          <React.Fragment key={n.label}>
            <Panel x={n.x} y={n.y} w={n.w} h={n.h} />
            <PixelText x={n.x + 4} y={n.y + 6} w={n.w - 8} align="center" color={palette.bone}>
              {n.label}
            </PixelText>
            <PixelText x={n.x + 4} y={n.y + 24} color={palette.soot}>
              {`0${i + 1}`}
            </PixelText>
          </React.Fragment>
        )
      })}

      {/* 线在两端节点就位后才长：节点 2 在 8 帧落位，线从 36 帧开始 */}
      <Rects
        groups={[
          { rects: growWire(seg1, d1), fill: palette.lineHi },
          { rects: growWire(seg2, d2), fill: palette.lineHi },
          { rects: dirArrow(112, 116, 6, 'right'), fill: palette.accent },
          { rects: dirArrow(208, 116, 6, 'right'), fill: palette.accent },
        ]}
      />

      {/* 图标只在开场出现，落位后不再动 */}
      {frame < 32 ? <PixelSprite sprite={SPRITES.terminal} x={48} y={120} scale={2} /> : null}
    </>
  )
}
```

**自检点**：三个面板的 `x + w` 与下一个 `x` 之间的间距是不是 ≥6 格；箭头 tip 是否正好落在面板左边缘（`112` / `208`）；线的竖段（这里长度为 0，因为 `y` 相同，`wireRoute` 会自动过滤掉空段）是否被过滤。

---

## 例 2：一个文件被切成段，映射到页

**brief 片段**：`Seg 07 ｜ 11s ｜ 文件段 → 页 → 权限 ｜ 出场：wipe / stagger ｜ 焦点：focus 第三段`

**判断**：要讲"结构 + 一一对应"，所以是堆栈 + 括号，不是连线。左侧文件段从下往上叠，右侧页表对齐同一高度，第三段落位后用 `Bracket` 圈住。

**骨架**：阶梯堆栈（模板 5）。

**代码**（关键片段，省掉了右侧页表的重复结构；`Bracket` 从 kit 取）：

```tsx
const segs = [
  { h: 16, label: '.text' },
  { h: 8, label: '.data' },
  { h: 6, label: '.bss' },
  { h: 4, label: 'heap' },
]

// 从底往上叠，base 是最底下那一层的 y
let cursor = 150
const placed = segs.map((s) => {
  cursor -= s.h + 1 // 1 格缝，让层与层分得开
  return { ...s, x: 40, w: 96, y: cursor }
})

// 错峰：间隔 8 → 4 → 2，收尾静止
const DELAY = [16, 24, 28, 30]
placed.forEach((s, i) => {
  if (frame < DELAY[i]) return
  // 画这一层
})
```

右侧页表用同样的高度对齐，每页一个 `PixelPanel`，页内写权限位。第三段被选中时：

```tsx
{frame >= 96 ? (
  <Bracket x={placed[2].x - 2} y={placed[2].y - 2} w={placed[2].w + 4} h={placed[2].h + 4}
           color={palette.accent} len={4} />
) : null}
```

**自检点**：`cursor` 累减出来的 `y` 是否仍是整数（用整数高度就不会出小数）；括号比内容外扩 2 格，是否会压到相邻层（层缝只有 1 格时，把括号改成只包左右两侧）。

---

## 例 3：有方法，不等于一定能突破

**brief 片段**：`Seg 18 ｜ 13s ｜ 六个防护 ↔ 六个应对 ｜ 出场：stagger ｜ 焦点：hold 结论`

**判断**：对照双栏（模板 4）。左侧六个防护，右侧六个应对，中间抖点竖线，最后压一句结论。这一拍不要任何 sprite——全是概念，画成图标反而分散注意力。

**骨架**：对照双栏 + 底部结论条。

**代码要点**：

- 六行等距，行高 14，行距 18（`14 + 4` 格缝）
- 逐行错峰 6 帧，收尾静止 0.5 秒（15 帧）
- 右侧应对文字用 `ash`，左侧防护用 `protect` 色；不改字号（只有一档能用）
- 结论条放 `bottom: 148`，用一个 `Panel` 包住，文字 `accent`
- 中间竖线用 `Dotted`，98 帧后才出现

```tsx
<Dotted x={188} y={40} len={96} color={palette.line} gap={2} dir="v" />
```

**自检点**：六行加起来的高度是否越过 `SAFE.bottom`（`40 + 6 * 18 = 148`，正好卡在结论条上方，不要再加行）；左右两栏文字是否都做了 `estWidth()` 估算，避免右侧文字顶到竖线。

---

## 三个例子的共同点

都不是先想"用什么组件"，而是先判断这一拍在讲**东西**还是**关系**，再挑骨架，最后才落到具体图元。

像素风里，判断错的代价比涂鸦风大：涂鸦可以靠线条走向救回来，方块一旦摆错，整屏就是一个表格。
