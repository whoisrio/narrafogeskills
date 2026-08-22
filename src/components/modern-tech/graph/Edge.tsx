import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Point, edgePath, loopPath} from './pathUtil';

// ============= 边(SVG path) =============
// 注意:此组件必须放在 <svg> 内使用(配合 GraphScene)
// 提取自 langgraph_concept/src/shared/graph/Edge.tsx。

export type EdgeType = 'solid' | 'dashed' | 'loop';

export const GraphEdge: React.FC<{
  from: Point;
  to: Point;
  type?: EdgeType;
  direction?: 'horizontal' | 'vertical' | 'straight';
  curvature?: number;
  color?: string;
  appearAt?: number; // 秒
  drawDur?: number; // 秒
  loopLift?: number; // 回环弧线的凸起高度
  faded?: boolean; // 变灰(Router 未激活分支)
}> = ({
  from,
  to,
  type = 'solid',
  direction = 'horizontal',
  curvature = 0.3,
  color = '#4a453e',
  appearAt = 0,
  drawDur = 0.4,
  loopLift = 120,
  faded = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;

  const localSec = sec - appearAt;
  if (localSec < 0) return null;

  const path =
    type === 'loop'
      ? loopPath(from, to, loopLift)
      : edgePath(from, to, direction, curvature);

  // 用 dasharray + dashoffset 做绘制动画
  const drawProgress = Math.min(1, localSec / drawDur);
  const totalLen = 1000; // 大概估计,dasharray 会剪掉溢出部分
  const dashOffset = totalLen * (1 - drawProgress);

  return (
    <>
      <path
        d={path}
        stroke={faded ? 'rgba(0,0,0,0.12)' : color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={type === 'dashed' ? '8 5' : `${totalLen}`}
        strokeDashoffset={type === 'dashed' ? undefined : dashOffset}
        markerEnd={faded ? undefined : `url(#arrow-${color.replace('#', '')})`}
        opacity={
          faded
            ? 0.4
            : interpolate(localSec, [0, 0.15], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
        }
      />
    </>
  );
};

// 一个 arrow marker 定义(放在 <defs> 里)
export const EdgeArrowMarker: React.FC<{color: string}> = ({color}) => (
  <marker
    id={`arrow-${color.replace('#', '')}`}
    viewBox="0 0 10 10"
    refX="8"
    refY="5"
    markerWidth="6"
    markerHeight="6"
    orient="auto-start-reverse"
  >
    <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
  </marker>
);
