import React from 'react';
import rough from 'roughjs';
import type {Drawable, PathInfo} from 'roughjs/bin/core';

// Seeded rough.js generators, cached so every frame renders the exact same sketch.
const generators = new Map<number, ReturnType<typeof rough.generator>>();

export const sketch = (seed: number) => {
  let g = generators.get(seed);
  if (!g) {
    g = rough.generator({options: {seed}});
    generators.set(seed, g);
  }
  return g;
};

export const toPaths = (seed: number, drawable: Drawable): PathInfo[] =>
  sketch(seed).toPaths(drawable);

export const roundedRectPath = (
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): string => {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  return [
    `M ${x + rr} ${y}`,
    `L ${x + w - rr} ${y}`,
    `A ${rr} ${rr} 0 0 1 ${x + w} ${y + rr}`,
    `L ${x + w} ${y + h - rr}`,
    `A ${rr} ${rr} 0 0 1 ${x + w - rr} ${y + h}`,
    `L ${x + rr} ${y + h}`,
    `A ${rr} ${rr} 0 0 1 ${x} ${y + h - rr}`,
    `L ${x} ${y + rr}`,
    `A ${rr} ${rr} 0 0 1 ${x + rr} ${y}`,
    'Z',
  ].join(' ');
};

export const RoughPaths: React.FC<{paths: PathInfo[]}> = ({paths}) => (
  <>
    {paths.map((p, i) => {
      const hasFill = Boolean(p.fill) && p.fill !== 'none';
      return (
        <path
          key={i}
          // rough.js leaves ellipse/circle fill paths open and double-draws
          // them; close the path and use nonzero winding or the fill cancels
          // itself out under evenodd.
          d={hasFill && !/[Zz]\s*$/.test(p.d) ? `${p.d} Z` : p.d}
          fill={p.fill ?? 'none'}
          stroke={p.stroke ?? 'none'}
          strokeWidth={p.strokeWidth ?? 0}
          fillRule={hasFill ? 'nonzero' : 'evenodd'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    })}
  </>
);
