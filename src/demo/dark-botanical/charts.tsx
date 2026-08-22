import React from 'react';
import {
  AnimatedBarChart,
  AnimatedComparison,
  AnimatedGauge,
  AnimatedLineChart,
} from '../../components/dark-botanical/Charts';
import {SceneLayout} from '../../components/dark-botanical/Primitives';
import {C} from '../../components/dark-botanical/theme';

// 图表展示:柱状 / 折线 / 仪表盘 / 对比,2x2 分区同屏。
export const DBChartsDemo: React.FC = () => {
  return (
    <SceneLayout bgVariant="default" gap={0}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          justifyItems: 'center',
          width: '100%',
          maxWidth: 1700,
          rowGap: 10,
        }}
      >
        <AnimatedBarChart
          data={[
            {label: '方案 A', value: 62, color: C.gold},
            {label: '方案 B', value: 88, color: C.cyan},
            {label: '方案 C', value: 41, color: C.pink},
          ]}
          width={760}
          height={430}
          barWidth={90}
          gap={70}
          valueSuffix="%"
          delay={0}
          stagger={10}
        />
        <AnimatedLineChart
          series={[
            {
              name: 'QPS',
              color: C.goldBright,
              data: [
                {x: 0, y: 12},
                {x: 1, y: 30},
                {x: 2, y: 26},
                {x: 3, y: 58},
                {x: 4, y: 84},
              ],
            },
          ]}
          width={720}
          height={430}
          yTicks={['0', '40', '80']}
          delay={10}
          drawDuration={40}
        />
        <AnimatedGauge value={0.86} label="缓存命中率" size={230} delay={20} />
        <AnimatedComparison
          left={{value: '3.2s', label: '优化前', color: C.red}}
          right={{value: '0.4s', label: '优化后', color: C.green}}
          delay={26}
        />
      </div>
    </SceneLayout>
  );
};
