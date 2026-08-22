import React, {useMemo} from 'react';
import {useVideoConfig} from 'remotion';
import {RoughPaths, sketch} from '../../rough';
import {theme} from '../../theme';
import {useScatterAssemble} from '../../hooks/useScatterAssemble';

// ParticleAssembly 打散重组:一组粒子先散布漂浮,再聚合到目标网格位,
// 配 scale/opacity/rotation/glow。表示 MLA / QKV 的「打散再组合」。
// 运动用共享 useScatterAssemble hook,渲染为 doodle 粗描边圆点。
//
// 两种给目标位的方式:
//  - targets:直接给坐标数组(任意布局)
//  - grid:给 rows/cols + origin + cellSize,自动生成网格目标
export const ParticleAssembly: React.FC<{
  x: number;
  y: number;
  targets?: {x: number; y: number}[];
  rows?: number;
  cols?: number;
  cellSize?: number;
  gap?: number;
  values?: string[];
  color?: string;
  dotSize?: number;
  delay?: number;
  floatDuration?: number;
  assembleDuration?: number;
  spread?: number;
  seed?: number;
}> = ({
  x,
  y,
  targets,
  rows = 4,
  cols = 4,
  cellSize = 64,
  gap = 8,
  values,
  color = theme.PALETTE[0],
  dotSize = 56,
  delay = 0,
  floatDuration = 25,
  assembleDuration = 8,
  spread = 220,
  seed = 7,
}) => {
  const {width, height} = useVideoConfig();

  // 目标位:优先用传入的 targets,否则按网格生成
  const tgts = useMemo(() => {
    if (targets) return targets;
    const arr: {x: number; y: number}[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr.push({
          x: x + c * (cellSize + gap) + cellSize / 2,
          y: y + r * (cellSize + gap) + cellSize / 2,
        });
      }
    }
    return arr;
  }, [targets, rows, cols, x, y, cellSize, gap]);

  const states = useScatterAssemble({
    targets: tgts,
    delay,
    floatDuration,
    assembleDuration,
    spread,
    seed,
  });

  // 每个粒子的 rough 圆点(按 seed 固定,逐帧不闪烁)
  const paths = useMemo(() => {
    const g = sketch(seed);
    return tgts.map(() =>
      g.toPaths(
        g.ellipse(0, 0, dotSize, dotSize, {
          roughness: 0.7,
          stroke: theme.INK,
          strokeWidth: 3,
          fill: color,
          fillStyle: 'solid',
        }),
      ),
    );
  }, [tgts.length, dotSize, color, seed]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{position: 'absolute', overflow: 'visible'}}
    >
      {states.map((st, i) => {
        if (!st.visible) return null;
        return (
          <g
            key={i}
            opacity={st.opacity}
            transform={`translate(${st.x} ${st.y}) rotate(${st.rotation}) scale(${st.scale})`}
          >
            <RoughPaths paths={paths[i]} />
            {values?.[i] && (
              <text
                x={0}
                y={0}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="'JetBrains Mono', monospace"
                fontSize={18}
                fontWeight={700}
                fill={theme.INK}
              >
                {values[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
