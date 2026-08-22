import React from 'react';
import {AbsoluteFill, Series, useCurrentFrame} from 'remotion';
import {GridBackground} from '../../../components/doodle/GridBackground';
import {PillBadge} from '../../../components/doodle/PillBadge';
import {TokenSequence} from '../../../components/doodle/TokenSequence';
import {Matrix} from '../../../components/doodle/Matrix';
import {BigTitle} from '../../../components/doodle/BigTitle';
import {theme} from '../../../theme';

// e2e 示例 · Attention 是什么(对应 doodle examples.md 示例 4):
// 场景 1:attention 概念 + token 序列 + 权重矩阵
// 场景 2:聚焦 T3,看它关注谁(active 高亮 + attention 弧线 + T3 的注意力行)
// 演示新 ML 构件(TokenSequence/Matrix)如何编排成场景。
export const ATTENTION_DURATION = 260;

const Scene1Concept: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <BigTitle x={960} y={150} words={[{text: 'Attention'}]} delay={0} />
      <TokenSequence x={360} y={340} count={6} activeToken={-1} showAttention={false} delay={20} />
      <Matrix
        x={560}
        y={560}
        label="权重矩阵"
        rowDim="q"
        colDim="k"
        data={[
          [0.9, 0.2, 0.1, 0.05, 0.05, 0.05],
          [0.3, 0.8, 0.4, 0.1, 0.05, 0.05],
          [0.1, 0.3, 0.9, 0.3, 0.1, 0.05],
          [0.05, 0.1, 0.4, 0.85, 0.3, 0.1],
          [0.05, 0.05, 0.1, 0.3, 0.8, 0.4],
          [0.05, 0.05, 0.05, 0.1, 0.4, 0.9],
        ]}
        color={theme.PALETTE[0]}
        cellSize={48}
        delay={50}
      />
      <PillBadge x={960} y={1000} text="每个 token 看其他所有 token" delay={120} />
    </AbsoluteFill>
  );
};

const Scene2Focus: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <GridBackground />
      <BigTitle x={960} y={150} words={[{text: '看 T3 关注谁'}]} delay={0} />
      <TokenSequence x={300} y={420} count={6} activeToken={3} showAttention windowSize={3} delay={10} />
      {/* T3 那一行注意力单独高亮显示在右侧 */}
      <Matrix
        x={1100}
        y={440}
        label="T3 的注意力"
        data={[[0.1, 0.3, 0.9, 0.3, 0.1, 0.05]]}
        color={theme.ACCENT[0]}
        cellSize={56}
        delay={30}
      />
      {frame > 90 && <PillBadge x={960} y={1000} text="主要关注 T1、T2" delay={90} />}
    </AbsoluteFill>
  );
};

export const Attention: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <Series>
        <Series.Sequence durationInFrames={130}>
          <Scene1Concept />
        </Series.Sequence>
        <Series.Sequence durationInFrames={130}>
          <Scene2Focus />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
