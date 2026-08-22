import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GridBackground} from '../../components/doodle/GridBackground';
import {Matrix} from '../../components/doodle/Matrix';
import {Vector} from '../../components/doodle/Vector';
import {TokenSequence} from '../../components/doodle/TokenSequence';
import {Formula} from '../../components/doodle/Formula';
import {ChatBubble} from '../../components/doodle/ChatBubble';
import {ParticleAssembly} from '../../components/doodle/ParticleAssembly';
import {Container} from '../../components/doodle/Container';
import {Table} from '../../components/doodle/Table';
import {CircleNode} from '../../components/doodle/CircleNode';
import {PillBadge} from '../../components/doodle/PillBadge';
import {DashedArrow} from '../../components/doodle/DashedArrow';
import {theme} from '../../theme';

// 每个 demo 是一个真实 AI 场景(不是抽象样例),演示新构件适合的用法。
// 全部铺在 GridBackground 上,内容居中。

// Matrix · attention 权重矩阵(4×4,token×token,强度着色)
export const MatrixDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <Matrix
        x={560}
        y={420}
        label="Attention Weights"
        rowDim="query"
        colDim="key"
        data={[
          [0.9, 0.2, 0.1, 0.05],
          [0.3, 0.8, 0.4, 0.1],
          [0.1, 0.3, 0.9, 0.3],
          [0.05, 0.1, 0.4, 0.85],
        ]}
        color={theme.PALETTE[0]}
        cellSize={64}
        delay={0}
      />
    </AbsoluteFill>
  );
};

// Vector · embedding 向量(一行值)
export const VectorDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <Vector
        x={560}
        y={500}
        label="embedding"
        dimLabel="1×6"
        values={['0.2', '-0.5', '0.8', '0.1', '-0.3', '0.6']}
        color={theme.PALETTE[0]}
        delay={0}
      />
    </AbsoluteFill>
  );
};

// TokenSequence · token 流(T3 激活 + attention 弧线)
export const TokenSequenceDemo: React.FC = () => {
  const frame = useCurrentFrame();
  // activeToken 随帧推进,演示注意力滑动
  const active = Math.min(5, Math.floor(frame / 30));
  return (
    <AbsoluteFill>
      <GridBackground />
      <TokenSequence
        x={420}
        y={460}
        count={6}
        activeToken={active}
        showAttention
        windowSize={3}
        delay={0}
      />
    </AbsoluteFill>
  );
};

// Formula · softmax attention 公式
export const FormulaDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <Formula
        x={420}
        y={520}
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
        size={64}
        delay={0}
        underlineIndex={5}
      />
    </AbsoluteFill>
  );
};

// ChatBubble · LLM 对话(user 问 + assistant 答)
export const ChatBubbleDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <ChatBubble x={300} y={320} w={560} role="user" text="RAG 和微调有什么区别?" delay={0} />
      <ChatBubble x={1060} y={520} w={560} role="assistant" text="RAG 是检索后拼上下文,微调是改权重。" delay={30} />
    </AbsoluteFill>
  );
};

// ParticleAssembly · QKV 打散重组(4×4 粒子聚合)
export const ParticleAssemblyDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <ParticleAssembly
        x={700}
        y={400}
        rows={4}
        cols={4}
        cellSize={64}
        values={['Q', 'Q', 'Q', 'Q', 'K', 'K', 'K', 'K', 'V', 'V', 'V', 'V', '·', '·', '·', '·']}
        color={theme.PALETTE[0]}
        delay={0}
        spread={260}
      />
    </AbsoluteFill>
  );
};

// Container · 分组框:框住几个独立节点表示一个命名子系统。
// 注意:doodle 节点(CircleNode 等)是绝对定位的,要作为 Container 的【兄弟】
// 用绝对坐标落进框内,不能当 children(绝对定位不理 flex,会堆到左上角)。
// 这里演示「Transformer 层 = Attention -> FFN」。
export const ContainerDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      {/* 只画框 + 标签 */}
      <Container x={460} y={340} w={1000} h={380} label="Transformer 层" delay={0} />
      {/* 框内节点作为兄弟,绝对坐标落在框内(460-1460, 340-720) */}
      <CircleNode x={720} y={540} r={72} fill={theme.PALETTE[0]} delay={20} />
      <PillBadge x={720} y={670} text="Attention" delay={28} fontSize={30} />
      <DashedArrow x1={800} y1={540} x2={1120} y2={540} bend={0} grow delay={50} growFrames={18} />
      <CircleNode x={1200} y={540} r={72} fill={theme.PALETTE[2]} delay={72} />
      <PillBadge x={1200} y={670} text="FFN" delay={80} fontSize={30} />
    </AbsoluteFill>
  );
};

// Table · 模型配置对比表
export const TableDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <Table
        x={560}
        y={360}
        headers={['Model', 'Params', 'Context', 'Cost']}
        rows={[
          ['GPT-4', '1.8T', '128K', '$$$'],
          ['Claude 3', '1.0T', '200K', '$$'],
          ['Llama 3', '70B', '8K', '$'],
        ]}
        colWidths={[200, 200, 200, 160]}
        highlightRow={2}
        delay={0}
      />
    </AbsoluteFill>
  );
};
