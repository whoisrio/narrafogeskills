import React, {useMemo} from 'react';
import {RoughPaths, sketch} from '../../rough';
import {theme} from '../../theme';
import {useFloat, usePopIn} from '../../hooks/usePopIn';

interface DatabaseCylinderProps {
  x: number;
  y: number;
  w?: number;
  h?: number;
  fill?: string;
  lidFill?: string;
  delay?: number;
  seed?: number;
  floatPhase?: number;
}

// Classic database cylinder doodle: solid body + sketched top lid.
export const DatabaseCylinder: React.FC<DatabaseCylinderProps> = ({
  x,
  y,
  w = 250,
  h = 200,
  fill = theme.PALETTE[4] ?? theme.PALETTE[0],
  lidFill = theme.PALETTE[5] ?? theme.STICKER,
  delay = 0,
  seed = 7,
  floatPhase = 0,
}) => {
  const pop = usePopIn(delay);
  const floatY = useFloat(floatPhase);

  const ry = w * 0.17;
  const pad = 12;
  const svgW = w + pad * 2;
  const svgH = h + ry * 2 + pad * 2;

  const paths = useMemo(() => {
    const g = sketch(seed);
    const x0 = pad;
    const x1 = pad + w;
    const yTop = pad + ry;
    const yBot = pad + ry + h;
    const base = {
      roughness: 0.7,
      stroke: theme.INK,
      strokeWidth: 3,
      fillStyle: 'solid' as const,
    };
    return [
      // body (sweep 0 -> bottom arc bulges downward)
      ...g.toPaths(
        g.path(
          `M ${x0} ${yTop} L ${x0} ${yBot} A ${w / 2} ${ry} 0 0 0 ${x1} ${yBot} L ${x1} ${yTop} Z`,
          {...base, fill}
        )
      ),
      // top lid
      ...g.toPaths(
        g.ellipse(pad + w / 2, yTop, w, ry * 2, {...base, fill: lidFill})
      ),
    ];
  }, [w, h, ry, fill, lidFill, seed]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x - svgW / 2,
        top: y - svgH / 2,
        width: svgW,
        height: svgH,
        opacity: pop.opacity,
        transform: `translateY(${pop.y + floatY}px) scale(${pop.scale})`,
      }}
    >
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{position: 'absolute', overflow: 'visible'}}
      >
        <RoughPaths paths={paths} />
      </svg>
    </div>
  );
};
