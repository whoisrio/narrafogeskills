import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Series,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {GridBackground} from '../../../components/doodle/GridBackground';
import {Scene1Vector} from './Scene1Vector';
import {Scene2MassiveData} from './Scene2MassiveData';
import {Scene3ConceptMap} from './Scene3ConceptMap';

export const SCENE_DURATION = 130;
export const TRANSITION = 18;
export const VECTOR_SEARCH_DURATION = SCENE_DURATION * 3 - TRANSITION * 2;

// Horizontal slide transition: incoming scene slides in from the right while
// the outgoing one slides out to the left during the overlap window.
const SlideWrap: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
}> = ({durationInFrames, children}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const enter = interpolate(frame, [0, TRANSITION], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exit = interpolate(
    frame,
    [durationInFrames - TRANSITION, durationInFrames],
    [0, 1],
    {
      easing: Easing.in(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  const x = (1 - enter) * width - exit * width;
  return (
    <AbsoluteFill style={{transform: `translateX(${x}px)`}}>
      {children}
    </AbsoluteFill>
  );
};

export const VectorSearch: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATION}>
          <SlideWrap durationInFrames={SCENE_DURATION}>
            <Scene1Vector />
          </SlideWrap>
        </Series.Sequence>
        <Series.Sequence offset={-TRANSITION} durationInFrames={SCENE_DURATION}>
          <SlideWrap durationInFrames={SCENE_DURATION}>
            <Scene2MassiveData />
          </SlideWrap>
        </Series.Sequence>
        <Series.Sequence offset={-TRANSITION} durationInFrames={SCENE_DURATION}>
          <SlideWrap durationInFrames={SCENE_DURATION}>
            <Scene3ConceptMap />
          </SlideWrap>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
