import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Point, edgePath, loopPath, pointOnPath} from './pathUtil';

// ============= 沿边流动的 token(SVG circle) =============
// 一个亮色小圆点,从边的起点滑到终点。用于数据流可视化。
// 提取自 langgraph_concept/src/shared/graph/TokenFlow.tsx。

export const TokenFlow: React.FC<{
  from: Point;
  to: Point;
  color: string;
  type?: 'solid' | 'loop';
  direction?: 'horizontal' | 'vertical' | 'straight';
  curvature?: number;
  loopLift?: number;
  appearAt: number; // 秒
  flowDur?: number; // 秒
  size?: number; // 半径 px,默认 8
  trail?: boolean; // 是否画一条淡淡的拖尾
}> = ({
  from,
  to,
  color,
  type = 'solid',
  direction = 'horizontal',
  curvature = 0.3,
  loopLift = 120,
  appearAt,
  flowDur = 1.0,
  size = 8,
  trail = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;
  const localSec = sec - appearAt;
  if (localSec < 0 || localSec > flowDur + 0.2) return null;

  const path =
    type === 'loop'
      ? loopPath(from, to, loopLift)
      : edgePath(from, to, direction, curvature);

  const t = Math.min(1, localSec / flowDur);
  const pt = pointOnPath(path, t);
  const opacity = interpolate(
    localSec,
    [0, 0.1, flowDur - 0.1, flowDur],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // 拖尾(更早的位置画一个更小更淡的点)
  const trailT = Math.max(0, t - 0.08);
  const trailPt = pointOnPath(path, trailT);
  const trail2T = Math.max(0, t - 0.16);
  const trail2Pt = pointOnPath(path, trail2T);

  return (
    <>
      {trail && trailT > 0 && (
        <circle
          cx={trail2Pt.x}
          cy={trail2Pt.y}
          r={size * 0.5}
          fill={color}
          opacity={opacity * 0.25}
        />
      )}
      {trail && (
        <circle
          cx={trailPt.x}
          cy={trailPt.y}
          r={size * 0.75}
          fill={color}
          opacity={opacity * 0.5}
        />
      )}
      <circle
        cx={pt.x}
        cy={pt.y}
        r={size}
        fill={color}
        opacity={opacity}
        style={{filter: `drop-shadow(0 0 8px ${color}80)`}}
      />
    </>
  );
};
