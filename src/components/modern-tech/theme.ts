// ── Modern Tech 浅暖现代主题 ──────────────────────────
// 提取自 langgraph_concept/src/shared/theme.ts。
// 字体改为声明 font-family 字符串 + 系统回退(不依赖 @remotion/google-fonts,
// 避免离线渲染沙箱超时,与仓库内 dark-botanical 的做法一致)。
// 想要精确字体时,自行引入 @remotion/google-fonts 加载 Inter Tight /
// JetBrains Mono / Noto Serif SC。
export const FPS = 30;

export const C = {
  // 主背景(浅暖色调)
  bg: '#f5efe4',
  bgDark: '#1a1917',
  panel: '#ffffff',

  // 文本
  text: '#1a1917',
  textDim: '#4a453e',
  textMuted: '#8a8478',

  // 品牌强调(金色)
  gold: '#c47a3a',
  goldSoft: '#d4a574',
  goldGlow: '#e8c48a',

  // 边线 / 描边
  line: '#2a2620',
  lineSoft: 'rgba(26, 25, 23, 0.15)',

  // 卡片阴影(硬偏移,本风格识别符之一)
  shadow: '8px 8px 0 rgba(26, 25, 23, 0.85)',
  shadowSoft: '6px 6px 0 rgba(26, 25, 23, 0.15)',
} as const;

// 六种 Pattern 的色相(同冷色 + 不同色相,避免撞色)
export const PATTERN_COLORS = {
  chain: '#2b4d7e', // 深蓝     Prompt Chain
  router: '#2d7a6e', // 青绿     Router
  orch: '#5b3d8a', // 紫       Orchestrator-Worker
  genEval: '#c47a3a', // 橙金     Generator-Evaluator(借用品牌金)
  subgraph: '#7d3d8f', // 紫罗兰   嵌套子图
  loop: '#2f6d4d', // 深绿     Agent Loop
} as const;

// 字体系统:
// display: 大标题用衬线(Noto Serif SC),符合既定偏好
// sans:    正文/副标/节点标签用 Inter Tight(现代 tech 无衬线)
// mono:    Kicker / 序号 / 代码用 JetBrains Mono
export const FONT = {
  display: "'Noto Serif SC', 'PingFang SC', -apple-system, serif",
  sans: "'Inter Tight', 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace",
} as const;

// 字号基准 - 1920x1080
export const SIZE = {
  hero: 96, // PatternTitle 大标题
  h1: 72,
  h2: 52,
  h3: 40,
  body: 32,
  bodySm: 26,
  caption: 22,
  kicker: 16, // PatternTitle 顶部 kicker
  sub: 26, // PatternTitle 副标
} as const;
