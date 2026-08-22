import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';
import {EDITOR, FONT} from './theme';

const outCubic = Easing.out(Easing.cubic);

export interface CodePanelProps {
  /** 窗口标题栏文字,如 POST /v1/chat/completions */
  title: string;
  /** 每行渲染好的 html(允许 <span class="k"> 等 token 高亮) */
  lines: string[];
  /** 每行「长出」的本地秒时刻;与该行旁白出现对齐 */
  at: number[];
  /** 行号 -> 高亮开始时刻(之后常亮),用于字段强调 */
  hl?: Record<number, number>;
  /** 顶部标题栏强调色 */
  accent?: string;
  left?: number;
  top?: number;
  width?: number;
  fontSize?: number;
  lineHeight?: number;
  /** 红框警示强度 0..1(痛点用) */
  warn?: number;
  /** 整体出现时刻(用于面板本身淡入);默认取第一行 at */
  appearAt?: number;
}

// 提取自 responseapi/src/components/CodePanel.tsx,颜色改走 EDITOR token。
export const CodePanel: React.FC<CodePanelProps> = ({
  title,
  lines,
  at,
  hl = {},
  accent = EDITOR.gold,
  left = 120,
  top = 165,
  width = 840,
  fontSize = 27,
  lineHeight = 1.7,
  warn = 0,
  appearAt,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;
  const base = appearAt ?? at[0] ?? 0;

  const panelOp = interpolate(sec, [base, base + 0.5], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const panelY = interpolate(sec, [base, base + 0.5], [16, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const lineClip = (t: number) =>
    `inset(0 ${100 - interpolate(sec, [t, t + 0.5], [0, 100], {easing: outCubic, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}% 0 0)`;
  const lineOp = (t: number) =>
    interpolate(sec, [t, t + 0.42], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  const lineY = (t: number) =>
    interpolate(sec, [t, t + 0.42], [9, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  const isHl = (i: number) => hl[i] !== undefined && sec >= hl[i]!;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity: panelOp,
        transform: `translateY(${panelY}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width,
          background: `linear-gradient(180deg, ${EDITOR.panelTop} 0%, ${EDITOR.panelBottom} 100%)`,
          border: `1px solid ${EDITOR.panelBorder}`,
          borderRadius: 18,
          boxShadow: '0 30px 80px -30px rgba(0,0,0,0.85)',
          overflow: 'hidden',
        }}
      >
        {/* 窗口标题栏 */}
        <div
          style={{
            height: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 24px',
            borderBottom: `1px solid ${EDITOR.titleBorder}`,
            background: 'rgba(255,255,255,0.015)',
          }}
        >
          <span style={{width: 16, height: 16, borderRadius: '50%', background: EDITOR.dotRed}} />
          <span style={{width: 16, height: 16, borderRadius: '50%', background: EDITOR.dotYellow}} />
          <span style={{width: 16, height: 16, borderRadius: '50%', background: EDITOR.dotGreen}} />
          <span style={{marginLeft: 15, color: EDITOR.titleText, fontSize: 20, fontFamily: FONT.mono}}>
            {title}
          </span>
          <span
            style={{
              marginLeft: 'auto',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: accent,
              boxShadow: `0 0 12px ${accent}`,
            }}
          />
        </div>

        {/* 代码区 */}
        <div
          style={{
            padding: '27px 30px 33px',
            fontFamily: FONT.mono,
            fontSize,
            lineHeight,
            color: EDITOR.text,
            whiteSpace: 'pre',
            tabSize: 2,
          }}
        >
          {lines.map((html, i) => (
            <div
              key={i}
              dangerouslySetInnerHTML={{__html: html}}
              style={{
                display: 'block',
                clipPath: lineClip(at[i] ?? 9999),
                opacity: lineOp(at[i] ?? 9999),
                transform: `translateY(${lineY(at[i] ?? 9999)}px)`,
                background: isHl(i) ? 'rgba(212,167,44,0.08)' : 'transparent',
                boxShadow: isHl(i) ? `inset 3px 0 0 ${EDITOR.gold}` : 'none',
                borderRadius: 4,
                padding: '0 9px',
                margin: '0 -9px',
              }}
            />
          ))}
        </div>

        {/* 红框警示(痛点) */}
        {warn > 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRadius: 18,
              boxShadow: `inset 0 0 ${60 * warn}px ${-10 * warn}px rgba(255,90,90,${0.28 * warn})`,
              border: `2px solid rgba(255,90,90,${0.6 * warn})`,
            }}
          />
        )}
      </div>

      {/* 代码 token 配色(全局) */}
      <style>{`
        .m{color:#ff7b72;font-weight:600}.p{color:#79c0ff}
        .k{color:#79c0ff}.s{color:#7ee787}.n{color:#ffa657}
        .c{color:#5b6677;font-style:italic}.t{color:#d2a8ff}.b{color:#ffd66b}
      `}</style>
    </AbsoluteFill>
  );
};
