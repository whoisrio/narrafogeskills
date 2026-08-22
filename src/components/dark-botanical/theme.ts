// ── Dark Botanical 暗底暖金主题 ──────────────────────────
// 提取自 deepseek_strategy_to_10_trillon_USD/app/src/theme.ts,
// 并并入 responseapi 系组件(代码面板/字幕/蓝图金背景)的 token。
export const W = 1920;
export const H = 1080;
export const FPS = 30;

export const C = {
  bg: '#0f0f0f',
  bgSubtle: '#1a1a1a',
  bgCard: 'rgba(255,255,255,0.03)',
  bgCardHover: 'rgba(255,255,255,0.05)',

  // 暖色调 — Dark Botanical palette
  gold: '#c9b896',
  goldBright: '#d4a574',
  goldDim: '#8b7635',

  warm: '#d4a574', // accent-warm
  pink: '#e8b4b8', // accent-pink
  deep: '#b87333', // accent-deep copper

  red: '#e63946',
  redBright: '#ff4d5a',
  redGlow: '#e6394640',

  green: '#2ec47a',
  greenDim: '#1a7a4e',

  cyan: '#3dc2c2',
  orange: '#e8873d',
  purple: '#9b59b6',

  text: '#e8e4df',
  textDim: '#9a9590',
  textMuted: '#5a5550',
  border: 'rgba(255,255,255,0.06)',
};

// responseapi 系代码面板(CodePanel)token:深海军蓝面板 + 亮金强调。
export const EDITOR = {
  panelTop: '#0e1420',
  panelBottom: '#0a0f19',
  panelBorder: 'rgba(140,170,230,0.10)',
  titleBorder: 'rgba(140,170,230,0.08)',
  titleText: '#6b7689',
  text: '#c9d4e3',
  gold: '#d4a72c',
  dotRed: '#ff5f56',
  dotYellow: '#ffbd2e',
  dotGreen: '#27c93f',
};

// Karaoke / Caption 逐字字幕 token。
export const CAPTION = {
  read: '#ffd66b',
  readSoft: '#f4d35e',
  active: '#ffffff',
  dim: '#5b6677',
  dimSoft: '#5b6473',
};

// Backdrop / ProgressBar 蓝图金背景 token。
export const BLUEPRINT = {
  bg: '#0b1220',
  bgTop: '#12203b',
  bgBottom: '#070d18',
  grid: 'rgba(201,162,39,0.06)',
  gold: '#c9a227',
  goldBright: '#f4d35e',
  goldGlow: 'rgba(244,211,94,0.55)',
};

export const FONT = {
  // 标题用衬线体,正文用无衬线
  display: "'Noto Serif SC', 'Source Han Serif SC', 'PingFang SC', serif",
  body: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
};

// 字号基准 — 1920x1080 视频专用
export const SIZE = {
  hero: 96, // 主标题
  h1: 72, // 一级标题
  h2: 52, // 二级标题
  h3: 40, // 三级标题
  body: 32, // 正文
  bodySm: 26, // 正文小号
  caption: 22, // 说明文字
  tag: 20, // 标签/eyebrow
  tiny: 18, // 最小文字
};

// Spring configs
export const SPRING = {
  punch: {damping: 12, stiffness: 200, mass: 0.8},
  slide: {damping: 15, stiffness: 150, mass: 1.0},
  bounce: {damping: 10, stiffness: 180, mass: 0.6},
  gentle: {damping: 20, stiffness: 100, mass: 1.2},
};

// Standard beat durations at 30fps
export const BEAT = {
  fast: 30, // 1s
  mid: 60, // 2s
  slow: 90, // 3s
  hold: 120, // 4s
};

// Subtitle safe zone: bottom 5% must stay clear
export const SUBTITLE_SAFE = Math.round(H * 0.05); // 54px at 1080p
export const CONTENT_H = H - SUBTITLE_SAFE; // 1026px at 1080p
