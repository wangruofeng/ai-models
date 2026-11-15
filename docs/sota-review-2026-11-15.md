# SOTA 核对记录（2026-11-15）

扫描了当前工作区的 1748 个模型入口和 45 个 provider，参考 [AIHOT 综合榜](https://aihot.news/leaderboard)、[编程榜](https://aihot.news/leaderboard/category/coding)和[科研榜](https://aihot.news/leaderboard/category/reasoning)发现候选。旗舰定位采用研发方的模型说明，同型号平台入口结合各平台文档核对。

最终标记 163 个入口，覆盖 42 个 provider。新增 29 个、移除 0 个，复核日期更新 130 个。Step 5 Preview 的 4 个入口沿用 11 月 13 日的核对日期，本轮仅取得官方页面外壳和索引。图像类有 3 个入口。

## 新增标记

| 模型 | 入口与分类 | 依据 |
| --- | --- | --- |
| 豆包 Seed 2.1 Pro | 火山方舟按量版 `260915`、Coding Plan、Agent Plan，通用／推理／编程。`260628` 旧快照与 `Seed Evolving` 滚动入口暂未标记。 | [字节发布](https://seed.bytedance.com/en/blog/seed2-1-officially-released-advancing-ai-productivity) · [方舟模型列表](https://console.volcengine.com/ark/region:cn-beijing/docs/model-list) |
| Seedream 5.5、Nano Banana Pro、Arrow 2 Telos | 各 1 个图像入口，分别为火山方舟、OpenRouter、Vercel AI Gateway。 | [Seedream 发布](https://seed.bytedance.com/en/blog/more-realistic-images-more-stable-editing-across-100-rounds-introducing-seedream-5-5) · [Google DeepMind](https://deepmind.google/models/gemini-image/) · [Quiver 模型目录](https://quiver.ai/models) |
| DeepSeek V4.1 Flash 1017 | 火山方舟 `261017`、阿里云个人版国内和国际 `1017`，共 3 个。旧快照和无版本套餐别名暂未标记。 | [DeepSeek 发布](https://api-docs.deepseek.com/news/news261017/) |
| Kimi K3.1 Pro、GLM-5.3 | 补火山方舟的 Kimi 按量版及两种套餐、GLM-5.3 两种套餐，共 5 个。 | [Kimi 发布](https://www.kimi.com/en/blog/kimi-k3-1-pro) · [GLM 模型文档](https://docs.z.ai/guides/llm/glm-5.3) · [Coding Plan](https://console.volcengine.com/ark/region:cn-beijing/docs/coding-plan-personal-get-started) · [Agent Plan](https://console.volcengine.com/ark/region:cn-beijing/docs/agent-plan-personal-plan-overview) |
| Inkling 2 Small | Workers AI、Cloudflare AI Gateway、OpenRouter、Vercel、OpenCode 共补 5 个入口。OpenCode 官方目录确认免费入口的型号。 | [Thinking Machines 发布](https://thinkingmachines.ai/news/inkling-2-small/) · [Cloudflare 上线记录](https://developers.cloudflare.com/changelog/post/2026-11-12-inkling-2-small-workers-ai/) · [OpenCode 模型目录](https://opencode.ai/docs/console/models/) |
| LongCat 2.5 | Vercel、OpenCode、OpenCode Go，共 3 个。通用／推理／编程。 | [美团模型卡](https://huggingface.co/meituan-longcat/LongCat-2.5) · [Vercel 上线记录](https://vercel.com/changelog/longcat-2-5-now-available-on-ai-gateway) · [OpenCode Go](https://opencode.ai/docs/console/go/) |
| Nemotron 3 Ultra | Baseten、NVIDIA、OpenRouter 两个映射及 Vercel，共 5 个。官方仍将 Ultra 定位于复杂规划和编排；3.5 Super VL 在部分任务上更强，定位于多模态专项。 | [Ultra 模型页](https://research.nvidia.com/labs/nemotron/Nemotron-3-Ultra/) · [NVIDIA 3.5 Super VL](https://developer.nvidia.com/blog/nvidia-nemotron-3-5-super-vl-powers-specialized-agents-with-multimodal-reasoning/) |
| Solar Pro 4、Mercury 3 | 各 1 个通用／推理／编程入口。 | [Upstage 发布](https://www.upstage.ai/news/upstage-ai-unveils-solar-pro-4-scoring-42-on-artificial-analysis-index-to-rank) · [Inception 发布](https://www.inceptionlabs.ai/blog/introducing-mercury-3) |

## 保留及待确认

- GPT-6 Astra、Claude Fable 5.2、Gemini 4 Carbon 仍有明确的高能力定位。GPT-6.1 Terra、Gemini 4 Hydrogen 分别按其产品定位评估，未因更新日期自动替代。 [OpenAI](https://developers.openai.com/api/docs/models/gpt-6-astra) · [Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-2) · [Google Cloud](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/google-models)
- 保留 Ling 3.1 Flash 1019 的文本与开发标记。官方仍推荐 3.1 用于办公和长程开发，3.2 是当前原生多模态型号，目录未收录。 [Ling 模型目录](https://developer.ant-ling.com/en/docs/models/ling)
- Qwen4-Max-Preview 和 GPT Image 2.6 已有官方资料，现有目录仍缺对应条目。 [QwenCloud](https://docs.qwencloud.com/developer-guides/getting-started/latest-model) · [OpenAI 图像指南](https://developers.openai.com/api/docs/guides/image-generation)
- 查阅了 Sakana、Aion 的编排产品与其他新入库候选。KT Mi:dm K 3.0 Pro 的官方详情页不可用。Motif 3、Ultramarine 1 Flash、Particle-1 等候选尚缺该厂商在相同能力方向的明确旗舰依据。其余未核实入口保留未标记状态。
