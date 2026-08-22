import {AbsoluteFill} from 'remotion';
import {CAPTION, FONT} from './theme';

/**
 * 卡拉OK式旁白字幕:已读=亮金,当前=白发光,未读=暗。
 * 贴屏幕最底部,避免遮挡主体内容。
 * progress 0..1 表示当前这条旁白被念到的进度(由父组件按时间算出)。
 * 提取自 responseapi/src/components/Karaoke.tsx,颜色改走 CAPTION token。
 */
export const Karaoke: React.FC<{
  text: string;
  progress: number;
}> = ({text, progress}) => {
  const chars = Array.from(text);
  const active = progress * chars.length;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: '0 0 2.8% 4%',
        pointerEvents: 'none',
      }}
    >
      <div style={{maxWidth: '90%'}}>
        <div
          style={{
            fontSize: 32,
            lineHeight: 1.42,
            color: '#eef2f7',
            fontWeight: 500,
            fontFamily: FONT.body,
            textShadow: '0 2px 16px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.7)',
          }}
        >
          {chars.map((c, i) => {
            let color: string = CAPTION.dim;
            const isActive = Math.abs(i - active) < 0.6;
            if (i < active - 0.6) color = CAPTION.read;
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
      </div>
    </AbsoluteFill>
  );
};
