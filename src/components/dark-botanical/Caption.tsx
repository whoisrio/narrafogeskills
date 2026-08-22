import {AbsoluteFill} from 'remotion';
import {CAPTION, FONT} from './theme';

/**
 * 居中卡拉OK字幕:逐字高亮(已读=柔金,当前=白发光,未读=暗)。
 * 提取自 responseapi/src/components/Caption.tsx,颜色改走 CAPTION token。
 */
export const Caption: React.FC<{
  text: string;
  progress: number; // 0..1 在当前字幕条内的进度
  opacity: number;
}> = ({text, progress, opacity}) => {
  const chars = Array.from(text);
  const active = progress * chars.length;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '11%',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: '82%',
          textAlign: 'center',
          opacity,
          fontFamily: FONT.body,
          fontSize: 46,
          fontWeight: 600,
          lineHeight: 1.55,
          textShadow: '0 2px 24px rgba(0,0,0,0.6)',
        }}
      >
        {chars.map((c, i) => {
          let color: string = CAPTION.dimSoft;
          const isActive = i <= active + 0.4 && i >= active - 0.4;
          if (i < active - 0.4) color = CAPTION.readSoft;
          else if (isActive) color = CAPTION.active;
          return (
            <span
              key={i}
              style={{
                color,
                textShadow: isActive
                  ? '0 0 18px rgba(255,255,255,0.6)'
                  : 'none',
              }}
            >
              {c}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
