// sticker-explainer/scripts/shapes.ts
// 几何原语生成器 —— sticker engine 唯一允许产出 SVG path `d` 字符串的入口。
//
// 铁律(对应 anatomy 的 kit 思想):
//   1. 闭合形状强制以 `Z` 结尾;
//   2. 线强制 `M a L b`,两端锚定到 Pt 坐标,绝不手敲控制点;
//   3. 平滑曲线只走 smooth()(Catmull-Rom 转 cubic bezier,张力 0.5 防过冲/防环),
//      不手写 `C`/`Q`,从根本上消灭"控制点过冲→线乱/自交"。
//
// 在 Remotion 项目中:把本文件复制到 `src/lib/shapes.ts`,
// 然后 `import { rrect, line, arrow, circle } from '../lib/shapes'`。
// lint-shapes.mjs 会校验:任何 `d` 字面量若不是本文件函数产出 → 报错。

export type Pt = { x: number; y: number };

const n = (v: number): number => Number(v.toFixed(2));

/** 圆角矩形(贴纸硬边方角 r=0,或主题固定小圆角)。闭合。 */
export function rrect(x: number, y: number, w: number, h: number, r = 0): string {
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

/** 直角矩形(方角贴纸)。闭合。 */
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
 * 注:生长动画用 shaft 的 `pathLength` 属性,head 在末端单独揭示。
 */
export function arrow(a: Pt, b: Pt, headSize = 12): { shaft: string; head: string } {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len; // 单位方向
  const px = -uy, py = ux;            // 垂直
  const wing = 0.5;                   // 半张角系数
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
