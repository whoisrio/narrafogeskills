/**
 * 像素主题：每套主题就是一份有限调色板 + 一套语义映射。
 *
 * 硬规则：
 * 1. 组件只能从 palette 取色，不许出现硬编码 hex。
 * 2. 调色板色数封顶 20，明暗只有阶，没有 alpha、没有渐变。
 * 3. 色值全部来自公开的像素调色板（PICO-8 / CGA / DawnBringer 16），未编造。
 */

/** 语义键：组件只认这些名字，不认具体色值 */
export type InkKey =
  | 'bg'
  | 'bgDeep'
  | 'panel'
  | 'edge'
  | 'line'
  | 'lineHi'
  | 'soot'
  | 'ash'
  | 'bone'
  | 'accent'
  | 'code'
  | 'data'
  | 'os'
  | 'protect'
  | 'agent'
  | 'evidence'
  | 'unknown'

export type PixelPalette = {
  /** 画布底 */
  bg: string
  /** 更深的凹槽底（井/背景板） */
  bgDeep: string
  /** 面板底 */
  panel: string
  /** 1 格边框 */
  line: string
  /** 高亮边框 / 选中态 */
  lineHi: string
  /** 轮廓墨色（比 line 更硬） */
  edge: string
  /** 文字阶：暗 */
  soot: string
  /** 文字阶：中 */
  ash: string
  /** 文字阶：亮（正文与字幕） */
  bone: string
  /** 主强调色 */
  accent: string
  /** 语义色：代码 / 数据 / 系统 / 防护 / 智能体 / 证据 / 未知 */
  code: string
  data: string
  os: string
  protect: string
  agent: string
  evidence: string
  unknown: string
}

export type PixelTheme = {
  id: string
  label: string
  scheme: 'dark' | 'light'
  /** 一句话调性，给 brief 选主题用 */
  mood: string
  /** 色源出处（真实性可按此复查） */
  source: string
  palette: PixelPalette
  /** 字号阶梯：只有字体原生尺寸与它的整 2 倍 */
  type: { t: 12; T: 24 }
}

const TYPE = { t: 12, T: 24 } as const

/** PICO-8 官方 16 色。技术/机器/代码题材的默认主题。 */
export const PICO8: PixelTheme = {
  id: 'pico8',
  label: 'PICO-8 夜',
  scheme: 'dark',
  mood: '机器、代码、终端、系统内部',
  source: 'PICO-8 官方调色板（16 色，lexaloffle）',
  palette: {
    bg: '#1D2B53',
    bgDeep: '#000000',
    panel: '#000000',
    line: '#5F574F',
    lineHi: '#83769C',
    edge: '#000000',
    soot: '#5F574F',
    ash: '#C2C3C7',
    bone: '#FFF1E8',
    accent: '#FFEC27',
    code: '#FFEC27',
    data: '#29ADFF',
    os: '#FFA300',
    protect: '#FF004D',
    agent: '#FF77A8',
    evidence: '#00E436',
    unknown: '#83769C',
  },
  type: TYPE,
}

/** CGA 16 色（palette 1 高亮）。80 年代 PC 的母语，色块极硬。 */
export const CGA: PixelTheme = {
  id: 'cga',
  label: 'CGA 白昼',
  scheme: 'dark',
  mood: '复古 PC、硬件、四位色对撞',
  source: 'IBM CGA 16 色调色板 1（高亮）',
  palette: {
    bg: '#000000',
    bgDeep: '#000000',
    panel: '#0000AA',
    line: '#555555',
    lineHi: '#AAAAAA',
    edge: '#555555',
    soot: '#555555',
    ash: '#AAAAAA',
    bone: '#FFFFFF',
    accent: '#55FFFF',
    code: '#FFFF55',
    data: '#55FFFF',
    os: '#AAAAAA',
    protect: '#FF5555',
    agent: '#FF55FF',
    evidence: '#55FF55',
    unknown: '#555555',
  },
  type: TYPE,
}

/** DawnBringer 16：低饱和、偏土，适合长时间讲述与文档感内容。 */
export const DB16: PixelTheme = {
  id: 'db16',
  label: 'DB16 褐',
  scheme: 'dark',
  mood: '档案、克制、低饱和、长时间讲述',
  source: 'DawnBringer 16 调色板',
  palette: {
    bg: '#140C1C',
    bgDeep: '#140C1C',
    panel: '#30346D',
    line: '#4E4A4E',
    lineHi: '#757161',
    edge: '#4E4A4E',
    soot: '#757161',
    ash: '#8595A1',
    bone: '#DEEED6',
    accent: '#DAD45E',
    code: '#DAD45E',
    data: '#6DC2CA',
    os: '#D2AA99',
    protect: '#D04648',
    agent: '#D27D2C',
    evidence: '#6DAA2C',
    unknown: '#757161',
  },
  type: TYPE,
}

export const PIXEL_THEMES: Record<string, PixelTheme> = {
  pico8: PICO8,
  cga: CGA,
  db16: DB16,
}

/** 引擎默认主题：brief 没写 themeRef 时用它 */
export const DEFAULT_THEME = PICO8

/** 按 id 取主题；未知 id 直接抛错，避免悄悄回退到默认色 */
export const themeById = (id: string): PixelTheme => {
  const hit = PIXEL_THEMES[id]
  if (hit === undefined) {
    throw new Error(`未知像素主题 "${id}"，可选：${Object.keys(PIXEL_THEMES).join(' / ')}`)
  }
  return hit
}
