import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from './theme';

const withAlpha = (hex: string, alpha: number) => {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return hex.length === 7 ? hex + a : hex;
};

// Vector 向量盒:暗金风一行格子,每格一个值,逐格弹入。表示 embedding / 向量。
export const Vector: React.FC<{
  x: number;
  y: number;
  label: string;
  dimLabel?: string;
  values: string[];
  color?: string;
  cellSize?: number;
  gap?: number;
  delay?: number; // 帧
}> = ({
  x,
  y,
  label,
  dimLabel,
  values,
  color = C.gold,
  cellSize = 64,
  gap = 8,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const n = values.length;
  const totalW = n * cellSize + (n - 1) * gap;

  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8, width: totalW}}>
        <span style={{fontFamily: FONT.mono, fontSize: 18, fontWeight: 700, color}}>{label}</span>
        {dimLabel && (
          <span style={{fontFamily: FONT.mono, fontSize: 14, color: C.textMuted}}>{dimLabel}</span>
        )}
      </div>
      <div style={{display: 'flex', gap}}>
        {values.map((v, i) => {
          const d = delay + i * 4;
          const op = interpolate(frame, [d, d + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const s = interpolate(frame, [d, d + 10], [0.6, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div
              key={i}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: 8,
                background: withAlpha(color, 0.12),
                border: `1px solid ${withAlpha(color, 0.5)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT.mono,
                fontSize: 20,
                fontWeight: 700,
                color: C.text,
                opacity: op,
                transform: `scale(${s})`,
                boxShadow: `0 0 20px ${withAlpha(color, 0.1)}`,
              }}
            >
              {v}
            </div>
          );
        })}
      </div>
    </div>
  );
};
