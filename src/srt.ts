// SRT 字幕解析(跨风格通用)。
// 提取自 harness_evolution_remotion/src/utils/srt-parser.ts。

export interface Subtitle {
  index: number;
  startTime: number;
  endTime: number;
  text: string;
}

export function parseSRT(srtContent: string): Subtitle[] {
  const blocks = srtContent.trim().split('\n\n');

  return blocks.map((block) => {
    const lines = block.split('\n');
    const index = parseInt(lines[0], 10);
    const timeMatch = lines[1].match(
      /(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/
    );

    if (!timeMatch) {
      throw new Error(`Invalid time format in block ${index}`);
    }

    const startTime = timeToSeconds(
      parseInt(timeMatch[1], 10),
      parseInt(timeMatch[2], 10),
      parseInt(timeMatch[3], 10),
      parseInt(timeMatch[4], 10)
    );

    const endTime = timeToSeconds(
      parseInt(timeMatch[5], 10),
      parseInt(timeMatch[6], 10),
      parseInt(timeMatch[7], 10),
      parseInt(timeMatch[8], 10)
    );

    const text = lines.slice(2).join(' ');

    return {index, startTime, endTime, text};
  });
}

function timeToSeconds(
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number
): number {
  return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}

export function secondsToFrames(seconds: number, fps: number = 30): number {
  return Math.round(seconds * fps);
}
