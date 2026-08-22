import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {RoughPaths, sketch} from '../../rough';
import {theme} from '../../theme';

// TokenSequence token 流:一行手绘圆点 token(T0..Tn),
// activeToken 高亮放大 + ACCENT 描边,可选 attention 弧线从 active 指向历史 token。
// 表示 LLM 的 token 序列与注意力范围。提取自 attention_evolution TokenSequence,
// 渲染改为 doodle 粗描边圆点。
export const TokenSequence: React.FC<{
  x: number;
  y: number;
  count: number;
  activeToken?: number; // -1 = 无激活
  delay?: number;
  showAttention?: boolean;
  windowSize?: number; // 注意力窗口
  tokenSize?: number; // 直径
  gap?: number;
  labels?: string[]; // 可选自定义标签(默认 T0..Tn)
  seed?: number;
}> = ({
  x,
  y,
  count,
  activeToken = -1,
  delay = 0,
  showAttention = true,
  windowSize = 4,
  tokenSize = 64,
  gap = 28,
  labels,
  seed = 44,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const step = tokenSize + gap;

  // 每个圆点的 rough path(两种:普通 / 激活)
  const paths = useMemo(() => {
    const g = sketch(seed);
    const r = tokenSize / 2;
    return Array.from({length: count}).map((_, i) => {
      const isActive = i === activeToken;
      return g.toPaths(
        g.ellipse(0, 0, tokenSize, tokenSize, {
          roughness: 0.7,
          stroke: theme.INK,
          strokeWidth: isActive ? 4 : 3,
          fill: isActive ? theme.ACCENT[0] : theme.STICKER,
          fillStyle: 'solid',
        }),
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, tokenSize, seed, activeToken]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{position: 'absolute', overflow: 'visible'}}
    >
      {/* attention 弧线:active -> 历史窗口内 token */}
      {showAttention &&
        activeToken > 0 &&
        Array.from({length: Math.min(windowSize, activeToken)}).map((_, k) => {
          const tgt = activeToken - k - 1;
          const startX = x + tgt * step + tokenSize / 2;
          const endX = x + activeToken * step + tokenSize / 2;
          const startY = y + tokenSize / 2;
          const endY = y + tokenSize / 2;
          const midY = startY - 50 - k * 10;
          const g = sketch(seed + k + 100);
          const lineOpacity = interpolate(
            frame,
            [delay + 20 + k * 4, delay + 35 + k * 4],
            [0, 0.6 - k * 0.1],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)},
          );
          if (lineOpacity <= 0.01) return null;
          const linePaths = g.toPaths(
            g.path(`M ${startX} ${startY} Q ${(startX + endX) / 2} ${midY} ${endX} ${endY}`, {
              roughness: 0.6,
              stroke: theme.PALETTE[0],
              strokeWidth: 2.5,
              fill: 'none',
              fillStyle: 'solid',
            }),
          );
          return (
            <g key={`arc-${tgt}`} opacity={lineOpacity}>
              <RoughPaths paths={linePaths} />
            </g>
          );
        })}

      {Array.from({length: count}).map((_, i) => {
        const cellDelay = delay + i * 3;
        const isActive = i === activeToken;
        const inWindow =
          activeToken >= 0 && i >= activeToken - windowSize && i <= activeToken && !isActive;
        const isFuture = activeToken >= 0 && i > activeToken;
        const op = interpolate(frame, [cellDelay, cellDelay + 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const baseOpacity = isActive ? 1 : inWindow ? 0.85 : isFuture ? 0.35 : 0.6;
        const scale = isActive
          ? interpolate(frame, [cellDelay, cellDelay + 14], [1, 1.18], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.back(1.5)),
            })
          : 1;
        const cx = x + i * step + tokenSize / 2;
        const cy = y + tokenSize / 2;
        return (
          <g
            key={i}
            opacity={op * baseOpacity}
            transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}
          >
            <RoughPaths paths={paths[i]} />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={theme.fontFamily}
              fontSize={20}
              fontWeight={900}
              fill={isActive ? theme.badgeText : theme.INK}
            >
              {labels?.[i] ?? `T${i}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
