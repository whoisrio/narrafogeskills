import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../../theme';

// hex 解析 + 向 theme.BG 混合的实色(数据件用普通 rect 填充,不用 rough.js)
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

// Matrix 矩阵:带强度着色的格子矩阵,逐格 reveal,cell 填充按 |值|/maxAbs 向色板混合。
// 表示 attention / 权重 / 特征矩阵。用普通 SVG rect(数据件要精确可读,手绘感靠边框/网格承载)。
export const Matrix: React.FC<{
  x: number;
  y: number;
  label: string;
  rowDim?: string;
  colDim?: string;
  data: number[][];
  color?: string;
  cellSize?: number;
  gap?: number;
  delay?: number;
  seed?: number;
  showValues?: boolean;
}> = ({
  x,
  y,
  label,
  rowDim,
  colDim,
  data,
  color = theme.PALETTE[0],
  cellSize = 56,
  gap = 6,
  delay = 0,
  seed = 33,
  showValues = true,
}) => {
  void seed;
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const rows = data.length;
  const cols = data[0]?.length ?? 0;
  const total = rows * cols;
  const maxAbs = Math.max(...data.flat().map(Math.abs), 0.01);
  const reveal = interpolate(frame, [delay, delay + total * 2 + 8], [0, total], {
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
      <text x={x} y={y - 16} fontFamily={theme.fontFamily} fontSize={22} fontWeight={800} fill={color}>
        {label}
      </text>
      {rowDim && colDim && (
        <text
          x={x + cols * (cellSize + gap) - gap}
          y={y - 16}
          textAnchor="end"
          fontFamily="'JetBrains Mono', monospace"
          fontSize={16}
          fill={theme.INK}
          opacity={0.55}
        >
          {rowDim} × {colDim}
        </text>
      )}
      {data.map((row, r) =>
        row.map((val, c) => {
          const idx = r * cols + c;
          const cellAlpha =
            reveal >= idx
              ? interpolate(reveal, [idx, idx + 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
              : 0;
          if (cellAlpha <= 0.01) return null;
          const intensity = Math.abs(val) / maxAbs;
          const fill = blend(theme.BG, color, 0.15 + intensity * 0.65);
          const cx = x + c * (cellSize + gap);
          const cy = y + r * (cellSize + gap);
          return (
            <g key={`${r}-${c}`} opacity={cellAlpha}>
              <rect
                x={cx}
                y={cy}
                width={cellSize}
                height={cellSize}
                rx={6}
                fill={fill}
                stroke={theme.INK}
                strokeWidth={2.5}
              />
              {showValues && (
                <text
                  x={cx + cellSize / 2}
                  y={cy + cellSize / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize={16}
                  fontWeight={700}
                  fill={theme.INK}
                >
                  {val.toFixed(1)}
                </text>
              )}
            </g>
          );
        }),
      )}
    </svg>
  );
};
