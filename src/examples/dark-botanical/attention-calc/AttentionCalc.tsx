import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BotanicalBg, BigText, Tag, SubText} from '../../../components/dark-botanical/Primitives';
import {Matrix} from '../../../components/dark-botanical/Matrix';
import {Vector} from '../../../components/dark-botanical/Vector';
import {Formula} from '../../../components/dark-botanical/Formula';
import {FlowArrow} from '../../../components/dark-botanical/FlowArrow';
import {C} from '../../../components/dark-botanical/theme';

// e2e 示例 · Attention 计算(对应 dark-botanical examples.md 示例 3):
// Formula(QKᵀ/√d -> softmax) -> Matrix(权重矩阵) -> Vector(V) -> 输出
// 演示新 ML 构件(Matrix/Vector/Formula/FlowArrow)在暗金风下如何编排。
export const ATTENTION_CALC_DURATION = 300;

export const AttentionCalc: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, fontFamily: "'Noto Sans SC', sans-serif"}}>
      <BotanicalBg variant="warm" />

      <Tag delay={0}>ATTENTION · 计算</Tag>

      <BigText size={64} color={C.gold} delay={8} style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center'}}>
        Q × Kᵀ → softmax → × V
      </BigText>

      {/* Formula */}
      <Formula
        x={300}
        y={280}
        parts={[
          {t: 'Attn(', kind: 'fn'},
          {t: 'Q', kind: 'var'},
          {t: ',', kind: 'op'},
          {t: 'K', kind: 'var'},
          {t: ') = softmax(', kind: 'fn'},
          {t: 'Q', kind: 'var'},
          {t: '·', kind: 'op'},
          {t: 'K', kind: 'var'},
          {t: 'ᵀ / √d', kind: 'op'},
          {t: ')', kind: 'op'},
        ]}
        size={48}
        delay={20}
        underlineIndex={5}
      />

      {/* 权重矩阵 */}
      <Matrix
        x={300}
        y={440}
        label="权重矩阵"
        rowDim="q"
        colDim="k"
        data={[
          [0.9, 0.2, 0.1, 0.05],
          [0.3, 0.8, 0.4, 0.1],
          [0.1, 0.3, 0.9, 0.3],
          [0.05, 0.1, 0.4, 0.85],
        ]}
        color={C.gold}
        cellSize={56}
        delay={90}
      />

      {/* 箭头:矩阵 -> V */}
      <FlowArrow from={{x: 620, y: 600}} to={{x: 980, y: 600}} color={C.gold} delay={180} drawDur={18} />

      {/* V 向量 */}
      <Vector
        x={1000}
        y={440}
        label="V"
        dimLabel="4×1"
        values={['0.5', '0.3', '0.8', '0.2']}
        color={C.goldBright}
        delay={200}
      />

      <SubText delay={250} size={22} color={C.textMuted} style={{position: 'absolute', bottom: 90, left: 0, right: 0, textAlign: 'center'}}>
        权重矩阵 × V = 输出
      </SubText>
    </AbsoluteFill>
  );
};
