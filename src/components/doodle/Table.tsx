import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {RoughPaths, roundedRectPath, sketch} from '../../rough';
import {theme} from '../../theme';
import {useFadeIn} from '../../hooks/usePopIn';

// Table 表格:粗描边手绘网格表,表头 ACCENT 底 + 数据行 STICKER 底,逐行弹入。
// 表示结构化数据 / 参数对比 / 配置项。highlightRow 用 PALETTE 色突出某行。
export const Table: React.FC<{
  x: number;
  y: number;
  headers: string[];
  rows: string[][];
  colWidths?: number[];
  rowHeight?: number;
  delay?: number;
  seed?: number;
  highlightRow?: number; // 数据行索引(0-based),-1 不高亮
}> = ({
  x,
  y,
  headers,
  rows,
  colWidths,
  rowHeight = 56,
  delay = 0,
  seed = 66,
  highlightRow = -1,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cols = headers.length;
  const cw = colWidths ?? Array(cols).fill(180);
  const totalW = cw.reduce((s, w) => s + w, 0);
  const totalH = (rows.length + 1) * rowHeight;

  // 列 x 偏移
  const colX = useMemo(() => {
    const arr = [0];
    for (let i = 0; i < cols - 1; i++) arr.push(arr[i] + cw[i]);
    return arr;
  }, [cw, cols]);

  // 预生成每格 rough rect
  const cellPaths = useMemo(() => {
    const g = sketch(seed);
    const all: {paths: ReturnType<typeof g.toPaths>; fill: string}[][] = [];
    // 表头行
    const headerRow = headers.map((_, c) => ({
      paths: g.toPaths(
        g.rectangle(colX[c], 0, cw[c], rowHeight, {
          roughness: 0.7,
          stroke: theme.INK,
          strokeWidth: 3,
          fill: theme.ACCENT[0],
          fillStyle: 'solid',
        }),
      ),
      fill: theme.ACCENT[0],
    }));
    all.push(headerRow);
    // 数据行
    rows.forEach((r, ri) => {
      const isHl = ri === highlightRow;
      const rowArr = r.map((_, c) => ({
        paths: g.toPaths(
          g.rectangle(colX[c], 0, cw[c], rowHeight, {
            roughness: 0.7,
            stroke: theme.INK,
            strokeWidth: 2.5,
            fill: isHl ? theme.PALETTE[2] : theme.STICKER,
            fillStyle: 'solid',
          }),
        ),
        fill: isHl ? theme.PALETTE[2] : theme.STICKER,
      }));
      all.push(rowArr);
    });
    return all;
  }, [headers, rows, colX, cw, rowHeight, highlightRow, seed]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{position: 'absolute', overflow: 'visible'}}
    >
      {cellPaths.map((row, ri) => {
        const rowDelay = delay + ri * 8;
        const op = interpolate(frame, [rowDelay, rowDelay + 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        const dy = interpolate(frame, [rowDelay, rowDelay + 10], [14, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        if (op <= 0.01) return null;
        const isHeader = ri === 0;
        const rowY = y + ri * rowHeight;
        return (
          <g key={ri} opacity={op} transform={`translate(0 ${dy})`}>
            {row.map((cell, c) => (
              <g key={c} transform={`translate(${x} ${rowY})`}>
                <RoughPaths paths={cell.paths} />
                <text
                  x={colX[c] + cw[c] / 2}
                  y={rowHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily={theme.fontFamily}
                  fontSize={isHeader ? 22 : 20}
                  fontWeight={isHeader ? 900 : 600}
                  fill={isHeader ? theme.badgeText : theme.INK}
                >
                  {isHeader ? headers[c] : rows[ri - 1][c]}
                </text>
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
};

// 消除 unused 警告(totalW/totalH 留作未来边框用)
void 0;
