import {useVideoConfig} from 'remotion';
import {C} from './theme';
import {useScatterAssemble} from '../../hooks/useScatterAssemble';

// ParticleAssembly 打散重组:暗金风版。运动用共享 useScatterAssemble hook,
// 渲染为金色发光圆点(div + radial-gradient + box-shadow glow)。
// 表示 MLA / QKV 的「打散再组合」。
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
  delay?: number; // 帧
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
  color = C.gold,
  dotSize = 56,
  delay = 0,
  floatDuration = 25,
  assembleDuration = 8,
  spread = 220,
  seed = 7,
}) => {
  const {width, height} = useVideoConfig();
  void width;
  void height;

  const tgts: {x: number; y: number}[] = [];
  if (targets) {
    tgts.push(...targets);
  } else {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        tgts.push({
          x: x + c * (cellSize + gap) + cellSize / 2,
          y: y + r * (cellSize + gap) + cellSize / 2,
        });
      }
    }
  }

  const states = useScatterAssemble({
    targets: tgts,
    delay,
    floatDuration,
    assembleDuration,
    spread,
    seed,
  });

  const a = (alpha: number) =>
    Math.round(Math.max(0, Math.min(1, alpha)) * 255)
      .toString(16)
      .padStart(2, '0');

  return (
    <>
      {states.map((st, i) => {
        if (!st.visible) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: st.x - dotSize / 2,
              top: st.y - dotSize / 2,
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${color}, ${color}${a(0.3)})`,
              border: `1px solid ${color}`,
              opacity: st.opacity,
              transform: `rotate(${st.rotation}deg) scale(${st.scale})`,
              boxShadow: st.glow > 0.01 ? `0 0 ${30 * st.glow}px ${color}${a(st.glow * 0.8)}` : `0 0 12px ${color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 16,
              fontWeight: 700,
              color: '#0f0f0f',
            }}
          >
            {values?.[i] ?? ''}
          </div>
        );
      })}
    </>
  );
};
