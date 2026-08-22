import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../theme';

// ============= Pattern 详解场的招牌标题组件 =============
// 布局(占屏幕上半区):
//   ┌─────────────────────────────────────────┐
//   │ PATTERN · 01 / 06        (kicker, mono)
//   │ Prompt Chain             (huge display, mask reveal)
//   │ ────                     (grow-from-left accent bar, pattern color)
//   │ 顺序流水线                (subtitle)
//   └─────────────────────────────────────────┘
// 提取自 langgraph_concept/src/shared/graph/PatternTitle.tsx。

interface PatternTitleProps {
  kicker: string; // e.g. "PATTERN · 01 / 06"
  title: string; // e.g. "Prompt Chain"
  subtitle: string; // e.g. "顺序流水线"
  accentColor: string; // pattern color, e.g. "#3b82f6"
  appearAt?: number; // 秒
  // 位置(默认居中偏上)
  x?: number;
  y?: number;
  align?: 'left' | 'center';
}

export const PatternTitle: React.FC<PatternTitleProps> = ({
  kicker,
  title,
  subtitle,
  accentColor,
  appearAt = 0,
  x = 200,
  y = 180,
  align = 'left',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localSec = Math.max(0, frame / fps - appearAt);

  // Kicker 淡入
  const kickerOp = interpolate(localSec, [0, 0.3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const kickerY = interpolate(localSec, [0, 0.4], [-8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 大字 mask reveal
  const revealSpring = spring({
    frame: Math.max(0, frame - Math.round((appearAt + 0.2) * fps)),
    fps,
    config: {damping: 24, stiffness: 90, mass: 1},
  });
  const revealPct = interpolate(revealSpring, [0, 1], [0, 100]);
  const titleY = interpolate(localSec - 0.2, [0, 0.6], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Accent bar 从 0 长到目标宽度
  const accentSpring = spring({
    frame: Math.max(0, frame - Math.round((appearAt + 0.6) * fps)),
    fps,
    config: {damping: 20, stiffness: 100, mass: 1},
  });
  const accentW = interpolate(accentSpring, [0, 1], [0, 88]);

  // Subtitle 淡入
  const subOp = interpolate(localSec, [0.9, 1.3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subY = interpolate(localSec, [0.9, 1.3], [8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textAlign = align === 'center' ? 'center' : 'left';
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    display: 'flex',
    flexDirection: 'column',
    alignItems: align === 'center' ? 'center' : 'flex-start',
    textAlign,
  };

  return (
    <div style={containerStyle}>
      {/* Kicker */}
      <div
        style={{
          fontSize: 16,
          fontFamily: FONT.mono,
          color: accentColor,
          letterSpacing: 5,
          fontWeight: 500,
          textTransform: 'uppercase',
          opacity: kickerOp,
          transform: `translateY(${kickerY}px)`,
          marginBottom: 18,
        }}
      >
        {kicker}
      </div>

      {/* Huge title with clip-path reveal */}
      <div
        style={{
          fontSize: 96,
          fontFamily: FONT.display,
          fontWeight: 700,
          color: '#1a1917',
          letterSpacing: -2.5,
          lineHeight: 1,
          clipPath: `inset(0 ${100 - revealPct}% 0 0)`,
          transform: `translateY(${titleY}px)`,
          marginBottom: 20,
        }}
      >
        {title}
      </div>

      {/* Accent bar */}
      <div
        style={{
          width: accentW,
          height: 4,
          background: accentColor,
          borderRadius: 2,
          marginBottom: 20,
          boxShadow: `0 2px 8px ${accentColor}55`,
        }}
      />

      {/* Subtitle */}
      <div
        style={{
          fontSize: 26,
          fontFamily: FONT.sans,
          color: '#4a453e',
          letterSpacing: 2,
          fontWeight: 400,
          opacity: subOp,
          transform: `translateY(${subY}px)`,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};
