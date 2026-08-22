import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GridBackground} from '../../components/doodle/GridBackground';
import {DashedArrow} from '../../components/doodle/DashedArrow';
import {SplitDivider} from '../../components/doodle/SplitDivider';
import {CircleNode} from '../../components/doodle/CircleNode';
import {PillBadge} from '../../components/doodle/PillBadge';
import {theme} from '../../theme';

// DashedArrow between two nodes, one arc per bend direction.
export const DashedArrowDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <CircleNode x={520} y={400} r={70} delay={0} seed={61} />
      <CircleNode
        x={1400}
        y={400}
        r={70}
        fill={theme.PALETTE[4]}
        dotFill={theme.STICKER}
        delay={6}
        seed={62}
        floatPhase={1}
      />
      <DashedArrow x1={620} y1={400} x2={1300} y2={400} bend={-70} delay={14} />
      <CircleNode
        x={520}
        y={720}
        r={70}
        fill={theme.PALETTE[1]}
        delay={20}
        seed={63}
        floatPhase={2}
      />
      <CircleNode
        x={1400}
        y={720}
        r={70}
        fill={theme.PALETTE[2]}
        dotFill={theme.INK}
        delay={26}
        seed={64}
        floatPhase={3}
      />
      <DashedArrow x1={620} y1={720} x2={1300} y2={720} bend={70} delay={34} />
    </AbsoluteFill>
  );
};

// SplitDivider growing top-to-bottom between two side badges.
export const SplitDividerDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <SplitDivider x={960} y1={120} y2={960} delay={0} growFrames={24} />
      <PillBadge x={560} y={540} text="方案 A" fontSize={56} delay={26} seed={71} />
      <PillBadge
        x={1360}
        y={540}
        text="方案 B"
        bg={theme.ACCENT[1]}
        fontSize={56}
        delay={34}
        seed={72}
        floatPhase={1}
      />
    </AbsoluteFill>
  );
};
