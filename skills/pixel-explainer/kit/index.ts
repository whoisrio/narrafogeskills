/**
 * 像素引擎几何层入口。
 *
 * 这个库只装"算错了看不出来"的东西：栅格断言、阶梯线分段、字符画转路径、
 * 整数对齐的文字排布、调色板数据。面板 / 底色 / 字幕带 / HUD 这类几行 div
 * 的东西按 style-guide 自己写，不进库。
 *
 * 用法：
 *   <PixelThemeProvider theme={themeById('pico8')}>
 *     <AbsoluteFill>
 *       <PixelBg />            // 自写：底色 + 扫描线 + 内框 + 四角
 *       <HudBar … />           // 自写：顶部章节条
 *       <PixelText … />        // 库
 *       <Rects … />            // 库
 *       <CaptionBand … />      // 自写：两行字幕
 *     </AbsoluteFill>
 *   </PixelThemeProvider>
 *
 * 三条不能破的：坐标走 u()、字号只走 t/T、动效只用 staged/blink/typewriter。
 */

export * from './grid'
export * from './themes'
export * from './theme'
export * from './wire'
export * from './rects'
export * from './text'
export * from './sprite'
export * from './sprites'
