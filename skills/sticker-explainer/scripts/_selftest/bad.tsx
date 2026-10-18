// 错误:手写 d / 手写贝塞尔 —— 正是"线段很乱"的根因
export const Box = () => (
  <Path d="M10 10 H110 V70 H10 Z" stroke="#000" strokeWidth={3} />
);

export const Edge = () => (
  <Path d="M0 0 L 50 50" stroke="#000" strokeWidth={3} />
);

export const Curve = () => (
  <Path d="M0 0 C 10 100 90 100 100 0" stroke="#000" />
);

export const Mixed = () => (
  <Path d={someVar + "M5 5 L 20 20"} stroke="#000" />
);
