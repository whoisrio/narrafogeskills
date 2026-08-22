import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, FONT} from './theme';

// TokenSequence token 流:暗金风一行圆点 token,activeToken 金色高亮放大,
// 可选 attention 弧线从 active 指向历史 token。表示 LLM token 序列与注意力范围。
export const TokenSequence: React.FC<{
  x: number;
  y: number;
  count: number;
  activeToken?: number;
  delay?: number; // 帧
  showAttention?: boolean;
  windowSize?: number;
  tokenSize?: number;
  gap?: number;
  labels?: string[];
}> = ({
  x,
  y,
  count,
  activeToken = -1,
  delay = 0,
  showAttention = true,
  windowSize = 4,
  tokenSize = 64,
  gap = 28,
  labels,
}) => {
  const frame = useCurrentFrame();
  const step = tokenSize + gap;

  return (
    <>
      {/* attention 弧线(SVG 覆盖层) */}
      {showAttention && activeToken > 0 && (
        <AbsoluteFill style={{pointerEvents: 'none'}}>
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            {Array.from({length: Math.min(windowSize, activeToken)}).map((_, k) => {
              const tgt = activeToken - k - 1;
              const startX = x + tgt * step + tokenSize / 2;
              const endX = x + activeToken * step + tokenSize / 2;
              const startY = y + tokenSize / 2;
              const midY = startY - 50 - k * 10;
              const op = interpolate(frame, [delay + 20 + k * 4, delay + 35 + k * 4], [0, 0.5 - k * 0.08], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.out(Easing.cubic),
              });
              if (op <= 0.01) return null;
              return (
                <path
                  key={tgt}
                  d={`M ${startX} ${startY} Q ${(startX + endX) / 2} ${midY} ${endX} ${startY}`}
                  fill="none"
                  stroke={C.gold}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  opacity={op}
                />
              );
            })}
          </svg>
        </AbsoluteFill>
      )}

      {/* token 圆点(HTML) */}
      <div style={{position: 'absolute', left: x, top: y, display: 'flex', gap}}>
        {Array.from({length: count}).map((_, i) => {
          const d = delay + i * 3;
          const isActive = i === activeToken;
          const inWindow = activeToken >= 0 && i >= activeToken - windowSize && i <= activeToken && !isActive;
          const isFuture = activeToken >= 0 && i > activeToken;
          const op = interpolate(frame, [d, d + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const baseOp = isActive ? 1 : inWindow ? 0.85 : isFuture ? 0.35 : 0.6;
          const scale = isActive
            ? interpolate(frame, [d, d + 14], [1, 1.18], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5))})
            : 1;
          return (
            <div
              key={i}
              style={{
                width: tokenSize,
                height: tokenSize,
                borderRadius: '50%',
                background: isActive ? C.gold : inWindow ? `${C.gold}14` : C.bgCard,
                border: `3px solid ${isActive ? C.goldBright : inWindow ? `${C.gold}99` : C.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT.mono,
                fontSize: 20,
                fontWeight: 900,
                color: isActive ? '#0f0f0f' : C.text,
                opacity: op * baseOp,
                transform: `scale(${scale})`,
                boxShadow: isActive ? `0 0 30px ${C.gold}80` : 'none',
              }}
            >
              {labels?.[i] ?? `T${i}`}
            </div>
          );
        })}
      </div>
    </>
  );
};
