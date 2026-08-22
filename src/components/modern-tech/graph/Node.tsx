import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../theme';

// ============= 节点 =============
// 三种形状:
//   rect     普通节点(Node / Worker / Generator)
//   diamond  决策节点(Router / Conditional Edge)
//   special  特殊节点(Orchestrator / LLM / Synthesizer),双描边效果
// 提取自 langgraph_concept/src/shared/graph/Node.tsx。

export type NodeShape = 'rect' | 'diamond' | 'special';

export const GraphNode: React.FC<{
  x: number; // 中心 x
  y: number; // 中心 y
  w?: number; // 默认 200
  h?: number; // 默认 88
  label: string;
  sub?: string; // 副标(可选,比如显示 "LLM" / "Tool")
  shape?: NodeShape;
  color: string; // 主色(用作强调线 / 图标底)
  appearAt?: number; // 出现时间(秒)
  active?: boolean; // 高亮激活(比如 token 到达时)
  activeAt?: number; // 激活时间(秒)
}> = ({
  x,
  y,
  w = 200,
  h = 88,
  label,
  sub,
  shape = 'rect',
  color,
  appearAt = 0,
  active = false,
  activeAt = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;

  // 出现动画
  const localFrame = Math.max(0, frame - Math.round(appearAt * fps));
  const s = spring({
    frame: localFrame,
    fps,
    config: {damping: 14, stiffness: 100, mass: 1},
  });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const scale = interpolate(s, [0, 0.7, 1], [0.85, 1.02, 1.0]);

  if (opacity <= 0.001) return null;

  // 激活脉冲(token 到达时的高亮)
  const activeLocalSec = sec - activeAt;
  const isActive = active && activeLocalSec >= 0 && activeLocalSec < 0.8;
  const activePulse = isActive
    ? interpolate(activeLocalSec, [0, 0.2, 0.8], [0, 1, 0])
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
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        pointerEvents: 'none',
      }}
    >
      {/* 卡片本体 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: isDiamond ? 'rotate(45deg)' : undefined,
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 14,
          boxShadow:
            '0 1px 2px rgba(0, 0, 0, 0.05), ' +
            '0 4px 12px rgba(0, 0, 0, 0.06), ' +
            '0 12px 32px rgba(0, 0, 0, 0.08)' +
            (activePulse > 0
              ? `, 0 0 0 4px ${color}${('0' + Math.round(activePulse * 40).toString(16)).slice(-2)}`
              : ''),
        }}
      >
        {/* 顶部彩色 hint 条(3px 宽色带作为身份识别) */}
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

        {/* 双描边(special 用) */}
        {shape === 'special' && (
          <div
            style={{
              position: 'absolute',
              inset: 4,
              border: `1.5px solid ${color}`,
              borderRadius: 10,
              opacity: 0.35,
            }}
          />
        )}
      </div>

      {/* 文字内容(不受 rotate 影响) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 14px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: sub ? 20 : 22,
            fontFamily: FONT.sans,
            fontWeight: 600,
            color: '#1a1917',
            letterSpacing: -0.3,
            lineHeight: 1.1,
          }}
        >
          {label}
        </div>
        {sub && (
          <div
            style={{
              fontSize: 12,
              fontFamily: FONT.mono,
              color: '#8a8478',
              letterSpacing: 1.5,
              marginTop: 4,
              textTransform: 'uppercase',
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
};
