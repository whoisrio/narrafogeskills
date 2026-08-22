import React, {useMemo} from 'react';
import {RoughPaths, roundedRectPath, sketch} from '../../rough';
import {estimateTextWidth} from '../../text';
import {theme} from '../../theme';
import {useFloat, usePopIn} from '../../hooks/usePopIn';

interface PillBadgeProps {
  x: number;
  y: number;
  text: string;
  bg?: string;
  textColor?: string;
  fontSize?: number;
  delay?: number;
  seed?: number;
  floatPhase?: number;
}

// Rounded pill badge: sticker rim + solid ACCENT fill + heavy text.
export const PillBadge: React.FC<PillBadgeProps> = ({
  x,
  y,
  text,
  bg = theme.ACCENT[0],
  textColor = theme.badgeText,
  fontSize = 56,
  delay = 0,
  seed = 1,
  floatPhase = 0,
}) => {
  const pop = usePopIn(delay);
  const floatY = useFloat(floatPhase);

  const h = fontSize * 2;
  const w = estimateTextWidth(text, fontSize) + fontSize * 1.7;

  const paths = useMemo(() => {
    const g = sketch(seed);
    const base = {
      roughness: 0.7,
      strokeWidth: 3,
      fillStyle: 'solid' as const,
    };
    return [
      // sticker rim
      ...g.toPaths(
        g.path(roundedRectPath(2, 2, w - 4, h - 4, (h - 4) / 2), {
          ...base,
          stroke: 'none',
          fill: theme.STICKER,
        })
      ),
      // colored pill
      ...g.toPaths(
        g.path(roundedRectPath(11, 11, w - 22, h - 22, (h - 22) / 2), {
          ...base,
          stroke: theme.INK,
          fill: bg,
        })
      ),
    ];
  }, [w, h, bg, seed]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        opacity: pop.opacity,
        transform: `translateY(${pop.y + floatY}px) scale(${pop.scale})`,
      }}
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{position: 'absolute', overflow: 'visible'}}
      >
        <RoughPaths paths={paths} />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: textColor,
          fontSize,
          fontWeight: 900,
          fontFamily: theme.fontFamily,
          letterSpacing: 2,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    </div>
  );
};
