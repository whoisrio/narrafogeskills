import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../../theme';

const parseHex = (h: string) => {
  const m = h.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  return m ? {r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16)} : {r: 0, g: 0, b: 0};
};
const blend = (a: string, b: string, t: number) => {
  const pa = parseHex(a);
  const pb = parseHex(b);
  const tt = Math.max(0, Math.min(1, t));
  const r = Math.round(pa.r + (pb.r - pa.r) * tt);
  const g = Math.round(pa.g + (pb.g - pa.g) * tt);
  const bl = Math.round(pa.b + (pb.b - pa.b) * tt);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
};

// Vector 向量盒:一行格子,每格一个值,逐格弹入。表示 embedding / 向量。
// 用普通 SVG rect(数据件精确可读),边框 INK,填充向色板混合的实色。
export const Vector: React.FC<{
  x: number;
  y: number;
  label: string;
  dimLabel?: string;
  values: string[];
  color?: string;
  cellSize?: number;
  gap?: number;
  delay?: number;
  seed?: number;
}> = ({x, y, label, dimLabel, values, color = theme.PALETTE[0], cellSize = 64, gap = 8, delay = 0, seed = 21}) => {
  void seed;
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const n = values.length;
  const totalW = n * cellSize + (n - 1) * gap;
  const fill = blend(theme.BG, color, 0.5);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{position: 'absolute', overflow: 'visible'}}
    >
      <text x={x} y={y - 14} fontFamily={theme.fontFamily} fontSize={22} fontWeight={800} fill={color}>
        {label}
      </text>
      {dimLabel && (
        <text
          x={x + totalW}
          y={y - 14}
          textAnchor="end"
          fontFamily="'JetBrains Mono', monospace"
          fontSize={16}
          fill={theme.INK}
          opacity={0.55}
        >
          {dimLabel}
        </text>
      )}
      {values.map((v, i) => {
        const d = delay + i * 4;
        const op = interpolate(frame, [d, d + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const s = interpolate(frame, [d, d + 10], [0.6, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const cx = x + i * (cellSize + gap) + cellSize / 2;
        const cy = y + cellSize / 2;
        return (
          <g key={i} opacity={op} transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}>
            <rect
              x={x + i * (cellSize + gap)}
              y={y}
              width={cellSize}
              height={cellSize}
              rx={8}
              fill={fill}
              stroke={theme.INK}
              strokeWidth={3}
            />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="'JetBrains Mono', monospace"
              fontSize={20}
              fontWeight={700}
              fill={theme.INK}
            >
              {v}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
