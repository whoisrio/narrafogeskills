#!/usr/bin/env node
/**
 * 像素风静态闸门：源码里混进一处柔化，整幅栅格就废了。
 *
 *   node scripts/lint-pixel.mjs src/ [更多路径...]
 *
 * 拦的是构造，不是审美：模糊、渐变、圆角、圆弧、alpha、spring/缓动、
 * 手写字号、临时 hex、非确定性随机。
 *
 * 通过时输出 `pixel issues: 0`，退出码 0；有问题逐条列行号，退出码 1。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, basename } from 'node:path'

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
if (args.length === 0) {
  console.error('用法：node scripts/lint-pixel.mjs <文件或目录>')
  process.exit(2)
}

/** 色源文件允许写 hex：调色板总得有个地方存色值 */
const HEX_ALLOWED = ['themes.ts']

const RULES = [
  { re: /blur\(/, why: '模糊会吃掉像素边缘，改用抖点或硬边' },
  { re: /filter\s*:/, why: 'filter 把栅格交给 GPU 采样，改用调色板换阶' },
  { re: /linear-gradient|radial-gradient/, why: '平滑渐变等于抗锯齿，改用抖点' },
  { re: /borderRadius\s*:\s*(?!0\b)\d/, why: '圆角不是像素语汇' },
  { re: /borderRadius\s*:\s*['"]\d/, why: '圆角不是像素语汇' },
  { re: /border-radius/, why: '圆角不是像素语汇' },
  { re: /<circle\b/, why: '圆弧会被抗锯齿，改用阶梯像素' },
  { re: /\brx=\{?["']?[1-9]/, why: '圆角矩形不是像素语汇' },
  { re: /strokeLinecap/, why: '圆形线帽不是像素语汇' },
  { re: /rgba\(/, why: '半透明不在有限调色板里，改用色阶或抖点' },
  { re: /opacity\s*:\s*0?\.\d/, why: '明暗靠调色板阶，不靠 alpha' },
  { re: /\bspring\(/, why: '像素动画是逐帧步进，不用 spring' },
  { re: /Easing\./, why: '像素动画是逐帧步进，不用连续缓动' },
  { re: /fontSize\s*:\s*\d/, why: '字号只走 t/T 两档，手写数字会被重新栅格化' },
  { re: /scale\(\s*\d+\.\d/, why: '缩放只能整数倍，小数倍会产生非整数边缘' },
  { re: /[≠✓✗]/, why: '字体回退会撕碎栅格，用 Block 拼或换说法' },
  { re: /Math\.random\(/, why: '伪随机要固定种子，否则第 3000 帧和预览不一样' },
  { re: /Date\.now\(/, why: '渲染必须逐帧可复现' },
]

const HEX = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/

/** 去掉注释，避免注释里写"禁 spring"被自己拦下；保留字符串，因为色值写在字符串里 */
const stripComments = (src) => {
  let out = ''
  let i = 0
  let quote = null
  while (i < src.length) {
    const c = src[i]
    const n = src[i + 1]
    if (quote) {
      out += c
      if (c === '\\') {
        out += n ?? ''
        i += 2
        continue
      }
      if (c === quote) quote = null
      i++
      continue
    }
    if (c === '"' || c === "'" || c === '`') {
      quote = c
      out += c
      i++
      continue
    }
    if (c === '/' && n === '/') {
      while (i < src.length && src[i] !== '\n') i++
      continue
    }
    if (c === '/' && n === '*') {
      i += 2
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++
      i += 2
      continue
    }
    out += c
    i++
  }
  return out
}

const walk = (p) => {
  const st = statSync(p)
  if (st.isFile()) return /\.(ts|tsx)$/.test(p) ? [p] : []
  return readdirSync(p).flatMap((name) => {
    if (name === 'node_modules' || name.startsWith('.')) return []
    return walk(join(p, name))
  })
}

const files = args.flatMap(walk)
if (files.length === 0) {
  console.error('没有找到 .ts/.tsx 文件')
  process.exit(2)
}

let issues = 0
for (const file of files) {
  const raw = readFileSync(file, 'utf8')
  const src = stripComments(raw)
  const lines = src.split('\n')
  const allowHex = HEX_ALLOWED.includes(basename(file))

  lines.forEach((line, idx) => {
    for (const rule of RULES) {
      if (rule.re.test(line)) {
        issues++
        console.log(`${file}:${idx + 1}  ${rule.re.source}  —— ${rule.why}`)
      }
    }
    if (!allowHex && HEX.test(line)) {
      issues++
      console.log(`${file}:${idx + 1}  硬编码色值 ${line.trim().slice(0, 60)} —— 改成主题语义键`)
    }
  })
}

console.log(`pixel issues: ${issues}`)
process.exit(issues === 0 ? 0 : 1)
