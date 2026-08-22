import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../../theme';

interface SplitDividerProps {
  x?: number;
  y1?: number;
  y2?: number;
  delay?: number;
  growFrames?: number;
  color?: string;
  strokeWidth?: number;
}

// Vertical dashed center divider that grows from top to bottom.
export const SplitDivider: React.FC<SplitDividerProps> = ({
  x,
  y1,
  y2,
  delay = 0,
  growFrames = 20,
  color = theme.INK,
  strokeWidth = 4,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cx = x ?? width / 2;
  const top = y1 ?? 60;
  const bottom = y2 ?? height - 60;

  const len = interpolate(frame, [delay, delay + growFrames], [0, bottom - top], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{position: 'absolute', overflow: 'visible'}}
    >
      <line
        x1={cx}
        y1={top}
        x2={cx}
        y2={top + len}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray="18 14"
        strokeLinecap="round"
      />
    </svg>
  );
};
