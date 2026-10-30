#!/usr/bin/env node
/**
 * 像素风动态闸门：一帧画面必须由整数倍的实心色块拼成。
 *
 *   node scripts/check-pixel-frame.mjs out/f150.png [--n=5]
 *
 * 判据：
 *   1) 每 N×N 个屏幕像素必须同色（否则说明有半像素位移 / 抗锯齿 / 缩放插值）
 *   2) 颜色数量必须很少（有限调色板；多了就是混进了渐变或 alpha）
 *
 * 退出码 1 = 不达标，可直接挂进 CI。
 * 依赖 ffmpeg / ffprobe：解成原始 RGB，避免给工程加图片解码依赖。
 */
import { execFileSync } from 'node:child_process'

const args = process.argv.slice(2)
const nArg = args.find((a) => a.startsWith('--n='))
const N = nArg ? Number(nArg.slice(4)) : 5
const maxArg = args.find((a) => a.startsWith('--max-colors='))
const MAX_COLORS = maxArg ? Number(maxArg.slice(13)) : 24
const files = args.filter((a) => !a.startsWith('--'))

if (files.length === 0) {
  console.error('用法：node scripts/check-pixel-frame.mjs <frame.png> [--n=5] [--max-colors=24]')
  process.exit(2)
}

const decode = (file) => {
  const probe = execFileSync('ffprobe', [
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=width,height',
    '-of',
    'csv=p=0',
    file,
  ])
    .toString()
    .trim()
  const [width, height] = probe.split(',').map(Number)
  const buf = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {
    maxBuffer: width * height * 4,
  })
  return { width, height, buf }
}

let failed = 0
for (const file of files) {
  const { width, height, buf } = decode(file)
  const px = (x, y) => {
    const i = (y * width + x) * 3
    return (buf[i] << 16) | (buf[i + 1] << 8) | buf[i + 2]
  }
  const colors = new Map()
  let broken = 0
  for (let by = 0; by + N <= height; by += N) {
    for (let bx = 0; bx + N <= width; bx += N) {
      const c = px(bx, by)
      colors.set(c, (colors.get(c) ?? 0) + 1)
      let uniform = true
      for (let dy = 0; dy < N && uniform; dy++) {
        for (let dx = 0; dx < N; dx++) {
          if (px(bx + dx, by + dy) !== c) {
            uniform = false
            break
          }
        }
      }
      if (!uniform) broken++
    }
  }
  const hex = (c) => `#${c.toString(16).padStart(6, '0')}`
  const top = [...colors.entries()].sort((a, b) => b[1] - a[1])
  const ok = broken === 0 && colors.size <= MAX_COLORS
  if (!ok) failed++
  console.log(`${ok ? '✓' : '✗'} ${file}`)
  console.log(`   ${width}×${height}  非整格色块 ${broken}  颜色数 ${colors.size}`)
  console.log(`   调色板：${top.slice(0, 12).map(([c]) => hex(c)).join(' ')}${top.length > 12 ? ' …' : ''}`)
  if (broken > 0) console.log('   ↑ 有抗锯齿或半像素位移，像素边缘被撕碎了')
  if (colors.size > MAX_COLORS) console.log('   ↑ 颜色太多，混进了渐变 / alpha / 插值缩放')
}

process.exit(failed > 0 ? 1 : 0)
