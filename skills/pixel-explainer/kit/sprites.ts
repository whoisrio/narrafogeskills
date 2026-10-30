import type { InkKey } from './themes'

/**
 * 种子 sprite：15 张 16×16 手绘图。
 *
 * 字符即墨色：o 轮廓 / b 基础 / l 亮面 / s 暗面 / c 点缀 / . 透明。
 * 光一律从左上来 —— 全片统一打光方向。
 * ink 存的是语义键，不是 hex：换主题时 sprite 跟着变色，不用重画。
 *
 * 加新图：手写 16 行 × 16 字符，跑 assertSprites() 会挡下长度不对的。
 */

export const SPRITE_CHARS = ['o', 'b', 'l', 's', 'c'] as const
export type SpriteChar = (typeof SPRITE_CHARS)[number]

export type Sprite = {
  id: string
  label: string
  rows: readonly string[]
  ink: Record<SpriteChar, InkKey>
}

const FOLDER: Sprite = {
  id: 'folder',
  label: '文件夹',
  ink: { o: 'edge', b: 'accent', l: 'bone', s: 'os', c: 'data' },
  rows: [
      '................',
      '................',
      '..ooooooo.......',
      '..ollllllo......',
      '..ollllllo......',
      '..oooooooooooo..',
      '..ollllllllllo..',
      '..ollllllllllo..',
      '..obbbbbbbbbbo..',
      '..obccbbbbbbo...',
      '..osssssssssso..',
      '..oooooooooooo..',
      '................',
      '................',
      '................',
      '................',
  ],
}

const TERMINAL: Sprite = {
  id: 'terminal',
  label: '终端',
  ink: { o: 'edge', b: 'bgDeep', l: 'ash', s: 'line', c: 'evidence' },
  rows: [
      '................',
      '..oooooooooooo..',
      '..ollllllllllo..',
      '..obbbbbbbbbbo..',
      '..obcbbbbbbbo...',
      '..obbcbbbbbo....',
      '..obcbbbbbbbo...',
      '..obbbbbbbbbbo..',
      '..obccccbbbbbo..',
      '..obbbbbbbbbbo..',
      '..osssssssssso..',
      '..oooooooooooo..',
      '................',
      '................',
      '................',
      '................',
  ],
}

const DOCUMENT: Sprite = {
  id: 'document',
  label: '文件',
  ink: { o: 'edge', b: 'ash', l: 'bone', s: 'soot', c: 'agent' },
  rows: [
      '................',
      '...oooooooooo...',
      '...obbbbbbbbo...',
      '...obbbbbbbbo...',
      '...occbbccbbo...',
      '...obbbbbbbbo...',
      '...obbccbbcco...',
      '...obbbbbbbbo...',
      '...occcccccco...',
      '...osssssssso...',
      '...oooooooooo...',
      '................',
      '................',
      '................',
      '................',
      '................',
  ],
}

const DISK: Sprite = {
  id: 'disk',
  label: '磁盘',
  ink: { o: 'edge', b: 'data', l: 'bone', s: 'unknown', c: 'accent' },
  rows: [
      '................',
      '................',
      '...oooooooooo...',
      '...ollllllllo...',
      '...obbbbbbbbo...',
      '...obcccccbbo...',
      '...occcccccco...',
      '...obcccccbbo...',
      '...obbbbbbbbo...',
      '...ollllllllo...',
      '...oooooooooo...',
      '................',
      '................',
      '................',
      '................',
      '................',
  ],
}

const APP: Sprite = {
  id: 'app',
  label: '程序',
  ink: { o: 'edge', b: 'ash', l: 'accent', s: 'line', c: 'data' },
  rows: [
      '................',
      '..oooooooooooo..',
      '..ollllllllllo..',
      '..obbbbbbbbbbo..',
      '..obccbbbbbbbo..',
      '..obbbbbbbbbbo..',
      '..obbbbbbbbbbo..',
      '..obbbbbbbbbbo..',
      '..obbbbbbbbbbo..',
      '..obbbbbbbbbbo..',
      '..obbbbbbbbbbo..',
      '..osssssssssso..',
      '..oooooooooooo..',
      '................',
      '................',
      '................',
  ],
}

const CHIP: Sprite = {
  id: 'chip',
  label: 'CPU',
  ink: { o: 'edge', b: 'ash', l: 'accent', s: 'line', c: 'bone' },
  rows: [
      '................',
      '.......oo.......',
      '.......oo.......',
      '..o.oooooooo.o..',
      '..o.ollllllo.o..',
      '..o.obbbbbbo.o..',
      '..o.obccccbo.o..',
      '..o.obbbbbbo.o..',
      '..o.osssssso.o..',
      '..o.oooooooo.o..',
      '.......oo.......',
      '.......oo.......',
      '................',
      '................',
      '................',
      '................',
  ],
}

const BUG: Sprite = {
  id: 'bug',
  label: '虫子',
  ink: { o: 'edge', b: 'agent', l: 'bone', s: 'os', c: 'bone' },
  rows: [
      '................',
      '................',
      '....o.oo.o......',
      '.....oooo.......',
      '...ooobbooo.....',
      '..obbbbbbbbo....',
      '..obcbbbbcbo....',
      '..obbbbbbbbo....',
      '..obcbbbbcbo....',
      '..obbbbbbbbo....',
      '...oobbbboo.....',
      '..o.o.oo.o.o....',
      '.o..o....o..o...',
      '................',
      '................',
      '................',
  ],
}

const LOCK: Sprite = {
  id: 'lock',
  label: '锁',
  ink: { o: 'edge', b: 'data', l: 'bone', s: 'unknown', c: 'bone' },
  rows: [
      '................',
      '................',
      '......oooo......',
      '.....obbbbo.....',
      '.....obbbbo.....',
      '....oooooooo....',
      '...ollllllllo...',
      '...obbbbbbbbo...',
      '...obbbccbbbo...',
      '...obbbccbbbo...',
      '...obbbbbbbbo...',
      '...osssssssso...',
      '....oooooooo....',
      '................',
      '................',
      '................',
  ],
}

const BOOK: Sprite = {
  id: 'book',
  label: '手册',
  ink: { o: 'edge', b: 'evidence', l: 'bone', s: 'unknown', c: 'bone' },
  rows: [
      '................',
      '................',
      '..oooooooooooo..',
      '..obbbbbbbbbbo..',
      '..obllllllllbo..',
      '..obbbbbbbbbbo..',
      '..obllllllllbo..',
      '..obbbbbbbbbbo..',
      '..obccccccccbo..',
      '..obbbbbbbbbbo..',
      '..osssssssssso..',
      '..oooooooooooo..',
      '................',
      '................',
      '................',
      '................',
  ],
}

const HAND: Sprite = {
  id: 'hand',
  label: '手',
  ink: { o: 'edge', b: 'agent', l: 'bone', s: 'os', c: 'bone' },
  rows: [
      '................',
      '................',
      '.......oo.......',
      '......olbo......',
      '......obbo......',
      '..oo..obbo..oo..',
      '.obbo.obbo.obbo.',
      '.obboobbbboobbo.',
      '.olbbbbbbbbbbbo.',
      '..obbbbbbbbbbo..',
      '...obssssssbo...',
      '....oooooooo....',
      '................',
      '................',
      '................',
      '................',
  ],
}

const BOT: Sprite = {
  id: 'bot',
  label: '机器人',
  ink: { o: 'edge', b: 'agent', l: 'bone', s: 'os', c: 'bone' },
  rows: [
      '................',
      '.......oo.......',
      '.......oo.......',
      '....oooooooo....',
      '...ollllllllo...',
      '...obccbbccbo...',
      '...obbbbbbbbo...',
      '...obbbbbbbbo...',
      '..oobboooobboo..',
      '..obbbbbbbbbbo..',
      '...obbbbbbbbo...',
      '....oooooooo....',
      '................',
      '................',
      '................',
      '................',
  ],
}

const EYE: Sprite = {
  id: 'eye',
  label: '眼睛',
  ink: { o: 'edge', b: 'data', l: 'bone', s: 'unknown', c: 'bone' },
  rows: [
      '................',
      '................',
      '...oooo.........',
      '..ollllo........',
      '..obbbbo........',
      '..obbbbo........',
      '...oooo.........',
      '......oo........',
      '.......oo.......',
      '........oo......',
      '.........oo.....',
      '..........oo....',
      '................',
      '................',
      '................',
      '................',
  ],
}

const GEAR: Sprite = {
  id: 'gear',
  label: '引擎',
  ink: { o: 'edge', b: 'accent', l: 'bone', s: 'os', c: 'bone' },
  rows: [
      '................',
      '................',
      '....o.oooo.o....',
      '....o.olbo.o....',
      '...ooolbbbooo...',
      '...obllllbbbo...',
      '...obboooobso...',
      '...obboooobso...',
      '...obllllbbbo...',
      '...ooosbbbooo...',
      '....o.obso.o....',
      '....o.oooo.o....',
      '................',
      '................',
      '................',
      '................',
  ],
}

const PACKAGE: Sprite = {
  id: 'package',
  label: '外壳',
  ink: { o: 'edge', b: 'accent', l: 'bone', s: 'os', c: 'agent' },
  rows: [
      '................',
      '................',
      '..oooooooooooo..',
      '..ollllllllllo..',
      '..obbbbbbbbbbo..',
      '..obbbbbbbbbbo..',
      '..occcccccccco..',
      '..occcccccccco..',
      '..obbbbbbbbbbo..',
      '..obbbbbbbbbbo..',
      '..osssssssssso..',
      '..oooooooooooo..',
      '................',
      '................',
      '................',
      '................',
  ],
}

const SERVER: Sprite = {
  id: 'server',
  label: '服务端',
  ink: { o: 'edge', b: 'ash', l: 'ash', s: 'line', c: 'evidence' },
  rows: [
      '................',
      '..oooooooooooo..',
      '..ollllllllllo..',
      '..obccccccccbo..',
      '..obbbbbbbbbbo..',
      '..oooooooooooo..',
      '..ollllllllllo..',
      '..obccccccccbo..',
      '..obbbbbbbbbbo..',
      '..oooooooooooo..',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
  ],
}

export const SPRITES: Record<string, Sprite> = {
  folder: FOLDER,
  terminal: TERMINAL,
  document: DOCUMENT,
  disk: DISK,
  app: APP,
  chip: CHIP,
  bug: BUG,
  lock: LOCK,
  book: BOOK,
  hand: HAND,
  bot: BOT,
  eye: EYE,
  gear: GEAR,
  package: PACKAGE,
  server: SERVER,
}

export const SPRITE_LIST: readonly Sprite[] = [FOLDER, TERMINAL, DOCUMENT, DISK, APP, CHIP, BUG, LOCK, BOOK, HAND, BOT, EYE, GEAR, PACKAGE, SERVER]

/** 开发期校验：行数、行长、墨色齐全。写错一格立刻抛，不要等到渲染糊了才发现。 */
export const assertSprites = (list: readonly Sprite[] = SPRITE_LIST): void => {
  for (const s of list) {
    if (s.rows.length !== 16) throw new Error(`${s.id}：要有 16 行，实际 ${s.rows.length}`)
    s.rows.forEach((row, i) => {
      if (row.length !== 16) throw new Error(`${s.id} 第 ${i} 行：要 16 格，实际 ${row.length}`)
    })
    for (const ch of SPRITE_CHARS) {
      if (s.ink[ch] === undefined) throw new Error(`${s.id}：缺墨色 ${ch}`)
    }
  }
}
