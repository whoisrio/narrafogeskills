// 拟人化提示镜:信息图 hard cut → 角色场景(用角色头像 + 场景卡 + 道具)
// 信息密度下降 + 情感升温 = 人性缓冲器
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {GridBackground} from '../../../components/doodle/GridBackground';
import {DoodleCard} from '../../../components/doodle/DoodleCard';
import {PillBadge} from '../../../components/doodle/PillBadge';
import {theme} from '../../../theme';

const PATTERN_DURATION = 220;

export const AnthropomorphicPrompt: React.FC = () => {
  const frame = useCurrentFrame();

  const t1 = 0;    // 信息图阶段
  const t2 = 70;   // hard cut(0.5s 内完成)
  const t3 = 80;   // 角色场景入场
  const t4 = 110;  // 道具卡片入场
  const t5 = 140;  // 字幕入场

  // 信息图阶段 opacity(0~70 帧)
  const infoOpacity = interpolate(frame, [t1, t1 + 20, t2 - 5, t2 + 3], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // 角色场景透明度(70 帧后)
  const charOpacity = interpolate(frame, [t2 + 3, t3, t3 + 15], [0, 0.2, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const propOpacity = interpolate(frame, [t3, t4, t4 + 15], [0, 0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const subOpacity = interpolate(frame, [t4, t5, t5 + 15], [0, 0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // 字符飞动效(强化"参差不齐"语义)
  const paperOffset = interpolate(frame, [t3, t3 + 30], [0, 80], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: frame < t2 ? theme.BG : '#FFE5B4'}}>
      {/* 信息图阶段(0~70 帧) */}
      {frame < t2 && (
        <>
          <GridBackground />
          <div style={{opacity: infoOpacity}}>
            <DoodleCard x={120} y={120} w={1680} h={840} delay={0} seed={801} fill="rgba(44,122,123,0.05)" />
            <PillBadge x={400} y={400} text="编排层" fontSize={32} bg={theme.ACCENT[0]} delay={0} seed={810} />
            <PillBadge x={850} y={400} text="记忆层" fontSize={32} bg={theme.ACCENT[1]} delay={3} seed={811} />
            <PillBadge x={1300} y={400} text="执行层" fontSize={32} bg={theme.ACCENT[0]} delay={6} seed={812} />
          </div>
        </>
      )}

      {/* 角色场景阶段(70 帧后) */}
      {frame >= t2 && (
        <div style={{opacity: charOpacity, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
          {/* 简化房间背景 — 暖色调 */}
          <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '60%', backgroundColor: '#FFD8A8'}} />
          <div style={{position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40%', backgroundColor: '#FFA500'}} />
          {/* 窗户 */}
          <div style={{position: 'absolute', top: 100, right: 120, width: 380, height: 320, backgroundColor: '#87CEEB', border: '8px solid #fff', borderRadius: 8}} />
          {/* 书架 */}
          <DoodleCard x={1480} y={120} w={280} h={420} delay={t3} seed={820} fill="#8B4513" />
          {/* 角色(用大圆形 + 表情符号当占位) */}
          <div style={{
            position: 'absolute',
            bottom: 120,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 220,
            height: 220,
            backgroundColor: '#F4D35E',
            borderRadius: '50%',
            border: '6px solid #2B2B2B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 110,
          }}>
            👧
          </div>
          {/* 角色标签 */}
          <PillBadge x={760} y={680} text="灰发少女(共享 IP)" fontSize={22} bg={theme.ACCENT[1]} delay={t3 + 5} seed={830} />
        </div>
      )}

      {/* 飞动效:多张纸分散飞(70 帧后) */}
      {frame >= t3 && (
        <div style={{opacity: propOpacity}}>
          {[
            {x: 600, y: 200, rot: -15},
            {x: 1200, y: 250, rot: 12},
            {x: 1400, y: 400, rot: -20},
            {x: 400, y: 500, rot: 8},
          ].map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: p.y - paperOffset,
                left: p.x + paperOffset * 0.3,
                width: 60,
                height: 80,
                backgroundColor: '#fff',
                border: '2px solid #2B2B2B',
                borderRadius: 2,
                transform: `rotate(${p.rot}deg)`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
          ))}
        </div>
      )}

      {/* 道具卡片:Technology 标签 */}
      {frame >= t4 && (
        <div style={{
          opacity: propOpacity,
          position: 'absolute',
          top: 220,
          left: 720,
          backgroundColor: '#fff',
          border: '3px solid #2C4A6B',
          padding: '20px 28px',
          borderRadius: 4,
          transform: 'rotate(-3deg)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          <div style={{fontSize: 28, color: '#2C4A6B', fontWeight: 700, fontFamily: theme.fontFamily}}>Technology</div>
          <div style={{position: 'absolute', top: 12, right: 12, width: 32, height: 32, backgroundColor: '#E2E8F0', borderRadius: '50%'}} />
        </div>
      )}

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
        opacity: subOpacity,
        whiteSpace: 'nowrap',
      }}>
        {frame < t2 ? 'AI Agent 由几层组成' : '全网资料参差不齐,如有差异以我为准'}
      </div>

      {/* 标注 */}
      <div style={{position: 'absolute', top: 24, left: 28, fontSize: 14, color: frame < t2 ? '#718096' : '#2B2B2B', fontWeight: 700, letterSpacing: 2, fontFamily: theme.fontFamily}}>
        @PatternAnthropomorphicPrompt · 信息图 → 角色场景 (hard cut)
      </div>
    </AbsoluteFill>
  );
};

export const ANTHROPOMORPHIC_PROMPT_DURATION = PATTERN_DURATION;
