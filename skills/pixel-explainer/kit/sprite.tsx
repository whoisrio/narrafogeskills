import React from 'react'
import { u } from './grid'
import { usePixel } from './theme'
import { SPRITE_CHARS, type Sprite } from './sprites'

/**
 * sprite 渲染：把同一墨色的横向连续像素合并成一条 path，
 * 一张 16×16 的图只剩 5 条 path，不是 256 个 rect。
 * crispEdges 关掉 SVG 抗锯齿 —— 边缘必须是整格，不能有灰边。
 */
const pathCache = new Map<string, string>()

const pathFor = (sprite: Sprite, ch: string): string => {
  const key = `${sprite.id}:${ch}`
  const hit = pathCache.get(key)
  if (hit !== undefined) return hit
  let d = ''
  sprite.rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      if (row[x] !== ch) {
        x++
        continue
      }
      let run = 1
      while (row[x + run] === ch) run++
      d += `M${x} ${y}h${run}v1h-${run}z`
      x += run
    }
  })
  pathCache.set(key, d)
  return d
}

export const PixelSprite: React.FC<{
  sprite: Sprite
  /** 逻辑坐标 */
  x: number
  y: number
  /** 整数倍放大 1..5，不做 1.7 这种 */
  scale?: number
  /** 全墨同色：受击白闪 / 剪影 / 未激活态 */
  flat?: string
}> = ({ sprite, x, y, scale = 1, flat }) => {
  const { palette } = usePixel()
  const size = 16 * scale
  const ink = (ch: (typeof SPRITE_CHARS)[number]): string =>
    ch === 'c' ? palette[sprite.ink.c] : palette[sprite.ink[ch]]

  return (
    <svg
      width={u(size)}
      height={u(size)}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      style={{ position: 'absolute', left: u(x), top: u(y), display: 'block' }}
    >
      {flat === undefined ? (
        SPRITE_CHARS.map((ch) => <path key={ch} d={pathFor(sprite, ch)} fill={ink(ch)} />)
      ) : (
        <path d={SPRITE_CHARS.map((ch) => pathFor(sprite, ch)).join('')} fill={flat} />
      )}
    </svg>
  )
}

/** sprite 在逻辑像素里的边长，布局算坐标时用 */
export const spriteSize = (scale = 1): number => 16 * scale
