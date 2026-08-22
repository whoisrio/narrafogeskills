import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../../theme';

// Magnifier 放大聚焦:在 focusAt 时刻把子元素放大推到中心 + 发光 + 提层,
// focusDuration 后回落。讲解里「放大看这块细节」的高频招式。
// 提取自 attention_evolution MagnifierCard,简化为时序驱动的包装器。
export const Magnifier: React.FC<{
  children: React.ReactNode;
  focusAt: number; // 开始聚焦的帧
  focusDuration?: number; // 聚焦持续帧数(默认 24)
  maxScale?: number; // 默认 1.2
  centerOffsetY?: number; // 推向中心的纵向偏移(默认 -40)
  glowColor?: string;
  style?: React.CSSProperties;
}> = ({
  children,
  focusAt,
  focusDuration = 24,
  maxScale = 1.2,
  centerOffsetY = -40,
  glowColor = theme.ACCENT[0],
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

  return (
    <div
      style={{
        transform: `translateY(${ty}px) scale(${scale})`,
        transformOrigin: 'center center',
        zIndex: z,
        position: 'relative',
        boxShadow:
          glow > 0.01
            ? `0 ${glow * 14}px ${glow * 30}px ${glowColor}${Math.round(glow * 40)
                .toString(16)
                .padStart(2, '0')}`
            : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
