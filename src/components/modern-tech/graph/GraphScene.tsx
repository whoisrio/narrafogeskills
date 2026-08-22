import {AbsoluteFill} from 'remotion';
import {FONT} from '../theme';
import {EdgeArrowMarker} from './Edge';

// ============= 图场景容器 =============
// 提供 1920×1080 的 SVG 图层 + HTML 图层。
// SVG 图层放 Edge / TokenFlow;HTML 图层放 Node、PatternTitle 等。
// 两者共享同一坐标系。
// 提取自 langgraph_concept/src/shared/graph/GraphScene.tsx。

interface GraphSceneProps {
  bg?: string;
  scenario?: string; // 右下角典型场景一行小字
  arrowColors?: string[]; // 需要为哪些颜色注册 arrow marker
  children: React.ReactNode; // HTML 图层内容(节点、标题)
  svgChildren?: React.ReactNode; // SVG 图层内容(边、token)
}

export const GraphScene: React.FC<GraphSceneProps> = ({
  bg = '#f5efe4',
  scenario,
  arrowColors = ['#4a453e'],
  children,
  svgChildren,
}) => {
  return (
    <AbsoluteFill style={{background: bg, fontFamily: FONT.sans}}>
      {/* SVG 图层:边 + token */}
      <svg
        width={1920}
        height={1080}
        style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
      >
        <defs>
          {arrowColors.map((c) => (
            <EdgeArrowMarker key={c} color={c} />
          ))}
        </defs>
        {svgChildren}
      </svg>

      {/* HTML 图层:节点 + 标题等 */}
      <div style={{position: 'absolute', inset: 0}}>{children}</div>

      {/* 右下角典型场景 */}
      {scenario && (
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 80,
            fontSize: 18,
            fontFamily: FONT.mono,
            color: '#8a8478',
            letterSpacing: 2,
          }}
        >
          典型场景 · {scenario}
        </div>
      )}
    </AbsoluteFill>
  );
};
