import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from './theme';
import {TokenLine} from './highlight';

// ============= 代码面板(Shiki 语法高亮 + 按段高亮) =============
// 提取自 langgraph_concept/src/shared/components/CodePanel.tsx,
// import 路径改为本仓库布局(./theme、./highlight)。

export interface CodeSection {
  startLine: number; // 0-indexed
  endLine: number; // 0-indexed (inclusive)
  highlightAt: number; // 秒
}

export const CodePanel: React.FC<{
  lines: string[];
  tokens?: TokenLine[]; // Shiki 预计算的 token(可选,没有则用纯文本)
  sections: CodeSection[];
  currentSectionIndex: number;
  height?: number;
  fontSize?: number;
}> = ({lines, tokens, sections, currentSectionIndex, height = 600, fontSize = 24}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;

  const lineHeight = fontSize + 12;

  // 自动滚动
  let scrollOffset = 0;
  if (currentSectionIndex >= 0 && currentSectionIndex < sections.length) {
    const currentSection = sections[currentSectionIndex];
    const targetLine = currentSection.startLine;
    const visibleLines = Math.floor(height / lineHeight);
    scrollOffset = Math.max(0, targetLine - Math.floor(visibleLines / 3));
  }

  const panelOp = interpolate(sec, [0, 0.4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const currentHighlightAt =
    currentSectionIndex >= 0 ? sections[currentSectionIndex].highlightAt : -1;
  const glowOp =
    currentHighlightAt >= 0
      ? interpolate(sec, [currentHighlightAt, currentHighlightAt + 0.3], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;

  const getLineState = (lineIndex: number): 'current' | 'past' | 'future' => {
    if (currentSectionIndex < 0) return 'future';
    const current = sections[currentSectionIndex];
    if (lineIndex >= current.startLine && lineIndex <= current.endLine)
      return 'current';
    for (let i = 0; i < currentSectionIndex; i++) {
      if (lineIndex >= sections[i].startLine && lineIndex <= sections[i].endLine)
        return 'past';
    }
    return 'future';
  };

  // 渲染一行:有 token 用 Shiki 颜色,没有则用纯文本
  const renderLineContent = (lineIndex: number, isCurrent: boolean) => {
    if (tokens && tokens[lineIndex]) {
      return tokens[lineIndex].map((span, k) => (
        <span
          key={k}
          style={{
            color: isCurrent
              ? span.color
              : blendColor(span.color, '#1a1917', isCurrent ? 0 : 0.6),
          }}
        >
          {span.text}
        </span>
      ));
    }
    return <span>{lines[lineIndex]}</span>;
  };

  return (
    <div
      style={{
        width: '100%',
        height,
        background: '#1a1917',
        borderRadius: 16,
        fontFamily: FONT.mono,
        fontSize,
        lineHeight: `${lineHeight}px`,
        overflow: 'hidden',
        opacity: panelOp,
        boxShadow:
          '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.10), 0 32px 80px rgba(0,0,0,0.16)',
        position: 'relative',
      }}
    >
      <div style={{transform: `translateY(${-scrollOffset * lineHeight + 20}px)`}}>
        {lines.map((line, i) => {
          const state = getLineState(i);
          const isCurrent = state === 'current';
          const isPast = state === 'past';
          const isFuture = state === 'future';

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                padding: '0 24px',
                height: lineHeight,
                background: isCurrent
                  ? `rgba(196, 122, 58, ${0.12 * glowOp})`
                  : 'transparent',
                borderLeft: isCurrent
                  ? `3px solid rgba(196, 122, 58, ${glowOp})`
                  : '3px solid transparent',
                opacity: isCurrent ? 1 : isPast ? 0.55 : isFuture ? 0.18 : 0.25,
              }}
            >
              <span
                style={{
                  width: 48,
                  textAlign: 'right',
                  paddingRight: 16,
                  color: isCurrent
                    ? `rgba(196, 122, 58, ${0.5 + 0.5 * glowOp})`
                    : '#3a352f',
                  userSelect: 'none',
                  flexShrink: 0,
                  fontSize: fontSize - 4,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  whiteSpace: 'pre',
                  color: isCurrent
                    ? '#e8e0d0'
                    : isPast
                    ? '#6a6560'
                    : '#2a2520',
                }}
              >
                {renderLineContent(i, isCurrent)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 颜色混合:把 color 向 bg 混合 ratio 比例(用于非高亮行降暗)
function blendColor(color: string, bg: string, ratio: number): string {
  const c = hexToRgb(color);
  const b = hexToRgb(bg);
  if (!c || !b) return color;
  const r = Math.round(c.r + (b.r - c.r) * ratio);
  const g = Math.round(c.g + (b.g - c.g) * ratio);
  const bl = Math.round(c.b + (b.b - c.b) * ratio);
  return `rgb(${r},${g},${bl})`;
}

function hexToRgb(hex: string): {r: number; g: number; b: number} | null {
  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}
