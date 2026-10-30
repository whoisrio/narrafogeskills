# 几何真相（Geometry）

本文件是唯一坐标真相源。画任何形状、连线、字符格之前读它。

## 1. 单位

画布逻辑尺寸 384×216，一个美术像素 = 5 屏幕像素。所有布局数字都是整数逻辑像素，过 `u()` 变成屏幕像素。

```ts
import { u, W, H, N } from '../kit'

u(0)   // 0
u(16)  // 80
u(384) // 1920
u(1.5) // 抛错
```

`u()` 不是格式化函数，是断言。它存在的唯一理由是把"我随手写了 1.5"这种事故挡在第一帧之前。

尺寸、位置、间距、边框粗细、行高，全部过 `u()`。例外只有三个：`opacity`（本来就不该出现）、`zIndex`、SVG 的 `viewBox` 原点。

## 2. 为什么半像素会毁掉整幅

一个美术像素对应屏幕上 5×5 的一块。只要有任何一处元素落在半格（比如 `left: 82.5px`），浏览器就要在 82 和 83 之间插值，结果是每个美术像素块被切成两种颜色，5 倍放大后就是一条贯穿的灰边。一帧里有半像素，`check-pixel-frame` 立刻报错。

半像素最常见的五个来源，写之前先想一遍：

1. **居中**：`(w - textW) / 2`，宽度是奇数就落半格。用 `snapCenter()`，向下取整后再左对齐
2. **`flex` 与 `justify-content: center`**：浏览器自己算，你控制不了取整。像素层不用 flex 做定位，一律绝对定位 + 显式坐标
3. **`lineHeight` 写小数或百分数**：用整数逻辑像素，`leading` 参数默认等于字号
4. **`transform: translate()` 带小数**：相机推拉、滑动入场都要先把位移取整。宁可"跳一格"，不要"漂半格"
5. **SVG `viewBox` 与元素尺寸不同比**：`viewBox="0 0 384 216"` 配宽度 100%，比值必然是 5，不要在中间插一层带 padding 的容器

## 3. 连线

线只有一种做法：1 格宽的实心矩形。`wire.ts` 三个函数覆盖九成场景。

```ts
import { wireRoute, wireDrop, growWire, dirArrow, shiftRects } from '../kit'

// 横 → 竖 → 横。midX 是竖段所在的列
const segs = wireRoute({ x: 40, y: 60 }, { x: 120, y: 90 }, 80)

// 生长：distance 是已走过的格数，只在整数格截断
const grown = growWire(segs, 18)

// 箭头：tip 落在 (x, y)，len 是总线长，含 5 格箭头
const head = dirArrow(120, 90, 14, 'right')
```

规则：

- `from` / `to` 必须是真实节点的锚点坐标，不要凭空写一个数
- 竖段优先放在两个节点之间的空白处；`midX` 落在格上，不要贴着面板边框，留 2 格
- 生长动画用 `growWire`，配合 `staged` 给距离，不要用 `pathLength`（那是 stroke 的机制）
- 多条线并行时拉开至少 3 格，否则看起来是一条粗线。并行走线要错开拐弯列，避免全部堆在同一列

## 4. 字符格

等宽格子是这个引擎的主力：字节、指令、矩阵、表格、进度。

```ts
import { gridCells } from '../kit'

const cells = gridCells(8, 4, 12, 14) // 8 列 4 行，每格 12×14 逻辑像素
```

格子宽高取字体尺寸的整数倍（全角字 12 宽、行高 14），这样每格里塞一个字符正好对齐。列宽不要用"平分剩余空间"算出来，写死整数，再整体居中。

## 5. 安全区

```ts
import { SAFE } from '../kit'

SAFE = { x: 16, y: 28, w: 352, h: 146, bottom: 174 }
```

顶部 28 格留给 HUD 与章节标，底部 174 往下是字幕带。构图只在这中间。sprite 放大后容易顶到 HUD，入场前先算 `y + 16 * scale` 是否越过 174。

## 6. 两道闸门

### 静态闸：源码扫描

```bash
node scripts/lint-pixel.mjs <文件或目录>
```

拦柔化构造、手写字号、外层缩放。输出 `pixel issues: 0` 才算过。

### 动态闸：帧校验

```bash
node scripts/check-pixel-frame.mjs out/f150.png
```

判据两条，任何一条不满足就是没做到：

1. 每个 5×5 屏幕像素块必须同色
2. 一帧颜色数很少（一般 9~17 色，全部来自当前调色板）

两条都要过，不要只跑第一条。第二条能抓出"混进了一个不在调色板里的色"。

## 7. 出片：像素风必须避开有损编码

H.264 默认的 `yuv420p` 会在硬边上糊出色晕，一帧几百色，栅格全毁。所以出片分两种：

```bash
# 通用版：能双击播放，边缘有极轻微色晕
npx remotion render <Id> out/demo.mp4 --image-format=png --crf=12

# 像素真实版：VP9 无损 + yuv444p，抽帧复查能 100% 通过
npx remotion render <Id> out/demo.webm \
  --codec=vp9 --image-format=png --crf=0 --pixel-format=yuv444p
```

两条都必须带 `--image-format=png`：项目默认的 JPEG 中间帧在硬边上本身就会产生振铃。
