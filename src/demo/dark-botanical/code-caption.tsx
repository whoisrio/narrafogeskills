import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop} from '../../components/dark-botanical/Backdrop';
import {CodePanel} from '../../components/dark-botanical/CodePanel';
import {Karaoke} from '../../components/dark-botanical/Karaoke';
import {ProgressBar} from '../../components/dark-botanical/ProgressBar';
import {useSegmentCaption} from '../../components/dark-botanical/useSegmentCaption';

const CUES = [
  {start: 0, end: 2, text: '模型返回的 message 里如果有 tool_use,'},
  {start: 2, end: 4, text: '就去调用工具,再把结果喂回模型。'},
];

// 蓝图金背景 + 代码面板逐行擦除 + Karaoke 逐字字幕 + 顶部进度条。
export const DBCodeCaptionDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {text, progress} = useSegmentCaption(CUES, 0);

  return (
    <AbsoluteFill>
      <Backdrop />
      <ProgressBar progress={frame / durationInFrames} />
      <CodePanel
        title="agent-loop.ts"
        left={420}
        top={220}
        width={1080}
        fontSize={30}
        at={[0.3, 0.8, 1.3, 1.8]}
        hl={{3: 2.4}}
        lines={[
          '<span class="k">if</span> (message.<span class="p">tool_use</span>) {',
          '  <span class="k">const</span> result = <span class="k">await</span> <span class="p">callTool</span>(message.tool_use)',
          '  state.messages.<span class="p">push</span>(result)',
          '  <span class="p">jump_to</span> = <span class="s">"model"</span>  <span class="c">// 重启循环</span>',
        ]}
      />
      <Karaoke text={text} progress={progress} />
    </AbsoluteFill>
  );
};
