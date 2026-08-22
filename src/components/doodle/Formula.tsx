import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {theme} from '../../theme';

export type FormulaKind = 'var' | 'op' | 'num' | 'fn' | 'txt';

// Formula 公式:把数学式拆成 token,按类型上色(var=PALETTE / num=ACCENT / fn=ACCENT2 / op/txt=INK),
// 衬线/等宽大字渲染,可选给某个 token 画粗描边下划线强调。
// 用于 softmax / attention / loss 等 ML 公式。不做完整 LaTeX,保持手账风。
export const Formula: React.FC<{
  x: number;
  y: number;
  parts: {t: string; kind?: FormulaKind; sub?: string}[];
  size?: number;
  delay?: number;
  underlineIndex?: number; // 给第几个 token 画 ACCENT 下划线强调
}> = ({x, y, parts, size = 56, delay = 0, underlineIndex = -1}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const op = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const dy = interpolate(frame, [delay, delay + 12], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const colorFor = (kind: FormulaKind) =>
    kind === 'var'
      ? theme.PALETTE[0]
      : kind === 'num'
      ? theme.ACCENT[0]
      : kind === 'fn'
      ? theme.ACCENT[1] ?? theme.ACCENT[0]
      : theme.INK;

  // 估算每个 token 宽度(粗略,CJK≈size, latin≈0.55size)用于下划线定位
  let cursor = 0;
  const spans = parts.map((p, i) => {
    const w =
      [...p.t].reduce(
        (s, ch) => s + (ch.codePointAt(0)! > 0x2e7f ? size * 0.62 : size * 0.5),
        0,
      ) * 0.9;
    const start = cursor;
    cursor += w;
    return {...p, i, start, w, color: colorFor(p.kind ?? 'txt')};
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{position: 'absolute', overflow: 'visible'}}
    >
      <g opacity={op} transform={`translate(0 ${dy})`}>
        <text
          x={x}
          y={y}
          fontFamily="'JetBrains Mono', monospace"
          fontSize={size}
          fontWeight={700}
          fill={theme.INK}
        >
          {spans.map((s) => (
            <tspan key={s.i} fill={s.color}>
              {s.t}
              {s.sub && (
                <tspan fontSize={size * 0.6} dy={size * 0.25}>
                  {s.sub}
                </tspan>
              )}
              {s.sub && <tspan dy={-size * 0.25}> </tspan>}
            </tspan>
          ))}
        </text>
        {/* 强调下划线 */}
        {underlineIndex >= 0 && spans[underlineIndex] && (
          <line
            x1={x + spans[underlineIndex].start}
            y1={y + 14}
            x2={x + spans[underlineIndex].start + spans[underlineIndex].w}
            y2={y + 14}
            stroke={theme.ACCENT[0]}
            strokeWidth={6}
            strokeLinecap="round"
            opacity={interpolate(frame, [delay + 18, delay + 28], [0, 0.85], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}
          />
        )}
      </g>
    </svg>
  );
};
