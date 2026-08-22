import React, {useMemo} from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {RoughPaths, roundedRectPath, sketch} from '../../rough';
import {theme} from '../../theme';
import {useFloat, usePopIn} from '../../hooks/usePopIn';

interface LinkedBlocksProps {
  x: number;
  y: number;
  blockSize?: number;
  gap?: number;
  colors?: string[];
  delay?: number;
  stagger?: number;
  seed?: number;
  withCard?: boolean;
  floatPhase?: number;
}

const PopBlock: React.FC<{
  cx: number;
  cy: number;
  size: number;
  color: string;
  delay: number;
  seed: number;
}> = ({cx, cy, size, color, delay, seed}) => {
  const pop = usePopIn(delay, 20);
  const paths = useMemo(() => {
    const g = sketch(seed);
    return g.toPaths(
      g.path(
        roundedRectPath(cx - size / 2, cy - size / 2, size, size, size * 0.22),
        {
          roughness: 0.6,
          stroke: theme.INK,
          strokeWidth: 2.5,
          fill: color,
          fillStyle: 'solid',
        }
      )
    );
  }, [cx, cy, size, color, seed]);

  return (
    <g
      opacity={pop.opacity}
      transform={`translate(${cx} ${cy}) scale(${pop.scale}) translate(${-cx} ${-cy})`}
    >
      <RoughPaths paths={paths} />
    </g>
  );
};

// A row of colored blocks joined by short connector lines,
// optionally on a white doodle card. Blocks pop in one by one.
export const LinkedBlocks: React.FC<LinkedBlocksProps> = ({
  x,
  y,
  blockSize = 64,
  gap = 26,
  colors = theme.PALETTE.slice(0, 4),
  delay = 0,
  stagger = 5,
  seed = 10,
  withCard = true,
  floatPhase = 0,
}) => {
  const frame = useCurrentFrame();
  const cardPop = usePopIn(delay);
  const floatY = useFloat(floatPhase);

  const n = colors.length;
  const rowW = n * blockSize + (n - 1) * gap;
  const pad = withCard ? blockSize * 0.85 : 14;
  const w = rowW + pad * 2;
  const h = blockSize + pad * 2;

  const paths = useMemo(() => {
    if (!withCard) return [];
    const g = sketch(seed);
    return g.toPaths(
      g.path(roundedRectPath(4, 4, w - 8, h - 8, 30), {
        roughness: 0.8,
        stroke: theme.INK,
        strokeWidth: 3,
        fill: theme.STICKER,
        fillStyle: 'solid',
      })
    );
  }, [withCard, w, h, seed]);

  const linePaths = useMemo(() => {
    const g = sketch(seed + 1);
    const cy = h / 2;
    const all = [];
    for (let i = 0; i < n - 1; i++) {
      const x1 = pad + i * (blockSize + gap) + blockSize;
      const x2 = pad + (i + 1) * (blockSize + gap);
      all.push(
        ...g.toPaths(
          g.line(x1, cy, x2, cy, {
            roughness: 0.5,
            stroke: theme.INK,
            strokeWidth: 3,
          })
        )
      );
    }
    return all;
  }, [n, blockSize, gap, pad, h, seed]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        transform: `translateY(${floatY}px)`,
      }}
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{position: 'absolute', overflow: 'visible'}}
      >
        <g
          opacity={withCard ? cardPop.opacity : 1}
          transform={`translate(${w / 2} ${h / 2}) scale(${
            withCard ? cardPop.scale : 1
          }) translate(${-w / 2} ${-h / 2})`}
        >
          <RoughPaths paths={paths} />
        </g>
        <g opacity={withCard ? 1 : cardPop.opacity}>
          {linePaths.length > 0 && (
            <g
              opacity={interpolate(
                frame,
                [delay + stagger, delay + stagger + 6],
                [0, 1],
                {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
              )}
            >
              <RoughPaths paths={linePaths} />
            </g>
          )}
          {colors.map((c, i) => (
            <PopBlock
              key={i}
              cx={pad + i * (blockSize + gap) + blockSize / 2}
              cy={h / 2}
              size={blockSize}
              color={c}
              delay={delay + (withCard ? 6 : 0) + i * stagger}
              seed={seed + 100 + i}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
