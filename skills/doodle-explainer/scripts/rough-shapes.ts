// doodle-explainer/scripts/rough-shapes.ts
// 几何原语生成器 —— doodle engine 唯一允许产出 SVG path `d` 字符串的入口。
//
// 与 sticker 的 shapes.ts 算法完全一致(保证闭合/落点/防过冲),额外针对 doodle 的
// rough.js 手绘特性加了两点:
//   1. roughSeed(...):由坐标派生【固定】seed,rough.js 抖动逐帧一致,消灭"逐帧闪烁/抖动乱跳"。
//   2. roughOpts(seed):统一 roughness/bowing,模型不再随手给随机 seed 或 Math.random。
//
// rough.js 的"手绘抖动"是叠加在【已闭合、已锚定、不过冲】的干净几何之上的——先有干净几何,
// 再有手绘质感。禁止先手写一段过冲的 `d` 再丢给 rough 美化,那是线乱的根因。
//
// 在 Remotion 项目中:复制到 `src/lib/rough-shapes.ts`,
// `import { rrect, line, arrow, circle, smooth, roughSeed, roughOpts } from '../lib/rough-shapes'`。
// lint-shapes.mjs 会校验:任何 `d` 字面量若不是本文件函数产出 → 报错。

export type Pt = { x: number; y: number };

const n = (v: number): number => Number(v.toFixed(2));

/** 圆角矩形(doodle 大圆角 ≥16px)。闭合。 */
export function rrect(x: number, y: number, w: number, h: number, r = 16): string {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  const X = n(x), Y = n(y), W = n(x + w), H = n(y + h);
  if (rr <= 0.01) {
    return `M${X} ${Y} H${W} V${H} H${X} Z`;
  }
  const r2 = n(rr);
  return [
    `M${n(x + rr)} ${Y}`,
    `H${n(x + w - rr)}`,
    `A${r2} ${r2} 0 0 1 ${W} ${n(y + rr)}`,
    `V${n(y + h - rr)}`,
    `A${r2} ${r2} 0 0 1 ${n(x + w - rr)} ${H}`,
    `H${n(x + rr)}`,
    `A${r2} ${r2} 0 0 1 ${X} ${n(y + h - rr)}`,
    `V${n(y + rr)}`,
    `A${r2} ${r2} 0 0 1 ${n(x + rr)} ${Y}`,
    'Z',
  ].join(' ');
}

/** 直角矩形。闭合。 */
export function rect(x: number, y: number, w: number, h: number): string {
  return rrect(x, y, w, h, 0);
}

/** 直线,两端锚定 a/b。 */
export function line(a: Pt, b: Pt): string {
  return `M${n(a.x)} ${n(a.y)} L${n(b.x)} ${n(b.y)}`;
}

/** 折线,依次连接各顶点,全部锚定。 */
export function polyline(points: Pt[]): string {
  if (points.length < 2) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${n(p.x)} ${n(p.y)}`).join(' ');
}

/** 闭合多边形。强制 `Z`。 */
export function poly(points: Pt[], close = true): string {
  const d = polyline(points);
  return close ? `${d} Z` : d;
}

/** 圆。闭合。 */
export function circle(cx: number, cy: number, r: number): string {
  const k = n(r * 0.5523);
  return [
    `M${n(cx - r)} ${n(cy)}`,
    `C${n(cx - r)} ${n(cy - k)} ${n(cx - k)} ${n(cy - r)} ${n(cx)} ${n(cy - r)}`,
    `C${n(cx + k)} ${n(cy - r)} ${n(cx + r)} ${n(cy - k)} ${n(cx + r)} ${n(cy)}`,
    `C${n(cx + r)} ${n(cy + k)} ${n(cx + k)} ${n(cy + r)} ${n(cx)} ${n(cy + r)}`,
    `C${n(cx - k)} ${n(cy + r)} ${n(cx - r)} ${n(cy + k)} ${n(cx - r)} ${n(cy)}`,
    'Z',
  ].join(' ');
}

/** 椭圆。闭合。 */
export function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  const kx = n(rx * 0.5523), ky = n(ry * 0.5523);
  return [
    `M${n(cx - rx)} ${n(cy)}`,
    `C${n(cx - rx)} ${n(cy - ky)} ${n(cx - kx)} ${n(cy - ry)} ${n(cx)} ${n(cy - ry)}`,
    `C${n(cx + kx)} ${n(cy - ry)} ${n(cx + rx)} ${n(cy - ky)} ${n(cx + rx)} ${n(cy)}`,
    `C${n(cx + rx)} ${n(cy + ky)} ${n(cx + kx)} ${n(cy + ry)} ${n(cx)} ${n(cy + ry)}`,
    `C${n(cx - kx)} ${n(cy + ry)} ${n(cx - rx)} ${n(cy + ky)} ${n(cx - rx)} ${n(cy)}`,
    'Z',
  ].join(' ');
}

/**
 * 平滑曲线,无过冲。Catmull-Rom 转 cubic bezier(张力 0.5),用于连接线/有机形。
 * 禁止手写 `C`/`Q` —— 那是控制点过冲→线乱/自交的根因。
 */
export function smooth(points: Pt[], close = false): string {
  if (points.length < 3) return poly(points, close);
  const p = points;
  const t = 0.5;
  let d = `M${n(p[0].x)} ${n(p[0].y)}`;
  const last = close ? p.length : p.length - 1;
  for (let i = 0; i < last; i++) {
    const p0 = p[(i - 1 + p.length) % p.length];
    const p1 = p[i];
    const p2 = p[(i + 1) % p.length];
    const p3 = p[(i + 2) % p.length];
    const c1x = p1.x + ((p2.x - p0.x) / 6) * t * 2;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * t * 2;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * t * 2;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * t * 2;
    d += ` C${n(c1x)} ${n(c1y)} ${n(c2x)} ${n(c2y)} ${n(p2.x)} ${n(p2.y)}`;
  }
  return close ? `${d} Z` : d;
}

/**
 * 带实心箭头的连线。返回 shaft(线) + head(填充三角),两端锚定 a/b。
 * 箭头两翼按方向垂直展开,绝不手写三角控制点。
 */
export function arrow(a: Pt, b: Pt, headSize = 12): { shaft: string; head: string } {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const px = -uy, py = ux;
  const wing = 0.5;
  const left = {
    x: b.x - ux * headSize + px * headSize * wing,
    y: b.y - uy * headSize + py * headSize * wing,
  };
  const right = {
    x: b.x - ux * headSize - px * headSize * wing,
    y: b.y - uy * headSize - py * headSize * wing,
  };
  const head = `M${n(b.x)} ${n(b.y)} L${n(left.x)} ${n(left.y)} L${n(right.x)} ${n(right.y)} Z`;
  const shaft = `M${n(a.x)} ${n(a.y)} L${n(b.x)} ${n(b.y)}`;
  return { shaft, head };
}

/**
 * 由坐标派生【固定】seed。把这条线的两个端点坐标喂进来,
 * rough.js 抖动就逐帧一致(不闪烁),且两端共享同一 seed 时线身连贯。
 * 绝不要用 Math.random()/Date.now() 当 seed。
 */
export function roughSeed(...nums: number[]): number {
  let h = 2166136261;
  const s = nums.map((v) => Math.round(v * 100)).join(',');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 100000;
}

/** 统一 rough.js 选项。roughness 0.5~0.8 之间,固定,不随手给。 */
export function roughOpts(seed: number, roughness = 0.6, bowing = 1): Record<string, unknown> {
  return { seed, roughness, bowing };
}
