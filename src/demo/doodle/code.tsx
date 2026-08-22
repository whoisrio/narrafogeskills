import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GridBackground} from '../../components/doodle/GridBackground';
import {CodeCard} from '../../components/doodle/CodeCard';

const LINES = [
  'const loop = createLoop(config)',
  "loop.on('tool_use', callTool)",
  "loop.on('stop', saveTrace)",
  'await loop.run(input)',
  'console.log(loop.state)',
];

const useWalkLine = () => {
  const frame = useCurrentFrame();
  return frame < 12
    ? -1
    : Math.min(LINES.length - 1, Math.floor((frame - 12) / 18));
};

// CodeCard light variant: lines light up one by one, focus bar follows,
// covered lines fall back to the done opacity.
export const CodeCardDemo: React.FC = () => {
  const activeLine = useWalkLine();
  return (
    <AbsoluteFill>
      <GridBackground />
      <CodeCard
        x={960}
        y={540}
        width={900}
        lines={LINES}
        activeLine={activeLine}
        fontSize={32}
        delay={0}
        seed={71}
      />
    </AbsoluteFill>
  );
};

// CodeCard dark variant: VSCode-style window with title bar, traffic lights
// and minimal syntax colors.
export const CodeCardDarkDemo: React.FC = () => {
  const activeLine = useWalkLine();
  return (
    <AbsoluteFill>
      <GridBackground />
      <CodeCard
        x={960}
        y={540}
        width={900}
        lines={LINES}
        activeLine={activeLine}
        fontSize={32}
        variant="dark"
        title="loop.ts"
        delay={0}
        seed={81}
      />
    </AbsoluteFill>
  );
};
