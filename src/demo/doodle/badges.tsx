import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GridBackground} from '../../components/doodle/GridBackground';
import {PillBadge} from '../../components/doodle/PillBadge';
import {StepBadge} from '../../components/doodle/StepBadge';
import {theme} from '../../theme';

// PillBadge in both ACCENT colors.
export const PillBadgeDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <PillBadge x={700} y={540} text="徽章" fontSize={64} delay={0} seed={11} />
      <PillBadge
        x={1220}
        y={540}
        text="关键词"
        bg={theme.ACCENT[1]}
        fontSize={64}
        delay={8}
        seed={12}
        floatPhase={1}
      />
    </AbsoluteFill>
  );
};

// StepBadge sequence 1-2-3, staggered pop-in.
export const StepBadgeDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <StepBadge x={760} y={540} n={1} size={96} delay={0} seed={21} />
      <StepBadge
        x={960}
        y={540}
        n={2}
        size={96}
        delay={8}
        seed={22}
        floatPhase={1}
      />
      <StepBadge
        x={1160}
        y={540}
        n={3}
        size={96}
        delay={16}
        seed={23}
        floatPhase={2}
      />
    </AbsoluteFill>
  );
};
