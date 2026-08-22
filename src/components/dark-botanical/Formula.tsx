import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, FONT} from './theme';

export type DBFormulaKind = 'var' | 'op' | 'num' | 'fn' | 'txt';

// Formula 公式:暗金风数学式,按 token 类型上色(var=金 / num=金亮 / fn=粉 / op/txt=text),
// 衬线/等宽大字,可选给某 token 画金色下划线强调。用于 softmax / attention / loss。
export const Formula: React.FC<{
  x: number;
  y: number;
  parts: {t: string; kind?: DBFormulaKind; sub?: string}[];
  size?: number;
  delay?: number; // 帧
  underlineIndex?: number;
}> = ({x, y, parts, size = 56, delay = 0, underlineIndex = -1}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const dy = interpolate(frame, [delay, delay + 12], [16, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const colorFor = (kind: DBFormulaKind) =>
    kind === 'var' ? C.gold : kind === 'num' ? C.goldBright : kind === 'fn' ? C.pink : C.text;

  let cursor = 0;
  const spans = parts.map((p, i) => {
    const w = [...p.t].reduce((s, ch) => s + (ch.codePointAt(0)! > 0x2e7f ? size * 0.62 : size * 0.5), 0) * 0.9;
    const start = cursor;
    cursor += w;
    return {...p, i, start, w, color: colorFor(p.kind ?? 'txt')};
  });

  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: op, transform: `translateY(${dy}px)`}}>
      <div style={{fontFamily: FONT.mono, fontSize: size, fontWeight: 700, lineHeight: 1.2, whiteSpace: 'pre'}}>
        {spans.map((s) => (
          <span key={s.i} style={{color: s.color}}>
            {s.t}
            {s.sub && (
              <sub style={{fontSize: size * 0.55, verticalAlign: 'sub'}}>{s.sub}</sub>
            )}
          </span>
        ))}
      </div>
      {underlineIndex >= 0 && spans[underlineIndex] && (
        <div
          style={{
            position: 'absolute',
            left: spans[underlineIndex].start,
            top: size + 4,
            width: spans[underlineIndex].w,
            height: 5,
            background: C.gold,
            borderRadius: 3,
            opacity: interpolate(frame, [delay + 18, delay + 28], [0, 0.9], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            boxShadow: `0 0 12px ${C.gold}80`,
          }}
        />
      )}
    </div>
  );
};
