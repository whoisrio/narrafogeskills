import React, {useMemo} from 'react';
import {useVideoConfig} from 'remotion';
import {RoughPaths, roundedRectPath, sketch} from '../../rough';
import {theme} from '../../theme';
import {usePopIn} from '../../hooks/usePopIn';

interface DoodleCardProps {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  radius?: number;
  delay?: number;
  seed?: number;
}

// Big rounded-corner container card with a thick ink outline.
export const DoodleCard: React.FC<DoodleCardProps> = ({
  x,
  y,
  w,
  h,
  fill = theme.STICKER,
  radius = 36,
  delay = 0,
  seed = 5,
}) => {
  const {width, height} = useVideoConfig();
  const pop = usePopIn(delay);
  const paths = useMemo(() => {
    const g = sketch(seed);
    return g.toPaths(
      g.path(roundedRectPath(x, y, w, h, radius), {
        roughness: 0.8,
        stroke: theme.INK,
        strokeWidth: 3,
        fill,
        fillStyle: 'solid',
      })
    );
  }, [x, y, w, h, radius, fill, seed]);

  const cx = x + w / 2;
  const cy = y + h / 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{position: 'absolute', overflow: 'visible'}}
    >
      <g
        opacity={pop.opacity}
        transform={`translate(${cx} ${cy}) scale(${pop.scale}) translate(${-cx} ${-cy})`}
      >
        <RoughPaths paths={paths} />
      </g>
    </svg>
  );
};
