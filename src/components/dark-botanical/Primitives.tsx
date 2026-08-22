import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, Easing} from 'remotion';
import {C, FONT, SPRING, SIZE} from './theme';

// ═══════════════════════════════════════════════════════════
//  BotanicalBg — Dark Botanical 浮动渐变光圈背景
//  参考 HTML .botanical::before / ::after
// ═══════════════════════════════════════════════════════════
export const BotanicalBg: React.FC<{
  variant?: 'default' | 'left' | 'center' | 'warm' | 'pink';
}> = ({variant = 'default'}) => {
  const frame = useCurrentFrame();

  // 降频：每3帧更新一次，减少重绘
  const f = Math.floor(frame / 3) * 3;
  const float1 = Math.sin(f * 0.018) * 12;
  const float2 = Math.cos(f * 0.015) * 10;

  const configs = {
    default: [
      {x: '75%', y: '-8%', size: 500, color: C.warm, opacity: 0.08},
      {x: '15%', y: '70%', size: 400, color: C.pink, opacity: 0.06},
    ],
    left: [
      {x: '-5%', y: '15%', size: 450, color: C.warm, opacity: 0.08},
      {x: '70%', y: '75%', size: 350, color: C.pink, opacity: 0.06},
    ],
    center: [
      {x: '40%', y: '-12%', size: 550, color: C.warm, opacity: 0.07},
      {x: '60%', y: '80%', size: 350, color: C.pink, opacity: 0.05},
    ],
    warm: [
      {x: '70%', y: '-5%', size: 500, color: C.goldBright, opacity: 0.1},
      {x: '20%', y: '65%', size: 400, color: C.deep, opacity: 0.07},
    ],
    pink: [
      {x: '80%', y: '10%', size: 450, color: C.pink, opacity: 0.08},
      {x: '10%', y: '60%', size: 400, color: C.warm, opacity: 0.06},
    ],
  };

  const dots = configs[variant];
  const floats = [float1, float2];

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0}}>
      {dots.map((dot, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: dot.x, top: dot.y,
          width: dot.size, height: dot.size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${dot.color} 0%, transparent 60%)`,
          opacity: dot.opacity,
          transform: `translate(${floats[i % 2]}px, ${floats[(i + 1) % 2]}px)`,
          // 去掉 filter: blur，radial-gradient已有柔边
        }}/>
      ))}
      {/* 细竖线装饰 */}
      <div style={{
        position: 'absolute',
        left: '8%', top: '12%', bottom: '12%',
        width: 1,
        background: `linear-gradient(to bottom, transparent, ${C.gold}25, transparent)`,
      }}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  Tag — 标签/eyebrow（参考 HTML .tag）
// ═══════════════════════════════════════════════════════════
export const Tag: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
}> = ({children, delay = 0, color = C.warm}) => {
  return (
    <Reveal delay={delay} style={{
      fontFamily: FONT.body,
      fontWeight: 500,
      fontSize: SIZE.tag,
      color,
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
    }}>
      {children}
    </Reveal>
  );
};

// ═══════════════════════════════════════════════════════════
//  Reveal — 通用淡入+上滑（行内）
// ═══════════════════════════════════════════════════════════
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  style?: React.CSSProperties;
}> = ({children, delay = 0, direction = 'up', style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: SPRING.slide, delay});
  const dist = 40;
  const translateMap = {up: `0,${dist * (1-s)}`, down: `0,${-dist*(1-s)}`, left: `${dist*(1-s)},0`, right: `${-dist*(1-s)},0`};
  const opacity = interpolate(frame, [delay, delay + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{opacity, transform: `translate(${translateMap[direction]})`, ...style}}>
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  PunchIn — 缩放弹入（冲击感）
// ═══════════════════════════════════════════════════════════
export const PunchIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({children, delay = 0, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: SPRING.punch, delay});
  const scale = interpolate(s, [0, 1], [0.5, 1]);
  const opacity = interpolate(frame, [delay, delay + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{opacity, transform: `scale(${scale})`, ...style}}>
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  BigText — 巨型标题（衬线体，行内）
// ═══════════════════════════════════════════════════════════
export const BigText: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  delay?: number;
  punch?: boolean;
  mono?: boolean;
  glow?: boolean;
  serif?: boolean;
  style?: React.CSSProperties;
}> = ({children, size = SIZE.h1, color = C.gold, delay = 0, punch = true, mono = false, glow = true, serif = true, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const config = punch ? SPRING.punch : SPRING.bounce;
  const s = spring({frame, fps, config, delay});
  const scale = interpolate(s, [0, 1], [0.4, 1]);
  const opacity = interpolate(frame, [delay, delay + 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fontFamily = mono ? FONT.mono : (serif ? FONT.display : FONT.body);
  return (
    <div style={{
      fontSize: size, fontFamily,
      fontWeight: 900, color, lineHeight: 1.1, letterSpacing: '-0.02em',
      textShadow: glow ? `0 0 60px ${color}30` : 'none',
      opacity, transform: `scale(${scale})`,
      textAlign: 'center', ...style,
    }}>
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  SubText — 副标题/说明文字（行内）
// ═══════════════════════════════════════════════════════════
export const SubText: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  delay?: number;
  gold?: boolean;
  style?: React.CSSProperties;
}> = ({children, size = SIZE.body, color, delay = 0, gold = false, style}) => {
  const c = color || (gold ? C.goldBright : C.textDim);
  return (
    <Reveal delay={delay} style={{
      fontSize: size, fontFamily: gold ? FONT.display : FONT.body,
      fontWeight: gold ? 600 : 400,
      color: c, textAlign: 'center', lineHeight: 1.5,
      ...(gold ? {
        textShadow: `0 0 30px ${C.gold}20`,
        background: `linear-gradient(180deg, transparent 55%, ${C.gold}20 55%)`,
        padding: '0 10px', display: 'inline',
      } : {}),
      ...style,
    }}>
      {children}
    </Reveal>
  );
};

// ═══════════════════════════════════════════════════════════
//  RedCircle — 红圈标注（SVG覆盖层）
// ═══════════════════════════════════════════════════════════
export const RedCircle: React.FC<{
  cx: number; cy: number; r?: number; delay?: number;
}> = ({cx, cy, r = 55, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 8, stiffness: 200, mass: 0.5}, delay});
  const scale = interpolate(s, [0, 1], [0, 1]);
  const dashOffset = interpolate(frame, [delay, delay + 60], [200, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pulse = 1 + Math.sin((frame - delay) * 0.12) * 0.05;
  const opacity = interpolate(frame, [delay, delay + 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none'}}>
      <circle cx={cx} cy={cy} r={r * scale * pulse} fill="none" stroke={C.red} strokeWidth={4}
        strokeDasharray="8 6" strokeDashoffset={dashOffset} opacity={opacity}/>
      <circle cx={cx} cy={cy} r={r * scale * pulse * 1.5} fill={`${C.red}08`} opacity={opacity}/>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════
//  GoldLine — 金色装饰线（行内，宽度自适应）
// ═══════════════════════════════════════════════════════════
export const GoldLine: React.FC<{delay?: number; width?: number}> = ({delay = 0, width = 200}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return <div style={{width: width * progress, height: 2, background: `linear-gradient(90deg, ${C.gold}, transparent)`, margin: '12px auto'}}/>;
};

// ═══════════════════════════════════════════════════════════
//  GlowBg — 背景光斑
// ═══════════════════════════════════════════════════════════
export const GlowBg: React.FC<{
  color?: string; size?: number; delay?: number;
}> = ({color = C.gold, size = 500, delay = 0}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 20], [0, 0.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pulse = 1 + Math.sin((frame - delay) * 0.06) * 0.12;
  return (
    <div style={{
      position: 'absolute', left: '50%', top: '50%',
      transform: `translate(-50%, -50%) scale(${pulse})`,
      width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle, ${color}20, transparent 70%)`,
      opacity, pointerEvents: 'none',
    }}/>
  );
};

// ═══════════════════════════════════════════════════════════
//  CounterUp — 数字滚动（行内块）
// ═══════════════════════════════════════════════════════════
export const CounterUp: React.FC<{
  from?: number; to: number; size?: number; color?: string;
  suffix?: string; prefix?: string; delay?: number;
  durationFrames?: number; decimals?: number;
}> = ({from = 0, to, size = SIZE.hero, color = C.gold, suffix = '', prefix = '', delay = 0, durationFrames = 35, decimals = 0}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const currentVal = from + (to - from) * progress;
  const displayVal = decimals > 0 ? currentVal.toFixed(decimals) : Math.round(currentVal).toLocaleString();
  return (
    <span style={{
      fontSize: size, fontFamily: FONT.mono, fontWeight: 900,
      color, letterSpacing: '-0.04em', lineHeight: 1,
      textShadow: `0 0 80px ${color}25`,
    }}>
      {prefix}{displayVal}{suffix}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════
//  ImgCard — 图片卡片（行内，用staticFile + 延迟加载）
// ═══════════════════════════════════════════════════════════

export const ImgCard: React.FC<{
  src: string;       // relative to public/ e.g. "images/xxx.jpg"
  width?: number;
  caption?: string;
  delay?: number;
}> = ({src, width = 800, caption, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: SPRING.slide, delay});
  const scale = interpolate(s, [0, 1], [0.92, 1]);
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{textAlign: 'center', opacity, transform: `scale(${scale})`}}>
      <Img src={staticFile(src)} style={{width, borderRadius: 10, boxShadow: '0 8px 50px rgba(0,0,0,0.5)'}}/>
      {caption && <div style={{fontSize: SIZE.caption, fontFamily: FONT.mono, color: C.textMuted, marginTop: 8}}>{caption}</div>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  Card — 通用信息卡片（行内flex）
// ═══════════════════════════════════════════════════════════
export const Card: React.FC<{
  title: string; value: string; color?: string; delay?: number;
  style?: React.CSSProperties;
}> = ({title, value, color = C.gold, delay = 0, style}) => {
  return (
    <PunchIn delay={delay} style={{
      background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12,
      padding: '22px 32px', boxShadow: `0 0 30px ${color}08`,
      textAlign: 'center', ...style,
    }}>
      <div style={{fontSize: SIZE.caption, fontFamily: FONT.body, color: C.textDim, marginBottom: 6}}>{title}</div>
      <div style={{fontSize: 44, fontFamily: FONT.mono, fontWeight: 900, color, letterSpacing: '-0.03em', lineHeight: 1}}>{value}</div>
    </PunchIn>
  );
};

// ═══════════════════════════════════════════════════════════
//  FeatureCard — 植物学风格功能卡片（参考HTML .feature-card）
// ═══════════════════════════════════════════════════════════
export const FeatureCard: React.FC<{
  icon?: string;
  title: string;
  desc: string;
  color?: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({icon, title, desc, color = C.warm, delay = 0, style}) => {
  return (
    <Reveal delay={delay} style={{
      background: C.bgCard,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: '20px 24px',
      ...style,
    }}>
      {icon && <div style={{fontSize: 32, marginBottom: 8, color}}>{icon}</div>}
      <div style={{fontSize: SIZE.h3, fontFamily: FONT.display, fontWeight: 600, color: C.text, marginBottom: 6}}>{title}</div>
      <div style={{fontSize: SIZE.bodySm, fontFamily: FONT.body, color: C.textDim, lineHeight: 1.5}}>{desc}</div>
    </Reveal>
  );
};

// ═══════════════════════════════════════════════════════════
//  SceneLayout — 标准场景布局容器（居中 + 植物学背景）
// ═══════════════════════════════════════════════════════════
export const SceneLayout: React.FC<{
  children: React.ReactNode;
  bgVariant?: 'default' | 'left' | 'center' | 'warm' | 'pink';
  gap?: number;
  style?: React.CSSProperties;
}> = ({children, bgVariant = 'default', gap = 20, style}) => {
  return (
    <AbsoluteFill style={{
      paddingBottom: 54,  // SUBTITLE_SAFE
      backgroundColor: '#0f0f0f',
      fontFamily: "'Noto Sans SC', 'PingFang SC', sans-serif",
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',  // 居中！
      alignItems: 'center',
      gap,
      position: 'relative',
      zIndex: 1,
      ...style,
    }}>
      <BotanicalBg variant={bgVariant} />
      <div style={{position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap, maxWidth: 1600, width: '100%', padding: '0 60px'}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};



