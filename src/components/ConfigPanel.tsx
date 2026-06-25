import { useRef, useCallback } from 'react'
import type { SealConfig } from '../types'

interface Props {
  config: SealConfig
  onChange: (c: SealConfig) => void
  onReset: () => void
}

const COLOR_PRESETS = [
  { label: '印章红', value: '#CC0000' },
  { label: '深红', value: '#990000' },
  { label: '朱红', value: '#E60000' },
  { label: '深蓝', value: '#003399' },
  { label: '海军蓝', value: '#1a3a6b' },
  { label: '黑色', value: '#000000' },
]

export default function ConfigPanel({ config, onChange, onReset }: Props) {
  const update = (patch: Partial<SealConfig>) => onChange({ ...config, ...patch })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      update({ uploadedImage: reader.result as string, centerSymbol: 'image' })
    }
    reader.readAsDataURL(file)
    // reset so same file can be re-selected
    e.target.value = ''
  }, [update])

  const clearLogo = useCallback(() => {
    update({ uploadedImage: null, centerSymbol: 'star' })
  }, [update])

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-gray-500 tracking-wide">✏️ 编辑参数</h3>

      {/* 印章尺寸 */}
      <Field label={`印章尺寸: ${config.diameter}px`}>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={150}
            max={600}
            step={10}
            value={config.diameter}
            onChange={(e) => update({ diameter: parseInt(e.target.value) })}
            className="flex-1 accent-red-600"
          />
          <span className="text-xs text-gray-400 w-14 text-right">
            {Math.round(config.diameter / 4.72)}mm
          </span>
        </div>
      </Field>

      {/* 上弧文字 */}
      <Field label="上弧 / 顶部文字">
        <input
          type="text"
          value={config.topText}
          onChange={(e) => update({ topText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
          placeholder="输入上弧文字..."
        />
      </Field>

      {/* 下弧文字 */}
      <Field label="下弧 / 底部文字">
        <input
          type="text"
          value={config.bottomText}
          onChange={(e) => update({ bottomText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
          placeholder="输入下弧文字..."
        />
      </Field>

      {/* 中心文字 */}
      <Field label="中心文字">
        <input
          type="text"
          value={config.centerText}
          onChange={(e) => update({ centerText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
          placeholder="中心文字（留空显示五角星）"
        />
      </Field>

      {/* 编码 */}
      <Field label="底部编码">
        <input
          type="text"
          value={config.serialNumber}
          onChange={(e) => update({ serialNumber: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
          placeholder="企业编码 / 税号..."
        />
      </Field>

      {/* 中心图案选择 + Logo 上传 */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">中心图案</label>
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            onClick={() => update({ centerSymbol: 'star' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              config.centerSymbol === 'star'
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            ⭐ 五角星
          </button>
          <button
            onClick={() => update({ centerSymbol: 'none' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              config.centerSymbol === 'none'
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            无图案
          </button>
          <button
            onClick={() => {
              if (config.uploadedImage) {
                update({ centerSymbol: 'image' })
              } else {
                fileInputRef.current?.click()
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              config.centerSymbol === 'image'
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            🖼️ 自定义图片
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
        />
        {config.uploadedImage && (
          <div className="flex items-center gap-2 mt-1">
            <img src={config.uploadedImage} alt="logo" className="w-8 h-8 object-contain rounded border" />
            <span className="text-xs text-gray-500 truncate flex-1">已上传</span>
            <button onClick={clearLogo} className="text-xs text-red-500 hover:underline">清除</button>
          </div>
        )}
      </div>

      {/* 边框样式 */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">边框样式</label>
        <div className="flex gap-2">
          <button
            onClick={() => update({ borderStyle: 'solid' })}
            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              config.borderStyle === 'solid'
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            ━━ 实线边框
          </button>
          <button
            onClick={() => update({ borderStyle: 'dashed' })}
            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              config.borderStyle === 'dashed'
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            ┅┅ 虚线边框
          </button>
        </div>
      </div>

      {/* 防伪微文字 */}
      <Field label="防伪微文字（留空=关闭）">
        <input
          type="text"
          value={config.microText}
          onChange={(e) => update({ microText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
          placeholder="例如：★公司名★"
        />
      </Field>

      {/* 颜色选择 */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">印章颜色</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {COLOR_PRESETS.map((c) => (
            <button
              key={c.value}
              onClick={() => update({ borderColor: c.value })}
              title={c.label}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                config.borderColor === c.value ? 'border-gray-800 scale-110 shadow-md' : 'border-gray-200 hover:scale-105'
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
          <div className="relative">
            <input
              type="color"
              value={config.borderColor}
              onChange={(e) => update({ borderColor: e.target.value })}
              className="w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 旋转角度 */}
      <Field label={`旋转角度: ${config.rotation}°`}>
        <input
          type="range"
          min={-15}
          max={15}
          step={0.5}
          value={config.rotation}
          onChange={(e) => update({ rotation: parseFloat(e.target.value) })}
          className="w-full accent-red-600"
        />
      </Field>

      {/* 字体选择 */}
      <Field label="字体">
        <select
          value={config.fontFamily}
          onChange={(e) => update({ fontFamily: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none bg-white"
        >
          <option value='"SimSun", "STSong", "宋体", serif'>宋体 / SimSun（中文公文章）</option>
          <option value='"KaiTi", "STKaiti", "楷体", serif'>楷体 / KaiTi</option>
          <option value='"Times New Roman", Georgia, serif'>Times New Roman（英文正式）</option>
          <option value='Georgia, "Times New Roman", serif'>Georgia</option>
          <option value='Arial, Helvetica, sans-serif'>Arial（现代简洁）</option>
        </select>
      </Field>

      {/* 外边框粗细 */}
      <Field label={`外边框粗细: ${config.outerBorderWidth}px`}>
        <input
          type="range"
          min={1}
          max={12}
          step={0.5}
          value={config.outerBorderWidth}
          onChange={(e) => update({ outerBorderWidth: parseFloat(e.target.value) })}
          className="w-full accent-red-600"
        />
      </Field>

      {/* 高级文字大小调整 */}
      <details className="group">
        <summary className="text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700 select-none">
          🔤 高级文字大小调整
        </summary>
        <div className="mt-3 space-y-3 pl-1">
          <Field label={`上弧文字: ${config.topFontSize}px`}>
            <input
              type="range"
              min={12}
              max={60}
              step={1}
              value={config.topFontSize}
              onChange={(e) => update({ topFontSize: parseInt(e.target.value) })}
              className="w-full accent-red-600"
            />
          </Field>
          <Field label={`下弧文字: ${config.bottomFontSize}px`}>
            <input
              type="range"
              min={10}
              max={50}
              step={1}
              value={config.bottomFontSize}
              onChange={(e) => update({ bottomFontSize: parseInt(e.target.value) })}
              className="w-full accent-red-600"
            />
          </Field>
          <Field label={`中心文字: ${config.centerFontSize}px`}>
            <input
              type="range"
              min={10}
              max={60}
              step={1}
              value={config.centerFontSize}
              onChange={(e) => update({ centerFontSize: parseInt(e.target.value) })}
              className="w-full accent-red-600"
            />
          </Field>
          <Field label={`编码: ${config.serialFontSize}px`}>
            <input
              type="range"
              min={8}
              max={24}
              step={1}
              value={config.serialFontSize}
              onChange={(e) => update({ serialFontSize: parseInt(e.target.value) })}
              className="w-full accent-red-600"
            />
          </Field>
          <Field label={`微文字: ${config.microTextFontSize}px`}>
            <input
              type="range"
              min={5}
              max={14}
              step={0.5}
              value={config.microTextFontSize}
              onChange={(e) => update({ microTextFontSize: parseFloat(e.target.value) })}
              className="w-full accent-red-600"
            />
          </Field>
        </div>
      </details>

      {/* 重置按钮 */}
      <button
        onClick={onReset}
        className="w-full py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        恢复默认
      </button>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
