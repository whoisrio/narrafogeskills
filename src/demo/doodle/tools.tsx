import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GridBackground} from '../../components/doodle/GridBackground';
import {WrenchGear} from '../../components/doodle/WrenchGear';
import {PillBadge} from '../../components/doodle/PillBadge';

// WrenchGear: hand-written SVG "tools" icon with a label badge.
export const WrenchGearDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <WrenchGear x={960} y={460} size={280} delay={0} seed={91} />
      <PillBadge
        x={960}
        y={760}
        text="tools"
        fontSize={52}
        delay={12}
        seed={92}
        floatPhase={1}
      />
    </AbsoluteFill>
  );
};
