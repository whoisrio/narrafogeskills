/**
 * 像素连线：不用 SVG stroke（会骑在 0.5px 上，5× 放大后是一条灰边），
 * 一律拆成 1px 宽的实心矩形，端点全落在整数格上。
 * 阶梯走线（横 → 竖 → 横）是这个画风的「线路板」语汇。
 */

export type Rect = { x: number; y: number; w: number; h: number }
export type Point = { x: number; y: number }
export type Dir = 'right' | 'down' | 'up' | 'left'

const int = (n: number, what: string): number => {
  if (!Number.isInteger(n)) throw new Error(`wire：${what} 必须是整数格（收到 ${n}）`)
  return n
}

export const rectLen = (r: Rect): number => Math.max(r.w, r.h)

/** 从 from 拉到 to：横到 midX、竖到目标高度、再横进目标 */
export const wireRoute = (from: Point, to: Point, midX: number): Rect[] => {
  int(from.x, 'from.x')
  int(from.y, 'from.y')
  int(to.x, 'to.x')
  int(to.y, 'to.y')
  int(midX, 'midX')
  const segs: Rect[] = [
    { x: from.x, y: from.y, w: midX - from.x, h: 1 },
    { x: midX, y: Math.min(from.y, to.y), w: 1, h: Math.abs(to.y - from.y) },
    { x: midX, y: to.y, w: to.x - midX, h: 1 },
  ]
  return segs.filter((s) => s.w > 0 && s.h > 0)
}

/** 先竖后横：适合上下对齐的节点对（左列落到右行） */
export const wireDrop = (from: Point, to: Point, midY: number): Rect[] => {
  int(from.x, 'from.x')
  int(from.y, 'from.y')
  int(to.x, 'to.x')
  int(to.y, 'to.y')
  int(midY, 'midY')
  return [
    { x: from.x, y: from.y, w: 1, h: midY - from.y },
    { x: Math.min(from.x, to.x), y: midY, w: Math.abs(to.x - from.x), h: 1 },
    { x: to.x, y: midY, w: 1, h: to.y - midY },
  ].filter((s) => s.w > 0 && s.h > 0)
}

/** 按长度生长：只在整数格上截断，绝不出现半格 */
export const growWire = (segs: readonly Rect[], distance: number): Rect[] => {
  let left = Math.max(0, Math.floor(distance))
  const out: Rect[] = []
  for (const seg of segs) {
    if (left <= 0) break
    const len = rectLen(seg)
    const take = Math.min(len, left)
    if (take <= 0) break
    out.push(
      seg.w === 1
        ? { x: seg.x, y: seg.y, w: 1, h: take }
        : { x: seg.x, y: seg.y, w: take, h: seg.h },
    )
    left -= take
  }
  return out
}

/** 1px 头 + 硬边三角头；tip 就是箭尖所在的那一格 */
export const dirArrow = (x: number, y: number, len: number, dir: Dir): Rect[] => {
  int(x, 'x')
  int(y, 'y')
  int(len, 'len')
  const shaft = len - 5
  const chevron: Rect[] =
    dir === 'right'
      ? [
          { x: x - 6, y: y - 3, w: 2, h: 1 },
          { x: x - 4, y: y - 2, w: 2, h: 1 },
          { x: x - 2, y: y - 1, w: 2, h: 3 },
          { x: x - 4, y: y + 1, w: 2, h: 1 },
          { x: x - 6, y: y + 2, w: 2, h: 1 },
        ]
      : dir === 'down'
        ? [
            { x: x - 3, y: y - 6, w: 1, h: 2 },
            { x: x - 2, y: y - 4, w: 1, h: 2 },
            { x: x - 1, y: y - 2, w: 3, h: 2 },
            { x: x + 1, y: y - 4, w: 1, h: 2 },
            { x: x + 2, y: y - 6, w: 1, h: 2 },
          ]
        : dir === 'up'
          ? [
              { x: x - 3, y: y + 4, w: 1, h: 2 },
              { x: x - 2, y: y + 2, w: 1, h: 2 },
              { x: x - 1, y: y, w: 3, h: 2 },
              { x: x + 1, y: y + 2, w: 1, h: 2 },
              { x: x + 2, y: y + 4, w: 1, h: 2 },
            ]
          : [
              { x: x + 4, y: y - 3, w: 2, h: 1 },
              { x: x + 2, y: y - 2, w: 2, h: 1 },
              { x: x, y: y - 1, w: 2, h: 3 },
              { x: x + 2, y: y + 1, w: 2, h: 1 },
              { x: x + 4, y: y + 2, w: 2, h: 1 },
            ]
  if (shaft <= 0) return chevron
  const stem: Rect =
    dir === 'right'
      ? { x: x - len, y, w: shaft, h: 1 }
      : dir === 'down'
        ? { x, y: y - len, w: 1, h: shaft }
        : dir === 'up'
          ? { x, y: y + 5, w: 1, h: shaft }
          : { x: x + 5, y, w: shaft, h: 1 }
  return [stem, ...chevron]
}

/** 把一串矩形平移，方便把一段走线整体挪位 */
export const shiftRects = (rects: readonly Rect[], dx: number, dy: number): Rect[] =>
  rects.map((r) => ({ ...r, x: r.x + dx, y: r.y + dy }))
