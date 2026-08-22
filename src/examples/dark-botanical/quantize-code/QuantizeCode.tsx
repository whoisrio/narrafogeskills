import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {CodePanel} from '../../../components/dark-botanical/CodePanel';
import {BotanicalBg, Tag} from '../../../components/dark-botanical/Primitives';
import {C} from '../../../components/dark-botanical/theme';

// 单场景示例 · 代码逐行(模板 5):量化核心三行代码。
// CodePanel 逐行 clip-path 擦出,焦点行(quantized = ...)在旁白讲到「这一行」时
// 点亮金色左条常亮不回落,配 RedCircle 风格的 warn 红框轻闪强调。
// CodePanel 自身是 AbsoluteFill,这里用层叠:背景光圈 -> Tag -> CodePanel -> 标题。
export const QUANTIZE_CODE_DURATION = 180;

export const QuantizeCode: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localSec = frame / fps;

  const lines = [
    '<span class="k">scale</span>, <span class="k">zero_point</span> = <span class="n">calibrate</span>(weight)',
    '<span class="k">quantized</span> = (weight - <span class="k">zero_point</span>) * <span class="k">scale</span>',
    '<span class="c"># 4x less VRAM, ~0 loss</span>',
  ];

  // 每行长出的本地秒时刻,对齐旁白句子
  const at = [0.3, 1.7, 4.0];
  // 第 1 行(index 1,quantized 行)是焦点行,在「这一行」时刻点亮常亮
  const hl: Record<number, number> = {1: 3.0};

  // warn 红框:焦点行点亮后轻微闪烁强调「省了 4 倍显存」
  const warn =
    localSec > 3.4
      ? Math.min(
          1,
          0.5 + 0.5 * Math.sin((localSec - 3.4) * 4),
        )
      : 0;

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <BotanicalBg variant="warm" />

      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          zIndex: 2,
        }}
      >
        <Tag delay={0}>量化 · 核心</Tag>
      </div>

      <CodePanel
        title="quantize.py"
        lines={lines}
        at={at}
        hl={hl}
        left={420}
        top={200}
        width={1080}
        fontSize={30}
        warn={warn}
        appearAt={0.1}
      />
    </AbsoluteFill>
  );
};
