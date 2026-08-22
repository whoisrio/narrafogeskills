import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, SPRING} from './theme';

// FlowNode 流程节点:暗金风白卡节点(半透 bgCard + 1px 边 + 12px 圆角 + 顶部 3px 金色身份条)。
// 三种 shape:rect 普通 / diamond 决策 / special 双描边。spring punch 入场,active 时金色脉冲环。
// 对齐 modern-tech GraphNode 的 API,但用 dark-botanical 的暗金美学。
export type DBNodeShape = 'rect' | 'diamond' | 'special';

export const FlowNode: React.FC<{
  x: number; // 中心 x
  y: number; // 中心 y
  w?: number;
  h?: number;
  label: string;
  sub?: string;
  shape?: DBNodeShape;
  color?: string; // 身份条色(默认金)
  delay?: number; // 帧
  active?: boolean; // token 到达时高亮
  activeAt?: number; // 帧
}> = ({
  x,
  y,
  w = 200,
  h = 88,
  label,
  sub,
  shape = 'rect',
  color = C.gold,
  delay = 0,
  active = false,
  activeAt = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = Math.max(0, frame - delay);
  const s = spring({frame: localFrame, fps, config: SPRING.punch});
  const scale = interpolate(s, [0, 1], [0.5, 1]);
  const opacity = interpolate(s, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'});

  // 入场后持续呼吸+浮动(避免静态 PPT 感,画面永远在动)
  const settled = frame >= delay + 28;
  const phase = (x + y) * 0.013;
  const breathe = settled ? 1 + Math.sin(frame * 0.06 + phase) * 0.028 : 1;
  const floatY = settled ? Math.sin(frame * 0.045 + phase) * 3.5 : 0;

  const activeFrame = active ? frame - activeAt : -1;
  const pulse = active && activeFrame >= 0 && activeFrame < 24
    ? interpolate(activeFrame, [0, 6, 24], [0, 1, 0])
    : 0;

  const isDiamond = shape === 'diamond';
  const useW = isDiamond ? Math.min(w, h) + 20 : w;
  const useH = isDiamond ? Math.min(w, h) + 20 : h;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - useW / 2,
        top: y - useH / 2,
        width: useW,
        height: useH,
        opacity,
        transform: `translateY(${floatY}px) scale(${scale * breathe})`,
        transformOrigin: 'center center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: isDiamond ? 'rotate(45deg)' : undefined,
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          boxShadow:
            `0 0 30px ${color}08` + (pulse > 0 ? `, 0 0 0 4px ${color}${Math.round(pulse * 60).toString(16).padStart(2, '0')}` : ''),
        }}
      >
        {shape !== 'diamond' && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 12,
              right: 12,
              height: 3,
              borderRadius: '0 0 4px 4px',
              background: color,
            }}
          />
        )}
        {shape === 'special' && (
          <div
            style={{
              position: 'absolute',
              inset: 4,
              border: `1.5px solid ${color}`,
              borderRadius: 10,
              opacity: 0.4,
            }}
          />
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{fontSize: 22, fontFamily: FONT.display, fontWeight: 700, color: C.text, lineHeight: 1.1}}>
          {label}
        </div>
        {sub && (
          <div style={{fontSize: 12, fontFamily: FONT.mono, color: C.textMuted, letterSpacing: 1.5, marginTop: 4, textTransform: 'uppercase'}}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
};
