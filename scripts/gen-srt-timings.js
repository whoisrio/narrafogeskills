#!/usr/bin/env node
// SRT 预解析脚本: 读 SRT 文件 -> 生成 TS 模块(时长+cues)
// 用法: node scripts/gen-srt-timings.ts <srt文件> <key名> [fps]
// 例: node scripts/gen-srt-timings.ts public/audio/02.srt srt_02 30
// 输出: src/generated/srt-timings.ts (追加)

const fs = require('fs');
const path = require('path');

function parseSRT(content) {
  const blocks = content.trim().split('\n\n');
  return blocks.map((block, i) => {
    const lines = block.split('\n');
    const m = lines[1].match(/(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/);
    if (!m) throw new Error(`Invalid SRT block ${i}`);
    const toSec = (h,mi,s,ms) => h*3600 + mi*60 + s + ms/1000;
    const startSec = toSec(+m[1],+m[2],+m[3],+m[4]);
    const endSec = toSec(+m[5],+m[6],+m[7],+m[8]);
    return {
      index: i,
      text: lines.slice(2).join(' '),
      startSec,
      endSec,
    };
  });
}

function genTimings(srtContent, fps = 30) {
  const subs = parseSRT(srtContent);
  const cues = subs.map(s => ({
    index: s.index,
    text: s.text,
    startSec: s.startSec,
    endSec: s.endSec,
    startFrame: Math.round(s.startSec * fps),
    endFrame: Math.round(s.endSec * fps),
    durationFrames: Math.round((s.endSec - s.startSec) * fps),
  }));
  return {
    cues,
    totalDuration: cues.length > 0 ? cues[cues.length - 1].endFrame : 0,
    fps,
  };
}

// CLI
const srtPath = process.argv[2];
const keyName = process.argv[3] || 'srt_default';
const fps = parseInt(process.argv[4] || '30', 10);

if (!srtPath) {
  console.error('用法: node scripts/gen-srt-timings.ts <srt文件> <key名> [fps]');
  console.error('例: node scripts/gen-srt-timings.ts public/audio/02.srt srt_02 30');
  process.exit(1);
}

const content = fs.readFileSync(srtPath, 'utf-8');
const timings = genTimings(content, fps);

// 输出到 src/generated/srt-timings.ts
const outDir = path.join(__dirname, '..', 'src', 'generated');
fs.mkdirSync(outDir, {recursive: true});
const outFile = path.join(outDir, 'srt-timings.ts');

// 读取已有内容(追加模式)
let existing = '';
if (fs.existsSync(outFile)) {
  existing = fs.readFileSync(outFile, 'utf-8');
  // 删掉同名的 export(重新生成)
  const regex = new RegExp(`\\/\\/ === ${keyName} ===[\\s\\S]*?(?=\\/\\/ === |$)`, 'g');
  existing = existing.replace(regex, '');
}

const newExport = `// === ${keyName} === (auto-generated from ${srtPath}, do not edit)
export const ${keyName} = ${JSON.stringify(timings, null, 2)} as const;

`;

const output = (existing.trim() ? existing.trim() + '\n\n' : '') + newExport;
fs.writeFileSync(outFile, output);

console.log(`Generated: src/generated/srt-timings.ts -> ${keyName}`);
console.log(`  cues: ${timings.cues.length}`);
console.log(`  totalDuration: ${timings.totalDuration} frames (${(timings.totalDuration / fps).toFixed(1)}s)`);
console.log(`  fps: ${fps}`);
