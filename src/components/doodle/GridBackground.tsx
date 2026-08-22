import React, {useMemo} from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {RoughPaths, sketch} from '../../rough';
import {theme} from '../../theme';

// Paper background with slightly wobbly hand-drawn grid lines.
export const GridBackground: React.FC = () => {
  const {width, height} = useVideoConfig();
  const step = 80;

  const paths = useMemo(() => {
    const g = sketch(20260806);
    const opts = {
      roughness: 0.6,
      stroke: theme.GRID,
      strokeWidth: 1.5,
    };
    const all = [];
    for (let x = 0; x <= width; x += step) {
      all.push(...g.toPaths(g.line(x, -40, x, height + 40, opts)));
    }
    for (let y = 0; y <= height; y += step) {
      all.push(...g.toPaths(g.line(-40, y, width + 40, y, opts)));
    }
    return all;
  }, [width, height]);

  return (
    <AbsoluteFill style={{backgroundColor: theme.BG}}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: 'absolute',
          transform: 'rotate(-0.4deg) scale(1.05)',
          transformOrigin: 'center',
        }}
      >
        <RoughPaths paths={paths} />
      </svg>
    </AbsoluteFill>
  );
};
