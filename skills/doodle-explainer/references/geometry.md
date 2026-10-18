# 几何契约(Geometry Contract)·涂鸦风

本文件是 doodle engine 画"形状/线条"的**唯一真相源**。与 sticker 的 `geometry.md` 思想一致:把"线条闭合、落点、平滑"从**文字要求**降级为**代码生成 + 脚本闸门**,模型不再手写 `d`。

doodle 与 sticker 的唯一差别:线条走 **rough.js 手绘**(固定 seed + 可控 roughness)。rough.js 的抖动是叠加在【已闭合、已锚定、不过冲】的干净几何之上的——先有干净几何,再有手绘质感。禁止先手写一段过冲的 `d` 再丢给 rough 美化。

## 硬规则(违反即被 lint-shapes.mjs 拦下)

1. **禁止手写 SVG path 的 `d` 属性。** 所有 `d` 必须来自 `scripts/rough-shapes.ts`(`rrect`/`rect`/`line`/`poly`/`circle`/`ellipse`/`smooth`/`arrow`)。
2. **闭合形状强制 `Z`、线强制 `M a L b`**(由生成器保证)。
3. **禁止手写 `C`/`Q` 贝塞尔控制点。** 平滑曲线一律走 `smooth()`(Catmull-Rom + 张力 0.5,防过冲/防环)。
4. **连接线两端必须锚定节点。** `line(a,b)` / `arrow(a,b)` 的 `a`/`b` 是真实节点坐标,不是随手给的数。
5. **rough.js 抖动必须固定 seed。** 用 `roughSeed(ax,ay,bx,by)` 派生,禁止 `Math.random()`/`Date.now()` 当 seed —— 否则逐帧抖动、线乱跳。
6. **生成后必过闸门:** `node scripts/lint-shapes.mjs <生成的源文件或 src/>`,输出 `line issues: 0` 才算交付。

## 在 Remotion 工程里怎么用

1. 把 `scripts/rough-shapes.ts` 复制到工程 `src/lib/rough-shapes.ts`。
2. 组件里(假设工程已有 rough 渲染器,如 `<Rough>` 或 rough generator):
   ```tsx
   import { rrect, line, arrow, circle, smooth, roughSeed, roughOpts } from '../lib/rough-shapes';

   // 卡片(大圆角涂鸦)
   const d = rrect(x, y, w, h, 18);
   <Rough d={d} {...roughOpts(roughSeed(x, y, w, h))} stroke={INK} fill={PALETTE[0]} />;

   // 连接线(虚线弧 + 箭头,两端锚定节点)
   const A = { x: 80, y: 230 }, B = { x: 300, y: 230 };
   const seed = roughSeed(A.x, A.y, B.x, B.y);
   <Rough d={line(A, B)} {...roughOpts(seed)} stroke={INK} strokeDasharray="6 6" pathLength={1} />;
   const a = arrow(A, B, 14);
   <Rough d={a.head} {...roughOpts(seed)} fill={INK} />;

   // 平滑连线(防过冲)
   <Rough d={smooth([p0, p1, p2])} {...roughOpts(roughSeed(p0.x, p0.y, p2.x, p2.y))} stroke={INK} fill="none" />;
   ```
3. 生成完跑 `node scripts/lint-shapes.mjs src/`;有报错定点修(把裸 `d="..."` 改成 rough-shapes 调用),归零后渲染。

## 与 sticker-explainer 的区别

sticker 硬边无抖动,直接用 `<Path d={rrect(...)} />`;doodle 多一层 rough.js 手绘,几何仍由同套算法保证干净,抖动只是质感。两者共用同一套 lint 逻辑(`lint-shapes.mjs`),只是生成器文件名不同(`shapes.ts` vs `rough-shapes.ts`)。
