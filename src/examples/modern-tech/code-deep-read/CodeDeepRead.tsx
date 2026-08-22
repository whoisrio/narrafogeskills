import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {CodePanel, CodeSection} from '../../../components/modern-tech/CodePanel';
import {useShikiTokens} from '../../../components/modern-tech/useShikiTokens';
import {PatternTitle} from '../../../components/modern-tech/graph/PatternTitle';
import {C, PATTERN_COLORS} from '../../../components/modern-tech/theme';

// e2e 示例 · 代码深读(模板 6):Shiki 语法高亮 + 按段高亮当前讲解段。
// 展示 modern-tech 的 CodePanel(全库唯一 Remotion 兼容 Shiki 高亮)。
// useShikiTokens 用 delayRender 阻塞渲染直到 token 计算完成,结果缓存。
const CODE = `def agent_loop(state):
    while state.has_tool_calls:
        result = run_tool(state.tool_calls)
        state.messages.append(result)
    return state`;

export const CODE_DEEP_READ_DURATION = 180;

export const CodeDeepRead: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;

  // Shiki 预计算(异步,delayRender 阻塞)
  const tokens = useShikiTokens(CODE, 'python');

  // 三段:函数签名 / 循环体 / 返回
  const sections: CodeSection[] = [
    {startLine: 0, endLine: 0, highlightAt: 1.5},
    {startLine: 1, endLine: 3, highlightAt: 3.0},
    {startLine: 4, endLine: 4, highlightAt: 5.0},
  ];

  // 当前段按时间推进
  let currentSectionIndex = -1;
  if (sec >= sections[2].highlightAt) currentSectionIndex = 2;
  else if (sec >= sections[1].highlightAt) currentSectionIndex = 1;
  else if (sec >= sections[0].highlightAt) currentSectionIndex = 0;

  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: C.text}}>
      <PatternTitle
        kicker="源码 · agent_loop"
        title="Code Walk"
        subtitle="逐段拆解循环体"
        accentColor={PATTERN_COLORS.chain}
        appearAt={0}
        x={200}
        y={110}
      />

      <div
        style={{
          position: 'absolute',
          left: 360,
          top: 420,
          width: 1200,
        }}
      >
        <CodePanel
          lines={CODE.split('\n')}
          tokens={tokens ?? undefined}
          sections={sections}
          currentSectionIndex={currentSectionIndex}
          height={420}
          fontSize={28}
        />
      </div>
    </AbsoluteFill>
  );
};
