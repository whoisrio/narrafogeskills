import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C} from './theme';

// FlowToken 沿边流动的发光金点:从一个节点滑到另一个,带拖尾 + 发光。
// 配合 FlowArrow 用:箭头画完后放 token 流动,让 agent loop 真正"流"起来。
// type=loop 走回环弧(同 FlowArrow)。

const curvePath = (from: {x: number; y: number}, to: {x: number; y: number}, curvature = 0.2) => {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * len * curvature;
  const cy = my + ny * len * curvature;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
};
const loopPath = (from: {x: number; y: number}, to: {x: number; y: number}, lift = 80) => {
  const midX = (from.x + to.x) / 2;
  const midY = Math.min(from.y, to.y) - lift;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
};
// 二次贝塞尔上 t(0..1) 的点
const pointOnQuad = (from: {x: number; y: number}, ctrl: {x: number; y: number}, to: {x: number; y: number}, t: number) => {
  const it = 1 - t;
  return {x: it * it * from.x + 2 * it * t * ctrl.x + t * t * to.x, y: it * it * from.y + 2 * it * t * ctrl.y + t * t * to.y};
};
const ctrlOf = (path: string) => {
  const m = path.match(/Q ([\d.\-]+) ([\d.\-]+) /);
  return m ? {x: +m[1], y: +m[2]} : {x: 0, y: 0};
};

export const FlowToken: React.FC<{
  from: {x: number; y: number};
  to: {x: number; y: number};
  type?: 'solid' | 'loop';
  loopLift?: number;
  color?: string;
  size?: number; // 半径
  appearAt: number; // 帧
  flowDur?: number; // 帧
  repeat?: boolean; // 流完后是否循环再流(让回路常驻流动)
}> = ({from, to, type = 'solid', loopLift = 80, color = C.gold, size = 9, appearAt, flowDur = 18, repeat = false}) => {
  const frame = useCurrentFrame();
  const local = frame - appearAt;
  if (local < 0) return null;

  const path = type === 'loop' ? loopPath(from, to, loopLift) : curvePath(from, to, 0.2);
  const ctrl = ctrlOf(path);

  let t = local / flowDur;
  if (repeat) {
    t = t % 1; // 循环
  } else if (t > 1) return null;

  const op = interpolate(local, [0, 3, flowDur - 3, flowDur], [0, 1, 1, repeat ? 1 : 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (op <= 0.01 && !repeat) return null;

  const pt = pointOnQuad(from, ctrl, to, t);
  // 拖尾两点
  const trail1 = pointOnQuad(from, ctrl, to, Math.max(0, t - 0.1));
  const trail2 = pointOnQuad(from, ctrl, to, Math.max(0, t - 0.2));

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {t - 0.2 > 0 && <circle cx={trail2.x} cy={trail2.y} r={size * 0.45} fill={color} opacity={op * 0.25} />}
        {t - 0.1 > 0 && <circle cx={trail1.x} cy={trail1.y} r={size * 0.7} fill={color} opacity={op * 0.5} />}
        <circle cx={pt.x} cy={pt.y} r={size} fill={color} opacity={op} style={{filter: `drop-shadow(0 0 8px ${color})`}} />
      </svg>
    </AbsoluteFill>
  );
};
