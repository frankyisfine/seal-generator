import { useState, useCallback } from 'react'
import type { SealConfig } from './types'
import { allTemplates } from './templates/presets'
import TemplateSelector from './components/TemplateSelector'
import SealPreview from './components/SealPreview'
import ConfigPanel from './components/ConfigPanel'
import ExportPanel from './components/ExportPanel'

export default function App() {
  const [config, setConfig] = useState<SealConfig>(allTemplates[0])
  const [templateId, setTemplateId] = useState(config.id)

  const handleTemplateSelect = useCallback((t: SealConfig) => {
    setConfig({ ...t })
    setTemplateId(t.id)
  }, [])

  const handleReset = useCallback(() => {
    const original = allTemplates.find((t) => t.id === templateId)
    if (original) setConfig({ ...original })
  }, [templateId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 顶部标题栏 */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔴</span>
            <div>
              <h1 className="text-xl font-bold text-gray-800">电子公章生成器</h1>
              <p className="text-xs text-gray-400">Seal & Stamp Generator</p>
            </div>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">透明背景 · 高清导出 · 支持中英文印章</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 模板选择 */}
        <section className="mb-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <TemplateSelector currentId={config.id} onSelect={handleTemplateSelect} />
        </section>

        {/* 主体：桌面端左右布局，移动端上下 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：编辑面板 */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 sticky top-4">
              <ConfigPanel config={config} onChange={setConfig} onReset={handleReset} />
            </div>
          </div>

          {/* 右侧：预览 + 导出 */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-5">
            <SealPreview config={config} />
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
              <ExportPanel config={config} />
            </div>
          </div>
        </div>
      </main>

      {/* 底部 */}
      <footer className="text-center py-6 text-xs text-gray-400">
        公章生成仅供合法用途 · 请勿用于伪造公章等违法行为
      </footer>
    </div>
  )
}
