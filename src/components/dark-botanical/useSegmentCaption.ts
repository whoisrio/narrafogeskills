import {useCurrentFrame, useVideoConfig} from 'remotion';

export interface CaptionCue {
  start: number;
  end: number;
  text: string;
}

/**
 * 卡拉OK字幕钩子:根据全局帧 + 本段 absStart,从 cue 数组命中当前字幕。
 * 返回 {text, progress},交给 <Karaoke> / <Caption> 渲染。
 * 提取自 responseapi SegShell,captions.json 依赖改为 cues 由 props 传入。
 */
export const useSegmentCaption = (cues: CaptionCue[], absStart: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps + absStart;
  const cue = cues.find((c) => sec >= c.start && sec < c.end);
  if (!cue) return {text: '', progress: 0};
  const progress = Math.min(
    1,
    Math.max(0, (sec - cue.start) / (cue.end - cue.start))
  );
  return {text: cue.text, progress};
};
