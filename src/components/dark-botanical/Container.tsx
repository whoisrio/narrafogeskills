import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT} from './theme';

// Container 分组框:暗金风虚线金色圆角边框 + 顶部 mono 金色标签。
// 用于流程图框住子系统/模块,或概念地图分组。
export const Container: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  color?: string;
  delay?: number; // 帧
  children?: React.ReactNode;
}> = ({x, y, w, h, label, color = C.gold, delay = 0, children}) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [delay, delay + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: fade}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `2px dashed ${color}`,
          borderRadius: 16,
          background: `${color}08`,
        }}
      />
      {label && (
        <div
          style={{
            position: 'absolute',
            top: -14,
            left: 24,
            background: '#0f0f0f',
            color,
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 18,
            padding: '2px 14px',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
      )}
      {children && <div style={{position: 'relative', padding: 28}}>{children}</div>}
    </div>
  );
};
