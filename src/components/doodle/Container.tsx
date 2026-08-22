import React, {useMemo} from 'react';
import {RoughPaths, roundedRectPath, sketch} from '../../rough';
import {theme} from '../../theme';
import {useFadeIn} from '../../hooks/usePopIn';

// Container 分组框:粗描边手绘圆角矩形(无填充)框住一组元素,顶部挂一个标签。
// 用于流程图里框住子系统/模块,或概念地图里分组。
// 注意:doodle 的节点(CircleNode 等)是绝对定位的,要作为 Container 的【兄弟】
// 用绝对坐标落进框内,不能当 children(children 只放 HTML 文本/说明)。
export const Container: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  color?: string;
  delay?: number;
  seed?: number;
  radius?: number;
  children?: React.ReactNode;
}> = ({
  x,
  y,
  w,
  h,
  label,
  color = theme.INK,
  delay = 0,
  seed = 9,
  radius = 28,
  children,
}) => {
  const fade = useFadeIn(delay, 12);
  const paths = useMemo(() => {
    const g = sketch(seed);
    return g.toPaths(
      g.path(roundedRectPath(0, 0, w, h, radius), {
        roughness: 0.9,
        stroke: color,
        strokeWidth: 3,
        fill: 'none',
        fillStyle: 'solid',
      }),
    );
  }, [w, h, radius, color, seed]);

  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: fade}}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{position: 'absolute', inset: 0, overflow: 'visible'}}
      >
        <RoughPaths paths={paths} />
      </svg>
      {label && (
        <div
          style={{
            position: 'absolute',
            top: -16,
            left: 28,
            background: color,
            color: theme.badgeText,
            fontFamily: theme.fontFamily,
            fontWeight: 900,
            fontSize: 20,
            padding: '4px 18px',
            borderRadius: 999,
            letterSpacing: 1,
            boxShadow: '0 2px 0 rgba(0,0,0,0.1)',
          }}
        >
          {label}
        </div>
      )}
      {children && <div style={{position: 'relative', padding: 30}}>{children}</div>}
    </div>
  );
};
