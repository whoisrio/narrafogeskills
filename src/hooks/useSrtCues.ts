// SRT 驱动的时间框架
// 解决问题: SRT 换了(重新导出), 代码不用改时间戳
// 用法: cues[3].startFrame 代替 f(3.9)
//
// 两层设计:
// 1. 预解析脚本(scripts/gen-srt-timings.ts): 渲染前跑, 从 SRT 生成 TS 模块
//    -> Composition 的 durationInFrames 从这里读(渲染前就要知道)
// 2. useSrtCues hook: Studio 预览时动态加载 SRT(不跑脚本也能预览)
//    -> 组件内部用 cue 索引驱动 delay
//
// 工作流:
//   改稿 -> 重新导出 02.srt -> npm run gen-srt -> 代码自动更新时长 -> 渲染

import {useEffect, useState} from 'react';
import {delayRender, continueRender, useVideoConfig, staticFile} from 'remotion';
import {parseSRT, secondsToFrames} from '../srt';

// ── 类型 ──────────────────────────────────────────

export interface SrtCue {
  index: number;          // 0-based
  text: string;           // cue 文本
  startSec: number;       // 开始秒
  endSec: number;         // 结束秒
  startFrame: number;     // 开始帧(按 composition fps)
  endFrame: number;       // 结束帧
  durationFrames: number; // endFrame - startFrame
}

export interface SrtTimings {
  cues: SrtCue[];
  totalDuration: number;  // 最后一个 cue 的 endFrame
  fps: number;
}

// ── 核心解析: SRT 文本 -> SrtTimings ──────────────

export function parseSrtToTimings(srtContent: string, fps: number = 30): SrtTimings {
  const subtitles = parseSRT(srtContent);
  const cues: SrtCue[] = subtitles.map((sub, i) => ({
    index: i,
    text: sub.text,
    startSec: sub.startTime,
    endSec: sub.endTime,
    startFrame: secondsToFrames(sub.startTime, fps),
    endFrame: secondsToFrames(sub.endTime, fps),
    durationFrames: secondsToFrames(sub.endTime, fps) - secondsToFrames(sub.startTime, fps),
  }));
  const totalDuration = cues.length > 0 ? cues[cues.length - 1].endFrame : 0;
  return {cues, totalDuration, fps};
}

// ── Hook: Studio 预览时动态加载 ───────────────────
// 用于组件内部: const {cues} = useSrtCues('audio/02.srt')
// delay={cues[3].startFrame - 9}  // cue 3, 提前 9 帧

export function useSrtCues(srtFile: string): {cues: SrtCue[]; totalDuration: number; ready: boolean} {
  const {fps} = useVideoConfig();
  const [timings, setTimings] = useState<SrtTimings>({cues: [], totalDuration: 0, fps});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handle = delayRender(`Loading SRT: ${srtFile}`);
    fetch(staticFile(srtFile))
      .then((r) => r.text())
      .then((text) => {
        setTimings(parseSrtToTimings(text, fps));
        setReady(true);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(`SRT load failed: ${srtFile}`, err);
        continueRender(handle);
      });
  }, [srtFile, fps]);

  return {cues: timings.cues, totalDuration: timings.totalDuration, ready};
}

// ── 辅助: 从 cue 索引算 delay(含音画偏移) ──────────
// 用法: delay={cueDelay(cues, 3, -9)}  // cue 3, 提前 9 帧
//      delay={cueDelay(cues, 7, 6)}    // cue 7, 滞后 6 帧

export function cueDelay(cues: SrtCue[], cueIndex: number, offsetFrames: number = 0): number {
  if (cueIndex < 0 || cueIndex >= cues.length) return 0;
  return cues[cueIndex].startFrame + offsetFrames;
}

// ── 辅助: 算场景时长(从 cue A 到 cue B) ───────────
// 用法: durationInFrames={sceneDuration(cues, 0, 6)}  // cue 0 到 cue 6

export function sceneDuration(cues: SrtCue[], startCue: number, endCue: number): number {
  if (endCue >= cues.length) return cues[cues.length - 1].endFrame - cues[startCue].startFrame;
  return cues[endCue].endFrame - cues[startCue].startFrame;
}

// ── 预解析脚本入口(给 scripts/gen-srt-timings.ts 调用) ──
// node -e "require('./src/hooks/useSrtCues').genTimingsFile('public/audio/02.srt', 30)"
// 输出 JSON 到 stdout, 可重定向到文件

export function genTimingsJson(srtContent: string, fps: number = 30): string {
  const timings = parseSrtToTimings(srtContent, fps);
  return JSON.stringify(timings, null, 2);
}
