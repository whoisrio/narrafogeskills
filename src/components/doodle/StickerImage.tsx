import React from 'react';
import {Img, staticFile} from 'remotion';
import {theme} from '../../theme';
import {useFloat, usePopIn} from '../../hooks/usePopIn';

interface StickerImageProps {
  // File name inside the project's public/ dir, or a full URL.
  src: string;
  x: number;
  // Top edge anchor: image height is unknown until load, so y is the top.
  y: number;
  width: number;
  delay?: number;
  floatPhase?: number;
  rotate?: number;
}

// Wrapper for AI-generated assets (see asset-prompts.md): white sticker
// border + ink outline, pops in and floats exactly like code-drawn elements.
export const StickerImage: React.FC<StickerImageProps> = ({
  src,
  x,
  y,
  width,
  delay = 0,
  floatPhase = 0,
  rotate = 0,
}) => {
  const pop = usePopIn(delay);
  const floatY = useFloat(floatPhase);
  const resolved = /^https?:\/\//.test(src) ? src : staticFile(src);

  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y,
        width,
        opacity: pop.opacity,
        transform: `translateY(${pop.y + floatY}px) scale(${pop.scale}) rotate(${rotate}deg)`,
      }}
    >
      <div
        style={{
          backgroundColor: theme.STICKER,
          padding: 8,
          borderRadius: 18,
          border: `3px solid ${theme.INK}`,
        }}
      >
        <Img
          src={resolved}
          style={{width: '100%', display: 'block', borderRadius: 10}}
        />
      </div>
    </div>
  );
};
