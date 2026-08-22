// 色码贯穿:同一概念在不同画面用同一色码,观众不需要每次重新理解
// 演示:输入向量(青绿)、最近邻(深蓝)、匹配(粉红)三个色码在 3 个不同场景中持续出现
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {GridBackground} from '../../../components/doodle/GridBackground';
import {DoodleCard} from '../../../components/doodle/DoodleCard';
import {PillBadge} from '../../../components/doodle/PillBadge';
import {DashedArrow} from '../../../components/doodle/DashedArrow';
import {theme} from '../../../theme';

const PATTERN_DURATION = 240;

const COLOR = {
  input: '#2C7A7B',      // 输入向量 — 青绿
  search: '#2C4A6B',     // 最近邻 — 深蓝
  match: '#D9534F',      // 匹配 — 粉红
};

export const ColorCoding: React.FC = () => {
  const frame = useCurrentFrame();

  // 三个场景切换(每 80 帧一个)
  const sceneSwap = frame < 80 ? 0 : frame < 160 ? 1 : 2;
  const sceneOpacity = [0, 0, 0].map((_, i) =>
    interpolate(frame, [i * 80, i * 80 + 10, (i + 1) * 80 - 10, (i + 1) * 80], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
  );

  // 顶部色码图例
  const t1 = 5;
  const legendOpacity = interpolate(frame, [t1, t1 + 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: theme.BG}}>
      <GridBackground />

      {/* 顶部色码图例 */}
      <div style={{
        position: 'absolute',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 24,
        opacity: legendOpacity,
        fontFamily: theme.fontFamily,
        fontWeight: 700,
        fontSize: 20,
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <div style={{width: 24, height: 24, backgroundColor: COLOR.input, borderRadius: 4}} />
          <span style={{color: COLOR.input}}>输入向量</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <div style={{width: 24, height: 24, backgroundColor: COLOR.search, borderRadius: 4}} />
          <span style={{color: COLOR.search}}>最近邻搜索</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <div style={{width: 24, height: 24, backgroundColor: COLOR.match, borderRadius: 4}} />
          <span style={{color: COLOR.match}}>匹配</span>
        </div>
      </div>

      {/* 场景 1:输入向量概念 */}
      <div style={{opacity: sceneOpacity[0]}}>
        <DoodleCard x={300} y={300} w={1320} h={480} delay={0} seed={1001} fill="rgba(44,122,123,0.05)" />
        <PillBadge x={560} y={520} text="输入向量" fontSize={32} bg={COLOR.input} delay={0} seed={1010} />
        <DoodleCard x={300} y={720} w={400} h={180} delay={5} seed={1011} fill={COLOR.input} />
        <DoodleCard x={740} y={720} w={400} h={180} delay={8} seed={1012} fill="rgba(44,122,123,0.4)" />
        <DoodleCard x={1180} y={720} w={400} h={180} delay={11} seed={1013} fill="rgba(44,122,123,0.2)" />
      </div>

      {/* 场景 2:搜索过程 */}
      <div style={{opacity: sceneOpacity[1]}}>
        <DoodleCard x={300} y={300} w={1320} h={480} delay={0} seed={2001} fill="rgba(44,74,107,0.05)" />
        <PillBadge x={340} y={520} text="输入向量" fontSize={28} bg={COLOR.input} delay={0} seed={2010} />
        <DashedArrow x1={580} y1={540} x2={730} y2={540} bend={-10} delay={5} />
        <PillBadge x={760} y={520} text="最近邻搜索" fontSize={28} bg={COLOR.search} delay={5} seed={2011} />
        <DashedArrow x1={1080} y1={540} x2={1230} y2={540} bend={-10} delay={10} />
        <PillBadge x={1240} y={520} text="匹配" fontSize={28} bg={COLOR.match} delay={10} seed={2012} />
        <PillBadge x={560} y={720} text="向量库" fontSize={28} bg={COLOR.search} delay={15} seed={2013} />
      </div>

      {/* 场景 3:匹配结果 */}
      <div style={{opacity: sceneOpacity[2]}}>
        <DoodleCard x={300} y={300} w={1320} h={480} delay={0} seed={3001} fill="rgba(217,83,79,0.05)" />
        <PillBadge x={340} y={520} text="输入向量" fontSize={28} bg={COLOR.input} delay={0} seed={3010} />
        <DashedArrow x1={580} y1={540} x2={730} y2={540} bend={-10} delay={5} />
        <PillBadge x={760} y={520} text="最近邻搜索" fontSize={28} bg={COLOR.search} delay={5} seed={3011} />
        <DashedArrow x1={1080} y1={540} x2={1230} y2={540} bend={-10} delay={10} />
        <DoodleCard x={1240} y={460} w={360} h={180} delay={15} seed={3012} fill={COLOR.match} />
        <PillBadge x={1280} y={540} text="⭐ 匹配" fontSize={32} bg={COLOR.match} delay={15} seed={3013} />
      </div>

      {/* 场景标签 */}
      <div style={{
        position: 'absolute',
        top: 80,
        left: 32,
        fontSize: 18,
        fontWeight: 700,
        color: theme.INK,
        fontFamily: theme.fontFamily,
        opacity: interpolate(frame, [0, 10, 70, 80], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }}>
        场景 1 · 输入向量定义
      </div>
      <div style={{
        position: 'absolute',
        top: 80,
        left: 32,
        fontSize: 18,
        fontWeight: 700,
        color: theme.INK,
        fontFamily: theme.fontFamily,
        opacity: interpolate(frame, [80, 90, 150, 160], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }}>
        场景 2 · 搜索过程
      </div>
      <div style={{
        position: 'absolute',
        top: 80,
        left: 32,
        fontSize: 18,
        fontWeight: 700,
        color: theme.INK,
        fontFamily: theme.fontFamily,
        opacity: interpolate(frame, [160, 170, 230, 240], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }}>
        场景 3 · 匹配结果高亮
      </div>

      {/* 字幕条 */}
      <div style={{
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
        fontFamily: theme.fontFamily,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        opacity: interpolate(frame, [t1, t1 + 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        whiteSpace: 'nowrap',
      }}>
        同一概念,同色码 — 中途换色观众会丢锚点
      </div>
    </AbsoluteFill>
  );
};

export const COLOR_CODING_DURATION = PATTERN_DURATION;
