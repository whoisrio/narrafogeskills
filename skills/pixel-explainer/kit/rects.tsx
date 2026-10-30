import React from 'react'
import { H, W, u } from './grid'
import type { Rect } from './wire'

/**
 * 矩形图元：像素风的所有形状最终都是这一层。
 *
 * 这里只收"算错了看不出来"的部分：批量矩形的 SVG 合并、八段条括号、抖点虚线。
 * 面板、底色、字幕带这类"几行 div + 1 格边框"的东西由使用方按规范写，不进库。
 */

/** 单块色块。量小就走了 div，别为了一个矩形开 SVG。 */
export const Block: React.FC<{ x: number; y: number; w: number; h: number; fill: string }> = ({
  x,
  y,
  w,
  h,
  fill,
}) => {
  if (w <= 0 || h <= 0) return null
  return (
    <div
      style={{ position: 'absolute', left: u(x), top: u(y), width: u(w), height: u(h), background: fill }}
    />
  )
}

/** 一组实心矩形，全在一个 SVG 里画，保证边缘落在整格 */
export const Rects: React.FC<{ groups: readonly { rects: readonly Rect[]; fill: string }[] }> = ({
  groups,
}) => (
  <svg
    width="100%"
    height="100%"
    viewBox={`0 0 ${W} ${H}`}
    shapeRendering="crispEdges"
    style={{ position: 'absolute', inset: 0, display: 'block' }}
  >
    {groups.map((g, gi) => (
      <g key={gi} fill={g.fill}>
        {g.rects.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} />
        ))}
      </g>
    ))}
  </svg>
)

/** 选中括号：8 段实心条，拐角各长一格。用来指认"这一段"，不要整块换色。 */
export const Bracket: React.FC<{
  x: number
  y: number
  w: number
  h: number
  color: string
  len?: number
}> = ({ x, y, w, h, color, len = 6 }) => {
  const bars: Rect[] = [
    { x, y, w: len, h: 1 },
    { x, y, w: 1, h: len },
    { x: x + w - len, y, w: len, h: 1 },
    { x: x + w - 1, y, w: 1, h: len },
    { x, y: y + h - 1, w: len, h: 1 },
    { x, y: y + h - len, w: 1, h: len },
    { x: x + w - len, y: y + h - 1, w: len, h: 1 },
    { x: x + w - 1, y: y + h - len, w: 1, h: len },
  ]
  return <Rects groups={[{ rects: bars, fill: color }]} />
}

/** 抖点虚线：CSS 的 dashed 相位不落在格上，会出半格，所以自己排点 */
export const Dotted: React.FC<{
  x: number
  y: number
  len: number
  color: string
  gap?: number
  dir?: 'h' | 'v'
}> = ({ x, y, len, color, gap = 2, dir = 'h' }) => {
  const rects: Rect[] = []
  for (let i = 0; i < len; i += gap) {
    rects.push(dir === 'h' ? { x: x + i, y, w: 1, h: 1 } : { x, y: y + i, w: 1, h: 1 })
  }
  return <Rects groups={[{ rects, fill: color }]} />
}

/** 点阵底纹：只在需要"桌面 / 空白 / 未占用"的场景出现，属装饰层 */
export const DotField: React.FC<{ step?: number; y0?: number; color: string }> = ({
  step = 16,
  y0 = 32,
  color,
}) => {
  const rows = Math.max(0, Math.floor((H - y0 - 12) / step))
  const cols = Math.max(0, Math.floor((W - 24) / step))
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      shapeRendering="crispEdges"
      style={{ position: 'absolute', inset: 0 }}
    >
      {Array.from({ length: rows }, (_, ry) =>
        Array.from({ length: cols }, (_, rx) => (
          <rect key={`${rx}-${ry}`} x={12 + rx * step} y={y0 + ry * step} width={1} height={1} fill={color} />
        )),
      )}
    </svg>
  )
}
