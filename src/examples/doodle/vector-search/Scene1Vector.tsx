import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PillBadge} from '../../../components/doodle/PillBadge';
import {LinkedBlocks} from '../../../components/doodle/LinkedBlocks';
import {DashedArrow} from '../../../components/doodle/DashedArrow';
import {CircleNode} from '../../../components/doodle/CircleNode';
import {theme} from '../../../theme';

// steel blue / teal / coral / yellow, matching the palette order of the
// original vector_db_doodle scenes.
const BLOCK_COLORS = [
  theme.PALETTE[4],
  theme.PALETTE[0],
  theme.PALETTE[3],
  theme.PALETTE[2],
];

// Scene 1: what a vector is — horizontal narrative.
export const Scene1Vector: React.FC = () => {
  return (
    <AbsoluteFill>
      <PillBadge
        x={440}
        y={330}
        text="向量"
        bg={theme.ACCENT[0]}
        fontSize={60}
        delay={0}
        seed={101}
      />
      <LinkedBlocks
        x={440}
        y={590}
        blockSize={84}
        gap={32}
        colors={BLOCK_COLORS}
        delay={10}
        stagger={6}
        seed={110}
        withCard
        floatPhase={1}
      />
      <DashedArrow
        x1={790}
        y1={570}
        x2={1300}
        y2={470}
        bend={-50}
        delay={40}
      />
      <PillBadge
        x={1480}
        y={430}
        text="向量检索"
        bg={theme.ACCENT[1]}
        fontSize={56}
        delay={50}
        seed={102}
        floatPhase={2}
      />
      <CircleNode x={1480} y={660} r={62} delay={60} seed={120} floatPhase={3} />
    </AbsoluteFill>
  );
};
