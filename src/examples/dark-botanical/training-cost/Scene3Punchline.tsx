import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  BigText,
  GlowBg,
  SubText,
  Tag,
} from '../../../components/dark-botanical/Primitives';
import {C} from '../../../components/dark-botanical/theme';

// 场景 3 · 金句收束:中心光斑 + 衬线大字金句收尾定调。
export const Scene3Punchline: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localSec = frame / fps;

  const capOpacity = Math.min(
    1,
    Math.max(0, (localSec - 0.5) * 2, (4.5 - localSec) * 2)
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        paddingBottom: 54,
      }}
    >
      <GlowBg color={C.gold} size={620} delay={0} />

      <Tag delay={8} color={C.goldBright}>
        INFERENCE ERA
      </Tag>

      <BigText size={84} color={C.gold} delay={18} punch>
        成本崩塌
      </BigText>
      <BigText size={84} color={C.text} delay={42} punch glow={false} serif>
        门槛消失
      </BigText>

      <SubText delay={70} size={24} color={C.textDim}>
        当训练便宜两个数量级,谁都能训自己的模型
      </SubText>

      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: '7%',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            opacity: capOpacity,
            fontFamily: "'Noto Sans SC','PingFang SC',sans-serif",
            fontSize: 40,
            fontWeight: 600,
            color: '#eef2f7',
            textShadow: '0 2px 24px rgba(0,0,0,0.6)',
          }}
        >
          推理时代,正式开场
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
