// 留白呼吸镜(原视频级别重制版)
// 关键: 纯白背景无网格 + 4~5 层文字叠加色差错位 + 快速收敛到单字
// 节奏: 0.4s 多层叠加入场 → 0.3s 收敛到单字 → 1.5s 静止
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../../../theme';

const PATTERN_DURATION = 180;

// 文字副本配置: 每层一个 (x偏移, y偏移, 颜色, 透明度)
const LAYERS = [
  {dx: -8,  dy: -4, color: '#E53E3E', opacity: 0.7, decay: 0.20},  // 红
  {dx: 6,   dy: -3, color: '#38A169', opacity: 0.7, decay: 0.22},  // 绿
  {dx: -4,  dy: 5,  color: '#7B61FF', opacity: 0.6, decay: 0.24},  // 紫
  {dx: 8,   dy: 4,  color: '#3182CE', opacity: 0.5, decay: 0.26},  // 浅蓝
  {dx: 0,   dy: 0,  color: '#2C4A6B', opacity: 1.0, decay: 0.0},   // 主色(深蓝)
];

export const BreathingPause: React.FC = () => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();

  const t_appear = 0;
  const t_settle = 28;     // 0.93s 入场结束,开始收敛
  const t_static = 50;     // 1.67s 完全静止

  // 整体 opacity
  const titleOpacity = interpolate(
    frame,
    [t_appear, t_appear + 10],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill style={{backgroundColor: '#FFFFFF'}}>
      {/* 右上角水印 */}
      <div
        style={{
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

      {/* L1 大字 — 多层叠加色差错位 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          textAlign: 'center',
          opacity: titleOpacity,
          pointerEvents: 'none',
        }}>
        {LAYERS.map((layer, i) => {
          // 收敛动画: 0~28 帧保持初始偏移; 28~50 帧偏移按 decay 收敛
          const settleProgress = interpolate(
            frame,
            [t_settle, t_static],
            [0, 1],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
          );
          const eased = 1 - Math.pow(1 - settleProgress, 2); // ease-out
          // 静止时: 主色(decy=0)保持 100% 透明; 副色按 decay 保留 (1-decay) 比例
          const dx = layer.dx * (1 - eased * (1 - layer.decay));
          const dy = layer.dy * (1 - eased * (1 - layer.decay));
          const opacity = layer.opacity * (1 - eased * layer.decay);

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`,
                fontSize: 130,
                fontWeight: 900,
                color: layer.color,
                fontFamily: theme.fontFamily,
                letterSpacing: 8,
                whiteSpace: 'nowrap',
                opacity,
                lineHeight: 1,
              }}>
              HNSW 是什么
            </div>
          );
        })}
      </div>

      {/* 字幕条(L4)在入场后出现 */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#2D3748',
          color: '#FFFFFF',
          padding: '14px 28px',
          borderRadius: 28,
          fontSize: 22,
          fontWeight: 500,
          fontFamily: theme.fontFamily,
          opacity: interpolate(
            frame,
            [t_static, t_static + 15],
            [0, 1],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
          ),
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          whiteSpace: 'nowrap',
        }}>
        最近邻搜索 (Nearest Neighbor)
      </div>
    </AbsoluteFill>
  );
};

export const BREATHING_PAUSE_DURATION = PATTERN_DURATION;
