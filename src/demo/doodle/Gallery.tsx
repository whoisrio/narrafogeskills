import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GridBackground} from '../../components/doodle/GridBackground';
import {BigTitle} from '../../components/doodle/BigTitle';
import {PillBadge} from '../../components/doodle/PillBadge';
import {StepBadge} from '../../components/doodle/StepBadge';
import {DoodleCard} from '../../components/doodle/DoodleCard';
import {LinkedBlocks} from '../../components/doodle/LinkedBlocks';
import {DatabaseCylinder} from '../../components/doodle/DatabaseCylinder';
import {DashedArrow} from '../../components/doodle/DashedArrow';
import {SplitDivider} from '../../components/doodle/SplitDivider';
import {StickerImage} from '../../components/doodle/StickerImage';
import {theme} from '../../theme';

// Component gallery: every library component in one frame.
export const Gallery: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />

      {/* left half */}
      <BigTitle
        x={470}
        y={130}
        fontSize={88}
        words={[{text: '组件'}, {text: '画廊', accent: true}]}
        delay={0}
      />
      <PillBadge x={280} y={300} text="徽章" fontSize={44} delay={4} seed={11} />
      <PillBadge
        x={650}
        y={300}
        text="关键词"
        bg={theme.ACCENT[1]}
        fontSize={44}
        delay={8}
        seed={12}
        floatPhase={1}
      />
      <StepBadge x={250} y={460} n={1} delay={10} seed={21} />
      <StepBadge x={470} y={460} n={2} delay={13} seed={22} floatPhase={1} />
      <StepBadge x={690} y={460} n={3} delay={16} seed={23} floatPhase={2} />
      <DoodleCard x={110} y={560} w={720} h={260} delay={18} seed={31} />
      <LinkedBlocks
        x={470}
        y={690}
        blockSize={56}
        gap={22}
        withCard={false}
        delay={22}
        seed={32}
      />
      <StickerImage
        src="sample-sticker.png"
        x={470}
        y={860}
        width={170}
        delay={28}
        floatPhase={1}
      />

      {/* right half: mini hub-and-spoke */}
      <DatabaseCylinder x={1300} y={320} w={220} h={170} delay={4} seed={41} />
      <PillBadge
        x={1300}
        y={530}
        text="中心概念"
        fontSize={44}
        delay={10}
        seed={42}
        floatPhase={0.5}
      />
      <PillBadge
        x={1660}
        y={240}
        text="关联"
        bg={theme.ACCENT[1]}
        fontSize={40}
        delay={16}
        seed={43}
        floatPhase={1.2}
      />
      <PillBadge
        x={1660}
        y={760}
        text="生态"
        bg={theme.ACCENT[1]}
        fontSize={40}
        delay={20}
        seed={44}
        floatPhase={2}
      />
      <DashedArrow x1={1570} y1={260} x2={1430} y2={300} bend={-40} delay={24} />
      <DashedArrow x1={1570} y1={730} x2={1430} y2={390} bend={-40} delay={28} />
      <SplitDivider x={960} y1={80} y2={1000} delay={0} growFrames={24} />
    </AbsoluteFill>
  );
};
