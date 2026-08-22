import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GridBackground} from '../../components/doodle/GridBackground';
import {DoodleCard} from '../../components/doodle/DoodleCard';
import {LinkedBlocks} from '../../components/doodle/LinkedBlocks';

// GridBackground alone: paper texture + hand-drawn grid.
export const GridBackgroundDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
    </AbsoluteFill>
  );
};

// DoodleCard with a LinkedBlocks row inside, its typical usage.
export const DoodleCardDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <DoodleCard x={510} y={340} w={900} h={400} delay={0} seed={31} />
      <LinkedBlocks
        x={960}
        y={540}
        blockSize={64}
        gap={26}
        withCard={false}
        delay={10}
        seed={32}
      />
    </AbsoluteFill>
  );
};
