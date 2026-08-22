import React from 'react';
import {AbsoluteFill} from 'remotion';
import {DatabaseCylinder} from '../../../components/doodle/DatabaseCylinder';
import {PillBadge} from '../../../components/doodle/PillBadge';
import {DashedArrow} from '../../../components/doodle/DashedArrow';
import {theme} from '../../../theme';

const CENTER_X = 960;
const CENTER_Y = 520;

interface Satellite {
  text: string;
  x: number;
  y: number;
  bg: string;
  seed: number;
  left: boolean;
}

const SATELLITES: Satellite[] = [
  {text: 'ANN', x: 330, y: 320, bg: theme.ACCENT[0], seed: 301, left: true},
  {text: 'RAG', x: 330, y: 700, bg: theme.ACCENT[1], seed: 302, left: true},
  {text: 'Memory', x: 1590, y: 320, bg: theme.ACCENT[1], seed: 303, left: false},
  {text: '以图搜图', x: 1590, y: 700, bg: theme.ACCENT[0], seed: 304, left: false},
];

// Scene 3: vector database concept map — symmetric left/right layout.
export const Scene3ConceptMap: React.FC = () => {
  return (
    <AbsoluteFill>
      <DatabaseCylinder
        x={CENTER_X}
        y={CENTER_Y - 40}
        w={260}
        h={200}
        delay={0}
        seed={300}
        floatPhase={0.5}
      />
      <PillBadge
        x={CENTER_X}
        y={CENTER_Y + 190}
        text="向量数据库"
        bg={theme.ACCENT[0]}
        fontSize={52}
        delay={8}
        seed={305}
        floatPhase={1.5}
      />
      {SATELLITES.map((s, i) => {
        const delay = 20 + i * 12;
        const side = s.left ? 1 : -1;
        // Arrow from the badge's inner edge back to the cylinder side.
        const sx = s.x + side * 130;
        const sy = s.y;
        const ex = CENTER_X - side * 175;
        const ey = CENTER_Y - 40 + (s.y < CENTER_Y ? -55 : 55);
        return (
          <React.Fragment key={s.text}>
            <DashedArrow
              x1={sx}
              y1={sy}
              x2={ex}
              y2={ey}
              bend={s.left === s.y < CENTER_Y ? 45 : -45}
              delay={delay + 6}
            />
            <PillBadge
              x={s.x}
              y={s.y}
              text={s.text}
              bg={s.bg}
              fontSize={48}
              delay={delay}
              seed={s.seed}
              floatPhase={i * 1.1}
            />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
