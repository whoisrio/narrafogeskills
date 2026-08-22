import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedLineChart} from '../../../components/dark-botanical/Charts';
import {
  BigText,
  RedCircle,
  SubText,
} from '../../../components/dark-botanical/Primitives';
import {C} from '../../../components/dark-botanical/theme';

// 场景 2 · 图表论证:成本下降曲线。折线从左到右绘制,
// 绘完后红圈弹向 2025 末端低点(dasharray 绘制 + 脉冲),点出「跌到这里」。
// 用 AbsoluteFill 手动定位,以便 RedCircle 精确圈住曲线末端。
export const Scene2CostCurve: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localSec = frame / fps;

  // 图表几何(与下方定位保持一致,RedCircle 据此算末端坐标)
  const CHART_W = 1100;
  const CHART_H = 460;
  const CHART_LEFT = (1920 - CHART_W) / 2; // 410
  const CHART_TOP = 320;
  const PAD = {top: 40, right: 40, bottom: 60, left: 80};
  // 末端(2025,maxX,minY)的全局坐标
  const endX = CHART_LEFT + PAD.left + (CHART_W - PAD.left - PAD.right);
  const endY = CHART_TOP + PAD.top + (CHART_H - PAD.top - PAD.bottom);

  const capProgress = Math.min(1, Math.max(0, (localSec - 1.2) / 3.5));
  const capOpacity = Math.min(
    1,
    Math.max(0, (localSec - 1.2) * 2, (5 - localSec) * 2)
  );

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <BigText
        size={56}
        color={C.gold}
        delay={0}
        punch
        style={{position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center'}}
      >
        成本曲线
      </BigText>

      <div
        style={{
          position: 'absolute',
          left: CHART_LEFT,
          top: CHART_TOP,
          width: CHART_W,
        }}
      >
        <AnimatedLineChart
          delay={15}
          drawDuration={50}
          width={CHART_W}
          height={CHART_H}
          xTicks={['2022', '2023', '2024', '2025']}
          yTicks={['0', '2', '4']}
          yLabel="美元 / 百万"
          series={[
            {
              name: '训练成本',
              color: C.goldBright,
              data: [
                {x: 2022, y: 4.6},
                {x: 2023, y: 1.2},
                {x: 2024, y: 0.3},
                {x: 2025, y: 0.04},
              ],
            },
          ]}
        />
      </div>

      {/* 曲线绘制完成(15+50=65f)后,红圈弹向末端低点 */}
      <RedCircle cx={endX} cy={endY} r={70} delay={78} />

      <SubText
        delay={120}
        size={20}
        color={C.textMuted}
        style={{position: 'absolute', bottom: 90, left: 0, right: 0, textAlign: 'center'}}
      >
        数据 · 近似估算
      </SubText>

      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: '7%',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            maxWidth: '82%',
            textAlign: 'center',
            opacity: capOpacity,
            fontFamily: "'Noto Sans SC','PingFang SC',sans-serif",
            fontSize: 40,
            fontWeight: 600,
            color: '#eef2f7',
            textShadow: '0 2px 24px rgba(0,0,0,0.6)',
          }}
        >
          几乎是直线下降
        </div>
      </AbsoluteFill>
      {/* capProgress 占位引用,避免未使用变量;实际逐字效果由静态文案承载 */}
      {capProgress >= 0 && null}
    </AbsoluteFill>
  );
};
