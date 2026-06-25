import { chineseTemplates, foreignTemplates, type TemplatePreset } from '../templates/presets'

interface Props {
  currentId: string
  onSelect: (t: TemplatePreset) => void
}

export default function TemplateSelector({ currentId, onSelect }: Props) {
  return (
    <div className="space-y-3">
      {/* 中国传统章 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2 tracking-wide">🇨🇳 中国传统印章</h3>
        <div className="flex flex-wrap gap-2">
          {chineseTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                currentId === t.id
                  ? 'border-red-600 bg-red-50 text-red-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-red-300 hover:bg-red-50/50'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* 国外 / 国际章 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2 tracking-wide">🌍 国际 / 国外印章</h3>
        <div className="flex flex-wrap gap-2">
          {foreignTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                currentId === t.id
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
