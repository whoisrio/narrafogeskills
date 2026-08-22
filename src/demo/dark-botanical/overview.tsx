import React from 'react';
import {
  BigText,
  Card,
  CounterUp,
  FeatureCard,
  GoldLine,
  SceneLayout,
  SubText,
  Tag,
} from '../../components/dark-botanical/Primitives';
import {C, SIZE} from '../../components/dark-botanical/theme';

// Dark Botanical 总览:背景 / Tag / 大标题 / 装饰线 / 数字 / 卡片。
export const DarkBotanicalDemo: React.FC = () => {
  return (
    <SceneLayout bgVariant="warm" gap={26}>
      <Tag delay={0}>DARK BOTANICAL</Tag>
      <BigText delay={5}>暗底暖金</BigText>
      <GoldLine delay={12} width={260} />
      <SubText delay={16} size={SIZE.bodySm}>
        衬线大标题 + 暖金点缀 + 深色画布
      </SubText>
      <div style={{display: 'flex', gap: 28, marginTop: 12}}>
        <Card title="组件" value="12+" delay={22} />
        <Card title="图表" value="7" color={C.cyan} delay={28} />
        <Card title="预设" value="2" color={C.pink} delay={34} />
      </div>
      <CounterUp to={10492} delay={44} size={72} suffix=" 行" />
      <FeatureCard
        title="FeatureCard"
        desc="植物学风格功能卡片,Reveal 入场"
        color={C.warm}
        delay={56}
        style={{width: 520}}
      />
    </SceneLayout>
  );
};
