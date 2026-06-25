import { useRef, useCallback, useEffect, useState } from 'react'
import type { SealConfig } from '../types'
import { SealRenderer } from '../engine/renderer'
import { downloadSVG } from '../engine/svg'

interface Props {
  config: SealConfig
}

export default function ExportPanel({ config }: Props) {
  const offscreenRef = useRef<HTMLCanvasElement | null>(null)
  const [exportImage, setExportImage] = useState<HTMLImageElement | null>(null)

  // 加载自定义图片供导出使用
  useEffect(() => {
    if (config.uploadedImage && config.centerSymbol === 'image') {
      const img = new Image()
      img.onload = () => setExportImage(img)
      img.onerror = () => setExportImage(null)
      img.src = config.uploadedImage
    } else {
      setExportImage(null)
    }
  }, [config.uploadedImage, config.centerSymbol])

  const getCanvas = useCallback(() => {
    if (!offscreenRef.current) {
      offscreenRef.current = document.createElement('canvas')
    }
    const renderer = new SealRenderer(offscreenRef.current)
    const exportScale = 4
    renderer.render(config, exportScale, exportImage)
    return offscreenRef.current
  }, [config, exportImage])

  const downloadPNG = useCallback(() => {
    const canvas = getCanvas()
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${config.name || 'seal'}.png`
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }, [config, getCanvas])

  const downloadJPEG = useCallback(() => {
    const canvas = getCanvas()
    const tmp = document.createElement('canvas')
    tmp.width = canvas.width
    tmp.height = canvas.height
    const ctx = tmp.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, tmp.width, tmp.height)
    ctx.drawImage(canvas, 0, 0)
    tmp.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${config.name || 'seal'}.jpg`
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/jpeg', 0.95)
  }, [config, getCanvas])

  const handleSVG = useCallback(() => {
    downloadSVG(config)
  }, [config])

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 mb-3 tracking-wide">📥 导出印章</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={downloadPNG}
          className="flex-1 min-w-[100px] px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl text-sm font-semibold hover:from-red-700 hover:to-red-600 transition-all shadow-sm active:scale-95"
        >
          PNG 透明背景
        </button>
        <button
          onClick={downloadJPEG}
          className="flex-1 min-w-[100px] px-4 py-2.5 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-xl text-sm font-semibold hover:from-gray-800 hover:to-gray-700 transition-all shadow-sm active:scale-95"
        >
          JPEG 白底
        </button>
        <button
          onClick={handleSVG}
          className="flex-1 min-w-[100px] px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-sm active:scale-95"
        >
          SVG 矢量
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        PNG/SVG 支持透明背景，JPEG 为白色背景。SVG 可无限放大不失真。
      </p>
    </div>
  )
}
