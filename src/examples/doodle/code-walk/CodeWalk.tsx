import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GridBackground} from '../../../components/doodle/GridBackground';
import {BigTitle} from '../../../components/doodle/BigTitle';
import {CodeCard} from '../../../components/doodle/CodeCard';
import {PillBadge} from '../../../components/doodle/PillBadge';
import {DashedArrow} from '../../../components/doodle/DashedArrow';
import {theme} from '../../../theme';

const LINES = [
  'if follow_up_queue.empty: return',
  'messages = follow_up_queue.drain()',
  'state.messages += messages',
  'jump_to = "model"',
];

// e2e example (template 7): line-by-line walkthrough of the followup
// middleware jump_to snippet.
export const CodeWalk: React.FC = () => {
  const frame = useCurrentFrame();
  // 20f/40f/55f light up lines 1-3, 95f line 4 takes focus and keeps it.
  const activeLine =
    frame < 20 ? -1 : frame < 40 ? 0 : frame < 55 ? 1 : frame < 95 ? 2 : 3;

  return (
    <AbsoluteFill>
      <GridBackground />
      <BigTitle
        x={960}
        y={105}
        fontSize={60}
        words={[{text: 'FollowUp'}, {text: 'Middleware', accent: true}]}
        delay={0}
        wordGap={5}
      />

      <CodeCard
        x={1300}
        y={540}
        width={880}
        lines={LINES}
        activeLine={activeLine}
        fontSize={32}
        delay={0}
        seed={601}
      />

      {/* annotation 1 -> line 2 (messages drain) */}
      <PillBadge
        x={420}
        y={430}
        text="注入对话历史"
        fontSize={44}
        delay={70}
        seed={611}
        floatPhase={0.7}
      />
      <DashedArrow
        x1={610}
        y1={445}
        x2={830}
        y2={510}
        bend={-30}
        delay={78}
        grow
        growFrames={15}
      />

      {/* annotation 2 -> line 4 (jump_to) */}
      <PillBadge
        x={430}
        y={770}
        text="点睛之笔:重启循环"
        bg={theme.ACCENT[1]}
        fontSize={38}
        delay={110}
        seed={612}
        floatPhase={1.9}
      />
      <DashedArrow
        x1={655}
        y1={755}
        x2={830}
        y2={632}
        bend={30}
        delay={118}
        grow
        growFrames={15}
      />
    </AbsoluteFill>
  );
};
