import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GridBackground} from '../../components/doodle/GridBackground';
import {BigTitle} from '../../components/doodle/BigTitle';

// BigTitle: words pop in one by one, accent word highlighted.
export const BigTitleDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GridBackground />
      <BigTitle
        x={960}
        y={540}
        fontSize={120}
        words={[
          {text: '为什么'},
          {text: '需要'},
          {text: '大标题', accent: true},
        ]}
        delay={0}
        wordGap={8}
      />
    </AbsoluteFill>
  );
};
