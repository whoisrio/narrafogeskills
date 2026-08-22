// 配色 Token,与 skills/doodle-explainer/references/style-guide.md 的变量区一一对应。
// 换预设色板只允许改本文件末尾的 `theme` 赋值。

export interface CodeDarkTokens {
  titlebar: string;
  bg: string;
  text: string;
  lineNumber: string;
  titleText: string;
  keyword: string;
  string: string;
  dotRed: string;
  dotYellow: string;
  dotGreen: string;
}

export interface DoodleTheme {
  name: string;
  BG: string;
  GRID: string;
  INK: string;
  STICKER: string;
  PALETTE: string[];
  ACCENT: string[];
  badgeText: string;
  fontFamily: string;
  // VSCode-window style dark editor tokens (CodeCard variant="dark").
  codeDark: CodeDarkTokens;
}

// Same dark editor palette for both presets — it mimics a real editor window,
// not the paper/board surface.
const codeDark: CodeDarkTokens = {
  titlebar: '#2D2D2D',
  bg: '#1E1E1E',
  text: '#D4D4D4',
  lineNumber: '#5A5A5A',
  titleText: '#9A9A9A',
  keyword: '#569CD6',
  string: '#CE9178',
  dotRed: '#FF5F57',
  dotYellow: '#FEBC2E',
  dotGreen: '#28C840',
};

// 预设 A「马卡龙手账」(默认)
export const presetA: DoodleTheme = {
  name: 'macaron-journal',
  BG: '#FBF6EA',
  GRID: '#D8D2C4',
  INK: '#2B2B2B',
  STICKER: '#FFFFFF',
  PALETTE: ['#5FB8A5', '#7CBF6E', '#F4C542', '#F08060', '#7C9FD6', '#DCE6F2'],
  ACCENT: ['#1F6F8B', '#2D6A4F'],
  badgeText: '#FBF6EA',
  fontFamily:
    "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
  codeDark,
};

// 预设 B「黑板粉笔」
export const presetB: DoodleTheme = {
  name: 'chalkboard',
  BG: '#2B2B2B',
  GRID: '#4A4A4A',
  INK: '#F5F0E6',
  STICKER: '#F5F0E6',
  PALETTE: ['#F4D35E', '#7FB5D5', '#E88C7D', '#9BC995'],
  ACCENT: ['#F5F0E6'],
  badgeText: '#2B2B2B',
  fontFamily:
    "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
  codeDark,
};

// 当前生效的预设:换 presetB 即整体切换黑板粉笔风。
export const theme: DoodleTheme = presetA;
