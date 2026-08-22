import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Springy pop-in: scale 0 -> 1 with overshoot, slight upward settle, fade in.
export const usePopIn = (delay = 0, fromY = 50) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const started = frame >= delay;
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {damping: 10, stiffness: 130, mass: 0.9},
  });
  return {
    scale: started ? s : 0,
    y: started ? (1 - s) * fromY : fromY,
    opacity: started
      ? interpolate(s, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'})
      : 0,
  };
};

// Slow idle floating, +-amplitude px.
export const useFloat = (phase = 0, amplitude = 5, periodFrames = 70) => {
  const frame = useCurrentFrame();
  return Math.sin((frame / periodFrames) * Math.PI * 2 + phase) * amplitude;
};

// Simple delayed fade-in, 0 -> 1 over `fadeFrames`.
export const useFadeIn = (delay = 0, fadeFrames = 8) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + fadeFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};
