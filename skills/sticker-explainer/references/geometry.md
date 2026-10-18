# 几何契约(Geometry Contract)·贴纸风

本文件是 sticker engine 画"形状/线条"的**唯一真相源**。紧接 anatomy 的思想:把"线条闭合、落点、平滑"从**文字要求**降级为**代码生成 + 脚本闸门**,模型不再手写 `d`。

## 硬规则(违反即被 lint-shapes.mjs 拦下)

1. **禁止手写 SVG path 的 `d` 属性。** 所有 `d` 必须来自 `scripts/shapes.ts` 的函数(`rrect`/`rect`/`line`/`poly`/`circle`/`ellipse`/`smooth`/`arrow`)。
2. **闭合形状强制 `Z`、线强制 `M a L b`**(由生成器保证,模型无需关心实现)。
3. **禁止手写 `C`/`Q` 贝塞尔控制点。** 平滑曲线一律走 `smooth()`,它用 Catmull-Rom 转 cubic bezier(张力 0.5),从根上消灭"控制点过冲→线乱/自交"。
4. **连接线两端必须锚定节点。** 用 `line(a, b)` / `arrow(a, b)` 时,`a`/`b` 是真实节点坐标(同一次布局算出的 Pt),不是随手给的数。
5. **生成后必过闸门:** `node scripts/lint-shapes.mjs <生成的源文件或 src/>`,输出 `line issues: 0` 才算交付。

## 在 Remotion 工程里怎么用

1. 把 `scripts/shapes.ts` 复制到工程 `src/lib/shapes.ts`。
2. 组件里:
   ```tsx
   import { rrect, line, arrow, circle } from '../lib/shapes';
   // 卡片(方角贴纸)
   <Path d={rrect(x, y, w, h, 0)} stroke={INK} strokeWidth={3} fill={PALETTE[0]} />;
   // 连接线(锚定两端节点)
   <Path d={line(nodeA, nodeB)} stroke={INK} strokeWidth={3} pathLength={1} />;
   // 带箭头(生长动画作用在 shaft 上)
   const a = arrow(nodeA, nodeB, 12);
   <Path d={a.shaft} stroke={INK} strokeWidth={3} pathLength={1} />;
   <Path d={a.head} fill={INK} />;
   // 圆/椭圆
   <Path d={circle(cx, cy, r)} fill={PALETTE[1]} />;
   // 平滑连线(防过冲)
   <Path d={smooth([p0, p1, p2, p3])} stroke={INK} strokeWidth={3} fill="none" />;
   ```
3. 生成完跑 `node scripts/lint-shapes.mjs src/`;有报错定点修(把裸 `d="..."` 改成 shapes 调用),归零后渲染。

## 与 doodle-explainer 的区别

doodle 走 rough.js(手绘抖动),它那套"乱"来自随机抖动 + 手写贝塞尔,治理方式见 doodle 自己的 `scripts/rough-shapes.ts` + 同款 lint。本文件只约束 sticker(硬边、无抖动)路径。
