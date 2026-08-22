import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GridBackground} from '../../../components/doodle/GridBackground';
import {BigTitle} from '../../../components/doodle/BigTitle';
import {PillBadge} from '../../../components/doodle/PillBadge';
import {DoodleCard} from '../../../components/doodle/DoodleCard';
import {LinkedBlocks} from '../../../components/doodle/LinkedBlocks';
import {WrenchGear} from '../../../components/doodle/WrenchGear';
import {DashedArrow} from '../../../components/doodle/DashedArrow';
import {theme} from '../../../theme';

// e2e example: the simple agent loop.
// START -> model -(tool_calls)-> tools -(result)-> model, model -(stop)-> END.
export const AgentLoop: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <BigTitle
        x={960}
        y={105}
        fontSize={64}
        words={[
          {text: 'Simple'},
          {text: 'Agent'},
          {text: 'Loop', accent: true},
        ]}
        delay={0}
        wordGap={5}
      />

      {/* START */}
      <PillBadge
        x={190}
        y={480}
        text="START"
        bg={theme.ACCENT[1]}
        fontSize={44}
        delay={0}
        seed={501}
        floatPhase={0.4}
      />
      {/* arrow 1: START -> model */}
      <DashedArrow x1={310} y1={480} x2={415} y2={480} bend={-25} delay={10} />

      {/* model node */}
      <DoodleCard x={430} y={350} w={440} h={260} delay={20} seed={510} />
      <LinkedBlocks
        x={640}
        y={450}
        blockSize={42}
        gap={15}
        withCard={false}
        delay={26}
        stagger={3}
        seed={511}
      />
      <PillBadge
        x={640}
        y={562}
        text="model"
        fontSize={40}
        delay={30}
        seed={512}
        floatPhase={0.8}
      />

      {/* arrow 2: model -(tool_calls)-> tools */}
      <DashedArrow x1={885} y1={450} x2={1260} y2={450} bend={-45} delay={45} />
      <PillBadge
        x={1070}
        y={360}
        text="tool_calls"
        bg={theme.ACCENT[1]}
        fontSize={32}
        delay={55}
        seed={513}
        floatPhase={1.6}
      />
      {/* arrow 3: model -(stop)-> END */}
      <DashedArrow x1={640} y1={615} x2={640} y2={770} bend={35} delay={48} />
      <PillBadge
        x={805}
        y={695}
        text="stop"
        bg={theme.ACCENT[1]}
        fontSize={32}
        delay={58}
        seed={514}
        floatPhase={2.1}
      />

      {/* tools node */}
      <WrenchGear x={1390} y={440} size={230} delay={60} seed={520} />
      <PillBadge
        x={1390}
        y={640}
        text="tools"
        fontSize={44}
        delay={70}
        seed={521}
        floatPhase={1.2}
      />

      {/* END */}
      <PillBadge
        x={640}
        y={830}
        text="END"
        bg={theme.ACCENT[1]}
        fontSize={44}
        delay={85}
        seed={522}
        floatPhase={2.6}
      />

      {/* arrow 4: loop back from tools bottom to model bottom */}
      <DashedArrow
        x1={1390}
        y1={700}
        x2={820}
        y2={620}
        bend={-260}
        delay={105}
      />
    </AbsoluteFill>
  );
};
