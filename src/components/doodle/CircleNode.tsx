import React, {useMemo} from 'react';
import {RoughPaths, sketch} from '../../rough';
import {theme} from '../../theme';
import {useFloat, usePopIn} from '../../hooks/usePopIn';

interface CircleNodeProps {
  x: number;
  y: number;
  r?: number;
  fill?: string;
  dotFill?: string;
  delay?: number;
  seed?: number;
  floatPhase?: number;
}

// Concentric-circle doodle node: solid outer disc + smaller center dot.
export const CircleNode: React.FC<CircleNodeProps> = ({
  x,
  y,
  r = 64,
  fill = theme.PALETTE[3] ?? theme.PALETTE[0],
  dotFill = theme.PALETTE[2] ?? theme.PALETTE[0],
  delay = 0,
  seed = 60,
  floatPhase = 0,
}) => {
  const pop = usePopIn(delay);
  const floatY = useFloat(floatPhase);
  const size = r * 2 + 16;

  const paths = useMemo(() => {
    const g = sketch(seed);
    const c = size / 2;
    const base = {
      roughness: 0.7,
      stroke: theme.INK,
      strokeWidth: 3,
      fillStyle: 'solid' as const,
    };
    return [
      ...g.toPaths(g.ellipse(c, c, r * 2, r * 2, {...base, fill})),
      ...g.toPaths(g.ellipse(c, c, r * 0.5, r * 0.5, {...base, fill: dotFill})),
    ];
  }, [r, fill, dotFill, seed]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        opacity: pop.opacity,
        transform: `translateY(${pop.y + floatY}px) scale(${pop.scale})`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{position: 'absolute', overflow: 'visible'}}
      >
        <RoughPaths paths={paths} />
      </svg>
    </div>
  );
};
