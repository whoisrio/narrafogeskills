/**
 * 像素栅格：全片唯一允许的坐标来源。
 *
 * 输出仍是 1920×1080，但一切按「美术像素」思考：
 * 1 个美术像素 = N 个屏幕像素，逻辑画布 384×216。
 * 所有布局数字都写逻辑像素，经 u() 换到屏幕像素；
 * u() 拒绝非整数 —— 半个像素会把边缘撕成灰边（抗锯齿）。
 *
 * 不做「外层 div scale(N)」：那一层一旦被 GPU 提升成合成层，
 * 文字会按 CSS 像素栅格化再位图放大，中文立刻糊。
 */

/** 一个美术像素占几个屏幕像素。固定 5，不做响应式缩放。 */
export const N = 5

/** 逻辑画布尺寸（美术像素） */
export const W = 1920 / N
export const H = 1080 / N

/** 逻辑像素 → 屏幕像素。只接受非负整数。 */
export const u = (n: number): number => {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error(`u(${n})：像素风只允许非负整数逻辑坐标，否则会撕碎栅格`)
  }
  return n * N
}

/** 动画步进：像素动画是逐帧的，30fps 下每 2 帧一个动画帧（15fps 手感） */
export const HOLD = 2

/** 硬闪：只在开/关之间跳，没有中间态 */
export const blink = (frame: number, hold = 8): boolean => Math.floor(frame / hold) % 2 === 0

/** 打字机：每 hold 帧吐一个字，开始之前一个字都不漏 */
export const typewriter = (frame: number, start: number, hold: number, text: string): string => {
  const n = Math.floor((frame - start) / hold)
  return n <= 0 ? '' : text.slice(0, n)
}

/** 打字机已吐出的字数（给游标判断用） */
export const typedCount = (frame: number, start: number, hold: number, total: number): number => {
  const n = Math.floor((frame - start) / hold)
  return Math.max(0, Math.min(total, n))
}

/**
 * 阶梯取值：给定 [起始帧, 值] 的台阶列表，返回当前台阶。
 * 不做插值 —— 像素动画是「停 4 帧、跳一下」，不是连续过渡。
 */
export const staged = <T,>(frame: number, steps: readonly (readonly [number, T])[]): T => {
  let value = steps[0][1]
  for (const [at, v] of steps) if (frame >= at) value = v
  return value
}

/** 4×4 Bayer 矩阵：抖点消融 / 抖点阴影的阈值表，值域 0..15 */
export const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const

/** 抖点消融：progress 0→1 时，像素按 Bayer 阈值逐个消失 */
export const ditheredIn = (x: number, y: number, progress: number): boolean =>
  BAYER[((y % 4) + 4) % 4][((x % 4) + 4) % 4] / 16 < progress

/** 均匀网格：把 cols×rows 个格子铺在原点，用于 hex dump / 字符格 / 矩阵 */
export type Cell = { i: number; col: number; row: number; x: number; y: number; w: number; h: number }

export const gridCells = (cols: number, rows: number, cw: number, ch: number): Cell[] => {
  const cells: Cell[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({ i: row * cols + col, col, row, x: col * cw, y: row * ch, w: cw, h: ch })
    }
  }
  return cells
}

/**
 * 居中的整数偏移：文字宽度常是奇数，(w - textW) / 2 会落在半格。
 * 一律向下取整到整数逻辑像素，再交给左对齐去画。
 */
export const snapCenter = (boxW: number, contentW: number): number =>
  Math.max(0, Math.floor((boxW - contentW) / 2))

/**
 * 内容安全区：顶部 28 格留 HUD 与章节标，174 往下是字幕带。
 * 构图只在这中间；sprite 放大后先算 y + 16 * scale 有没有越线。
 */
export const SAFE = { x: 16, y: 28, w: W - 32, h: 146, bottom: 174 } as const
