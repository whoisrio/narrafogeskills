import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GridBackground} from '../../components/doodle/GridBackground';
import {StickerImage} from '../../components/doodle/StickerImage';
import {PillBadge} from '../../components/doodle/PillBadge';

// StickerImage wrapping an AI-generated asset with the sticker border.
export const StickerImageDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <StickerImage
        src="sample-sticker.png"
        x={960}
        y={260}
        width={360}
        delay={0}
        rotate={-2}
      />
      <PillBadge
        x={960}
        y={800}
        text="AI 素材"
        fontSize={52}
        delay={12}
        seed={81}
        floatPhase={1}
      />
    </AbsoluteFill>
  );
};
