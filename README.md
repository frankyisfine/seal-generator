# 🔴 电子公章生成器 · Seal & Stamp Generator

在线生成中英文电子印章，支持 15 种模板、高清 PNG/SVG 导出、自定义 Logo、防伪微文字。

**🌐 在线使用**: [https://seal-generator.vercel.app](https://seal-generator.vercel.app) *(部署后生效)*

## ✨ 功能

- 🏷️ **15 种模板** — 企业公章、合同章、财务章、发票章、法人章、报关章、检验章、项目章、工会章、学校章 + Corporate/Notary/Common Seal + Approved/Received Stamp
- 🎨 **实时预览** — Canvas 高清渲染，所见即所得
- 📥 **多格式导出** — PNG 透明背景 / JPEG 白底 / SVG 矢量
- 🔍 **防伪微文字环** — 模拟真实印章的防伪圈
- 🖼️ **自定义中心 Logo** — 上传图片替换五角星
- ┅┅ **虚线边框** — 发票章等特殊样式
- 📐 **全方位可调** — 尺寸 150-600px、颜色、旋转角度、边框粗细、5 种字体、文字大小
- 📱 **响应式** — 桌面端左右分栏，手机端上下堆叠

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发模式 (localhost:5173)
npm run dev

# 生产构建
npm run build

# 预览生产版本
npm run preview
```

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite 6
- **样式**: Tailwind CSS 3
- **渲染**: HTML5 Canvas (4x 超采样) + SVG 代码生成
- **字体**: 宋体/楷体/Times New Roman/Georgia/Arial

## 📂 项目结构

```
src/
├── engine/
│   ├── renderer.ts    # Canvas 渲染引擎
│   └── svg.ts         # SVG 矢量导出
├── templates/
│   └── presets.ts     # 15 种印章模板
├── components/
│   ├── SealPreview.tsx      # 实时预览
│   ├── ConfigPanel.tsx      # 参数编辑面板
│   ├── TemplateSelector.tsx # 模板选择器
│   └── ExportPanel.tsx      # 导出面板
├── types.ts           # 类型定义
└── App.tsx            # 主布局
```

## ⚠️ 免责声明

本工具仅供合法用途（设计练习、内部参考、印章样式预览）。**生成结果不具有法律效力**。请勿用于伪造公章等违法行为——根据《中华人民共和国刑法》第 280 条，伪造公司、企业印章属于违法犯罪行为。

## 📄 License

MIT
