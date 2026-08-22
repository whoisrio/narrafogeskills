import React, {useMemo} from 'react';
import {RoughPaths, sketch} from '../../rough';
import {theme} from '../../theme';
import {useFloat, usePopIn} from '../../hooks/usePopIn';

interface StepBadgeProps {
  x: number;
  y: number;
  n: number;
  size?: number;
  fill?: string;
  textColor?: string;
  delay?: number;
  seed?: number;
  floatPhase?: number;
}

// Circular step-number badge: thick-outlined circle + heavy numeral.
export const StepBadge: React.FC<StepBadgeProps> = ({
  x,
  y,
  n,
  size = 76,
  fill = theme.STICKER,
  textColor = theme.INK,
  delay = 0,
  seed = 50,
  floatPhase = 0,
}) => {
  const pop = usePopIn(delay);
  const floatY = useFloat(floatPhase);

  const paths = useMemo(() => {
    const g = sketch(seed + n);
    const c = size / 2;
    return g.toPaths(
      g.ellipse(c, c, size - 8, size - 8, {
        roughness: 0.7,
        stroke: theme.INK,
        strokeWidth: 3,
        fill,
        fillStyle: 'solid',
      })
    );
  }, [size, fill, seed, n]);

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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: textColor,
          fontSize: size * 0.48,
          fontWeight: 900,
          fontFamily: theme.fontFamily,
        }}
      >
        {n}
      </div>
    </div>
  );
};
