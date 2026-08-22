import React, {useMemo} from 'react';
import {RoughPaths, roundedRectPath, sketch} from '../../rough';
import {theme} from '../../theme';
import {useFloat, usePopIn} from '../../hooks/usePopIn';

interface WrenchGearProps {
  x: number;
  y: number;
  size?: number;
  fill?: string;
  wrenchFill?: string;
  delay?: number;
  seed?: number;
  floatPhase?: number;
}

const polar = (cx: number, cy: number, r: number, a: number) =>
  `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;

// Gear silhouette: trapezoid teeth on a root circle, as one closed polygon.
const gearPath = (
  cx: number,
  cy: number,
  rOuter: number,
  rRoot: number,
  teeth: number
): string => {
  const step = (Math.PI * 2) / teeth;
  const parts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const pts: Array<[number, number]> = [
      [rRoot, a],
      [rOuter, a + step * 0.16],
      [rOuter, a + step * 0.36],
      [rRoot, a + step * 0.52],
      [rRoot, a + step * 0.76],
    ];
    for (const [r, ang] of pts) {
      parts.push(`${parts.length === 0 ? 'M' : 'L'} ${polar(cx, cy, r, ang)}`);
    }
  }
  return parts.join(' ') + ' Z';
};

// Open-end wrench in a local frame: origin at jaw center, mouth facing +x,
// handle extending towards -x. Jaw is a ring sector (C shape); the inner arc
// winds opposite to the outer one so nonzero fill leaves the hole open.
const wrenchPath = (
  headR: number,
  mouthDeg: number,
  handleLen: number,
  handleW: number
): string => {
  const m = (mouthDeg * Math.PI) / 180;
  const ri = headR * 0.62;
  const jaw = [
    `M ${polar(0, 0, headR, m)}`,
    `A ${headR} ${headR} 0 1 1 ${polar(0, 0, headR, -m)}`,
    `L ${polar(0, 0, ri, -m)}`,
    `A ${ri} ${ri} 0 1 0 ${polar(0, 0, ri, m)}`,
    'Z',
  ].join(' ');
  const handle = roundedRectPath(
    -handleLen,
    -handleW,
    handleLen + headR * 0.4,
    handleW * 2,
    handleW
  );
  return `${jaw} ${handle}`;
};

// Wrench + gear doodle icon, the "tools" node. Hand-written SVG paths,
// sketched by rough.js like every other code-drawn element.
export const WrenchGear: React.FC<WrenchGearProps> = ({
  x,
  y,
  size = 240,
  fill = theme.PALETTE[4] ?? theme.PALETTE[0],
  wrenchFill = theme.PALETTE[2] ?? theme.PALETTE[0],
  delay = 0,
  seed = 90,
  floatPhase = 0,
}) => {
  const pop = usePopIn(delay);
  const floatY = useFloat(floatPhase);

  const paths = useMemo(() => {
    const g = sketch(seed);
    const c = size / 2;
    const R = size * 0.32;
    const base = {
      roughness: 0.6,
      stroke: theme.INK,
      strokeWidth: 3,
      fillStyle: 'solid' as const,
    };

    // wrench local frame: jaw center up-right of the gear, handle crossing it
    const headR = size * 0.13;
    const d = R * 0.72;
    const hx = c + Math.SQRT1_2 * d;
    const hy = c - Math.SQRT1_2 * d;
    const wrench = wrenchPath(headR, 55, size * 0.34, size * 0.045);

    return {
      gear: g.toPaths(
        g.path(gearPath(c, c, R, R * 0.74, 8), {...base, fill})
      ),
      hub: g.toPaths(
        g.ellipse(c, c, R * 0.6, R * 0.6, {...base, fill: theme.STICKER})
      ),
      wrench: g.toPaths(g.path(wrench, {...base, fill: wrenchFill})),
      wrenchTransform: `translate(${hx} ${hy}) rotate(-45)`,
    };
  }, [size, fill, wrenchFill, seed]);

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
        <RoughPaths paths={paths.gear} />
        <RoughPaths paths={paths.hub} />
        <g transform={paths.wrenchTransform}>
          <RoughPaths paths={paths.wrench} />
        </g>
      </svg>
    </div>
  );
};
