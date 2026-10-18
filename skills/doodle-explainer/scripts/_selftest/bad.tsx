// 错误:doodle 下典型的乱线来源 —— 手写 d / 手写贝塞尔 / 随机 seed
export const Box = () => (
  <Rough d="M10 10 H110 V70 H10" stroke="#1A1A1A" />
);

export const Edge = () => (
  <Rough d="M0 0 L 50 50" stroke="#1A1A1A" strokeDasharray="6 6" />
);

export const Curve = () => (
  <Rough d="M0 0 C 10 100 90 100 100 0" stroke="#1A1A1A" />
);

export const Mixed = () => (
  <Rough d={someVar + "M5 5 Q 20 0 20 20"} stroke="#1A1A1A" />
);
