import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GridBackground} from '../../components/doodle/GridBackground';
import {LinkedBlocks} from '../../components/doodle/LinkedBlocks';
import {DatabaseCylinder} from '../../components/doodle/DatabaseCylinder';
import {CircleNode} from '../../components/doodle/CircleNode';
import {PillBadge} from '../../components/doodle/PillBadge';
import {theme} from '../../theme';

// LinkedBlocks with its built-in card, blocks pop in one by one.
export const LinkedBlocksDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <LinkedBlocks
        x={960}
        y={540}
        blockSize={84}
        gap={32}
        delay={0}
        stagger={6}
        seed={110}
        withCard
      />
    </AbsoluteFill>
  );
};

// DatabaseCylinder with a label badge below.
export const DatabaseCylinderDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <DatabaseCylinder x={960} y={470} w={280} h={220} delay={0} seed={41} />
      <PillBadge
        x={960}
        y={760}
        text="标签"
        fontSize={52}
        delay={10}
        seed={42}
        floatPhase={1}
      />
    </AbsoluteFill>
  );
};

// CircleNode in two palette colors.
export const CircleNodeDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <CircleNode x={760} y={540} r={90} delay={0} seed={51} />
      <CircleNode
        x={1160}
        y={540}
        r={90}
        fill={theme.PALETTE[4]}
        dotFill={theme.STICKER}
        delay={8}
        seed={52}
        floatPhase={1}
      />
    </AbsoluteFill>
  );
};
