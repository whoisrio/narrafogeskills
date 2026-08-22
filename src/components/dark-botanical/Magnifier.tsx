import {interpolate, useCurrentFrame} from 'remotion';
import {C} from './theme';

// Magnifier 放大聚焦:暗金风版。focusAt 时刻把子元素放大推到中心 + 金色发光 + 提层,
// focusDuration 后回落。讲解里「放大看这块细节」的高频招式。
export const Magnifier: React.FC<{
  children: React.ReactNode;
  focusAt: number; // 帧
  focusDuration?: number; // 帧
  maxScale?: number;
  centerOffsetY?: number;
  glowColor?: string;
  style?: React.CSSProperties;
}> = ({
  children,
  focusAt,
  focusDuration = 24,
  maxScale = 1.2,
  centerOffsetY = -40,
  glowColor = C.gold,
  style,
}) => {
  const frame = useCurrentFrame();
  const e0 = focusAt;
  const e1 = focusAt + 6;
  const e2 = focusAt + focusDuration - 6;
  const e3 = focusAt + focusDuration;

  const scale = interpolate(frame, [e0, e1, e2, e3], [1, maxScale, maxScale, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ty = interpolate(frame, [e0, e1, e2, e3], [0, centerOffsetY, centerOffsetY, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glow = interpolate(frame, [e0, e1, e2, e3], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const z = glow > 0.01 ? 50 : 1;
  const a = Math.round(Math.max(0, Math.min(1, glow * 0.4)) * 255)
    .toString(16)
    .padStart(2, '0');

  return (
    <div
      style={{
        transform: `translateY(${ty}px) scale(${scale})`,
        transformOrigin: 'center center',
        zIndex: z,
        position: 'relative',
        boxShadow: glow > 0.01 ? `0 ${glow * 14}px ${glow * 30}px ${glowColor}${a}` : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
