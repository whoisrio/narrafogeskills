import {useCurrentFrame, useVideoConfig, interpolate, spring, Easing} from 'remotion';
import {C, FONT, SPRING, SUBTITLE_SAFE} from './theme';

// ═══════════════════════════════════════════════════════════
//  AnimatedBarChart — 柱状图，柱子从底部长出
//  外层是 position:relative 行内块，可放入flex布局
// ═══════════════════════════════════════════════════════════
export const AnimatedBarChart: React.FC<{
  data: {label: string; value: number; color: string; sub?: string}[];
  width?: number; height?: number;
  maxValue?: number;
  delay?: number;
  stagger?: number;
  barWidth?: number;
  gap?: number;
  valueSuffix?: string;
  showValues?: boolean;
}> = ({
  data, width = 1200, height = 500,
  maxValue, delay = 0, stagger = 15, barWidth = 120, gap = 80,
  valueSuffix = '', showValues = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const max = maxValue ?? Math.max(...data.map(d => d.value));
  const totalBarsWidth = data.length * barWidth + (data.length - 1) * gap;
  const startX = (width - totalBarsWidth) / 2;

  return (
    <div style={{position: 'relative', width, height, margin: '0 auto'}}>
      {data.map((d, i) => {
        const barDelay = delay + i * stagger;
        const s = spring({frame, fps, config: SPRING.punch, delay: barDelay});
        const barH = (d.value / max) * (height - 80) * s;
        const o = interpolate(frame, [barDelay, barDelay + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

        return (
          <div key={i} style={{
            position: 'absolute',
            left: startX + i * (barWidth + gap),
            bottom: 40,
            width: barWidth,
            opacity: o,
          }}>
            {showValues && (
              <div style={{
                textAlign: 'center', fontSize: 32, fontFamily: FONT.mono,
                fontWeight: 900, color: d.color, marginBottom: 8,
                textShadow: `0 0 30px ${d.color}30`,
                opacity: interpolate(s, [0.5, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
              }}>
                {d.value}{valueSuffix}
              </div>
            )}
            <div style={{
              width: '100%', height: barH,
              background: `linear-gradient(180deg, ${d.color}, ${d.color}90)`,
              borderRadius: '8px 8px 2px 2px',
              boxShadow: `0 0 30px ${d.color}20, inset 0 1px 0 ${d.color}40`,
            }}/>
            <div style={{
              textAlign: 'center', fontSize: 24, fontFamily: FONT.display,
              fontWeight: 700, color: C.text, marginTop: 12,
              whiteSpace: 'nowrap',
            }}>{d.label}</div>
            {d.sub && (
              <div style={{
                textAlign: 'center', fontSize: 18, fontFamily: FONT.mono,
                color: d.color, marginTop: 4, fontWeight: 600,
              }}>{d.sub}</div>
            )}
          </div>
        );
      })}
      <div style={{
        position: 'absolute', bottom: 36, left: startX - 20,
        width: totalBarsWidth + 40, height: 2,
        background: C.border,
      }}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  AnimatedLineChart — 折线图，线条绘制动画
// ═══════════════════════════════════════════════════════════
export const AnimatedLineChart: React.FC<{
  series: {name: string; data: {x: number; y: number}[]; color: string}[];
  width?: number; height?: number;
  xLabel?: string; yLabel?: string;
  xTicks?: string[];
  yTicks?: string[];
  delay?: number;
  drawDuration?: number;
}> = ({
  series, width = 1000, height = 500,
  xLabel, yLabel, xTicks, yTicks,
  delay = 0, drawDuration = 50,
}) => {
  const frame = useCurrentFrame();
  const padding = {top: 40, right: 40, bottom: 60, left: 80};
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allY = series.flatMap(s => s.data.map(d => d.y));
  const allX = series.flatMap(s => s.data.map(d => d.x));
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);

  const toSvgX = (v: number) => padding.left + ((v - minX) / (maxX - minX || 1)) * chartW;
  const toSvgY = (v: number) => padding.top + chartH - ((v - minY) / (maxY - minY || 1)) * chartH;

  return (
    <div style={{position: 'relative', width, height, margin: '0 auto'}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {yTicks && yTicks.map((tick, i) => {
          const yPos = toSvgY(parseFloat(tick));
          const gridO = interpolate(frame, [delay, delay + 10], [0, 0.15], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return <g key={`y${i}`} opacity={gridO}>
            <line x1={padding.left} y1={yPos} x2={width - padding.right} y2={yPos} stroke={C.border} strokeWidth={1}/>
            <text x={padding.left - 10} y={yPos + 5} textAnchor="end" fill={C.textMuted} fontSize={13} fontFamily={FONT.mono}>{tick}</text>
          </g>;
        })}
        {xTicks && xTicks.map((tick, i) => {
          const xPos = toSvgX(parseFloat(tick));
          return <text key={`x${i}`} x={xPos} y={height - 15} textAnchor="middle" fill={C.textMuted} fontSize={13} fontFamily={FONT.mono}>{tick}</text>;
        })}

        {series.map((s, si) => {
          const lineDelay = delay + si * 20;
          const progress = interpolate(frame, [lineDelay, lineDelay + drawDuration], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });

          const points = s.data.map(d => ({sx: toSvgX(d.x), sy: toSvgY(d.y)}));
          const totalLen = points.length - 1;
          const drawUpTo = Math.floor(progress * totalLen);
          const partialFrac = (progress * totalLen) - drawUpTo;

          let pathD = `M ${points[0].sx} ${points[0].sy}`;
          for (let i = 1; i <= drawUpTo && i < points.length; i++) {
            pathD += ` L ${points[i].sx} ${points[i].sy}`;
          }
          if (drawUpTo < totalLen) {
            const from = points[drawUpTo];
            const to = points[drawUpTo + 1];
            if (from && to) {
              const px = from.sx + (to.sx - from.sx) * partialFrac;
              const py = from.sy + (to.sy - from.sy) * partialFrac;
              pathD += ` L ${px} ${py}`;
            }
          }

          const dotOpacity = progress > 0.95 ? 1 : 0;

          return (
            <g key={si}>
              <path d={pathD} fill="none" stroke={s.color} strokeWidth={5} opacity={0.15} filter="url(#blur)"/>
              <path d={pathD} fill="none" stroke={s.color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
              {dotOpacity > 0 && points[points.length - 1] && (
                <circle cx={points[points.length - 1].sx} cy={points[points.length - 1].sy} r={6} fill={s.color} opacity={dotOpacity}>
                  <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite"/>
                </circle>
              )}
              {dotOpacity > 0 && points[points.length - 1] && (
                <text x={Math.min(points[points.length - 1].sx + 16, width - 34)} y={points[points.length - 1].sy + 5} fill={s.color} fontSize={18} fontFamily={FONT.mono} fontWeight={700} opacity={dotOpacity}>{s.name}</text>
              )}
            </g>
          );
        })}

        <defs>
          <filter id="blur"><feGaussianBlur stdDeviation="6"/></filter>
        </defs>
      </svg>

      {xLabel && <div style={{position: 'absolute', bottom: SUBTITLE_SAFE + 10, left: '50%', transform: 'translateX(-50%)', fontSize: 15, color: C.textMuted, fontFamily: FONT.mono}}>{xLabel}</div>}
      {yLabel && <div style={{position: 'absolute', left: 10, top: '50%', transform: 'rotate(-90deg) translateX(-50%)', fontSize: 15, color: C.textMuted, fontFamily: FONT.mono, transformOrigin: '0 50%'}}>{yLabel}</div>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  AnimatedComparison — 对比暴击（左右两个巨大数字）
// ═══════════════════════════════════════════════════════════
export const AnimatedComparison: React.FC<{
  left: {value: string; label: string; color: string; sub?: string};
  right: {value: string; label: string; color: string; sub?: string};
  vs?: string;
  delay?: number;
}> = ({left, right, vs = 'VS', delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const lS = spring({frame, fps, config: SPRING.punch, delay});
  const rS = spring({frame, fps, config: SPRING.punch, delay: delay + 15});
  const vsO = interpolate(frame, [delay + 10, delay + 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60, width: '100%'}}>
      <div style={{
        textAlign: 'center',
        transform: `scale(${interpolate(lS, [0, 1], [0.5, 1])})`,
        opacity: interpolate(frame, [delay, delay + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }}>
        <div style={{fontSize: 120, fontFamily: FONT.mono, fontWeight: 900, color: left.color, lineHeight: 1, letterSpacing: '-0.04em', textShadow: `0 0 80px ${left.color}35`}}>{left.value}</div>
        <div style={{fontSize: 28, fontFamily: FONT.display, fontWeight: 700, color: C.textDim, marginTop: 12}}>{left.label}</div>
        {left.sub && <div style={{fontSize: 16, fontFamily: FONT.mono, color: C.textMuted, marginTop: 4}}>{left.sub}</div>}
      </div>
      <div style={{fontSize: 42, fontFamily: FONT.mono, fontWeight: 900, color: C.textMuted, opacity: vsO, letterSpacing: '0.08em'}}>{vs}</div>
      <div style={{
        textAlign: 'center',
        transform: `scale(${interpolate(rS, [0, 1], [0.5, 1])})`,
        opacity: interpolate(frame, [delay + 15, delay + 23], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
      }}>
        <div style={{fontSize: 120, fontFamily: FONT.mono, fontWeight: 900, color: right.color, lineHeight: 1, letterSpacing: '-0.04em', textShadow: `0 0 80px ${right.color}35`}}>{right.value}</div>
        <div style={{fontSize: 28, fontFamily: FONT.display, fontWeight: 700, color: C.textDim, marginTop: 12}}>{right.label}</div>
        {right.sub && <div style={{fontSize: 16, fontFamily: FONT.mono, color: C.textMuted, marginTop: 4}}>{right.sub}</div>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  AnimatedGauge — 半圆仪表盘动画
// ═══════════════════════════════════════════════════════════
export const AnimatedGauge: React.FC<{
  value: number;        // 0-1
  label: string;
  size?: number;
  color?: string;
  delay?: number;
}> = ({value, label, size = 200, color = C.gold, delay = 0}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + 40], [0, value], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const r = size / 2 - 12;
  const cx = size / 2;
  const cy = size * 0.6;
  const startAngle = -Math.PI;
  const endAngle = 0;
  const currentAngle = startAngle + (endAngle - startAngle) * progress;

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(currentAngle);
  const y2 = cy + r * Math.sin(currentAngle);
  const largeArc = (currentAngle - startAngle) > Math.PI ? 1 : 0;

  const pathD = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  const opacity = interpolate(frame, [delay, delay + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div style={{width: size, opacity, textAlign: 'center'}}>
      <svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.7}`}>
        <path d={`M ${cx + r * Math.cos(startAngle)} ${cy + r * Math.sin(startAngle)} A ${r} ${r} 0 1 1 ${cx + r * Math.cos(endAngle)} ${cy + r * Math.sin(endAngle)}`}
          fill="none" stroke={C.border} strokeWidth={10} strokeLinecap="round"/>
        <path d={pathD} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
          style={{filter: `drop-shadow(0 0 8px ${color}40)`}}/>
      </svg>
      <div style={{fontSize: 36, fontFamily: FONT.mono, fontWeight: 900, color, marginTop: -10}}>
        {Math.round(progress * 100)}%
      </div>
      <div style={{fontSize: 16, fontFamily: FONT.display, color: C.textDim, marginTop: 4}}>{label}</div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  AnimatedStackedBar — 堆叠柱状图
// ═══════════════════════════════════════════════════════════
export const AnimatedStackedBar: React.FC<{
  segments: {value: number; color: string; label: string}[];
  width?: number; height?: number;
  delay?: number;
  stagger?: number;
}> = ({segments, width = 80, height = 400, delay = 0, stagger = 12}) => {
  const frame = useCurrentFrame();
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let currentY = 0;

  return (
    <div style={{position: 'relative', width, height, margin: '0 auto'}}>
      {segments.map((seg, i) => {
        const segH = (seg.value / total) * height;
        const segDelay = delay + i * stagger;
        const s = interpolate(frame, [segDelay, segDelay + 20], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const h = segH * s;
        const top = currentY;
        currentY += segH;

        return (
          <div key={i} style={{
            position: 'absolute', left: 0, top, width,
            height: h,
            background: `linear-gradient(180deg, ${seg.color}, ${seg.color}cc)`,
            borderRadius: i === 0 ? '8px 8px 0 0' : i === segments.length - 1 ? '0 0 8px 8px' : 0,
            boxShadow: `0 0 20px ${seg.color}15`,
          }}/>
        );
      })}
      <div style={{position: 'absolute', top: height + 10, width, textAlign: 'center',
        fontSize: 14, fontFamily: FONT.mono, color: C.textDim}}>
        {segments.map((s, i) => (
          <span key={i} style={{color: s.color}}>{s.label}{i < segments.length - 1 ? '/' : ''}</span>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  NumberFlip — 数字翻滚动画（价格变动、指标变化）
// ═══════════════════════════════════════════════════════════
export const NumberFlip: React.FC<{
  from: number; to: number;
  prefix?: string; suffix?: string;
  color?: string; oldColor?: string;
  fontSize?: number;
  delay?: number; duration?: number;
  decimals?: number;
}> = ({
  from, to, prefix = '', suffix = '',
  color = C.green, oldColor = C.red,
  fontSize = 72, delay = 0, duration = 40, decimals = 4,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const oldOp = interpolate(frame, [delay, delay + 8, delay + 15, delay + 20], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const newS = spring({frame, fps, config: SPRING.punch, delay: delay + 18});
  const arrowOp = interpolate(frame, [delay + 12, delay + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const valueP = interpolate(frame, [delay + 18, delay + 18 + duration], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const currentVal = from + (to - from) * valueP;

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center'}}>
      <div style={{position: 'relative', opacity: oldOp}}>
        <span style={{fontSize: fontSize * 0.5, fontFamily: FONT.mono, fontWeight: 900, color: oldColor, textDecoration: 'line-through', textDecorationColor: oldColor}}>
          {prefix}{from.toFixed(decimals)}{suffix}
        </span>
      </div>
      <span style={{fontSize: fontSize * 0.35, fontFamily: FONT.mono, color: C.textMuted, opacity: arrowOp}}>→</span>
      <div style={{transform: `scale(${interpolate(newS, [0, 1], [0.3, 1])})`, opacity: interpolate(newS, [0, 0.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        <span style={{fontSize, fontFamily: FONT.mono, fontWeight: 900, color, lineHeight: 1, textShadow: `0 0 40px ${color}30`}}>
          {prefix}{currentVal.toFixed(decimals)}{suffix}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  HorizontalPriceBar — 水平价格对比条
// ═══════════════════════════════════════════════════════════
export const HorizontalPriceBar: React.FC<{
  data: {label: string; value: number; color: string; highlight?: boolean}[];
  maxValue?: number;
  width?: number; height?: number;
  delay?: number; stagger?: number;
  valuePrefix?: string; valueSuffix?: string;
}> = ({
  data, maxValue, width = 1000, height = 280,
  delay = 0, stagger = 12,
  valuePrefix = '$', valueSuffix = '',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const max = maxValue ?? Math.max(...data.map(d => d.value));
  const barH = 42;
  const labelW = 160;

  return (
    <div style={{position: 'relative', width, height, margin: '0 auto'}}>
      {data.map((d, i) => {
        const barDelay = delay + i * stagger;
        const s = spring({frame, fps, config: SPRING.slide, delay: barDelay});
        const barW = (d.value / max) * (width - labelW - 120) * s;
        const o = interpolate(frame, [barDelay, barDelay + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const y = 20 + i * (barH + 18);

        return (
          <div key={i} style={{position: 'absolute', left: 0, top: y, width: '100%', opacity: o}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: labelW, fontSize: 18, fontFamily: FONT.display, fontWeight: 700, color: d.color, lineHeight: `${barH}px`, whiteSpace: 'nowrap'}}>{d.label}</div>
            <div style={{position: 'absolute', left: labelW, top: 0, width: barW, height: barH, background: `linear-gradient(90deg, ${d.color}, ${d.color}cc)`, borderRadius: '4px 8px 8px 4px', boxShadow: d.highlight ? `0 0 30px ${d.color}40` : `0 0 15px ${d.color}15`}}/>
            <div style={{position: 'absolute', left: labelW + barW + 12, top: 0, fontSize: 22, fontFamily: FONT.mono, fontWeight: 900, color: d.color, lineHeight: `${barH}px`, opacity: interpolate(s, [0.5, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
              {valuePrefix}{d.value}{valueSuffix}
            </div>
          </div>
        );
      })}
    </div>
  );
};
