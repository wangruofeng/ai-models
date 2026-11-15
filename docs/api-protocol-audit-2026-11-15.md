# API 协议地址核对（2026-11-15）

核对范围为模型目录现有的 45 个 provider ID。按供应商、套餐和地区核实 Chat Completions、Responses 和 Anthropic Messages 的接入路径。[provider-apis.json](../provider-apis.json) 保存 Base URL 和逐条来源。覆盖数量按 provider ID 计，同一协议可有多个地区地址。

| Chat Completions | Responses | Anthropic Messages | 三种都已收录 |
| ---: | ---: | ---: | ---: |
| 41 | 36 | 31 | 29 |

小米 MiMo Token Plan 的新加坡和欧洲区采用[官方区域地址](https://mimo.mi.com/docs/en-US/tokenplan/Token%20Plan/quick-access)。对这两个区域的 `/v1/responses` 发送无凭据请求，返回 `401 Invalid API Key`，对照路径返回 `404`。GitHub Copilot 采用 [Pi 的个人账户配置](https://cdn.jsdelivr.net/npm/@earendil-works/pi-ai@1.5.2/dist/providers/github-copilot.js)，登录后实际地址由账户凭据解析。本次未用付费凭据逐条测试推理。

## 仍为空的组合

| 提供商 | 仍为空的协议 | 核对结果 |
| --- | --- | --- |
| Anthropic | Chat Completions、Responses | 官方直连收录 Messages。 |
| OpenAI | Anthropic Messages | 官方直连收录两种 OpenAI 协议。 |
| Ant Group Ling | Responses | 已核实 Chat Completions 和 Messages，`/v1/responses` 返回 `404`。 |
| Cloudflare Workers AI | Anthropic Messages | [Cloudflare 文档](https://developers.cloudflare.com/ai-gateway/usage/rest-api/)明确区分 Workers AI 与 AI Gateway 的 Messages 路由。 |
| xAI | Anthropic Messages | [官方标记为完全弃用](https://docs.x.ai/developers/rest-api-reference/inference/legacy)。 |
| Google Vertex AI | Responses、Anthropic Messages | Claude 接入使用 [Vertex 专用 SDK 和预测路由](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude/use-claude)。标准 Responses Base URL 待核实。 |
| OpenAI Codex、Radius | 三种 | Pi 使用 [Codex 专用 Responses 路由](https://cdn.jsdelivr.net/npm/@earendil-works/pi-ai@1.5.2/dist/api/openai-codex-responses.js)和 Radius 专用 `pi-messages` 协议。 |
| Baseten、Cerebras、Google Gemini、NVIDIA | Responses、Anthropic Messages | 同一服务的通用 Base URL 待核实。 |
| Groq、Hugging Face Inference Providers、Mistral | Anthropic Messages | 同一服务的通用 Base URL 待核实。 |
| Meta | Chat Completions、Anthropic Messages | 同一服务的通用 Base URL 待核实。 |
