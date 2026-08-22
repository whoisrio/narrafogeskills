// 图坐标 / 路径工具
// 提取自 langgraph_concept/src/shared/graph/pathUtil.ts。

export interface Point {
  x: number;
  y: number;
}

// 生成一条边的 SVG path(带轻微弯曲,比直线更精致)
// direction: "horizontal" 走横向弯曲,"vertical" 走纵向弯曲,"straight" 直线
export function edgePath(
  from: Point,
  to: Point,
  direction: 'horizontal' | 'vertical' | 'straight' = 'horizontal',
  curvature: number = 0.3,
): string {
  if (direction === 'straight') {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (direction === 'horizontal') {
    const cx = dx * curvature;
    const c1 = {x: from.x + cx, y: from.y};
    const c2 = {x: to.x - cx, y: to.y};
    return `M ${from.x} ${from.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`;
  }
  // vertical
  const cy = dy * curvature;
  const c1 = {x: from.x, y: from.y + cy};
  const c2 = {x: to.x, y: to.y - cy};
  return `M ${from.x} ${from.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`;
}

// 生成一条回环弧线(用于 Generator-Evaluator 打回 / Agent Loop 反馈)
// 从 from 到 to 走一条向上凸起的弧线
export function loopPath(from: Point, to: Point, lift: number = 120): string {
  const midX = (from.x + to.x) / 2;
  const midY = Math.min(from.y, to.y) - lift;
  return `M ${from.x} ${from.y} Q ${midX} ${midY}, ${to.x} ${to.y}`;
}

// 计算贝塞尔路径上某个进度 t (0..1) 的点,用于 token 沿路径滑动
// 简化实现:仅支持 M + C 或 M + L 或 M + Q 三种
export function pointOnPath(path: string, t: number): Point {
  // 解析
  const cmd = path.match(/([MLCQ])\s*([-\d.,\s]+)/g);
  if (!cmd || cmd.length < 2) return {x: 0, y: 0};
  const [mCmd, mainCmd] = cmd;
  const parseNums = (s: string) =>
    s
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !isNaN(n));
  const [x0, y0] = parseNums(mCmd);
  const nums = parseNums(mainCmd);
  const type = mainCmd[0];
  if (type === 'L') {
    const [x1, y1] = nums;
    return {x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t};
  }
  if (type === 'Q') {
    const [cx, cy, x1, y1] = nums;
    const it = 1 - t;
    return {
      x: it * it * x0 + 2 * it * t * cx + t * t * x1,
      y: it * it * y0 + 2 * it * t * cy + t * t * y1,
    };
  }
  // C
  const [c1x, c1y, c2x, c2y, x1, y1] = nums;
  const it = 1 - t;
  return {
    x: it * it * it * x0 + 3 * it * it * t * c1x + 3 * it * t * t * c2x + t * t * t * x1,
    y: it * it * it * y0 + 3 * it * it * t * c1y + 3 * it * t * t * c2y + t * t * t * y1,
  };
}
