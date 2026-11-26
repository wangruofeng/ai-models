# SOTA 核对记录（2026-11-26）

## 两阶段更新与统计

本轮同时执行用户指定的 update-model-catalog 与 update-sota-models，先同步目录，再保存独立快照校验 SOTA，避免混淆目录变化和标记变化。

- 目录：Pi 源站 1696 条、官方补充 10 条，共 1706 条、42 个 provider；相对执行前新增 152、移除 105、变更 164 条。保留官方补充及现有 traits，未核实的新增型号不自动继承属性。
- SOTA：同步后剩余 134 个标记；本阶段新增 50、移除 35、更新 98，最终 149 个入口、39 个 provider。148 个标记核对日期为 2026-11-26，一个 inclusionAI 存量标记保持 2026-11-13。
- SOTA 阶段所有非 sota 字段与同步后基线完全一致。目录同步导致的型号移除不计入 SOTA 阶段移除数。

## 依据与维护判断

参考用户指定的 [AIHOT 模型榜](https://aihot.news/leaderboard)（页面显示 11/26 更新）发现候选，再读取以下官方来源。仍采用厂商当前旗舰口径；不复制榜单分数，也不将所有上榜模型标记。

| 厂商 | 本轮判断 | 官方来源 |
| --- | --- | --- |
| OpenAI | GPT-6.2 Astra 明确为最强，移除旧 Astra 14 个标记，精确普通及 batch 入口继承；Pro/Fast 变体未自动继承 | [当前模型](https://developers.openai.com/api/docs/models)、[Astra 6.2](https://developers.openai.com/api/docs/models/gpt-6.2-astra) |
| Z.ai | GLM-5.4 明确为最新旗舰，移除 GLM-5.3 的 21 个标记，新增两个 5.4 入口；官方指出目前 Coding Plan 可用，Model API 尚待安全评估 | [GLM-5.4](https://docs.z.ai/guides/llm/glm-5.4) |
| Qwen | 正式 Qwen4 Max 已入库，标记正式版，不推断 Preview 等同正式版 | [当前旗舰](https://docs.qwencloud.com/developer-guides/getting-started/latest-model) |
| Google | Neon 在参考榜表现领先，但官方仍把 Carbon 作为长时深度验证／推理方向，Neon 用于复杂交互式工程；据此 Carbon 标 reasoning、Neon 标 general/coding，而非全盘淘汰 Carbon | [选择指南](https://aistudio.google.com/docs/choosing-a-model)、[Neon 更新](https://aistudio.google.com/docs/whats-new-gemini-4-neon) |
| Anthropic | 当前发布列表仍为 Fable 5.2，保留已确认入口 | [模型发布](https://www.anthropic.com/news/models) |
| Kimi | 保留 K3.1 Pro／Highspeed，补新入库普通、HF、batch 及明确 US 入口；Code 仍单独 coding | [K3.1 Pro](https://www.kimi.com/en/blog/kimi-k3-1-pro)、[Code 型号](https://www.kimi.com/code/docs/en/kimi-code/models) |
| DeepSeek | 官方 deepseek-flash 仍映射 1017，补新入库精确快照和 US；Flex/Fast 等不自动继承 | [当前映射](https://api-docs.deepseek.com/quick_start/pricing/)、[1017](https://api-docs.deepseek.com/news/news261017/) |
| MiniMax | 当前目录仍以 M3.1 Flash 为前沿编程型号，补 Together | [官方型号](https://platform.minimax.io/docs/guides/models-intro) |
| xAI | Grok 4.7 仍列最新主力，保留 | [模型目录](https://docs.x.ai/developers/models) |
| Meta | Wonder 系列仍为最强，保留已确认 Wonder 入口，不因新增 Spark Open 取代 | [Wonder](https://research.meta.ai/blog/muse-wonder) |
| Mistral | 保留 Large 4，补精确 HF 权重入口；不推断 latest 和未知快照 | [Large 4](https://docs.mistral.ai/models/mistral-large-4-0) |
| Xiaomi | Pro 仍为旗舰，UltraSpeed 仍明确保持旗舰能力 | [Pro](https://mimo.mi.com/models/en-US/mimo-v2.6-pro)、[UltraSpeed](https://mimo.mi.com/models/en-US/mimo-v2.6-pro-ultraspeed) |
| Tencent | 官方卡明确 Hy4 为旗舰，补 HF 和 Together，Flash 不因新版本自动继承；旧公告正文为空，来源换为可读取官方卡 | [Hy4 模型卡](https://huggingface.co/tencent/Hy4) |
| StepFun | 官方仍称 Step 5 Preview 为新代旗舰，保留 | [模型文档](https://platform.stepfun.com/docs/zh/guides/models/step-5-preview) |
| Thinking Machines | 官方仍称 Inkling 2 Small 最强，补普通及精确 CF/HF/Together 入口，Mini 不取代 | [当前系列](https://thinkingmachines.ai/inkling/) |
| Reflection | 保留 Beam，补精确 HF 权重入口；Baseten 省略参数的别名没有新平台映射证据，暂不补标 | [模型卡](https://reflection.ai/beam-model-card) |
| Cohere | 当前产品仍称 Command A+ 最强，补同型号 BF16 权重入口；North Mini Code 的小型定位不足以替代 | [当前产品](https://cohere.com/models-overview) |

## 未确认范围与缺口

- inclusionAI：Ling 3.2 Flash 官方 Hugging Face 页面返回 401；[Ling 3.2 Air 官方卡](https://huggingface.co/inclusionAI/Ling-3.2-air)主要比较旧多模态 3.0 Flash VL，不能据此认定全面替代 3.1 Flash 1019。保留一个既有标记及旧日期，其他新型号未标记，后续需复核。
- 图像：[OpenAI 指南](https://developers.openai.com/api/docs/guides/image-generation)仍推荐 GPT Image 2.6，当前目录仅保留历史补充至 2.5，本任务没有擅自新增官方补充。图像标记为空不表示没有图像旗舰。
- 新增的 MAI Code、Motif、KT、小型厂商型号及 Amazon/NVIDIA 等旧未核实项，尚未完成独立旗舰认定；保持未标记。没有将整个目录扫描表述为所有型号均完成官方核实。
- 名称相似、报价相近、版本更大均不能单独证明身份或旗舰。未核实的免费／动态路由、Prime、Fast、Ultrafast、Pro、Preview 仍不自动继承。

## 验证

目录脚本已先预览，再执行 --write，检查总数、重复 ID、provider 统计、补充条目与数值。SOTA 使用同步后快照运行 validate_sota.py，确认模型数量、顺序、provider 和所有其他字段不变。执行 node --check app.js、git diff --check；默认未提交、未推送、未部署。

## 远端同步后的合并结果

本地更新后同步 origin/main 的 15 个提交（至 c2f0db9）。以远端目录为基础，按 (p,id) 合入本地 SOTA 字段变化；远端全部官方补充、release、priceNote、traits、图片计价、套餐计费及 API 地址数据保留。上文两阶段数字描述远端合并前的过程，不是当前目录最终统计。

合并后目录 1841 条、47 个 provider；SOTA 170 个入口、44 个 provider。标记日期分布：{'2026-11-26': 148, '2026-11-15': 21, '2026-11-19': 1}。

远端新增的官方补充与其既有图像标记完整保留；重新核对确认目录仍未收录 GPT Image 2.6，该目录缺口尚未解决，不把其他图像型号误称为 GPT Image 2.6。远端 GLM-5.3／旧 Astra 的过时标记同步移除。合并验证逐条证明除 sota 外的所有字段与远端完全一致。

## SOTA 独立页补齐与验收

页面此前只展示原厂入口与 Qwen 一个第三方代表，导致套餐或第三方独有的已核实旗舰缺失。本次补充精确 `(p,id)` 代表映射：GLM-5.4、Hy4、Step 5 Preview、Inkling 2 Small、Beam、Command A+、Ling 3.1 Flash 1019、Solar Pro 4、Nano Banana Pro。保留自研系列与地区去重规则，同一研发方已有其他能力型号时也可加入不同型号（例如 Z.ai 的 GLM-Image 与 GLM-5.4），不开放全部第三方入口。

补齐 31 条 release，覆盖原先全部 31 个缺失日期的 SOTA 入口，优先沿用精确同型号的已有核实来源。GLM-5.4 官方模型文档未给明确日期，使用已读取的 [BenchLM 发布记录](https://benchlm.ai/model-updates/providers/z-ai)所列 2026-11-23，显式加 `sourceType: secondary`；不是以核对日期推算。其余入口同步精确同型号日期，不把首次发布、开放权重和平台上架混为一谈。只有月份的既有来源保持月份，没有伪补日。

实际浏览器验收：http://localhost:3457/sota.html，共 27 张卡片、27 个不同 ID，全部有日期且倒序排列。GLM-5.4、GPT-6.2 Astra、Gemini 4 Neon、Qwen4 Max 可见，旧 GLM-5.3、GPT-6 Astra、Gemini 4 Argon 未出现；增加的研发方每个精确代表只显示一次。中英文、明暗主题可切换；390×844 移动端页面宽度与内容宽度同为 390，无横向溢出。浏览器控制台 error 为 0。31 条 release 以外的数据字段不变；SOTA 总数仍为 170、provider 44，未提交或推送。
