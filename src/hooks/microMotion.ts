// 微动效 hooks 与工具函数(跨风格通用)。
// 提取自 claude_memory_mechanism/src/components/MicroMotion.tsx。
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ─── Spring 配置 ────────────────────────────────────
// damping 控制振荡,stiffness 控制速度。
export const SPRING_CONFIGS = {
  // 极平滑:几乎无振荡,适合大标题/主布局
  smooth: {damping: 200},
  // 利落:快速到位,微弱回弹,适合卡片/按钮
  snappy: {damping: 20, stiffness: 200},
  // 弹性:明显弹跳,适合强调/高光元素
  bouncy: {damping: 8},
  // 沉稳:慢速大质量,适合背景/大块区域
  heavy: {damping: 15, stiffness: 80, mass: 2},
  // 温和:轻微回弹,适合通用场景
  subtle: {damping: 14, stiffness: 90},
  // 极速弹入:快速到位立即停止
  rapid: {damping: 30, stiffness: 400},
} as const;

export type SpringConfigName = keyof typeof SPRING_CONFIGS;

// ─── 呼吸缩放 ────────────────────────────────────────
export function useBreathScale(options?: {
  min?: number;
  max?: number;
  periodInSeconds?: number;
}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const min = options?.min ?? 0.98;
  const max = options?.max ?? 1.02;
  const period = (options?.periodInSeconds ?? 4) * fps;

  return min + ((max - min) * (1 + Math.sin((frame * 2 * Math.PI) / period))) / 2;
}

// ─── 脉冲透明度 ──────────────────────────────────────
export function usePulseOpacity(options?: {
  min?: number;
  max?: number;
  periodInSeconds?: number;
}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const min = options?.min ?? 0.7;
  const max = options?.max ?? 1.0;
  const period = (options?.periodInSeconds ?? 2.6) * fps;

  return min + ((max - min) * (1 + Math.sin((frame * 2 * Math.PI) / period))) / 2;
}

// ─── 浮动 Y ──────────────────────────────────────────
export function useFloatY(options?: {
  amplitude?: number;
  periodInSeconds?: number;
}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const amplitude = options?.amplitude ?? 3;
  const period = (options?.periodInSeconds ?? 5) * fps;

  return amplitude * Math.sin((frame * 2 * Math.PI) / period);
}

// ─── 光斑位置 ────────────────────────────────────────
export function useGlowPosition(speed?: number) {
  const frame = useCurrentFrame();
  return (frame * (speed ?? 2)) % 100;
}

// ─── 慢速旋转 ────────────────────────────────────────
export function useRotateSlow(periodInSeconds?: number) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const period = (periodInSeconds ?? 8) * fps;
  return (frame / period) * 360;
}

// ─── 淡入淡出 ────────────────────────────────────────
export function fadeInOut(
  frame: number,
  start: number,
  durationIn: number,
  durationOut: number,
  totalDuration: number
) {
  const inProgress = interpolate(frame, [start, start + durationIn], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const outStart = start + totalDuration - durationOut;
  const outProgress = interpolate(
    frame,
    [outStart, outStart + durationOut],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.in(Easing.quad),
    }
  );
  return Math.max(0, inProgress - outProgress);
}

// ─── 交错延迟 ────────────────────────────────────────
export function staggerDelay(index: number, frameGap: number) {
  return index * frameGap;
}

// ─── Slide-in 辅助 ──────────────────────────────────
// 从指定方向滑入,返回 transform 字符串。
export function slideIn(
  frame: number,
  startFrame: number,
  fps: number,
  direction: 'left' | 'right' | 'top' | 'bottom',
  distance: number = 60,
  springConfig: (typeof SPRING_CONFIGS)[SpringConfigName] = SPRING_CONFIGS.snappy
) {
  const s = spring({
    frame: frame - startFrame,
    fps,
    config: springConfig,
  });
  const d = distance * (1 - s);
  switch (direction) {
    case 'left':
      return `translateX(${-d}px)`;
    case 'right':
      return `translateX(${d}px)`;
    case 'top':
      return `translateY(${-d}px)`;
    case 'bottom':
      return `translateY(${d}px)`;
  }
}

// ─── 连接线动画辅助 ─────────────────────────────────
// 绘制从一个点到另一个点的渐进线段进度 0..1。
export function drawLineProgress(
  frame: number,
  startFrame: number,
  durationFrames: number
) {
  return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
}
