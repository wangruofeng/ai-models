# API 地址核对（2026-11-26）

## 结论与范围

扫描当前 provider-apis.json 的全部 45 个入口和目录的 47 个 provider，重点读取主流官方兼容性、区域与套餐文档，针对上轮空缺协议查新。确认需要补充 5 条端点、更新 7 条依据，并添加适用范围和鉴权说明。更新后共 45 个 provider、123 条端点；Chat Completions 覆盖 43、Responses 39、Anthropic Messages 34、Google 原生 3 个 provider。数量按 provider ID 去重统计，不表示所有模型均支持相应协议。

目录中的 openai-codex、radius 仍为专有账户／协议入口，不把产品内部地址当作通用 SDK Base URL，因此没有凭名称补入。没有使用用户密钥或调用付费推理；本次为文档及配置核对，不是逐账户可用性实测。

## 已落实的更新

| 提供商 | 变更 | 官方依据 |
| --- | --- | --- |
| Baseten | 新增 Responses `https://inference.baseten.co/v1`，Messages `https://inference.baseten.co`；原 Chat Completions 改用官方依据。Messages 按示例需附加 Authorization: Bearer 头 | [11 月 9 日 GA 公告](https://www.baseten.co/resources/changelog/responses-api-format-generally-available/)、[Responses](https://docs.baseten.co/reference/inference-api/responses)、[Messages](https://docs.baseten.co/reference/inference-api/messages) |
| Hugging Face | 新增 Messages `https://router.huggingface.co`，由 SDK 拼接 `/v1/messages`；不把 `/v1` 重复加到 SDK Base URL | [Messages](https://huggingface.co/docs/inference-providers/guides/messages-api) |
| Google Vertex | 新增 global Grok Responses `https://aiplatform.googleapis.com/v1/projects/{project_id}/locations/global/endpoints/openapi`，附带仅适用官方支持 Grok 模型的说明，不泛化到 Gemini | [Grok Responses](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/grok/responses) |
| Cloudflare AI Gateway | 新增推荐单模型 Chat Completions Base URL `https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1`。旧 `/compat` 仍保留供存量与动态路由，并标明单模型用途已弃用；原旧入口来源由 Pi 改为官方 | [REST](https://developers.cloudflare.com/ai-gateway/usage/rest-api/)、[兼容入口弃用说明](https://developers.cloudflare.com/ai-gateway/usage/chat-completion/) |
| NVIDIA | 原 `/openshell/latest/sandboxes/manage-providers` 来源 404，改为当前官方 Providers；Base URL 不变 | [当前文档](https://docs.nvidia.com/openshell/dev/how-it-works/providers/overview) |
| Amazon Bedrock | Responses 旧 mantle 来源已跳转，更新到 canonical 文档；现有 runtime 地址正确，不误改为 mantle | [Responses](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-responses-api.html) |
| MiniMax 中国区 | 三条来源由旧 platform.minimaxi.com 改为当前 platform.minimax.cn；API 域名仍为 api.minimax.cn，无需更换 | [Chat](https://platform.minimax.cn/docs/api-reference/text-openai-api)、[Responses](https://platform.minimax.cn/docs/api-reference/responses-create) |

## 复核后保持的重点项目

- AWS runtime 的 Chat、Messages、Responses 路径仍与官方一致。Mantle 是兼容／特定能力入口，官方仍推荐 runtime，新旧 endpoint 的模型和工具能力不相同。
- DeepSeek Responses 的官方 Base URL 仍为 `https://api.deepseek.com`；[文档](https://api-docs.deepseek.com/guides/responses_api/)直接给出该值。
- [Z.ai Codex](https://docs.z.ai/devpack/tool/codex)仍用 `/api/v1`；[BigModel Responses](https://docs.bigmodel.cn/cn/guide/develop/responses/introduction)仍用 `/api/v1`，不能拿 Chat 的 `/api/paas/v4` 替代。
- [Kimi Code](https://www.kimi.com/code/docs/en/)仍区分中国 api.kimi.com/coding 与海外 api.kimi.ai/coding，不与按量 moonshot API 混用。
- 阿里 [Codex](https://www.alibabacloud.com/help/en/model-studio/codex)及[北京区 Base URL](https://help.aliyun.com/en/model-studio/base-url)仍保留现有 Token Plan 地址，不能用按量 API Key 代替套餐 Key。
- 小米 [Token Plan 快速接入](https://mimo.mi.com/docs/en-US/tokenplan/Token%20Plan/quick-access)仍使用 cn／sgp／ams 各自域名，现有地区划分保持。
- 火山 [Coding Plan Codex](https://console.volcengine.com/ark/region:cn-beijing/docs/coding-plan-personal-ai-codex)、[Agent Plan ZCode](https://console.volcengine.com/ark/region:cn-beijing/docs/agent-plan-personal-zcode)确认 `/api/coding/v3` 与 `/api/plan/v3` 等原配置；[套餐价表](https://console.volcengine.com/ark/region:cn-beijing/docs/model-pricing)的现有月费摘要未发现变化。
- [OpenCode](https://opencode.ai/docs/console/models/)现有协议前缀保持。[Cerebras](https://inference-docs.cerebras.ai/resources/openai)和 [Google](https://aistudio.google.com/docs/openai)的 Chat 兼容地址保持；不能把“streaming responses”措辞当成支持 OpenAI Responses API。
- [Groq](https://console.groq.com/docs/api-reference)、[HF Responses](https://huggingface.co/docs/inference-providers/guides/responses-api)、[Mistral Responses](https://docs.mistral.ai/api/endpoint/responses)、[Together Responses](https://docs.together.ai/docs/inference/responses-api)、[Vercel OpenResponses](https://vercel.com/docs/ai-gateway/sdks-and-apis/openresponses)仍存在对应协议；部分为 beta，能力范围以各模型文档为准。

## 未完全确认的部分

- GitHub Copilot、Meta 和部分聚合路由仍依赖仓库已有的 Pi 1.5.2 固定版本依据，本轮没有将其冒称为最新账户级验证；Copilot 的实际端点由登录账户决定。
- Kimi 按量 Responses 的既有资源页本轮未找到足够清晰的专属端点示例，保留原条目和来源，列为需进一步凭官方 API Reference／账户支持核实；不因官方站点营销教程存在就声称全协议已实测。
- OpenCode Go 的 Google 原生前缀仍保留既有 Pi 来源；本轮读取的 Go 页面未发现明确新例，不推断其已下线。
- 未读取到当前依据的其他端点维持存量记录，不刷新全量核对日期，也不把文档读取失败等同服务失效。

## 验证

检查 JSON 可解析、provider ID 唯一、各 provider 的 `(protocol, baseUrl)` 无重复，URL 为 HTTPS，来源类型合法；原有 45 个 provider 的顺序和数量不变，没有删除既有端点。新增 5 条端点，更新 7 条既有来源，修改局限于 provider-apis.json、README 和本记录；未修改模型价格或 SOTA 数据。默认未提交、未推送。
