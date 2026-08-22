import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, FONT} from './theme';

const withAlpha = (hex: string, alpha: number) => {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return hex.length === 7 ? hex + a : hex;
};

// Matrix 矩阵:暗金风格子矩阵,逐格 reveal,cell 填充透明度按 |值|/maxAbs 缩放(金色强度)。
// 表示 attention / 权重 / 特征矩阵。
export const Matrix: React.FC<{
  x: number;
  y: number;
  label: string;
  rowDim?: string;
  colDim?: string;
  data: number[][];
  color?: string;
  cellSize?: number;
  gap?: number;
  delay?: number; // 帧
  showValues?: boolean;
}> = ({
  x,
  y,
  label,
  rowDim,
  colDim,
  data,
  color = C.gold,
  cellSize = 56,
  gap = 6,
  delay = 0,
  showValues = true,
}) => {
  const frame = useCurrentFrame();
  const rows = data.length;
  const cols = data[0]?.length ?? 0;
  const total = rows * cols;
  const maxAbs = Math.max(...data.flat().map(Math.abs), 0.01);
  const reveal = interpolate(frame, [delay, delay + total * 2 + 8], [0, total], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10, width: cols * (cellSize + gap) - gap}}>
        <span style={{fontFamily: FONT.mono, fontSize: 18, fontWeight: 700, color}}>{label}</span>
        {rowDim && colDim && (
          <span style={{fontFamily: FONT.mono, fontSize: 14, color: C.textMuted}}>
            {rowDim} × {colDim}
          </span>
        )}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap}}>
        {data.map((row, r) => (
          <div key={r} style={{display: 'flex', gap}}>
            {row.map((val, c) => {
              const idx = r * cols + c;
              const alpha = reveal >= idx
                ? interpolate(reveal, [idx, idx + 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
                : 0;
              const intensity = Math.abs(val) / maxAbs;
              return (
                <div
                  key={c}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    borderRadius: 6,
                    background: withAlpha(color, 0.08 + intensity * 0.55),
                    border: `1px solid ${withAlpha(color, alpha * 0.5)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONT.mono,
                    fontSize: 16,
                    fontWeight: 700,
                    color: withAlpha('#ffffff', 0.5 + intensity * 0.5),
                    opacity: alpha,
                  }}
                >
                  {showValues && alpha > 0.5 ? val.toFixed(1) : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

void Easing;
