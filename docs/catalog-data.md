# 数据来源与维护口径

## 数据来源与人工补充

Gemini 4 Neon 尚未被本次 Pi 快照收录，已根据 [Google 2026-11-18 官方公告](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/)补充到 Google 分组（`gemini-4-neon`）：上下文 100 万 tokens，输入／输出／缓存读取分别为 $3／$15／$0.15 每百万 tokens；缓存写入价格未公布，保留 `null`。核对日期为 2026-11-19。

- 每个模型包含：显示名、model ID、上下文窗口、输入/输出/缓存读写价格（$/M tokens）
- 数据提取自原站服务端渲染的 HTML 表格（`reference/pi-models-data.json` 为原始提取，`data.json` 为紧凑版）

`provider-apis.json` 独立维护接入地址。每个提供商包含 `id`（与目录中的 provider ID 对应）、`name`、可选的 `nameZh` 和 `endpoints`。目录和 API 地址共用供应商名称及品牌图标映射。每个端点包含 `protocol`、`baseUrl`、`source` 和 `sourceType`（`official`、`pi` 或 `community`）。填入对应协议的 SDK Base URL，按来源说明核对鉴权、可用模型及区域。带 `{占位符}` 的地址需要替换为自己的配置。

API 地址于 2026-11-26 做了增量核对：补充 Baseten 的 Responses／Messages、Hugging Face Messages、Vertex Grok Responses，以及 Cloudflare 推荐的单模型 Chat 入口；更新失效或跳转的来源。Vertex 的 Responses 有模型与区域限制，Cloudflare 旧 `/compat` 仅保留兼容用途。完整依据和待核实项见 [本轮 API 地址记录](api-protocol-audit-2026-11-26.md)。

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

### Google Gemini 4 价格说明（2026-11-19 核对）

Google 直连 Carbon、Argon 的 Standard 付费档优惠持续至 2026-11-30（含当天），输入／输出／缓存读取为 $2／$10／$0.10；2026-12-01 起为 $4／$20／$0.20，单位为美元／百万 tokens。Neon 当前为 $3／$15／$0.15，Hydrogen 为 $1.50／$7.50／$0.075。输出含思考 tokens，四款仅支持隐式缓存，缓存读取单价不等于写入或存储费。以上不套用第三方供应商或 Batch／Flex／Priority 档位。[Google 官方定价](https://aistudio.google.com/docs/pricing)。

模型目录的信息提示及 PK 的「价格说明」行读取 `priceNote`，目录同步保留该字段；优惠到期后需重新核对实际数字。

## SOTA 标记

最近核对：2026-11-26

本项目将 SOTA 用作「模型厂商在相应能力方向的当前旗舰」标记，依据官方发布与模型说明人工维护，并参考 [AIHOT 模型榜](https://aihot.news/leaderboard)交叉核对。它不表示跨厂商榜单第一，也不把所有上榜型号自动标记。未标记可能表示未核实、当前旗舰未入库或入口映射不明。

`data.json` 的 `sota` 包含 `categories`（general／reasoning／coding／image）、`verifiedAt` 与官方 `source`。本轮目录同步后又合并远端最新数据，当前共 1841 条、47 个 provider；SOTA 最终为 170 个入口、44 个 provider。本地已核实的标记使用 2026-11-26 日期；远端独有且本轮未复核的标记保留原日期。详细来源与未核实范围见 [本轮记录](sota-review-2026-11-26.md)，上轮记录见 [2026-11-13](sota-review-2026-11-13.md)。SOTA 阶段没有改动其他数据字段；目录同步阶段另有型号、上下文和价格变化。

本轮用 GPT-6.2 Astra 替代 GPT-6 Astra、GLM-5.4 替代 GLM-5.3，并补充 Qwen4 Max 及新入库的已确认同型号入口。Google 官方仍将 Carbon 用于深度验证与长时推理、Neon 用于复杂交互式工程任务，因此 Carbon 保留 reasoning，Neon 标记 general／coding，而非仅凭榜单名次认定 Carbon 已被淘汰。GLM-5.4 官方目前说明 Coding Plan 可用、Model API 待安全评估，标记不代表所有入口均已开放调用。

固定快照、区域和 batch 仅在身份清楚时继承；Highspeed／UltraSpeed 需官方同能力说明。未确认的 Fast、Ultrafast、Prime、Pro、免费变体及动态 latest 不自动继承。Qwen4 Max Preview 不自动等同正式版。Ling 3.2 Flash 的官方卡未能读取，Air 与旧 Flash 的全面替代关系也未确认，因此保留旧标记及日期，未把新版本直接标为旗舰。

当前目录尚未收录 GPT Image 2.6；页面保留已入库的图像旗舰标记，不新增目录外型号。其他小型厂商仍有未核实项，全目录扫描不等于每个厂商均已确认。目录同步脚本按 `(p, id)` 保留存量标记，新型号默认未标记；同步本身不会刷新核对日期或自动认定旗舰。

发布时间补充见 [2026-11-19 日期核对记录](model-release-review-2026-11-19.md)。`release.date`／`release.source` 为 SOTA 页和 PK 共用的发布信息；远端现有日期与来源完整保留。

SOTA 独立页继续直接读取 `data.json`，通过精确入口映射补齐 GLM-5.4、Hy4、Step 5 Preview、Inkling 2 Small、Beam、Command A+、Ling 3.1 Flash 1019、Solar Pro 4 与 Nano Banana Pro。目前展示 27 个不同型号，不重复展示地区与托管平台。补齐 31 条同型号入口的发布信息后，170 个 SOTA 入口均有 `release`；GLM-5.4 的 2026-11-23 日期来自 BenchLM 次级来源，已用 `sourceType: secondary` 标注。

SOTA 页标题右侧的图标可一键切换时间线卡片与紧凑列表，默认使用时间线；视图偏好保存在浏览器本地，刷新和切换语言后保留。列表保留研发方、模型名称、发布日期、能力与官方来源。

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
