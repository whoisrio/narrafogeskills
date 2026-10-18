import { rrect, line, arrow, circle, smooth, roughSeed, roughOpts } from '../lib/rough-shapes';

// 正确:所有 d 来自 rough-shapes 生成器,seed 由坐标派生
export const Box = () => (
  <Rough d={rrect(10, 10, 100, 60, 18)} {...roughOpts(roughSeed(10, 10, 110, 70))} stroke="#1A1A1A" fill="#F7DEC6" />
);

export const Edge = () => (
  <Rough d={line({ x: 0, y: 0 }, { x: 50, y: 50 })} {...roughOpts(roughSeed(0, 0, 50, 50))} stroke="#1A1A1A" strokeDasharray="6 6" />
);

export const ArrowEdge = () => {
  const a = arrow({ x: 0, y: 0 }, { x: 100, y: 0 }, 14);
  const seed = roughSeed(0, 0, 100, 0);
  return (
    <>
      <Rough d={a.shaft} {...roughOpts(seed)} stroke="#1A1A1A" pathLength={1} />
      <Rough d={a.head} {...roughOpts(seed)} fill="#1A1A1A" />
    </>
  );
};

export const Dot = () => <Rough d={circle(50, 50, 20)} {...roughOpts(roughSeed(50, 50, 20))} fill="#E8B88E" />;

export const Curve = () => (
  <Rough d={smooth([{ x: 0, y: 0 }, { x: 50, y: 80 }, { x: 100, y: 0 }])} {...roughOpts(roughSeed(0, 0, 100, 0))} stroke="#1A1A1A" fill="none" />
);
