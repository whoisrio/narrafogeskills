import React, {useMemo} from 'react';
import {RoughPaths, roundedRectPath, sketch} from '../../rough';
import {theme} from '../../theme';
import {usePopIn} from '../../hooks/usePopIn';

// ChatBubble 对话气泡:user(左) / assistant(右) 两种角色。
// 粗描边手绘圆角气泡 + 底部小尾巴 + 角色标签,表示 LLM 对话轮次。
export const ChatBubble: React.FC<{
  x: number;
  y: number;
  w?: number;
  role: 'user' | 'assistant';
  text: string;
  delay?: number;
  seed?: number;
}> = ({x, y, w = 520, role, text, delay = 0, seed = 55}) => {
  const pop = usePopIn(delay);
  const isUser = role === 'user';
  const color = isUser ? theme.PALETTE[3] : theme.PALETTE[0];
  const h = 120;

  const paths = useMemo(() => {
    const g = sketch(seed);
    return g.toPaths(
      g.path(roundedRectPath(0, 0, w, h, 28), {
        roughness: 0.85,
        stroke: theme.INK,
        strokeWidth: 3,
        fill: color,
        fillStyle: 'solid',
      }),
    );
  }, [w, color, seed]);

  // 尾巴:用户左下,助手右下(粗描边小三角)
  const tailPaths = useMemo(() => {
    const g = sketch(seed + 1);
    const tx = isUser ? 40 : w - 80;
    const tri = `M ${tx} ${h} L ${tx + 30} ${h} L ${tx + (isUser ? -10 : 40)} ${h + 30} Z`;
    return g.toPaths(
      g.path(tri, {
        roughness: 0.8,
        stroke: theme.INK,
        strokeWidth: 3,
        fill: color,
        fillStyle: 'solid',
      }),
    );
  }, [w, h, color, isUser, seed]);

  const cx = x + w / 2;
  const cy = y + h / 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        opacity: pop.opacity,
        transform: `translateY(${pop.y}px) scale(${pop.scale})`,
        transformOrigin: isUser ? 'left center' : 'right center',
      }}
    >
      <svg
        width={w + 60}
        height={h + 40}
        viewBox={`${isUser ? 0 : -60} 0 ${w + 60} ${h + 40}`}
        style={{position: 'absolute', left: isUser ? 0 : -60, top: 0, overflow: 'visible'}}
      >
        <g transform={`translate(${x - (isUser ? 0 : 0)} ${y - y})`}>
          {/* 这里用相对坐标:把气泡画在 (0,0) */}
        </g>
      </svg>
      <svg
        width={w}
        height={h + 40}
        viewBox={`0 0 ${w} ${h + 40}`}
        style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}
      >
        <g opacity={pop.opacity}>
          <RoughPaths paths={paths} />
          <RoughPaths paths={tailPaths} />
        </g>
        <text
          x={isUser ? 32 : w - 32}
          y={32}
          textAnchor={isUser ? 'start' : 'end'}
          fontFamily={theme.fontFamily}
          fontSize={16}
          fontWeight={900}
          fill={isUser ? theme.badgeText : theme.INK}
          opacity={0.7}
          letterSpacing={1}
        >
          {isUser ? 'USER' : 'ASSISTANT'}
        </text>
        <text
          x={w / 2}
          y={h / 2 + 10}
          textAnchor="middle"
          fontFamily={theme.fontFamily}
          fontSize={24}
          fontWeight={600}
          fill={isUser ? theme.badgeText : theme.INK}
        >
          {text}
        </text>
      </svg>
    </div>
  );
};
