// L1~L4 信息层级:每帧都死守 4 层架构,内容变化层级不变
// 节奏:网格 → L1 → L2 → L3 标签(从左到右)→ L4 字幕
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {GridBackground} from '../../../components/doodle/GridBackground';
import {BigTitle} from '../../../components/doodle/BigTitle';
import {PillBadge} from '../../../components/doodle/PillBadge';
import {DoodleCard} from '../../../components/doodle/DoodleCard';
import {DashedArrow} from '../../../components/doodle/DashedArrow';
import {theme} from '../../../theme';

const PATTERN_DURATION = 180;

export const InfoHierarchy: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const t1 = 15;   // L1 入场
  const t2 = 45;   // L2 入场
  const t3 = 80;   // L3 标签
  const t4 = 120;  // L4 字幕

  const l1Opacity = interpolate(frame, [t1, t1 + 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const l2Opacity = interpolate(frame, [t2, t2 + 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const l3Opacity = interpolate(frame, [t3, t3 + 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const l4Opacity = interpolate(frame, [t4, t4 + 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: theme.BG}}>
      <GridBackground />

      {/* L1 主标题 */}
      <div style={{opacity: l1Opacity, position: 'absolute', top: 100, left: 0, width: '100%', textAlign: 'center'}}>
        <span style={{position: 'absolute', left: 40, top: -10, fontSize: 13, color: '#A0AEC0', fontWeight: 700, letterSpacing: 2}}>L1</span>
        <BigTitle x={960} y={105} fontSize={64} words={[{text: '最近邻'},{text: '问题', accent: true}]} delay={0} wordGap={5} />
      </div>

      {/* L2 核心图示 — 三个节点 + 箭头 */}
      <div style={{opacity: l2Opacity}}>
        <DoodleCard x={300} y={420} w={380} h={260} delay={0} seed={501} />
        <PillBadge x={490} y={520} text="输入向量" fontSize={28} delay={10} seed={502} />
        <DashedArrow x1={690} y1={550} x2={830} y2={550} bend={-15} delay={15} />
        <DoodleCard x={770} y={420} w={380} h={260} delay={5} seed={503} />
        <PillBadge x={960} y={520} text="最近邻搜索" fontSize={28} delay={15} seed={504} />
        <DashedArrow x1={1160} y1={550} x2={1300} y2={550} bend={-15} delay={20} />
        <DoodleCard x={1240} y={420} w={380} h={260} delay={10} seed={505} />
        <PillBadge x={1430} y={520} text="向量库" fontSize={28} delay={20} seed={506} />
      </div>

      {/* L3 标签 */}
      <div style={{opacity: l3Opacity, position: 'absolute', top: 720, left: 0, width: '100%', display: 'flex', justifyContent: 'space-around', padding: '0 80px'}}>
        <PillBadge x={450} y={720} text="输入向量" fontSize={20} bg={theme.ACCENT[0]} delay={0} seed={601} />
        <PillBadge x={770} y={720} text="最近邻搜索" fontSize={20} bg={theme.ACCENT[1]} delay={5} seed={602} />
        <PillBadge x={1100} y={720} text="向量库" fontSize={20} bg={theme.ACCENT[0]} delay={10} seed={603} />
      </div>

      {/* L4 字幕条 */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#2D3748',
          color: '#fff',
          padding: '14px 28px',
          borderRadius: 28,
          fontSize: 24,
          fontWeight: 600,
          opacity: l4Opacity,
          fontFamily: theme.fontFamily,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          whiteSpace: 'nowrap',
        }}>
        从商品库里找距离最近的图片向量就是同款
      </div>

      {/* L1~L4 层级标注 */}
      <div style={{position: 'absolute', top: 16, left: 24, fontSize: 13, color: '#718096', fontWeight: 700, letterSpacing: 2, fontFamily: theme.fontFamily}}>
        L1~L4 信息层级 · 任何内容都遵守此结构
      </div>
    </AbsoluteFill>
  );
};

export const INFO_HIERARCHY_DURATION = PATTERN_DURATION;
