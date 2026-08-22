// 结构图入场顺序(原视频级别重制版 v3)
// 关键:可见等距网格 + 标题左上角 + 4 拍入场 + 4 个独立胶囊垂直堆叠的向量库
// 原视频形态: 1 个输入向量胶囊 + 绿色粗箭头 + 4 个独立向量胶囊垂直堆叠 + "向量 N" 编号
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {GridBackground} from '../../../components/doodle/GridBackground';
import {PillBadge} from '../../../components/doodle/PillBadge';
import {RoughPaths, roundedRectPath, sketch} from '../../../rough';
import {theme} from '../../../theme';

const PATTERN_DURATION = 230;

// 4 格彩色向量(蓝/青/红/黄)
const VECTOR_COLORS = ['#3182CE', '#319795', '#E53E3E', '#D69E2E'];

// 单个胶囊:粗描边圆角框 + 内部 4 个色块横排
const makeVectorCapsule = (
  g: ReturnType<typeof sketch>,
  x: number,
  y: number,
  w: number,
  h: number,
  seed: number
) => {
  const r = h / 2;
  // 胶囊外框(粗描边、深色、白色填充)
  const frame = g.path(roundedRectPath(x, y, w, h, r), {
    roughness: 1.2,
    strokeWidth: 4,
    stroke: '#1A1A1A',
    fill: '#FFFFFF',
    fillStyle: 'solid',
    seed,
  });
  // 内部 4 个色块
  const padding = 12;
  const cellSize = h - padding * 2;
  const cellGap = 6;
  const startX = x + padding;
  const cellY = y + padding;
  const cells = [];
  for (let i = 0; i < 4; i++) {
    const cx = startX + i * (cellSize + cellGap);
    cells.push(
      g.rectangle(cx, cellY, cellSize, cellSize, {
        roughness: 1.6,
        strokeWidth: 4,
        stroke: '#1A1A1A',
        fill: VECTOR_COLORS[i],
        fillStyle: 'solid',
        seed: seed + 100 + i,
      })
    );
  }
  return [frame, ...cells]
    .map((dr) => g.toPaths(dr))
    .reduce((acc, arr) => acc.concat(arr), []);
};

// 绿色粗箭头(带三角箭头)
const makeArrow = (
  g: ReturnType<typeof sketch>,
  x: number,
  y: number,
  seed: number
) => {
  const tail = g.line(x, y, x + 200, y, {
    roughness: 1.0,
    stroke: '#38A169',
    strokeWidth: 10,
    seed,
  });
  const triHead = g.polygon(
    [[x + 200, y - 32], [x + 200, y + 32], [x + 250, y]],
    {roughness: 0.8, strokeWidth: 10, stroke: '#38A169', fill: '#38A169', fillStyle: 'solid', seed: seed + 1}
  );
  return [...g.toPaths(tail), ...g.toPaths(triHead)];
};

export const StructuralEntry: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const t1 = 15;   // 标题入场
  const t2 = 25;   // 输入向量 + 大外框
  const t3 = 60;   // 向量库 4 胶囊分批入场
  const t4 = 105;  // 绿色箭头
  const t5 = 140;  // 标签

  const stageText =
    frame < t2 ? '准备' :
    frame < t3 ? '第 1 拍:外框+输入向量' :
    frame < t4 ? '第 2 拍:向量库分批弹入' :
    frame < t5 ? '第 3 拍:绿色箭头' :
    '第 4 拍:标签+徽章';

  // 各元素 opacity
  const titleOpacity = interpolate(frame, [t1, t1 + 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const outerOpacity = interpolate(frame, [t2, t2 + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const inputOpacity = interpolate(frame, [t2 + 5, t2 + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // 4 个向量胶囊分别延迟入场
  const vecOpacities = [0, 1, 2, 3].map((i) =>
    interpolate(frame, [t3 + i * 10, t3 + i * 10 + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
  );
  const arrowOpacity = interpolate(frame, [t4, t4 + 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const labelOpacity = interpolate(frame, [t5, t5 + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const badgeOpacity = interpolate(frame, [t5 + 8, t5 + 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // 草图实例(seed 不重复,避免相同抖动)
  const gOuter = React.useMemo(() => sketch(901), []);
  const gInput = React.useMemo(() => sketch(902), []);
  const gVec = [
    React.useMemo(() => sketch(910), []),
    React.useMemo(() => sketch(920), []),
    React.useMemo(() => sketch(930), []),
    React.useMemo(() => sketch(940), []),
  ];
  const gArrow = React.useMemo(() => sketch(950), []);

  // —— 坐标布局 ——
  // 输入向量(左,小)
  const INPUT_X = 180;
  const INPUT_Y = 540;
  const INPUT_W = 230;
  const INPUT_H = 80;

  // 绿色箭头(中)
  const ARROW_X = 480;
  const ARROW_Y = INPUT_Y + INPUT_H / 2;

  // 4 个向量胶囊(右,垂直堆叠)
  const VEC_X = 820;
  const VEC_W = 280;
  const VEC_H = 70;
  const VEC_GAP = 14;
  const VEC_START_Y = 320;

  // 大外框
  const FRAME_X = 130;
  const FRAME_Y = 260;
  const FRAME_W = 980;
  const FRAME_H = 470;

  // 预生成所有路径
  const outerPath = React.useMemo(
    () => gOuter.toPaths(gOuter.path(roundedRectPath(FRAME_X, FRAME_Y, FRAME_W, FRAME_H, 36), {
      roughness: 0.8,
      stroke: '#38A169',
      strokeWidth: 5,
      fill: 'rgba(44,122,123,0.03)',
      fillStyle: 'solid',
      seed: 901,
    })),
    [gOuter]
  );

  const inputPath = React.useMemo(
    () => makeVectorCapsule(gInput, INPUT_X, INPUT_Y, INPUT_W, INPUT_H, 902),
    [gInput]
  );

  const vecPaths = React.useMemo(
    () => gVec.map((g, i) =>
      makeVectorCapsule(g, VEC_X, VEC_START_Y + i * (VEC_H + VEC_GAP), VEC_W, VEC_H, 911 + i * 10)
    ),
    [gVec]
  );

  const arrowPath = React.useMemo(
    () => makeArrow(gArrow, ARROW_X, ARROW_Y, 950),
    [gArrow]
  );

  return (
    <AbsoluteFill style={{backgroundColor: theme.BG}}>
      <GridBackground />

      {/* L1 标题 - 左上角 */}
      <div style={{
        position: 'absolute',
        top: 80,
        left: 80,
        fontSize: 56,
        fontWeight: 900,
        color: '#2C7A7B',
        fontFamily: theme.fontFamily,
        opacity: titleOpacity,
        letterSpacing: 2,
      }}>
        最近邻问题 (Nearest Neighbor)
      </div>

      {/* 右上角水印 */}
      <div style={{
        position: 'absolute',
        top: 24,
        right: 36,
        fontSize: 22,
        fontWeight: 700,
        color: '#2C7A7B',
        fontFamily: theme.fontFamily,
        opacity: titleOpacity,
        letterSpacing: 1,
      }}>
        @小白debug
      </div>

      {/* 阶段提示 */}
      <div style={{
        position: 'absolute',
        top: 30,
        left: 80,
        fontSize: 18,
        fontWeight: 700,
        color: '#2C7A7B',
        fontFamily: theme.fontFamily,
        opacity: titleOpacity,
        letterSpacing: 1,
      }}>
        {stageText}
      </div>

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{position: 'absolute', overflow: 'visible', pointerEvents: 'none'}}
      >
        {/* 大外框 */}
        <g opacity={outerOpacity}>
          <RoughPaths paths={outerPath} />
        </g>

        {/* 输入向量(左) */}
        <g opacity={inputOpacity}>
          <RoughPaths paths={inputPath} />
        </g>

        {/* 4 个向量胶囊垂直堆叠(右),逐个延迟入场 */}
        {vecPaths.map((paths, i) => (
          <g key={i} opacity={vecOpacities[i]}>
            <RoughPaths paths={paths} />
          </g>
        ))}

        {/* 绿色大箭头 */}
        <g opacity={arrowOpacity}>
          <RoughPaths paths={arrowPath} />
        </g>
      </svg>

      {/* 第 4 拍:标签 + 编号(逐向量右侧) + 向量库深蓝徽章 */}
      <div style={{opacity: labelOpacity}}>
        {/* 输入向量下沿标签 */}
        <div style={{
          position: 'absolute',
          left: INPUT_X + INPUT_W / 2 - 50,
          top: INPUT_Y + INPUT_H + 14,
          color: '#2C4A6B',
          fontSize: 24,
          fontWeight: 700,
          fontFamily: theme.fontFamily,
        }}>
          输入向量
        </div>

        {/* 最近邻搜索(中,放在箭头上方不挡箭头) */}
        <div style={{
          position: 'absolute',
          left: ARROW_X - 40,
          top: ARROW_Y - 95,
          color: '#2C4A6B',
          fontSize: 22,
          fontWeight: 700,
          fontFamily: theme.fontFamily,
          textAlign: 'left',
          lineHeight: 1.3,
        }}>
          最近邻搜索
        </div>

        {/* 4 个向量胶囊右侧"向量 N"编号 */}
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            position: 'absolute',
            left: VEC_X + VEC_W + 12,
            top: VEC_START_Y + i * (VEC_H + VEC_GAP) + VEC_H / 2 - 16,
            color: '#2C7A7B',
            fontSize: 26,
            fontWeight: 700,
            fontFamily: theme.fontFamily,
            whiteSpace: 'nowrap',
          }}>
            向量 {i + 1}
          </div>
        ))}
      </div>

      {/* 向量库深蓝徽章(右下角) */}
      <div style={{opacity: badgeOpacity}}>
        <PillBadge
          x={VEC_X + VEC_W / 2 - 80}
          y={VEC_START_Y + 4 * (VEC_H + VEC_GAP) + 18}
          text="向量库"
          fontSize={32}
          bg="#1A365D"
          textColor="#FFFFFF"
          delay={0}
          seed={960}
        />
      </div>

      {/* 字幕条 */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#2D3748',
        color: '#FFFFFF',
        padding: '14px 28px',
        borderRadius: 28,
        fontSize: 22,
        fontWeight: 500,
        fontFamily: theme.fontFamily,
        opacity: interpolate(frame, [t2, t2 + 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        whiteSpace: 'nowrap',
      }}>
        从商品库里找距离最近的图片向量就是同款
      </div>
    </AbsoluteFill>
  );
};

export const STRUCTURAL_ENTRY_DURATION = PATTERN_DURATION;
