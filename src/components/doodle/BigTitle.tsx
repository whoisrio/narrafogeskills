import React from 'react';
import {estimateTextWidth} from '../../text';
import {theme} from '../../theme';
import {usePopIn} from '../../hooks/usePopIn';

export interface BigTitleWord {
  text: string;
  accent?: boolean;
}

interface BigTitleProps {
  x: number;
  y: number;
  words: BigTitleWord[];
  fontSize?: number;
  delay?: number;
  wordGap?: number;
  color?: string;
  accentColor?: string;
}

const PopWord: React.FC<{
  text: string;
  left: number;
  fontSize: number;
  color: string;
  delay: number;
}> = ({text, left, fontSize, color, delay}) => {
  const pop = usePopIn(delay, fontSize * 0.5);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: 0,
        color,
        fontSize,
        fontWeight: 900,
        fontFamily: theme.fontFamily,
        letterSpacing: 2,
        whiteSpace: 'nowrap',
        opacity: pop.opacity,
        transform: `translateY(${pop.y}px) scale(${pop.scale})`,
        transformOrigin: 'left center',
      }}
    >
      {text}
    </div>
  );
};

// Oversized headline, words pop in one by one; accent words use ACCENT color.
// Anchored at horizontal center x, vertical center y.
export const BigTitle: React.FC<BigTitleProps> = ({
  x,
  y,
  words,
  fontSize = 96,
  delay = 0,
  wordGap = 6,
  color = theme.INK,
  accentColor = theme.ACCENT[0],
}) => {
  const spacing = fontSize * 0.35;
  const widths = words.map((wd) => estimateTextWidth(wd.text, fontSize));
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (words.length - 1);
  let cursor = x - total / 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: y - fontSize * 0.75,
        width: '100%',
        height: fontSize * 1.5,
      }}
    >
      {words.map((wd, i) => {
        const left = cursor;
        cursor += widths[i] + spacing;
        return (
          <PopWord
            key={i}
            text={wd.text}
            left={left}
            fontSize={fontSize}
            color={wd.accent ? accentColor : color}
            delay={delay + i * wordGap}
          />
        );
      })}
    </div>
  );
};
