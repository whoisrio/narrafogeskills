// spring/easing/stagger 工厂函数(跨风格通用)。
// 提取自 harness_evolution_remotion/src/utils/animation-helpers.ts。
import {spring, interpolate, Easing} from 'remotion';

export const ANIMATION_CONFIG = {
  spring: {
    gentle: {damping: 20, stiffness: 100, mass: 1},
    snappy: {damping: 15, stiffness: 150, mass: 0.8},
    bouncy: {damping: 12, stiffness: 180, mass: 0.6},
    smooth: {damping: 25, stiffness: 80, mass: 1.2},
  },

  easing: {
    easeOutExpo: Easing.bezier(0.16, 1, 0.3, 1),
    easeInOut: Easing.bezier(0.65, 0, 0.35, 1),
    easeOutBack: Easing.bezier(0.34, 1.56, 0.64, 1),
  },

  stagger: {
    fast: 5,
    normal: 10,
    slow: 15,
  },
};

export function createStaggeredSpring(
  frame: number,
  fps: number,
  index: number,
  staggerFrames: number = 10,
  config: keyof typeof ANIMATION_CONFIG.spring = 'gentle'
) {
  const delayedFrame = frame - index * staggerFrames;
  return spring({
    frame: delayedFrame,
    fps,
    config: ANIMATION_CONFIG.spring[config],
  });
}

export function createFadeIn(
  frame: number,
  fps: number,
  durationFrames: number = 20,
  easing: keyof typeof ANIMATION_CONFIG.easing = 'easeOutExpo'
) {
  return interpolate(frame, [0, durationFrames], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
    easing: ANIMATION_CONFIG.easing[easing],
  });
}

export function createSlideIn(
  frame: number,
  fps: number,
  direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom',
  distance: number = 50,
  durationFrames: number = 25
) {
  const progress = createFadeIn(frame, fps, durationFrames, 'easeOutExpo');

  const positions = {
    left: {x: -distance, y: 0},
    right: {x: distance, y: 0},
    top: {x: 0, y: -distance},
    bottom: {x: 0, y: distance},
  };

  return {
    x: positions[direction].x * (1 - progress),
    y: positions[direction].y * (1 - progress),
    opacity: progress,
  };
}

export function createScaleIn(
  frame: number,
  fps: number,
  fromScale: number = 0.8,
  durationFrames: number = 20
) {
  const progress = createFadeIn(frame, fps, durationFrames, 'easeOutExpo');
  return fromScale + (1 - fromScale) * progress;
}

export function createGlowEffect(
  frame: number,
  fps: number,
  color: string,
  intensity: number = 0.3
) {
  const pulse = Math.sin(frame * 0.05) * 0.5 + 0.5;
  return `0 0 ${20 + pulse * 30}px ${color}${Math.round(intensity * 255)
    .toString(16)
    .padStart(2, '0')}`;
}
