# AI Model Catalog

基于 [pi.dev/models](https://pi.dev/models) 的数据与设计复刻的 AI 大模型目录站。

**线上地址**：<https://blog.wangruofeng007.com/ai-models/>（GitHub Pages 部署，仓库 [wangruofeng/ai-models](https://github.com/wangruofeng/ai-models)）

## 数据

- **1414 个模型**，来自 **39 个 provider**（amazon-bedrock、anthropic、openai、openrouter、vercel-ai-gateway、zai 等）
- 每个模型包含：显示名、model ID、上下文窗口、输入/输出/缓存读写价格（$/M tokens）
- 数据提取自原站服务端渲染的 HTML 表格（`reference/pi-models-data.json` 为原始提取，`data.json` 为紧凑版）

## 运行

纯静态站点，零构建依赖：

```bash
npx serve . -l 3456
# 或
python3 -m http.server 3456
```

打开 http://localhost:3456 即可。

## 功能

- **名称搜索**：实时匹配模型名 / model ID / provider
- **Provider 筛选**：下拉选择，同步 URL 参数 `?provider=…`（与原站行为一致）
- **Reset**：一键清空全部筛选
- **实时计数**：`N / 1414` 显示当前匹配数
- **主题切换**：footer 右侧 Auto / Light / Dark 三态循环，localStorage 记忆
- **分组表格**：按 provider 分组、行悬停高亮、数字右对齐、窄屏横向滚动

## 技术栈

- 原生 HTML / CSS / JavaScript，无框架、无构建
- 设计 token（配色、字号、字距、间距、边框）逐项提取自原站 computed styles
- 字体使用 Georgia / ui-monospace 等效回退（原站商业字体 Plantin MT Pro / Departure Mono 不可再分发）

## 目录结构

```
├── index.html      # 页面结构（导航 / 卡片 / 表格 / 页脚）
├── styles.css      # 设计 token + 组件样式（含暗色主题）
├── app.js          # 数据加载、筛选、渲染、主题切换
├── data.json       # 1414 个模型的紧凑数据
└── reference/      # 提取过程中间产物（快照、DOM 样式、原始数据、截图）
```

## 与原站的差异

- 字体为等效回退（商业字体不可再分发），整体视觉像素接近率约 94%
- logo 为自绘简版 π 标记，非原站官方图形
- 模型名链接指向原站对应详情页（克隆站不含详情路由）
- 未复刻：导航 logo 右键菜单（Copy/Download SVG、Press Kit）、移动端 burger 抽屉菜单

## GPT 生图模型（2026-10-18 核对）

OpenAI 分组收录 10 个 GPT 生图型号，包含通用别名及带日期的固定快照。价格单位为美元／100 万 tokens，采用标准 API 单价，不是每张图片价格，也不是 Batch 折扣价。

| 模型 | 文本输入 | 图片输入 | 图片输出 | 缓存文本输入 | 缓存图片输入 |
| --- | ---: | ---: | ---: | ---: | ---: |
| gpt-image-1 | 5 | 10 | 40 | 1.25 | 2.5 |
| gpt-image-1-mini | 2 | 2.5 | 8 | 0.2 | 0.25 |
| gpt-image-1.5、chatgpt-image-latest | 5 | 8 | 32 | 1.25 | 2 |
| gpt-image-2、gpt-image-2-2026-04-21 | 5 | 8 | 30 | 1.25 | 2 |
| gpt-image-2.5-flare、gpt-image-2.5-flare-2026-09-08 | 5 | 8 | 30 | 1.25 | 2 |
| gpt-image-2.5-sunburst、gpt-image-2.5-sunburst-2026-09-08 | 5 | 8 | 30 | 1.25 | 2 |

- Flare 侧重速度，适合日常生图和试构图；Sunburst 侧重质量与编辑控制，适合最终成图及细修。两者 token 单价相同，但每张图的 token 消耗可能不同。
- 带日期的名称用于锁定版本，不代表比通用别名更高级。Image 1、Mini、1.5 与 chatgpt-image-latest 的官方模型页已标记弃用。
- 实际费用由提示词文本、参考图输入及图片输出共同组成；尺寸、质量档位和实际 token 消耗都会影响账单。第三方平台的收费及映射以其说明为准。
- 生图行的 `in`／`cr` 表示文本输入／缓存文本输入，`out` 表示图片输出；`imagePricing.input`／`cachedInput` 单独记录图片输入／缓存图片输入。上下文与缓存写入没有确认数据，使用 `null`，页面显示“—”，不伪填为免费或零上下文。
- 各行 `source` 链接到官方模型说明，`verifiedAt` 为核对日期。原始 `reference/` 提取快照保持不变，后续刷新目录应保留这些官方补充条目。

来源：[官方价格表](https://developers.openai.com/api/docs/pricing)、[生图指南与成本计算器](https://developers.openai.com/api/docs/guides/image-generation)、[模型选择与提示指南](https://developers.openai.com/api/docs/guides/image-prompting)。旧模型价格见对应的 [Image 1](https://developers.openai.com/api/docs/models/gpt-image-1)、[Mini](https://developers.openai.com/api/docs/models/gpt-image-1-mini)、[1.5](https://developers.openai.com/api/docs/models/gpt-image-1.5) 和 [ChatGPT Image Latest](https://developers.openai.com/api/docs/models/chatgpt-image-latest) 模型页。
