import type { SealConfig } from '../types'

export class SealRenderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
  }

  /** 高清渲染 (适配 devicePixelRatio)。centerImage 为自定义中心图片 */
  render(config: SealConfig, scale = 2, centerImage?: HTMLImageElement | null) {
    const size = config.diameter
    const dpr = scale
    this.canvas.width = size * dpr
    this.canvas.height = size * dpr
    this.canvas.style.width = size + 'px'
    this.canvas.style.height = size + 'px'

    const ctx = this.ctx
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, size, size)

    // 全局旋转 (模拟盖章歪斜)
    const cx = size / 2
    const cy = size / 2
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate((config.rotation * Math.PI) / 180)
    ctx.translate(-cx, -cy)

    if (config.shape === 'circular' || config.shape === 'elliptical') {
      this.drawCircularSeal(config, centerImage)
    } else if (config.shape === 'rectangular' || config.shape === 'square') {
      this.drawRectangularSeal(config, centerImage)
    }

    ctx.restore()
  }

  // ─── 圆形 / 椭圆形 ────────────────────────────────────

  private drawCircularSeal(config: SealConfig, centerImage?: HTMLImageElement | null) {
    const ctx = this.ctx
    const size = config.diameter
    const cx = size / 2
    const cy = size / 2
    const rx = cx
    const ry = config.shape === 'elliptical' ? cy * 0.8 : cy

    // 边框样式
    if (config.borderStyle === 'dashed') {
      ctx.setLineDash([10, 6])
    } else {
      ctx.setLineDash([])
    }

    // 外边框
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx - config.outerBorderWidth / 2, ry - config.outerBorderWidth / 2, 0, 0, Math.PI * 2)
    ctx.strokeStyle = config.borderColor
    ctx.lineWidth = config.outerBorderWidth
    ctx.stroke()

    // 恢复实线
    ctx.setLineDash([])

    const outerInset = config.outerBorderWidth + 5

    // ── 防伪微文字环 (在外框和内框之间) ──
    if (config.microText && config.innerBorderWidth > 0) {
      const microR = rx - config.outerBorderWidth / 2 - outerInset / 2
      this.drawMicroTextRing(config, cx, cy, microR)
    }

    // 内边框
    if (config.innerBorderWidth > 0) {
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx - outerInset, ry - outerInset, 0, 0, Math.PI * 2)
      ctx.strokeStyle = config.borderColor
      ctx.lineWidth = config.innerBorderWidth
      ctx.stroke()
    }

    const innerR = rx - config.outerBorderWidth - 10

    // 上弧文字（沿顶部圆弧）
    if (config.topText) {
      this.drawArcText(config, config.topText, cx, cy, innerR * 0.78, -210, 30, false, config.topFontSize)
    }

    // 下弧文字（沿底部圆弧）
    if (config.bottomText) {
      this.drawArcText(config, config.bottomText, cx, cy, innerR * 0.78, -30, 210, false, config.bottomFontSize)
    }

    // 中心图案
    if (config.centerSymbol === 'star') {
      const starR = config.diameter * 0.08
      this.drawStar(cx, cy, config.starPoints, starR, starR * 0.42, config.borderColor)
    } else if (config.centerSymbol === 'image' && centerImage) {
      this.drawCenterImage(ctx, centerImage, cx, cy, config.diameter * 0.18)
    }

    // 中心文字（在星形下方或替代星形）
    if (config.centerText) {
      ctx.save()
      ctx.fillStyle = config.borderColor
      ctx.font = `${config.centerFontSize}px ${config.fontFamily}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const starOffset = (config.centerSymbol === 'star' || config.centerSymbol === 'image') ? config.diameter * 0.11 : 0
      ctx.fillText(config.centerText, cx, cy + starOffset)
      ctx.restore()
    }

    // 底部编码
    if (config.serialNumber) {
      ctx.save()
      ctx.fillStyle = config.borderColor
      ctx.font = `${config.serialFontSize}px ${config.fontFamily}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(config.serialNumber, cx, cy + innerR - 15)
      ctx.restore()
    }
  }

  // ─── 矩形 / 方形 ──────────────────────────────────────

  private drawRectangularSeal(config: SealConfig, centerImage?: HTMLImageElement | null) {
    const ctx = this.ctx
    const size = config.diameter
    const pad = 20
    const w = size
    const h = config.shape === 'square' ? size : size * 0.6

    // 边框
    if (config.borderStyle === 'dashed') {
      ctx.setLineDash([10, 6])
    }
    ctx.beginPath()
    ctx.rect(pad, pad, w - pad * 2, h - pad * 2)
    ctx.strokeStyle = config.borderColor
    ctx.lineWidth = config.outerBorderWidth
    ctx.stroke()
    ctx.setLineDash([])

    // 上排文字
    if (config.topText) {
      ctx.save()
      ctx.fillStyle = config.borderColor
      ctx.font = `bold ${config.topFontSize}px ${config.fontFamily}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(config.topText, w / 2, h * 0.28 + pad)
      ctx.restore()
    }

    // 中心图片或文字
    if (config.centerSymbol === 'image' && centerImage) {
      this.drawCenterImage(ctx, centerImage, w / 2, h * 0.48 + pad, config.diameter * 0.12)
    }

    // 中心文字
    if (config.centerText) {
      ctx.save()
      ctx.fillStyle = config.borderColor
      ctx.font = `${config.centerFontSize}px ${config.fontFamily}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const yOff = config.centerSymbol === 'image' ? config.diameter * 0.08 : 0
      ctx.fillText(config.centerText, w / 2, h * 0.5 + pad + yOff)
      ctx.restore()
    }

    // 下排文字
    if (config.bottomText) {
      ctx.save()
      ctx.fillStyle = config.borderColor
      ctx.font = `${config.bottomFontSize}px ${config.fontFamily}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(config.bottomText, w / 2, h * 0.72 + pad)
      ctx.restore()
    }
  }

  // ─── 防伪微文字环 ─────────────────────────────────────

  private drawMicroTextRing(config: SealConfig, cx: number, cy: number, radius: number) {
    const ctx = this.ctx
    ctx.save()
    ctx.fillStyle = config.borderColor
    ctx.font = `${config.microTextFontSize}px ${config.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const text = config.microText
    const fontSize = config.microTextFontSize
    // 估算每个字符占的弧度
    const charWidth = ctx.measureText(text[0] || 'A').width
    const charAngle = charWidth / radius
    const textAngle = charWidth * text.length / radius
    // 重复文字填满整圈
    const repeats = Math.floor((2 * Math.PI) / textAngle)
    const fullText = text.repeat(Math.max(1, repeats))

    const chars = fullText.split('')
    for (let i = 0; i < chars.length; i++) {
      const angle = (i / chars.length) * Math.PI * 2 - Math.PI / 2
      const x = cx + Math.cos(angle) * radius
      const y = cy + Math.sin(angle) * radius

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle + Math.PI / 2)
      ctx.fillText(chars[i], 0, 0)
      ctx.restore()
    }

    ctx.restore()
  }

  // ─── 自定义中心图片 ───────────────────────────────────

  private drawCenterImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cx: number, cy: number, maxRadius: number) {
    const iw = img.naturalWidth || img.width
    const ih = img.naturalHeight || img.height
    if (iw === 0 || ih === 0) return

    // 缩放以适应，保持长宽比
    const scale = Math.min((maxRadius * 2) / iw, (maxRadius * 2) / ih)
    const dw = iw * scale
    const dh = ih * scale

    ctx.save()
    ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh)
    ctx.restore()
  }

  // ─── 弧形文字 ──────────────────────────────────────────

  private drawArcText(
    config: SealConfig,
    text: string,
    cx: number,
    cy: number,
    radius: number,
    startDeg: number,
    endDeg: number,
    _clockwise: boolean,
    fontSize: number,
  ) {
    const ctx = this.ctx
    ctx.save()
    ctx.fillStyle = config.borderColor
    ctx.font = `${fontSize}px ${config.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const chars = text.split('')
    const n = chars.length
    if (n === 0) { ctx.restore(); return }

    const startAngle = (startDeg * Math.PI) / 180
    const endAngle = (endDeg * Math.PI) / 180

    // 测量每个字符宽度并计算文字实际需要的弧度
    const charWidths = chars.map((ch) => ctx.measureText(ch).width)
    const totalWidth = charWidths.reduce((a, b) => a + b, 0)
    const textAngle = totalWidth / radius

    // 让短文字紧凑、长文字占满可用空间
    const availableAngle = Math.abs(endAngle - startAngle)
    const spreadAngle = Math.min(textAngle * 1.05, availableAngle)
    const midAngle = (startAngle + endAngle) / 2
    const actualStart = midAngle - spreadAngle / 2

    // 逐字均分
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1)
      const angle = actualStart + spreadAngle * t

      const x = cx + Math.cos(angle) * radius
      const y = cy + Math.sin(angle) * radius

      ctx.save()
      ctx.translate(x, y)
      const rot = angle + Math.PI / 2
      ctx.rotate(rot)
      ctx.fillText(chars[i], 0, 0)
      ctx.restore()
    }

    ctx.restore()
  }

  // ─── 五角星 ────────────────────────────────────────────

  private drawStar(cx: number, cy: number, points: number, outerR: number, innerR: number, color: string) {
    const ctx = this.ctx
    ctx.save()
    ctx.fillStyle = color

    ctx.beginPath()
    const step = Math.PI / points
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR
      const angle = -Math.PI / 2 + i * step
      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  // ─── 导出 Blob ─────────────────────────────────────────

  toBlob(type = 'image/png'): Promise<Blob | null> {
    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => resolve(blob), type)
    })
  }
}
