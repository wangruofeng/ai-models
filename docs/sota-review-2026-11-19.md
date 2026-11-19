# SOTA 核对记录（2026-11-19）

扫描当前工作区全部 1826 个模型入口、47 个 provider 及存量标记，参考 [AIHOT 综合榜](https://aihot.news/leaderboard)（页面显示 11/19 08:05 更新）发现新增候选。本次实际复核 OpenAI、Google、Anthropic、Qwen、Kimi 和 Thinking Machines 的相关型号，未声称全厂商重新核实。其余存量标记和日期保留。

新增 13 个、移除 14 个、变更 19 个；最终标记 166 个入口、覆盖 44 个 provider。本轮相对更新模型目录后的工作区基线，仅修改模型的 `sota` 字段。

## 更替与保留判断

- GPT-6.2 Astra 取代 GPT-6 Astra，标记通用／推理／编程；Sol 定位于日常任务与成本平衡，不自动打标。[官方发布](https://openai.com/index/introducing-gpt-6-2-astra-sol/)。移除旧 Astra 全部 14 个入口的标记，即使部分平台尚未收录新型号也不保留过时旗舰。
- Qwen4 Max 补充 OpenRouter 与 Vercel 两个明确入口，标记通用／推理／编程。[QwenCloud](https://docs.qwencloud.com/developer-guides/getting-started/latest-model)、[OpenRouter](https://openrouter.ai/qwen/qwen4-max)、[Vercel](https://vercel.com/changelog/qwen4-max-now-available-on-ai-gateway)。
- Gemini 4 Carbon 保留：Neon 官方公告仍将 Carbon 定位于最难的长程项目，Neon 兼顾深度与效率，不能因发布时间或单项榜单自动取代。[Google 官方公告](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/)。
- Claude Fable 5.2 保留：官方将其用于最困难的技术工作，Opus 5.5 是日常主力，未取代 Fable。[Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-2)。
- 新入库的 Hugging Face Kimi K3.1 Pro 与 Inkling 2 Small 补同型号标记。[Kimi](https://www.kimi.com/en/blog/kimi-k3-1-pro)、[官方模型卡](https://huggingface.co/moonshotai/Kimi-K3.1-Pro)、[Thinking Machines](https://thinkingmachines.ai/news/inkling-2-small/)、[官方模型卡](https://huggingface.co/thinkingmachines/Inkling-2-Small)。

## 入口映射与未核实范围

- GPT-6.2 Astra 使用精确型号 ID；OpenRouter 明确型号和各供应商路由，[OpenCode 目录](https://opencode.ai/docs/console/models/)列出型号，[Vercel 发布](https://vercel.com/changelog/gpt-6-2-astra-and-sol-now-available-on-ai-gateway)确认标准入口及加速服务。Fast 另由[专属型号页](https://vercel.com/ai-gateway/models/openai/gpt-6.2-astra-fast)核实，不凭后缀继承。Azure、Radius 的精确 ID 沿用本次 Pi 快照映射，未进行鉴权 API 调用。
- OpenRouter Astra Pro 及其 batch 变体不自动等同标准 Astra；Qwen Token Plan 的 `qwen4-max-preview` 与 OpenCode Go 的 `qwen4-max` 缺少本轮读取到的平台映射证据，暂不标记。
- DeepSeek 新入库 batch、Hy4 Flash、Flint 等未取得本轮足够的旗舰或入口身份依据，保持未知。未重新核实其他厂商、图像旗舰及旧快照，日期不刷新。

## 本轮变更入口

### 新增

- `azure` / `gpt-6.2-astra`
- `huggingface` / `thinkingmachines/inkling-2-small`
- `huggingface` / `moonshotai/kimi-k3.1-pro`
- `openai` / `gpt-6.2-astra`
- `openai-codex` / `gpt-6.2-astra`
- `opencode` / `gpt-6.2-astra`
- `openrouter` / `openai/gpt-6.2-astra`
- `openrouter` / `openai/gpt-6.2-astra:batch`
- `openrouter` / `qwen/qwen4-max`
- `radius` / `gpt-6.2-astra`
- `vercel-ai-gateway` / `openai/gpt-6.2-astra`
- `vercel-ai-gateway` / `openai/gpt-6.2-astra-fast`
- `vercel-ai-gateway` / `alibaba/qwen4-max`

### 移除

- `amazon-bedrock` / `openai.gpt-6-astra`
- `amazon-bedrock` / `global.openai.gpt-6-astra`
- `amazon-bedrock` / `us.openai.gpt-6-astra`
- `azure` / `gpt-6-astra`
- `cloudflare-ai-gateway` / `gpt-6-astra`
- `github-copilot` / `gpt-6-astra`
- `openai` / `gpt-6-astra`
- `openai-codex` / `gpt-6-astra`
- `opencode` / `gpt-6-astra`
- `openrouter` / `openai/gpt-6-astra`
- `openrouter` / `openai/gpt-6-astra:batch`
- `radius` / `gpt-6-astra`
- `vercel-ai-gateway` / `openai/gpt-6-astra`
- `vercel-ai-gateway` / `openai/gpt-6-astra-batch`

### 变更

- `amazon-bedrock` / `anthropic.claude-fable-5-2`
- `amazon-bedrock` / `global.anthropic.claude-fable-5-2`
- `amazon-bedrock` / `us.anthropic.claude-fable-5-2`
- `anthropic` / `claude-fable-5-2`
- `cloudflare-ai-gateway` / `claude-fable-5-2`
- `github-copilot` / `claude-fable-5.2`
- `github-copilot` / `gemini-4-carbon`
- `google` / `gemini-4-carbon`
- `google-vertex` / `gemini-4-carbon`
- `opencode` / `claude-fable-5-2`
- `opencode` / `gemini-4-carbon`
- `openrouter` / `anthropic/claude-fable-5.2`
- `openrouter` / `anthropic/claude-fable-5.2:batch`
- `openrouter` / `google/gemini-4-carbon`
- `openrouter` / `google/gemini-4-carbon:batch`
- `radius` / `claude-fable-5-2`
- `vercel-ai-gateway` / `anthropic/claude-fable-5.2`
- `vercel-ai-gateway` / `anthropic/claude-fable-5.2-batch`
- `vercel-ai-gateway` / `google/gemini-4-carbon`

## 独立页同步补充

- GPT-6.2 Astra 已标记入口补充 2026-11-17 发布日期，依据 [OpenAI 官方发布帖](https://community.openai.com/t/gpt-6-2-astra-and-sol-are-now-available/1417531)，独立页恢复按发布时间排序，PK 共用同一日期字段。
- Qwen4 Max 原厂按量条目未入库，页面以 OpenRouter 精确入口代表 Qwen 研发方，仅展示一次；发布日期尚未取得本轮官方精确日期证据，显示未知，不拿平台上架日期代替。
- 本次补充仅修改 `release` 及页面展示规则，未改变现有 SOTA 判定或模型数量。

发布时间后续补齐及差异说明见 [本日日期核对记录](model-release-review-2026-11-19.md)，其中 Qwen4 Max 已找到官方首发文章并补为 2026-11-16，取代上文核对时的未知状态。
