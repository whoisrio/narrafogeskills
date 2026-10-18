import { rrect, line, arrow, circle, smooth } from '../lib/shapes';

// 正确:所有 d 来自 shapes 生成器
export const Box = () => (
  <Path d={rrect(10, 10, 100, 60, 0)} stroke="#000" strokeWidth={3} fill="#FE90E8" />
);

export const Edge = () => (
  <Path d={line({ x: 0, y: 0 }, { x: 50, y: 50 })} stroke="#000" strokeWidth={3} />
);

export const ArrowEdge = () => {
  const a = arrow({ x: 0, y: 0 }, { x: 100, y: 0 }, 12);
  return (
    <>
      <Path d={a.shaft} stroke="#000" strokeWidth={3} pathLength={1} />
      <Path d={a.head} fill="#000" />
    </>
  );
};

export const Dot = () => <Path d={circle(50, 50, 20)} fill="#99E885" />;

export const Curve = () => (
  <Path d={smooth([{ x: 0, y: 0 }, { x: 50, y: 80 }, { x: 100, y: 0 }])} stroke="#000" fill="none" />
);
