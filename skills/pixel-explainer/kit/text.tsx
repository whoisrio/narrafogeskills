import React from 'react'
import { snapCenter, u } from './grid'
import { PIXEL_FONT_FAMILY } from './theme'
import { usePixel } from './theme'

/**
 * 像素文本。
 *
 * 两条比字号更重要的规则：
 * 1. 字号只能取字体原生尺寸的整数倍（12 / 24 逻辑像素），否则字形被重新栅格化。
 * 2. 对齐不能用 CSS 的 center/right：文字宽度常是奇数，(w - width) / 2 会落在半格上。
 *    这里按 12px 全角 / 6px 半角估算宽度，把起始 x 吸到整数逻辑像素，再一律左对齐。
 */

/** 单字前进宽度（逻辑像素）：ASCII 6，其余 12 */
export const advance = (ch: string): number => (ch.charCodeAt(0) < 0x7f ? 6 : 12)

const flatten = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flatten).join('')
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return flatten(node.props.children)
  return ''
}

/** 估算一行文字的宽度（逻辑像素），给布局算坐标用 */
export const estWidth = (node: React.ReactNode): number =>
  Array.from(flatten(node)).reduce((w, ch) => w + advance(ch), 0)

export const PIXEL_FONT = `"${PIXEL_FONT_FAMILY}", "Noto Sans SC", monospace`

export type PixelTextProps = {
  children: React.ReactNode
  /** 逻辑坐标 */
  x?: number
  y?: number
  /** 逻辑宽度（用于居中/右对齐/折行） */
  w?: number
  h?: number
  /** 字号阶梯：t = 12（原生），T = 24（整 2 倍） */
  size?: 't' | 'T'
  color?: string
  align?: 'left' | 'center' | 'right'
  wrap?: boolean
  /** 行高（逻辑像素），默认等于字号 */
  leading?: number
}

export const PixelText: React.FC<PixelTextProps> = ({
  children,
  x = 0,
  y = 0,
  w,
  h,
  size = 't',
  color,
  align = 'left',
  wrap = false,
  leading,
}) => {
  const theme = usePixel()
  const px = theme.type[size]
  const boxW = w ?? 0
  const textW = estWidth(children)
  const offset =
    align === 'center'
      ? snapCenter(boxW, textW)
      : align === 'right'
        ? Math.max(0, boxW - textW)
        : 0

  return (
    <div
      style={{
        position: 'absolute',
        left: u(x + offset),
        top: u(y),
        width: w === undefined ? undefined : u(w),
        height: h === undefined ? undefined : u(h),
        fontFamily: PIXEL_FONT,
        fontSize: u(px),
        lineHeight: `${u(leading ?? px)}px`,
        color: color ?? theme.palette.bone,
        textAlign: 'left',
        letterSpacing: 0,
        whiteSpace: wrap ? 'normal' : 'pre',
        wordBreak: 'keep-all',
        fontSynthesis: 'none',
        WebkitFontSmoothing: 'none',
        overflow: 'visible',
      }}
    >
      {children}
    </div>
  )
}

/** 大字号标题：整 2 倍，用来做章节题/钩子句，不做三级字阶 */
export const PixelTitle: React.FC<Omit<PixelTextProps, 'size'>> = (props) => (
  <PixelText {...props} size="T" />
)
