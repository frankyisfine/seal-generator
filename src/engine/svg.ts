import type { SealConfig } from '../types'

export function downloadSVG(config: SealConfig) {
  const svg = buildSVG(config)
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  downloadBlob(blob, `${config.name || 'seal'}.svg`)
}

function buildSVG(config: SealConfig): string {
  const size = config.diameter
  const cx = size / 2
  const cy = size / 2

  let content = ''
  const dashAttr = config.borderStyle === 'dashed' ? ` stroke-dasharray="10,6"` : ''

  if (config.shape === 'circular' || config.shape === 'elliptical') {
    const rx = cx
    const ry = config.shape === 'elliptical' ? cy * 0.8 : cy
    const outerInset = config.outerBorderWidth + 5
    const innerR = rx - config.outerBorderWidth - 10

    // 外边框
    content += `<ellipse cx="${cx}" cy="${cy}" rx="${rx - config.outerBorderWidth / 2}" ry="${ry - config.outerBorderWidth / 2}" fill="none" stroke="${config.borderColor}" stroke-width="${config.outerBorderWidth}"${dashAttr}/>`

    // 防伪微文字环（内外框之间）
    if (config.microText && config.innerBorderWidth > 0) {
      const microR = rx - config.outerBorderWidth / 2 - outerInset / 2
      content += buildMicroTextRingSVG(config, cx, cy, microR)
    }

    // 内边框
    if (config.innerBorderWidth > 0) {
      content += `<ellipse cx="${cx}" cy="${cy}" rx="${rx - outerInset}" ry="${ry - outerInset}" fill="none" stroke="${config.borderColor}" stroke-width="${config.innerBorderWidth}"/>`
    }

    // 上弧文字
    if (config.topText) {
      content += buildArcTextPath(config, config.topText, cx, cy, innerR * 0.78, -210, 30, 'topArc', config.topFontSize)
    }

    // 下弧文字
    if (config.bottomText) {
      content += buildArcTextPath(config, config.bottomText, cx, cy, innerR * 0.78, -30, 210, 'bottomArc', config.bottomFontSize)
    }

    // 中心图案
    if (config.centerSymbol === 'star') {
      const starR = config.diameter * 0.08
      content += buildStarSVG(cx, cy, config.starPoints, starR, starR * 0.42, config.borderColor)
    } else if (config.centerSymbol === 'image' && config.uploadedImage) {
      const imgSize = config.diameter * 0.18
      content += `<image href="${escAttr(config.uploadedImage)}" x="${cx - imgSize}" y="${cy - imgSize}" width="${imgSize * 2}" height="${imgSize * 2}" preserveAspectRatio="xMidYMid meet"/>`
    }

    // 中心文字
    if (config.centerText) {
      const hasCenter = config.centerSymbol === 'star' || config.centerSymbol === 'image'
      const starOffset = hasCenter ? config.diameter * 0.11 : 0
      content += `<text x="${cx}" y="${cy + starOffset}" text-anchor="middle" dominant-baseline="middle" font-family="${config.fontFamily}" font-size="${config.centerFontSize}" fill="${config.borderColor}">${esc(config.centerText)}</text>`
    }

    // 底部编码
    if (config.serialNumber) {
      content += `<text x="${cx}" y="${cy + innerR - 15}" text-anchor="middle" font-family="${config.fontFamily}" font-size="${config.serialFontSize}" fill="${config.borderColor}">${esc(config.serialNumber)}</text>`
    }
  } else {
    // 矩形
    const pad = 20
    const w = size
    const h = config.shape === 'square' ? size : size * 0.6
    content += `<rect x="${pad}" y="${pad}" width="${w - pad * 2}" height="${h - pad * 2}" fill="none" stroke="${config.borderColor}" stroke-width="${config.outerBorderWidth}"${dashAttr}/>`

    if (config.topText) {
      content += `<text x="${w / 2}" y="${h * 0.28 + pad}" text-anchor="middle" dominant-baseline="middle" font-family="${config.fontFamily}" font-weight="bold" font-size="${config.topFontSize}" fill="${config.borderColor}">${esc(config.topText)}</text>`
    }

    if (config.centerSymbol === 'image' && config.uploadedImage) {
      const imgSize = config.diameter * 0.12
      content += `<image href="${escAttr(config.uploadedImage)}" x="${w / 2 - imgSize}" y="${h * 0.48 + pad - imgSize}" width="${imgSize * 2}" height="${imgSize * 2}" preserveAspectRatio="xMidYMid meet"/>`
    }

    if (config.centerText) {
      const yOff = config.centerSymbol === 'image' ? config.diameter * 0.08 : 0
      content += `<text x="${w / 2}" y="${h * 0.5 + pad + yOff}" text-anchor="middle" dominant-baseline="middle" font-family="${config.fontFamily}" font-size="${config.centerFontSize}" fill="${config.borderColor}">${esc(config.centerText)}</text>`
    }
    if (config.bottomText) {
      content += `<text x="${w / 2}" y="${h * 0.72 + pad}" text-anchor="middle" dominant-baseline="middle" font-family="${config.fontFamily}" font-size="${config.bottomFontSize}" fill="${config.borderColor}">${esc(config.bottomText)}</text>`
    }
  }

  const rotation = config.rotation ? ` transform="rotate(${config.rotation} ${cx} ${cy})"` : ''

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <g${rotation}>
    ${content}
  </g>
</svg>`
}

// ─── 微文字环 (SVG) ──────────────────────────────────────

function buildMicroTextRingSVG(config: SealConfig, cx: number, cy: number, r: number): string {
  const text = config.microText
  const chars = text.split('')
  // 简单估算：每个字符占 ~fontSize*0.6 弧度宽度
  const charAng = (config.microTextFontSize * 0.7) / r
  const textAng = charAng * chars.length
  const repeats = Math.max(1, Math.floor((2 * Math.PI) / textAng))
  const fullText = text.repeat(repeats)

  let out = ''
  const totalChars = fullText.length
  for (let i = 0; i < totalChars; i++) {
    const angle = (i / totalChars) * Math.PI * 2 - Math.PI / 2
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    const rotDeg = ((angle + Math.PI / 2) * 180) / Math.PI
    out += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-family="${config.fontFamily}" font-size="${config.microTextFontSize}" fill="${config.borderColor}" transform="rotate(${rotDeg.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})">${esc(fullText[i])}</text>`
  }
  return out
}

// ─── 弧形文字路径 ────────────────────────────────────────

function buildArcTextPath(
  config: SealConfig,
  text: string,
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
  pathId: string,
  fontSize: number,
): string {
  const startAngle = (startDeg * Math.PI) / 180
  const endAngle = (endDeg * Math.PI) / 180

  const x1 = cx + Math.cos(startAngle) * r
  const y1 = cy + Math.sin(startAngle) * r
  const x2 = cx + Math.cos(endAngle) * r
  const y2 = cy + Math.sin(endAngle) * r

  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
  const sweep = 0

  const pathD = `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 ${largeArc} ${sweep} ${x2.toFixed(1)} ${y2.toFixed(1)}`

  return `<defs><path id="${pathId}" d="${pathD}"/></defs>
<text font-family="${config.fontFamily}" font-size="${fontSize}" fill="${config.borderColor}" text-anchor="middle">
  <textPath href="#${pathId}" startOffset="50%">${esc(text)}</textPath>
</text>`
}

function buildStarSVG(cx: number, cy: number, points: number, outerR: number, innerR: number, color: string): string {
  let d = ''
  const step = Math.PI / points
  for (let i = 0; i < points * 2; i++) {
    const rv = i % 2 === 0 ? outerR : innerR
    const angle = -Math.PI / 2 + i * step
    const x = cx + Math.cos(angle) * rv
    const y = cy + Math.sin(angle) * rv
    d += (i === 0 ? 'M' : 'L') + ` ${x.toFixed(1)} ${y.toFixed(1)} `
  }
  d += 'Z'
  return `<path d="${d}" fill="${color}"/>`
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escAttr(s: string) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
