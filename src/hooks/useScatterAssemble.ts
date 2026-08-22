import {interpolate, useCurrentFrame} from 'remotion';

// ============= 散布 -> 聚合 粒子运动 hook(风格无关) =============
// 提取自 attention_evolution QKVParticleAssembly 的运动逻辑,与渲染解耦。
// 给定一组目标位置,每个粒子先散布在质心周围(带 wobble 漂浮),
// 再插值聚合到目标位,配 scale/opacity/rotation/glow。
// 每风格只需写自己的粒子渲染器(rough.js 点 / 暗金 cell / 干净发光点)。
//
// 返回每个粒子当前帧的状态;渲染器据此画粒子。

export interface ParticleState {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
  glow: number;
  visible: boolean;
}

// 确定性 0..1 hash(同 hand.tsx 的 hash01),保证逐帧确定性渲染
const hash01 = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const useScatterAssemble = (opts: {
  targets: {x: number; y: number}[];
  delay?: number;
  floatDuration?: number; // 散布漂浮帧数(默认 25)
  assembleDuration?: number; // 聚合帧数(默认 8)
  spread?: number; // 散布半径(默认 220)
  seed?: number;
}): ParticleState[] => {
  const frame = useCurrentFrame();
  const {
    targets,
    delay = 0,
    floatDuration = 25,
    assembleDuration = 8,
    spread = 220,
    seed = 0,
  } = opts;
  const f = frame - delay;

  // 质心(散布中心)
  const cx = targets.reduce((s, p) => s + p.x, 0) / targets.length;
  const cy = targets.reduce((s, p) => s + p.y, 0) / targets.length;

  return targets.map((tgt, i) => {
    if (f < 0) {
      return {
        x: tgt.x,
        y: tgt.y,
        scale: 0,
        opacity: 0,
        rotation: 0,
        glow: 0,
        visible: false,
      };
    }
    const s1 = hash01(seed * 97 + i * 13 + 1);
    const s2 = hash01(seed * 31 + i * 7 + 3);
    const spreadX = (s1 - 0.5) * 2 * spread;
    const spreadY = (s2 - 0.5) * 2 * spread;

    // 散布:远点 -> 近点(漂浮期间拉近),叠 wobble
    const startX = cx + spreadX * 1.6;
    const startY = cy + spreadY * 1.6;
    const midX = cx + spreadX * 0.8;
    const midY = cy + spreadY * 0.8;
    const wobbleX = Math.sin(f * 0.08 + s1 * 6) * 18;
    const wobbleY = Math.cos(f * 0.06 + s2 * 6) * 14;

    if (f < floatDuration) {
      const floatX = interpolate(f, [0, floatDuration], [startX, midX], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const floatY = interpolate(f, [0, floatDuration], [startY, midY], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const scale = interpolate(f, [0, 8], [0, 0.9], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const opacity = interpolate(f, [0, 10], [0, 0.8], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const rotation = Math.sin(f * 0.05 + s1 * 6) * 18;
      return {
        x: floatX + wobbleX,
        y: floatY + wobbleY,
        scale,
        opacity,
        rotation,
        glow: 0,
        visible: opacity > 0.01,
      };
    }

    // 聚合:从中点插值到目标位
    const p = interpolate(
      f,
      [floatDuration, floatDuration + assembleDuration],
      [0, 1],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
    );
    const fromX = midX + Math.sin(floatDuration * 0.08 + s1 * 6) * 18;
    const fromY = midY + Math.cos(floatDuration * 0.06 + s2 * 6) * 14;
    const x = interpolate(p, [0, 1], [fromX, tgt.x]);
    const y = interpolate(p, [0, 1], [fromY, tgt.y]);
    const scale = interpolate(p, [0, 1], [0.9, 1]);
    const opacity = interpolate(p, [0, 1], [0.8, 1]);
    const rotation = interpolate(p, [0, 1], [
      Math.sin(floatDuration * 0.05 + s1 * 6) * 18,
      0,
    ]);
    const glow = interpolate(
      f,
      [floatDuration + assembleDuration - 4, floatDuration + assembleDuration + 10],
      [1, 0],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
    );
    return {x, y, scale, opacity, rotation, glow, visible: opacity > 0.01};
  });
};
