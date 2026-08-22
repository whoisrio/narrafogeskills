import React, {useId} from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../../theme';
import {useFadeIn} from '../../hooks/usePopIn';

interface DashedArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bend?: number;
  delay?: number;
  color?: string;
  strokeWidth?: number;
  // Grow the path from start to end instead of fading in.
  grow?: boolean;
  growFrames?: number;
}

// Curved dashed arc arrow; dashes slowly march forward to suggest direction.
export const DashedArrow: React.FC<DashedArrowProps> = ({
  x1,
  y1,
  x2,
  y2,
  bend = 60,
  delay = 0,
  color = theme.INK,
  strokeWidth = 4,
  grow = false,
  growFrames = 15,
}) => {
  const frame = useCurrentFrame();
  const fade = useFadeIn(delay, 8);
  const clipId = useId();

  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * bend;
  const cy = my + ny * bend;

  const pad = 50;
  const minX = Math.min(x1, x2, cx) - pad;
  const minY = Math.min(y1, y2, cy) - pad;
  const w = Math.max(x1, x2, cx) - minX + pad;
  const h = Math.max(y1, y2, cy) - minY + pad;

  const angle = (Math.atan2(y2 - cy, x2 - cx) * 180) / Math.PI;
  const head = 16;

  // Grow mode: reveal the path with an animated clip rect along the
  // dominant start->end axis; the arrowhead pops on at the end.
  const t = grow
    ? interpolate(frame, [delay, delay + growFrames], [0, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;
  const headOpacity = grow
    ? interpolate(t, [0.85, 1], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  const horizontal = Math.abs(dx) >= Math.abs(dy);
  let clipRect: {x: number; y: number; width: number; height: number};
  if (horizontal) {
    const boundary = x1 - minX + dx * t;
    clipRect =
      dx >= 0
        ? {x: 0, y: 0, width: boundary, height: h}
        : {x: boundary, y: 0, width: w - boundary, height: h};
  } else {
    const boundary = y1 - minY + dy * t;
    clipRect =
      dy >= 0
        ? {x: 0, y: 0, width: w, height: boundary}
        : {x: 0, y: boundary, width: w, height: h - boundary};
  }

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        position: 'absolute',
        left: minX,
        top: minY,
        overflow: 'visible',
        opacity: grow ? (frame >= delay ? 1 : 0) : fade,
      }}
    >
      {grow && (
        <clipPath id={clipId}>
          <rect {...clipRect} />
        </clipPath>
      )}
      <g clipPath={grow ? `url(#${clipId})` : undefined}>
        <path
          d={`M ${x1 - minX} ${y1 - minY} Q ${cx - minX} ${cy - minY} ${
            x2 - minX
          } ${y2 - minY}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray="16 14"
          strokeDashoffset={-frame * 1.1}
          strokeLinecap="round"
        />
      </g>
      <g
        transform={`translate(${x2 - minX} ${y2 - minY}) rotate(${angle})`}
        opacity={headOpacity}
      >
        <polygon
          points={`0,0 ${-head * 1.4},${-head * 0.75} ${-head * 1.4},${
            head * 0.75
          }`}
          fill={color}
        />
      </g>
    </svg>
  );
};
