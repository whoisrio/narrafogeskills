import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  AnimatedComparison,
} from '../../../components/dark-botanical/Charts';
import {
  BigText,
  CounterUp,
  GoldLine,
  SubText,
  Tag,
} from '../../../components/dark-botanical/Primitives';
import {Caption} from '../../../components/dark-botanical/Caption';
import {C} from '../../../components/dark-botanical/theme';

// 场景 1 · 数据冲击:2022 的 $4.6M vs 2025 的 $40K,降了 100×。
// 数字是暗金风的灵魂,这里用 AnimatedComparison 把两个数字并排暴击,
// 再用 CounterUp 把「100×」翻出来收束。
export const Scene1CostPunch: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localSec = frame / fps;

  // 字幕进度:整段 5s,「训练成本三年降百倍」逐字推进
  const capProgress = Math.min(1, Math.max(0, (localSec - 1) / 3.5));
  const capOpacity = Math.min(
    1,
    Math.max(0, (localSec - 1) * 2, (5 - localSec) * 2)
  );

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 28,
        paddingBottom: 54,
      }}
    >
      <Tag delay={0}>训练成本 · 2022 → 2025</Tag>

      <AnimatedComparison
        delay={12}
        left={{
          value: '$4.6M',
          label: '2022 · GPT-3 级',
          color: C.red,
          sub: '一次训练',
        }}
        right={{
          value: '$40K',
          label: '2025 · 同级',
          color: C.green,
          sub: '一次训练',
        }}
      />

      <GoldLine delay={70} width={320} />

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 18,
          marginTop: 4,
        }}
      >
        <CounterUp
          from={0}
          to={100}
          size={96}
          color={C.goldBright}
          suffix="×"
          delay={80}
          durationFrames={35}
        />
        <BigText size={52} color={C.text} delay={118} glow={false} serif>
          成本下降
        </BigText>
      </div>

      <SubText delay={130} size={22} color={C.textMuted}>
        同等能力,三年降两个数量级
      </SubText>

      <Caption
        text="训练成本三年降百倍"
        progress={capProgress}
        opacity={capOpacity}
      />
    </AbsoluteFill>
  );
};
