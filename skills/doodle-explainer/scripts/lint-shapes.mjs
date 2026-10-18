#!/usr/bin/env node
// sticker-explainer/scripts/lint-shapes.mjs
// 几何闸门 —— 对应 anatomy 的 lines.mjs / audit.mjs。
//
// 用法:
//   node lint-shapes.mjs <file|dir> [...]
//   node lint-shapes.mjs src/            # 扫描整个 Remotion 工程
//
// 退出码非 0 = 存在禁止的手写 path `d`(线乱的根因)。
// 目标输出: `line issues: 0`
//
// 查什么:
//   1. hand-written-literal : d="..." 裸字符串字面量 —— 一律禁止,必须走 shapes API
//   2. hand-written-expr    : d={...} 内不是 shapes 调用(且不变量/链式结果)—— 禁止
//   3. raw-bezier           : d={...} 内出现手写 C/Q 控制点 —— 必须用 smooth()
// 不查什么(由生成器结构性保证,无需静态推断):
//   - 闭合:shapes 的闭合函数强制 Z
//   - 落点:line/arrow/poly 两端锚定 Pt

import fs from 'node:fs';
import path from 'node:path';

const SHAPE_FNS = ['rrect', 'rect', 'line', 'polyline', 'poly', 'circle', 'ellipse', 'smooth', 'arrow'];

// 匹配 d="..." 与 d={...}（支持一层嵌套 {}）
const D_ATTR = /d\s*=\s*(?:"([^"]*)"|\{((?:[^{}]|\{[^{}]*\})*)\})/g;

function isShapesCall(expr) {
  return SHAPE_FNS.some((fn) => new RegExp(`\\b${fn}\\s*\\(`).test(expr));
}

function lineOf(src, idx) {
  return src.slice(0, idx).split('\n').length;
}

function lintFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const issues = [];
  let m;
  D_ATTR.lastIndex = 0;
  while ((m = D_ATTR.exec(src)) !== null) {
    const literal = m[1]; // d="..."
    const expr = m[2];    // d={...}
    if (literal !== undefined) {
      issues.push({
        line: lineOf(src, m.index),
        kind: 'hand-written-literal',
        detail: `d="${literal.slice(0, 36)}…"`,
      });
      continue;
    }
    if (expr !== undefined) {
      const e = expr.trim();
      const isVarOrChain = /^[A-Za-z_$][\w$]*$/.test(e) || /\.(shaft|head|d)$/.test(e);
      if (!isShapesCall(e) && !isVarOrChain) {
        issues.push({
          line: lineOf(src, m.index),
          kind: 'hand-written-expr',
          detail: `d={${e.slice(0, 36)}…}`,
        });
      }
      if (/[CcQq]\s*[\d.\-]/.test(e) && !isShapesCall(e)) {
        issues.push({
          line: lineOf(src, m.index),
          kind: 'raw-bezier',
          detail: 'hand-written cubic/quadratic bezier — use smooth()',
        });
      }
    }
  }
  return issues;
}

function collectFiles(targets) {
  const out = [];
  for (const t of targets) {
    let st;
    try {
      st = fs.statSync(t);
    } catch {
      console.error(`skip (not found): ${t}`);
      continue;
    }
    if (st.isDirectory()) {
      for (const f of fs.readdirSync(t, { recursive: true })) {
        const p = path.join(t, f);
        if (fs.statSync(p).isFile() && /\.(tsx?|jsx?)$/.test(p)) out.push(p);
      }
    } else {
      out.push(t);
    }
  }
  return out;
}

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('usage: node lint-shapes.mjs <file|dir> [...]');
  process.exit(2);
}

let total = 0;
for (const f of collectFiles(targets)) {
  const issues = lintFile(f);
  if (issues.length) {
    console.log(`✗ ${f}`);
    for (const i of issues) console.log(`   L${i.line}  [${i.kind}] ${i.detail}`);
    total += issues.length;
  } else {
    console.log(`✓ ${f}`);
  }
}
console.log(`\nline issues: ${total}`);
process.exit(total > 0 ? 1 : 0);
