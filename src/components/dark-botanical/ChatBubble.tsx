import {spring, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {C, FONT, SPRING} from './theme';

// ChatBubble 对话气泡:暗金风 user(左) / assistant(右) 气泡。
// 半透 bgCard + 1px 边 + 12px 圆角 + 金色角色标签 + 底部尾巴。spring punch 入场。
export const ChatBubble: React.FC<{
  x: number;
  y: number;
  w?: number;
  role: 'user' | 'assistant';
  text: string;
  delay?: number; // 帧
}> = ({x, y, w = 520, role, text, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const isUser = role === 'user';
  const color = isUser ? C.pink : C.gold;
  const h = 120;

  const s = spring({frame: Math.max(0, frame - delay), fps, config: SPRING.punch});
  const scale = interpolate(s, [0, 1], [0.5, 1]);
  const opacity = interpolate(s, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'});
  const ty = interpolate(s, [0, 1], [20, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        opacity,
        transform: `translateY(${ty}px) scale(${scale})`,
        transformOrigin: isUser ? 'left center' : 'right center',
      }}
    >
      <div
        style={{
          position: 'relative',
          background: C.bgCard,
          border: `1px solid ${withAlpha(color, 0.5)}`,
          borderRadius: 16,
          padding: '18px 24px',
          boxShadow: `0 0 30px ${withAlpha(color, 0.1)}`,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontFamily: FONT.mono,
            fontWeight: 700,
            color,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 8,
            textAlign: isUser ? 'left' : 'right',
          }}
        >
          {isUser ? 'USER' : 'ASSISTANT'}
        </div>
        <div
          style={{
            fontSize: 24,
            fontFamily: FONT.body,
            color: C.text,
            lineHeight: 1.4,
          }}
        >
          {text}
        </div>
        {/* 尾巴 */}
        <div
          style={{
            position: 'absolute',
            bottom: -10,
            [isUser ? 'left' : 'right']: 36,
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: `16px solid ${C.bgCard}`,
          }}
        />
      </div>
    </div>
  );
};

const withAlpha = (hex: string, alpha: number) => {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return hex.length === 7 ? hex + a : hex;
};
