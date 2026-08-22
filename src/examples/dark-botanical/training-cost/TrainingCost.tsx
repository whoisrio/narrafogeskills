import React from 'react';
import {AbsoluteFill, interpolate, Series, useCurrentFrame, useVideoConfig} from 'remotion';
import {BotanicalBg} from '../../../components/dark-botanical/Primitives';
import {C} from '../../../components/dark-botanical/theme';
import {Scene1CostPunch} from './Scene1CostPunch';
import {Scene2CostCurve} from './Scene2CostCurve';
import {Scene3Punchline} from './Scene3Punchline';

export const SCENE_DURATION = 150;
export const TRANSITION = 15;
export const TRAINING_COST_DURATION = SCENE_DURATION * 3 - TRANSITION * 2;

// 优雅淡入淡出转场:暗金风不用涂鸦的横向滑动,用 opacity 交叉,
// 配合常驻的 BotanicalBg 光圈,转场读起来像「同一场戏的光线变化」。
const FadeWrap: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
}> = ({durationInFrames, children}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, TRANSITION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exit = interpolate(
    frame,
    [durationInFrames - TRANSITION, durationInFrames],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const opacity = Math.min(enter, 1 - exit);
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

export const TrainingCost: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      {/* 常驻光圈背景,跨场景不重置,提供连续感 */}
      <BotanicalBg variant="warm" />
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATION}>
          <FadeWrap durationInFrames={SCENE_DURATION}>
            <Scene1CostPunch />
          </FadeWrap>
        </Series.Sequence>
        <Series.Sequence offset={-TRANSITION} durationInFrames={SCENE_DURATION}>
          <FadeWrap durationInFrames={SCENE_DURATION}>
            <Scene2CostCurve />
          </FadeWrap>
        </Series.Sequence>
        <Series.Sequence offset={-TRANSITION} durationInFrames={SCENE_DURATION}>
          <FadeWrap durationInFrames={SCENE_DURATION}>
            <Scene3Punchline />
          </FadeWrap>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
