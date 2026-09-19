# AI Model Catalog

基于 [pi.dev/models](https://pi.dev/models) 的数据与设计复刻的 AI 大模型目录站。

**线上地址**：<https://blog.wangruofeng007.com/ai-models/>（GitHub Pages 部署，仓库 [wangruofeng/ai-models](https://github.com/wangruofeng/ai-models)）

## 数据

- **1404 个模型**，来自 **39 个 provider**（amazon-bedrock、anthropic、openai、openrouter、vercel-ai-gateway、zai 等）
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
- **实时计数**：`N / 1404` 显示当前匹配数
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
├── data.json       # 1404 个模型的紧凑数据
└── reference/      # 提取过程中间产物（快照、DOM 样式、原始数据、截图）
```

## 与原站的差异

- 字体为等效回退（商业字体不可再分发），整体视觉像素接近率约 94%
- logo 为自绘简版 π 标记，非原站官方图形
- 模型名链接指向原站对应详情页（克隆站不含详情路由）
- 未复刻：导航 logo 右键菜单（Copy/Download SVG、Press Kit）、移动端 burger 抽屉菜单
