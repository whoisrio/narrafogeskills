import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {
  BotanicalBg,
  Tag,
  BigText,
  FeatureCard,
  SceneLayout,
} from '../../components/dark-botanical/Primitives';
import {FlowNode} from '../../components/dark-botanical/FlowNode';
import {FlowArrow} from '../../components/dark-botanical/FlowArrow';
import {Container} from '../../components/dark-botanical/Container';
import {Table} from '../../components/dark-botanical/Table';
import {Matrix} from '../../components/dark-botanical/Matrix';
import {Vector} from '../../components/dark-botanical/Vector';
import {TokenSequence} from '../../components/dark-botanical/TokenSequence';
import {ChatBubble} from '../../components/dark-botanical/ChatBubble';
import {Formula} from '../../components/dark-botanical/Formula';
import {Magnifier} from '../../components/dark-botanical/Magnifier';
import {ParticleAssembly} from '../../components/dark-botanical/ParticleAssembly';
import {C} from '../../components/dark-botanical/theme';

const Bg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <BotanicalBg variant="warm" />
    {children}
  </AbsoluteFill>
);

// FlowNode · agent 架构节点(model/tools/END,special 双描边 + 身份条)
export const DBFlowNodeDemo: React.FC = () => (
  <Bg>
    <Tag delay={0}>FLOW NODE</Tag>
    <FlowNode x={640} y={540} label="model" sub="LLM" shape="special" color={C.gold} delay={8} />
    <FlowNode x={960} y={540} label="tools" sub="TOOL" color={C.cyan} delay={20} />
    <FlowNode x={1280} y={540} label="END" color={C.textMuted} delay={32} shape="diamond" />
  </Bg>
);

// FlowArrow · 弯曲边 + loop 回流弧
export const DBFlowArrowDemo: React.FC = () => (
  <Bg>
    <Tag delay={0}>FLOW ARROW</Tag>
    <FlowArrow from={{x: 700, y: 540}} to={{x: 900, y: 540}} color={C.gold} delay={8} />
    <FlowArrow from={{x: 1020, y: 540}} to={{x: 1220, y: 540}} color={C.cyan} delay={20} type="dashed" />
    <FlowArrow from={{x: 1100, y: 480}} to={{x: 820, y: 480}} type="loop" loopLift={90} color={C.pink} delay={32} />
  </Bg>
);

// Container · 分组框(Transformer 层 = Attention -> FFN,节点作为兄弟落进框内)
export const DBContainerDemo: React.FC = () => (
  <Bg>
    <Container x={460} y={340} w={1000} h={380} label="Transformer 层" delay={0} />
    <FlowNode x={720} y={540} label="Attention" color={C.gold} delay={20} />
    <FlowArrow from={{x: 800, y: 540}} to={{x: 1120, y: 540}} color={C.gold} delay={50} />
    <FlowNode x={1200} y={540} label="FFN" color={C.pink} delay={72} />
  </Bg>
);

// Table · 模型配置对比表
export const DBTableDemo: React.FC = () => (
  <Bg>
    <Tag delay={0}>MODEL CONFIG</Tag>
    <Table
      x={510}
      y={300}
      headers={['Model', 'Params', 'Context', 'Cost']}
      rows={[
        ['GPT-4', '1.8T', '128K', '$$$'],
        ['Claude 3', '1.0T', '200K', '$$'],
        ['Llama 3', '70B', '8K', '$'],
      ]}
      colWidths={[220, 220, 220, 180]}
      highlightRow={2}
      delay={8}
    />
  </Bg>
);

// Matrix · attention 权重矩阵(强度着色逐格)
export const DBMatrixDemo: React.FC = () => (
  <Bg>
    <Tag delay={0}>ATTENTION MATRIX</Tag>
    <Matrix
      x={560}
      y={380}
      label="Weights"
      rowDim="query"
      colDim="key"
      data={[
        [0.9, 0.2, 0.1, 0.05],
        [0.3, 0.8, 0.4, 0.1],
        [0.1, 0.3, 0.9, 0.3],
        [0.05, 0.1, 0.4, 0.85],
      ]}
      color={C.gold}
      cellSize={72}
      delay={8}
    />
  </Bg>
);

// Vector · embedding 向量
export const DBVectorDemo: React.FC = () => (
  <Bg>
    <Tag delay={0}>EMBEDDING</Tag>
    <Vector x={560} y={500} label="embedding" dimLabel="1×6" values={['0.2', '-0.5', '0.8', '0.1', '-0.3', '0.6']} color={C.gold} delay={8} />
  </Bg>
);

// TokenSequence · token 流(T3 激活 + attention 弧)
export const DBTokenSequenceDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.min(5, Math.floor(frame / 30));
  return (
    <Bg>
      <Tag delay={0}>TOKEN SEQUENCE</Tag>
      <TokenSequence x={300} y={460} count={6} activeToken={active} showAttention windowSize={3} delay={8} />
    </Bg>
  );
};

// ChatBubble · LLM 对话
export const DBChatBubbleDemo: React.FC = () => (
  <Bg>
    <Tag delay={0}>CHAT</Tag>
    <ChatBubble x={240} y={320} w={620} role="user" text="RAG 和微调有什么区别?" delay={0} />
    <ChatBubble x={1060} y={540} w={620} role="assistant" text="RAG 是检索后拼上下文,微调是改权重。" delay={30} />
  </Bg>
);

// Formula · softmax attention 公式
export const DBFormulaDemo: React.FC = () => (
  <Bg>
    <Tag delay={0}>FORMULA</Tag>
    <Formula
      x={340}
      y={500}
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
      size={56}
      delay={8}
      underlineIndex={5}
    />
  </Bg>
);

// Magnifier · 放大聚焦(包 FeatureCard,HTML 子元素)
export const DBMagnifierDemo: React.FC = () => (
  <Bg>
    <Tag delay={0}>MAGNIFIER</Tag>
    <div style={{position: 'absolute', left: 660, top: 420}}>
      <Magnifier focusAt={20} focusDuration={80} maxScale={1.3}>
        <FeatureCard
          title="KV Cache"
          desc="放大看这块:缓存历史 token 的 K/V,避免重算"
          color={C.gold}
          delay={0}
          style={{width: 600}}
        />
      </Magnifier>
    </div>
  </Bg>
);

// ParticleAssembly · 打散重组(4×4 粒子聚合)
export const DBParticleAssemblyDemo: React.FC = () => (
  <Bg>
    <Tag delay={0}>PARTICLE ASSEMBLY</Tag>
    <ParticleAssembly x={700} y={400} rows={4} cols={4} cellSize={64} color={C.gold} delay={0} spread={260} />
  </Bg>
);
