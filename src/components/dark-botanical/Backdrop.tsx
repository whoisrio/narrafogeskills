import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BLUEPRINT} from './theme';

/**
 * 蓝图金背景:深海军蓝 + 暗金网格(画布)+ 中心金晕 + 漂浮金点。
 * 提取自 responseapi/src/components/Backdrop.tsx,颜色改走 BLUEPRINT token。
 */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = (frame * 0.12) % 80;
  const t = frame / 30;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 120% at 50% 0%, ${BLUEPRINT.bgTop} 0%, ${BLUEPRINT.bg} 55%, ${BLUEPRINT.bgBottom} 100%)`,
      }}
    >
      {/* 暗金网格:缓慢平移,作为"画布" */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${BLUEPRINT.grid} 1px, transparent 1px), linear-gradient(90deg, ${BLUEPRINT.grid} 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          backgroundPosition: `${shift}px ${shift}px`,
        }}
      />
      {/* 中心金晕 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(55% 45% at 50% 46%, ${BLUEPRINT.goldGlow.replace('0.55', '0.10')}, transparent 70%)`,
        }}
      />
      {/* 极淡漂浮金点,点缀画布(非元素,不抢焦点) */}
      {Array.from({length: 7}).map((_, i) => {
        const x = (i * 137.5) % 100;
        const y = (i * 53 + frame * 0.25) % 110 - 5;
        const op = 0.025 + 0.02 * Math.abs(Math.sin(t + i));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: BLUEPRINT.gold,
              opacity: op,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
