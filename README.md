# AI Model Catalog

基于 [pi.dev/models](https://pi.dev/models) 的数据与设计复刻的 AI 大模型目录站。

**线上地址**：<https://ai-models.wangruofeng007.com/>（Cloudflare Pages 部署，仓库 [wangruofeng/ai-models](https://github.com/wangruofeng/ai-models)）

## 数据

最近同步：2026-11-16。pi.dev/models 源站共 1661 个模型，另保留 145 个官方补充条目，合计 1806 个模型、47 个 provider。

- 每个模型包含：显示名、model ID、上下文窗口、输入/输出/缓存读写价格（$/M tokens）
- 数据提取自原站服务端渲染的 HTML 表格（`reference/pi-models-data.json` 为原始提取，`data.json` 为紧凑版）

`provider-apis.json` 独立维护接入地址。每个提供商包含 `id`（与目录中的 provider ID 对应）、`name`、可选的 `nameZh` 和 `endpoints`。目录和 API 地址共用供应商名称及品牌图标映射。每个端点包含 `protocol`、`baseUrl`、`source` 和 `sourceType`（`official`、`pi` 或 `community`）。填入对应协议的 SDK Base URL，按来源说明核对鉴权、可用模型及区域。带 `{占位符}` 的地址需要替换为自己的配置。

### 智谱 API 与 Coding Plan

国际区使用 **Z.ai API**（`zai-api`）和 **Z.ai Coding Plan**（`zai`），中国区使用 **BigModel API**（`zai-api-cn`）和 **BigModel Coding Plan**（`zai-coding-cn`）。两个按量 API 的 Chat Completions 地址使用各区域域名下的 `/api/paas/v4`，Coding Plan 对应 `/api/coding/paas/v4`。各协议和对应来源可在「API 地址」中查看。

按量模型采用 [Z.ai 国际定价](https://docs.z.ai/guides/overview/pricing)和 [BigModel 中国定价](https://docs.bigmodel.cn/cn/guide/start/pricing)。中国区固定 token 单价以 [2026-11-13 汇率](https://api.frankfurter.dev/v1/2026-11-13?base=USD&symbols=CNY)（1 USD = 6.6719 CNY）换算，分档和媒体专用价格见模型说明。Coding Plan 按额度计费，token 价格栏留空。Z.ai 国际区按量入口当前仅收录官方明确用于标准 API Key 的 Chat Completions 地址。

### 火山引擎方舟

2026-11-15 核对了北京区三个入口。各入口的模型名称、Base URL 和专属鉴权说明见「API 地址」。

| 入口 | 目录 ID | 计费方式 |
| --- | --- | --- |
| 按量 API | `volcengine` | 使用方舟按量价格，覆盖文本、图片、视频、3D 和向量化模型。 |
| Coding Plan | `volcengine-coding-plan` | 个人版 Lite ¥40/月或 ¥120/季，Pro ¥200/月或 ¥600/季。 |
| Agent Plan | `volcengine-agent-plan` | 个人版 Small ¥40/月、Medium ¥200/月、Large ¥500/月、Max ¥1,000/月。视频模型需要 Large 或 Max。 |

模型 ID 和套餐可用范围见[按量模型目录](https://docs.volcengine.com/docs/ark/model-list?lang=zh)、[Coding Plan 配置](https://console.volcengine.com/ark/region:cn-beijing/docs/coding-plan-personal-get-started#model-configuration)和[Agent Plan 支持模型](https://console.volcengine.com/ark/region:cn-beijing/docs/agent-plan-personal-plan-overview#supported-models-harness)。套餐价格见[方舟官方价表](https://console.volcengine.com/ark/region:cn-beijing/docs/model-pricing)。套餐模型使用额度，目录的 token 单价栏留空。`ark-code-latest` 是由控制台配置的路由。

以下为部分豆包模型的[常规在线推理价格](https://console.volcengine.com/ark/region:cn-beijing/docs/model-pricing#aa1874cf)，单位为人民币／百万 tokens。

| 模型 | 非音频输入 | 输出 | 非音频缓存命中 |
| --- | ---: | ---: | ---: |
| Doubao Seed 2.1 Pro | 6.00 | 30.00 | 1.20 |
| Doubao Seed 2.1 Lite | 0.80 | 2.70 | 0.16 |
| Doubao Seed 2.1 Turbo | 3.00 | 15.00 | 0.60 |
| Doubao Seed Evolving | 6.00 | 30.00 | 1.20 |

目录采用常规在线推理定价，固定单价以 [Frankfurter 2026-11-13 汇率](https://api.frankfurter.dev/v1/2026-11-13?base=USD&symbols=CNY)（1 USD = 6.6719 CNY）换算为美元。输入长度分档、时段变化、媒体专用价格和即将下线状态见各行说明。Lite 的音频输入和音频缓存命中分别为 12.00 和 2.40 元／百万 tokens。上表四个模型的缓存存储费为 0.017 元／百万 tokens／小时，目录的缓存写入栏留空。

### DeepSeek 官方模型

截至 2026-11-15，DeepSeek 官方直连提供 `deepseek-flash`（V4.1 Flash 1017）和 `deepseek-v4-pro`（V4 Pro 0813）。[模型接口文档](https://api-docs.deepseek.com/api/list-models/)给出的上下文为 1,048,576 tokens。旧 ID `deepseek-v4-flash` 和 `deepseek-v4-flash-vision-exp` 的请求均由 `deepseek-flash` 处理。搜索、OCR 和语音按工具 API 计费。详见[官方定价](https://api-docs.deepseek.com/quick_start/pricing/)。

### 小米与 DeepSeek 缓存价格核对（2026-10-20）

以下为官方直连按量计费价格，单位为美元 / 百万 tokens；不适用于第三方托管或小米 Token Plan 套餐。

| 提供商 | 模型 ID | 缓存读取 | 缓存写入 |
| --- | --- | --- | --- |
| 小米 | `mimo-v2.6-flash` | 0.0028 | 0（限时免费） |
| 小米 | `mimo-v2.6-pro` | 0.0036 | 0（限时免费） |
| 小米 | `mimo-v2.6-pro-ultraspeed` | 0.036 | 0（限时免费） |
| DeepSeek | `deepseek-flash` | 0.006（高峰）／0.003（空闲） | 未单独公布（`null`，页面显示“—”） |
| DeepSeek | `deepseek-v4-pro` | 0.044（高峰）／0.022（空闲） | 未单独公布（`null`，页面显示“—”） |

来源：[小米按量计费](https://mimo.mi.com/docs/zh-CN/price/pay-as-you-go)、[DeepSeek 中文定价](https://api-docs.deepseek.com/zh-cn/quick_start/pricing/)、[DeepSeek 美元定价](https://api-docs.deepseek.com/quick_start/pricing/)。小米采用海外实时推理价。DeepSeek 的 `data.json` 沿用高峰时段价格，空闲时段为半价；北京时间工作日（中国法定节假日除外）9:00–12:00、14:00–18:00 为高峰时段，其余为空闲时段。缓存未命中的输入价属于普通输入价格，不能作为单独的缓存写入价。原始 Pi 快照保留原样，以上为官方核对后的本地修正。

## 部署

Cloudflare Pages 直接连接 GitHub 仓库，推送到 `main` 后自动部署。框架预设为「无」，构建命令留空，构建输出目录为 `.`，无需安装依赖。正式域名为 `ai-models.wangruofeng007.com`。GitHub Pages 已停用。

## 运行

纯静态站点，无需构建。首次运行先安装开发依赖：

```bash
npm install
npm run dev
```

打开 http://localhost:3456，介绍页为 http://localhost:3456/about.html。保存 HTML、CSS、JavaScript、`data.json`、`provider-apis.json` 或 `assets/` 下的资源后，浏览器自动更新；CSS 修改直接注入，其他文件修改触发页面刷新。按 `Ctrl+C` 停止服务。

开发服务使用 BrowserSync，配置位于 `bs-config.cjs`；默认端口为 3456，占用时实际地址以终端输出为准。发布时仍直接使用静态文件，无需上传 `node_modules/` 或运行开发服务。

## 功能

- **API 地址**：从目录顶部打开，可同时选择多个供应商，也可按名称或目录 ID 模糊搜索。供应商选择、搜索和协议筛选可以组合使用。支持复制 OpenAI Chat Completions、Anthropic Messages、OpenAI Responses 和 Google Generative AI 的 Base URL，每个端点附有来源。
- **模型 PK**：仅桌面端支持，默认关闭；点击“开始 PK”后显示模型勾选框，支持跨供应商和筛选结果选择，点击“退出 PK”清空并退出；底部已选栏支持移除、清空，选择至少两个后可打开横向对比面板。对比供应商、模型 ID、上下文、输入／输出及缓存读写价格、SOTA、开源和国产属性；沿用当前货币，缓存价格最多四位小数。移动端隐藏全部 PK 功能，缩小至移动端宽度时自动退出并清空选择；对比面板支持关闭按钮和 Esc；重置筛选保留 PK 选择，刷新页面后清空选择。

- **模型搜索**：支持模型名称、模型 ID、供应商和中英文标签。用空格组合关键词，结果须同时满足所有条件，关键词顺序不限。例如 `Seedream 生图` 或 `DeepSeek 开源`。
- **Provider 筛选**：下拉复选，多个提供商取并集；同步重复 URL 参数 `?provider=…&provider=…`，兼容原有单选链接和本地记录；选择“所有提供商”清空选择。
- **SOTA 筛选**：按通用、推理、编程、图像等能力人工标记当前旗舰；可选择不限／仅 SOTA／未标记，与其他筛选联动。模型旁的 SOTA 标识可查看能力、核对日期，并点击访问官方依据。
- **[SOTA 模型页](sota.html)**：以发布日期倒序展示目录中的原厂旗舰及官方依据。第三方分发入口不收录，同一厂商的地区与套餐入口不重复展示同一模型。
- **免费标记**：输入、输出单价均明确为零，且已记录的缓存和图片单价也为零时，模型名称旁显示「免费」。
- **价格排序**：点击输入、输出、缓存读、缓存写价格表头，在默认／正序／反序之间循环；各提供商组内排序，未知价格始终置后，同价保持原顺序；生图输入和缓存读按文本价格排序
- **价格货币**：默认美元，可切换人民币、港币、欧元、日元、韩元；所有输入、输出、缓存及图片价格统一换算，原始美元数据保持不变
- **汇率与缓存**：切换非美元货币时从 Frankfurter 一次查询最新 USD 对 CNY、HKD、EUR、JPY、KRW 的汇率（按日更新），显示汇率日期，并用 localStorage 缓存 1 小时；支持手动刷新，查询失败时标注使用旧缓存，无缓存时继续显示美元
- **Reset**：一键清空全部筛选
- **实时计数**：显示当前匹配数与目录总数
- **主题切换**：右上角太阳／月亮图标切换浅色与深色，localStorage 记忆；首次访问跟随系统主题
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
├── data.json       # 模型目录数据
├── provider-apis.json # 厂商 API 地址与来源
└── reference/      # 提取过程中间产物（快照、DOM 样式、原始数据、截图）
```

## 与原站的差异

- 字体为等效回退（商业字体不可再分发），整体视觉像素接近率约 94%
- logo 为自绘简版 π 标记，非原站官方图形
- 模型名链接指向原站对应详情页（克隆站不含详情路由）
- 未复刻：导航 logo 右键菜单（Copy/Download SVG、Press Kit）、移动端 burger 抽屉菜单

## SOTA 标记（2026-11-15 核对）

本项目将 SOTA 用作「模型厂商在相应能力方向的当前旗舰」标记，依据官方发布与模型说明人工维护，并参考 [AIHOT 综合榜](https://aihot.news/leaderboard)及[科研榜](https://aihot.news/leaderboard/category/reasoning)交叉检查型号更替。它不表示跨厂商榜单第一，也不把所有上榜模型自动标为 SOTA；榜单评测覆盖和更新时间不同，旧型号仍可能留在榜上。未标记可能表示未核实、目录未收录当前旗舰，或入口映射尚不明确。

`data.json` 中的 `sota` 对象包含 `categories`（general／reasoning／coding／image）、`verifiedAt` 和官方 `source`。当前标记 167 个模型入口，覆盖 44 个 provider。新增型号、同型号映射和待核实范围见 [2026-11-15 核对记录](docs/sota-review-2026-11-15.md)。

聚合平台与区域入口仅继承已核实的同型号标记。固定快照及明确的同型号批处理入口可一并标记；MiMo UltraSpeed 与 Kimi Highspeed 有官方同能力说明。未确认映射的 Prime、Pro、Fast、免费变体和动态 latest 路由不自动继承；未获独立证据的普通别名不自动等同最新日期快照。

同步脚本按 `(provider, id)` 保留存量标记；源站删除型号时同时移除对应标记，新型号默认未标记。更新旗舰时需重新核实官方信息，并移除已被替代型号的 `sota` 对象；仅同步目录不会刷新核对日期或自动认定新旗舰。

## 更新 SOTA 的项目级 Skill

项目提供 [update-sota-models](.agents/skills/update-sota-models/SKILL.md)，支持参考 AIHOT 榜单和官方资料更新旗舰标记，并校验只有 SOTA 字段发生变化。

下次可直接说：`使用 $update-sota-models 刷新所有模型的 SOTA 状态`。默认不提交、不推送、不部署。

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

## 开源与国产标识

“开源”按已公开模型权重的口径，包含带商用或使用限制的许可证，不表示符合严格开源定义，使用时需查阅原始许可证。“国产”按模型研发方判断，不按 API 提供商、部署地区或访问入口判断。第三方平台同一模型保持相同研发方归属。

`traits.openWeights`、`traits.china` 分别使用 `true`／`false`／`null` 表示是／否／未知，缺失字段也视为未知；未找到权重不能直接推断为闭源。`traits.sources` 保存官方依据，`verifiedAt` 保存核对日期。列表显示确认的开源、国产标识，筛选支持不限／是／否／未知，并与其他筛选联动。

首批依据包括 [OpenAI 开放模型](https://openai.com/open-models/)、[Llama 模型仓库](https://github.com/meta-llama/llama-models)、[Gemma 文档](https://ai.google.dev/gemma/docs)、[DeepSeek](https://huggingface.co/deepseek-ai)、[Qwen](https://huggingface.co/Qwen)、[Kimi](https://huggingface.co/moonshotai)、[MiniMax](https://huggingface.co/MiniMaxAI)、[GLM](https://huggingface.co/zai-org)、[小米 MiMo 权重发布说明](https://mimo.mi.com/docs/en-US/news/latest/v2.5-open-sourced)。尚未核实的新型号和匿名模型保留未知，不能根据同厂商其他型号自动推断。

目录同步按 `(provider, id)` 保留标识，新型号默认未知。更新时逐型号核实来源，不自动继承同厂商或同系列的开放状态，也不要刷新未经复核的日期。

筛选条件（名称、提供商、上下文多选、SOTA、开源、国产）、价格货币和价格排序自动保存在浏览器本地，刷新后恢复。点击“重置”会清除筛选记录并恢复默认美元和默认排序，不清除汇率缓存、语言或主题设置。带 `?provider=…` 的链接优先采用链接指定的提供商。

模型列表、厂商筛选和 API 地址将同一厂商的地区及套餐入口排在一起。各入口可独立筛选和收藏。厂商筛选弹框中，含收藏入口的厂商分组整体置顶；收藏保存在浏览器本地。

## 项目介绍页

`about.html` 为项目介绍页，参考 Mole 的暖纸色、衬线排印和深蓝配色，使用独立的 `about.css` 与 `about.js`。模型数量、提供商数量和示例价格读取当前 `data.json`；明暗主题及语言与目录页共用本地偏好。目录顶部“介绍”和介绍页“浏览模型目录”提供双向入口。
