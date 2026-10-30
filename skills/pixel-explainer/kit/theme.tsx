import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { continueRender, delayRender } from 'remotion'
import { DEFAULT_THEME, type PixelTheme } from './themes'

/**
 * 主题注入：组件一律用 usePixel() 取色，不直接引 palette 常量。
 * 不套 Provider 时退回引擎默认主题，保证单文件 demo 也能跑。
 */
const ThemeContext = createContext<PixelTheme>(DEFAULT_THEME)

export const PixelThemeProvider: React.FC<{ theme: PixelTheme; children: React.ReactNode }> = ({
  theme,
  children,
}) => <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>

export const usePixel = (): PixelTheme => useContext(ThemeContext)

/** 字体族名。缝合像素 12px，只在原生尺寸与整 2 倍上清晰。 */
export const PIXEL_FONT_FAMILY = 'FusionPixel'

/**
 * 像素字体加载。
 *
 * 不用 @remotion/fonts 是为了不引额外依赖：这里直接建 FontFace，
 * 用 delayRender/continueRender 卡住首帧，避免字体回退的帧被渲进成片。
 * url 一般传 staticFile('fonts/fusion-pixel-12px-proportional-zh_hans.otf.woff2')。
 */
export const usePixelFont = (url: string, family = PIXEL_FONT_FAMILY): string => {
  const [handle] = useState(() => delayRender(`加载像素字体 ${family}`))

  useEffect(() => {
    let alive = true
    const face = new FontFace(family, `url(${url})`)
    face
      .load()
      .then((loaded) => {
        if (alive) document.fonts.add(loaded)
      })
      .catch((err: unknown) => {
        // 字体缺失时不能静默：像素风一旦回退到系统字体，栅格全毁
        console.error(`像素字体 ${family} 加载失败：`, err)
      })
      .finally(() => {
        if (alive) continueRender(handle)
      })
    return () => {
      alive = false
    }
  }, [url, family, handle])

  return useMemo(() => `"${family}", "Noto Sans SC", monospace`, [family])
}
