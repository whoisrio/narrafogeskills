import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from './theme';

// FlowArrow 流程箭头:暗金风 SVG 弯曲边 + 金色 arrow marker + dashoffset 绘制动画。
// 自带 AbsoluteFill SVG 图层(自包含),composition 作者直接放 <FlowNode>+<FlowArrow> 即可。
// type:solid 实线 / dashed 虚线(条件分支) / loop 回环弧(反馈回路);faded 变灰(未激活分支)。
export type DBEdgeType = 'solid' | 'dashed' | 'loop';

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

const loopPath = (from: {x: number; y: number}, to: {x: number; y: number}, lift = 120) => {
  const midX = (from.x + to.x) / 2;
  const midY = Math.min(from.y, to.y) - lift;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
};

export const FlowArrow: React.FC<{
  from: {x: number; y: number};
  to: {x: number; y: number};
  type?: DBEdgeType;
  color?: string;
  delay?: number; // 帧
  drawDur?: number; // 帧
  loopLift?: number;
  faded?: boolean;
}> = ({
  from,
  to,
  type = 'solid',
  color = C.gold,
  delay = 0,
  drawDur = 12,
  loopLift = 120,
  faded = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  void fps;
  const localFrame = frame - delay;
  if (localFrame < 0) return null;

  const path = type === 'loop' ? loopPath(from, to, loopLift) : curvePath(from, to, 0.2);
  const progress = Math.min(1, localFrame / drawDur);
  const totalLen = 1200;
  const dashOffset = totalLen * (1 - progress);
  const markerId = `db-arrow-${color.replace('#', '')}`;
  const op = faded ? 0.35 : interpolate(localFrame, [0, 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </marker>
        </defs>
        <path
          d={path}
          stroke={faded ? 'rgba(255,255,255,0.12)' : color}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={progress >= 1 ? '14 8' : type === 'dashed' ? '8 5' : `${totalLen}`}
          strokeDashoffset={progress >= 1 ? -frame * 0.9 : type === 'dashed' ? undefined : dashOffset}
          markerEnd={faded ? undefined : `url(#${markerId})`}
          opacity={op}
        />
      </svg>
    </AbsoluteFill>
  );
};
