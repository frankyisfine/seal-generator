import { useEffect, useRef, useState } from 'react'
import type { SealConfig } from '../types'
import { SealRenderer } from '../engine/renderer'

interface Props {
  config: SealConfig
}

export default function SealPreview({ config }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<SealRenderer | null>(null)
  const [centerImage, setCenterImage] = useState<HTMLImageElement | null>(null)
  const prevImageRef = useRef<string | null | undefined>(undefined)

  // 加载自定义中心图片
  useEffect(() => {
    if (config.uploadedImage && config.uploadedImage !== prevImageRef.current) {
      const img = new Image()
      img.onload = () => setCenterImage(img)
      img.onerror = () => setCenterImage(null)
      img.src = config.uploadedImage
    } else if (!config.uploadedImage) {
      setCenterImage(null)
    }
    prevImageRef.current = config.uploadedImage
  }, [config.uploadedImage])

  // 渲染
  useEffect(() => {
    if (!canvasRef.current) return
    if (!rendererRef.current) {
      rendererRef.current = new SealRenderer(canvasRef.current)
    }
    // 使用 3x 缩放保证高清预览
    rendererRef.current.render(config, 3, centerImage)
  }, [config, centerImage])

  return (
    <div className="flex items-center justify-center p-6 bg-gray-100/60 rounded-2xl border-2 border-dashed border-gray-300 min-h-[440px]">
      {/* 透明背景网格提示 */}
      <div
        className="relative shadow-lg rounded-sm overflow-hidden"
        style={{
          width: config.diameter,
          height: config.diameter,
          background:
            'repeating-conic-gradient(#f0f0f0 0% 25%, white 0% 50%) 50% / 20px 20px',
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ width: config.diameter, height: config.diameter }}
        />
      </div>
    </div>
  )
}
