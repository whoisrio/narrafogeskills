import React from 'react';
import {AbsoluteFill} from 'remotion';
import {DoodleCard} from '../../../components/doodle/DoodleCard';
import {LinkedBlocks} from '../../../components/doodle/LinkedBlocks';
import {PillBadge} from '../../../components/doodle/PillBadge';
import {theme} from '../../../theme';

const BLOCK_COLORS = [
  theme.PALETTE[4],
  theme.PALETTE[0],
  theme.PALETTE[3],
  theme.PALETTE[2],
];

// Scene 2: a wide container full of vectors, popped in row by row.
export const Scene2MassiveData: React.FC = () => {
  const cardX = 210;
  const cardY = 140;
  const cardW = 1500;
  const cardH = 640;

  const cols = 4;
  const rows = 3;
  const innerPadX = 60;
  const innerPadY = 66;
  const cellW = (cardW - innerPadX * 2) / cols;
  const cellH = (cardH - innerPadY * 2) / rows;

  return (
    <AbsoluteFill>
      <DoodleCard
        x={cardX}
        y={cardY}
        w={cardW}
        h={cardH}
        delay={0}
        seed={200}
      />
      {Array.from({length: rows}).map((_, r) =>
        Array.from({length: cols}).map((__, c) => (
          <LinkedBlocks
            key={`${r}-${c}`}
            x={cardX + innerPadX + cellW * c + cellW / 2}
            y={cardY + innerPadY + cellH * r + cellH / 2}
            blockSize={42}
            gap={15}
            colors={BLOCK_COLORS}
            delay={8 + r * 12 + c * 4}
            stagger={2}
            seed={210 + r * cols + c}
            withCard={false}
            floatPhase={r * 1.3 + c * 0.7}
          />
        ))
      )}
      <PillBadge
        x={960}
        y={920}
        text="海量向量数据"
        bg={theme.ACCENT[0]}
        fontSize={56}
        delay={55}
        seed={201}
        floatPhase={1}
      />
    </AbsoluteFill>
  );
};
