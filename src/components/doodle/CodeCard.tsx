import React, {useMemo, useRef} from 'react';
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {DoodleCard} from './DoodleCard';
import {RoughPaths, roundedRectPath, sketch} from '../../rough';
import {theme} from '../../theme';
import {useFadeIn} from '../../hooks/usePopIn';

export type CodeCardLine = string | {text: string; note?: string};

type LineState = 'pending' | 'active' | 'done';

const MONO = "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace";

// Minimal syntax highlighting for the dark variant: quoted strings first,
// then a small keyword set, everything else stays the default text color.
const KEYWORD_RE =
  /\b(if|else|elif|return|const|let|var|await|async|function|for|while|in|of|import|from|new|class|break|continue|null|true|false|None|True|False|def|print)\b/g;
const STRING_RE = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;

interface Token {
  text: string;
  kind: 'keyword' | 'string' | 'plain';
}

export const tokenizeLine = (line: string): Token[] => {
  const tokens: Token[] = [];
  // Combined regex: strings win over keywords.
  const combined = new RegExp(
    `(${STRING_RE.source})|(${KEYWORD_RE.source})`,
    'g'
  );
  let last = 0;
  for (const m of line.matchAll(combined)) {
    const idx = m.index ?? 0;
    if (idx > last) tokens.push({text: line.slice(last, idx), kind: 'plain'});
    tokens.push({
      text: m[0],
      kind: m[1] !== undefined ? 'string' : 'keyword',
    });
    last = idx + m[0].length;
  }
  if (last < line.length) tokens.push({text: line.slice(last), kind: 'plain'});
  return tokens;
};

// Eased tween between line-state opacities; restarts whenever the state
// changes. Not a linear animation.
const useLineOpacity = (
  state: LineState,
  base: number,
  done: number,
  frames = 8
) => {
  const frame = useCurrentFrame();
  const targets: Record<LineState, number> = {
    pending: base,
    active: 1,
    done,
  };
  const ref = useRef({state, from: targets[state], at: -1000});
  if (ref.current.state !== state) {
    const current = interpolate(
      frame - ref.current.at,
      [0, frames],
      [ref.current.from, targets[ref.current.state]],
      {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }
    );
    ref.current = {state, from: current, at: frame};
  }
  return interpolate(
    frame - ref.current.at,
    [0, frames],
    [ref.current.from, targets[state]],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
};

const CodeLineRow: React.FC<{
  index: number;
  text: string;
  state: LineState;
  top: number;
  left: number;
  width: number;
  lineHeight: number;
  fontSize: number;
  showLineNumbers: boolean;
  numberWidth: number;
  baseOpacity: number;
  doneOpacity: number;
  entrance: number;
  dark: boolean;
}> = ({
  index,
  text,
  state,
  top,
  left,
  width,
  lineHeight,
  fontSize,
  showLineNumbers,
  numberWidth,
  baseOpacity,
  doneOpacity,
  entrance,
  dark,
}) => {
  const stateOpacity = useLineOpacity(state, baseOpacity, doneOpacity);
  const tokens = useMemo(
    () => (dark ? tokenizeLine(text) : null),
    [dark, text]
  );
  const tokenColor = (kind: Token['kind']) =>
    kind === 'keyword'
      ? theme.codeDark.keyword
      : kind === 'string'
        ? theme.codeDark.string
        : theme.codeDark.text;

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height: lineHeight,
        display: 'flex',
        alignItems: 'center',
        opacity: stateOpacity * entrance,
        fontFamily: MONO,
        fontWeight: 600,
        fontSize,
        whiteSpace: 'pre',
      }}
    >
      {showLineNumbers && (
        <span
          style={{
            width: numberWidth,
            flexShrink: 0,
            color: dark ? theme.codeDark.lineNumber : theme.GRID,
            fontSize: fontSize * 0.8,
            textAlign: 'right',
            paddingRight: fontSize * 0.6,
          }}
        >
          {index + 1}
        </span>
      )}
      {tokens ? (
        <span>
          {tokens.map((tk, i) => (
            <span key={i} style={{color: tokenColor(tk.kind)}}>
              {tk.text}
            </span>
          ))}
        </span>
      ) : (
        <span style={{color: theme.INK}}>{text}</span>
      )}
    </div>
  );
};

// ACCENT focus bar left of the active line; pops in with a spring every time
// it moves to a new line.
const FocusBar: React.FC<{
  lineIndex: number;
  lineCenterY: (i: number) => number;
  left: number;
  height: number;
  seed: number;
}> = ({lineIndex, lineCenterY, left, height, seed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ref = useRef({line: lineIndex, at: 0});
  if (ref.current.line !== lineIndex) {
    ref.current = {line: lineIndex, at: frame};
  }
  const s = spring({
    frame: Math.max(0, frame - ref.current.at),
    fps,
    config: {damping: 11, stiffness: 160, mass: 0.7},
  });

  const barW = 12;
  const paths = useMemo(
    () =>
      sketch(seed).toPaths(
        sketch(seed).path(roundedRectPath(0, 0, barW, height, 6), {
          roughness: 0.6,
          stroke: 'none',
          strokeWidth: 0,
          fill: theme.ACCENT[0],
          fillStyle: 'solid',
        })
      ),
    [seed, height]
  );

  return (
    <svg
      width={barW + 8}
      height={height + 8}
      viewBox={`-4 -4 ${barW + 8} ${height + 8}`}
      style={{
        position: 'absolute',
        left: left - 4,
        top: lineCenterY(lineIndex) - height / 2 - 4,
        overflow: 'visible',
        opacity: Math.min(1, s * 2),
        transform: `scaleY(${s})`,
        transformOrigin: 'center',
      }}
    >
      <RoughPaths paths={paths} />
    </svg>
  );
};

// Rounded-top strip used as the dark window's title bar.
const titleBarPath = (
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): string =>
  [
    `M ${x} ${y + r}`,
    `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
    `L ${x + w - r} ${y}`,
    `A ${r} ${r} 0 0 1 ${x + w} ${y + r}`,
    `L ${x + w} ${y + h}`,
    `L ${x} ${y + h}`,
    'Z',
  ].join(' ');

interface CodeCardProps {
  x: number;
  y: number;
  lines: CodeCardLine[];
  width?: number;
  // Index of the line currently in focus; -1 means no focus yet.
  // Lines before it fall back to doneOpacity, lines after stay at baseOpacity.
  activeLine?: number;
  // "dark" renders a VSCode-style editor window: title bar with traffic
  // lights, dark code area, light syntax colors.
  variant?: 'light' | 'dark';
  // Optional window title shown in the dark title bar.
  title?: string;
  fontSize?: number;
  showLineNumbers?: boolean;
  baseOpacity?: number;
  doneOpacity?: number;
  delay?: number;
  seed?: number;
}

// Doodle-style code card for line-by-line walkthroughs (template 7).
export const CodeCard: React.FC<CodeCardProps> = ({
  x,
  y,
  lines,
  width = 880,
  activeLine = -1,
  variant = 'light',
  title,
  fontSize = 32,
  showLineNumbers = true,
  baseOpacity = 0.4,
  doneOpacity = 0.7,
  delay = 0,
  seed = 70,
}) => {
  const entrance = useFadeIn(delay + 6, 10);
  const dark = variant === 'dark';
  const {width: frameW, height: frameH} = useVideoConfig();

  const lineHeight = fontSize * 1.9;
  const padV = fontSize * 1.1;
  const padH = fontSize * 1.4;
  const numberWidth = fontSize * 1.7;
  const titleBarH = dark ? fontSize * 1.5 : 0;
  const height = titleBarH + lines.length * lineHeight + padV * 2;
  const left = x - width / 2;
  const top = y - height / 2;
  const contentTop = top + titleBarH;

  const lineCenterY = (i: number) =>
    contentTop + padV + i * lineHeight + lineHeight / 2;

  const stateOf = (i: number): LineState =>
    activeLine < 0 || i > activeLine
      ? 'pending'
      : i === activeLine
        ? 'active'
        : 'done';

  const darkChrome = useMemo(() => {
    if (!dark) return null;
    const g = sketch(seed + 2);
    const bar = g.toPaths(
      g.path(titleBarPath(left + 3, top + 3, width - 6, titleBarH, 30), {
        roughness: 0.6,
        stroke: 'none',
        strokeWidth: 0,
        fill: theme.codeDark.titlebar,
        fillStyle: 'solid',
      })
    );
    const dotR = fontSize * 0.22;
    const dotY = top + 3 + titleBarH / 2;
    const dotColors = [
      theme.codeDark.dotRed,
      theme.codeDark.dotYellow,
      theme.codeDark.dotGreen,
    ];
    const dots = dotColors.flatMap((c, i) =>
      g.toPaths(
        g.ellipse(left + 30 + i * dotR * 2.6, dotY, dotR * 2, dotR * 2, {
          roughness: 0.5,
          stroke: 'none',
          strokeWidth: 0,
          fill: c,
          fillStyle: 'solid',
        })
      )
    );
    return {bar, dots};
  }, [dark, left, top, width, titleBarH, fontSize, seed]);

  return (
    <>
      <DoodleCard
        x={left}
        y={top}
        w={width}
        h={height}
        fill={dark ? theme.codeDark.bg : theme.STICKER}
        delay={delay}
        seed={seed}
      />
      {darkChrome && (
        <svg
          width={frameW}
          height={frameH}
          viewBox={`0 0 ${frameW} ${frameH}`}
          style={{
            position: 'absolute',
            overflow: 'visible',
            opacity: entrance,
          }}
        >
          <RoughPaths paths={darkChrome.bar} />
          <RoughPaths paths={darkChrome.dots} />
        </svg>
      )}
      {dark && title && (
        <div
          style={{
            position: 'absolute',
            left,
            top: top + 3,
            width,
            height: titleBarH,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.codeDark.titleText,
            fontFamily: MONO,
            fontWeight: 600,
            fontSize: fontSize * 0.55,
            opacity: entrance,
          }}
        >
          {title}
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          left,
          top: contentTop,
          width,
          height: height - titleBarH,
        }}
      >
        {lines.map((l, i) => (
          <CodeLineRow
            key={i}
            index={i}
            text={typeof l === 'string' ? l : l.text}
            state={stateOf(i)}
            top={padV + i * lineHeight}
            left={padH}
            width={width - padH * 2}
            lineHeight={lineHeight}
            fontSize={fontSize}
            showLineNumbers={showLineNumbers}
            numberWidth={numberWidth}
            baseOpacity={baseOpacity}
            doneOpacity={doneOpacity}
            entrance={entrance}
            dark={dark}
          />
        ))}
        {activeLine >= 0 && activeLine < lines.length && (
          <FocusBar
            lineIndex={activeLine}
            lineCenterY={(i) => lineCenterY(i) - contentTop}
            left={padH * 0.35}
            height={lineHeight * 0.72}
            seed={seed + 1}
          />
        )}
      </div>
    </>
  );
};
