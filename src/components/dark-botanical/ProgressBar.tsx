import React from 'react';
import {BLUEPRINT} from './theme';

// 顶部细进度条。提取自 responseapi/src/components/ProgressBar.tsx。
export const ProgressBar: React.FC<{progress: number}> = ({progress}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: 'rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${Math.min(100, Math.max(0, progress * 100))}%`,
          background: `linear-gradient(90deg, ${BLUEPRINT.gold}, ${BLUEPRINT.goldBright})`,
          boxShadow: `0 0 12px ${BLUEPRINT.goldGlow}`,
        }}
      />
    </div>
  );
};
