import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';

/**
 * 场景缩放包装器:按基础分辨率(默认 1280x720)设计的场景,
 * 自动缩放到当前 Composition 分辨率(如 1080p / 4K),
 * 用 CSS transform scale 保持内部布局比例不变。
 */
export const SceneScaler: React.FC<{
  children: React.ReactNode;
  baseWidth?: number;
  baseHeight?: number;
}> = ({children, baseWidth = 1280, baseHeight = 720}) => {
  const {width, height} = useVideoConfig();
  const scale = Math.min(width / baseWidth, height / baseHeight);

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: baseWidth,
          height: baseHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/**
 * 创建带缩放的场景组件。
 * 用法:const ScaledTitle = createScaledScene(SceneTitle);
 */
export const createScaledScene = <P extends object>(
  Component: React.ComponentType<P>,
  base?: {baseWidth?: number; baseHeight?: number}
): React.FC<P> => {
  const ScaledScene: React.FC<P> = (props) => (
    <SceneScaler {...base}>
      <Component {...props} />
    </SceneScaler>
  );
  ScaledScene.displayName = `Scaled${Component.displayName || Component.name || 'Scene'}`;
  return ScaledScene;
};
