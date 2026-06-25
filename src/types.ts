export type SealShape = 'circular' | 'elliptical' | 'rectangular' | 'square'
export type BorderStyle = 'solid' | 'dashed'

export interface SealConfig {
  id: string
  name: string
  shape: SealShape
  /** Canvas 绘制直径/宽度 (px) */
  diameter: number
  /** 整体旋转角度 (°) */
  rotation: number
  /** 主色 */
  borderColor: string
  /** 背景色 (通常透明) */
  backgroundColor: string
  /** 外边框粗细 (px) */
  outerBorderWidth: number
  /** 内边框粗细 (px, 0=无内框) */
  innerBorderWidth: number
  /** 外边框样式 */
  borderStyle: BorderStyle
  /** 上弧文字 */
  topText: string
  /** 下弧文字 */
  bottomText: string
  /** 中心文字 (可选, 优先于星形) */
  centerText: string
  /** 中心图案 */
  centerSymbol: 'star' | 'none' | 'image'
  /** 五角星角数 */
  starPoints: number
  /** 底部编码 */
  serialNumber: string
  /** 字体族 */
  fontFamily: string
  /** 上弧文字大小 */
  topFontSize: number
  /** 下弧文字大小 */
  bottomFontSize: number
  /** 中心文字大小 */
  centerFontSize: number
  /** 编码文字大小 */
  serialFontSize: number
  /** 防伪微文字 (空=不显示) */
  microText: string
  /** 微文字大小 (px) */
  microTextFontSize: number
  /** 自定义中心图片 (base64 data URL), 仅 centerSymbol='image' 时生效 */
  uploadedImage: string | null
}
