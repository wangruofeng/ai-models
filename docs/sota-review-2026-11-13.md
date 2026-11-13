# SOTA 核对记录（2026-11-13）

## 口径与范围

扫描全部 1659 条目录记录，以厂商当前旗舰为主，参考用户指定的 [AIHOT 模型榜](https://aihot.news/leaderboard)及[科研榜](https://aihot.news/leaderboard/category/reasoning)检查候选型号和新旧更替，再读取官方发布或模型文档。SOTA 仍是人工维护标记，不是将 AIHOT 名次、分数或评测库复制到本站，也不等同跨厂商排名第一。榜单没有收录或评测不足，不能单独证明模型不是旗舰。

所有本轮实际保留或新增的标记均核对至 2026-11-13。共新增 80、移除 80、更新 55 个标记；最终 135 个标记、39 个 provider。未修改目录条目、价格、上下文、traits 或其他字段。

## 已采用的型号

| 厂商 | 采用型号与处理 | 官方依据 |
| --- | --- | --- |
| OpenAI | 保留 GPT-6 Astra；6.1 Sol/Terra 未因版本更新自动替代旗舰 | [模型说明](https://developers.openai.com/api/docs/models/gpt-6-astra) |
| Anthropic | Fable 5.2 替代 5.1，包含明确批处理与区域入口 | [11 月 9 日发布](https://www.anthropic.com/claude-fable-and-mythos-5-2) |
| Google | Carbon 替代 Argon | [Carbon 模型说明](https://aistudio.google.com/docs/models/gemini-4-carbon) |
| Moonshot | K3.1 Pro 替代 K3；Highspeed 官方确认同能力；Kimi Code 单独标 coding | [发布](https://www.kimi.com/en/blog/kimi-k3-1-pro)、[Code 型号](https://www.kimi.com/code/docs/en/kimi-code/models) |
| DeepSeek | V4.1 Flash 1017 替代 V4 Pro；仅标 1017 精确型号、显示名明确 1017 的 OpenCode 入口及官方 deepseek-flash | [9 月更替说明](https://api-docs.deepseek.com/news/news260910/)、[10 月升级](https://api-docs.deepseek.com/news/news261017/)、[当前官方别名](https://api-docs.deepseek.com/quick_start/pricing/) |
| MiniMax | M3.1 Flash 替代 M3；这是结合官方新代际定位与 AIHOT 型号表现的维护判断 | [发布](https://www.minimax.io/blog/minimax-m31f)、[模型目录](https://platform.minimax.io/docs/guides/models-intro) |
| Z.ai | 保留 GLM-5.3，补齐独立 Token Plan 和 Mistral 同型号入口 | [旗舰说明](https://docs.z.ai/guides/llm/glm-5.3) |
| xAI | 保留 Grok 4.7，补 batch | [模型目录](https://docs.x.ai/developers/models) |
| Meta | 保留 Muse Wonder，补 OpenCode | [发布](https://research.meta.ai/blog/muse-wonder)、[11 月更新](https://research.meta.ai/blog/specialized-models-for-muse-and-metaai) |
| Mistral | 保留 Large 4，补 radius；不推断隐藏别名 | [模型说明](https://docs.mistral.ai/models/mistral-large-4) |
| Xiaomi | 保留 V2.6 Pro，补 reasoning 与官方同能力的 UltraSpeed | [Pro](https://mimo.mi.com/models/en-US/mimo-v2.6-pro)、[UltraSpeed](https://mimo.mi.com/models/en-US/mimo-v2.6-pro-ultraspeed) |
| inclusionAI | Ling 3.1 Flash 1019 替代旧 Ling/Ring 2.6；仅标精确日期快照 | [官方模型卡](https://huggingface.co/inclusionAI/Ling-3.1-flash-1019) |
| Tencent | 增加 Hy4 正式版，Preview 保持未标记 | [官方发布](https://www.tencent.com/tencent-launches-hy4-joining-the-ranks-of-the-worlds-leading-open-source-ai-models/) |
| StepFun | 增加 Step 5 Preview | [官方旗舰说明](https://platform.stepfun.com/docs/zh/guides/models/step-5-preview) |
| Thinking Machines | 增加精确 Inkling 2 Small 免费入口，未将旧 Inkling 继承标记 | [发布](https://thinkingmachines.ai/news/inkling-2-small/) |
| Reflection | 增加 Beam 1.0，未继承未知 free 变体 | [模型卡](https://reflection.ai/beam-model-card) |
| Cohere | 增加 Command A+ | [当前产品](https://cohere.com/models-overview)、[平台映射](https://docs.cohere.com/docs/models) |

## 目录缺口与未知项

- **Qwen**：[官方当前旗舰](https://docs.qwencloud.com/developer-guides/getting-started/latest-model)已更新为 Qwen4-Max-Preview，当前目录没有 qwen4；移除 Qwen3.8 Max 标记，不以榜单仍出现旧型号为保留理由。
- **OpenAI 图像**：[官方指南](https://developers.openai.com/api/docs/guides/image-generation)已推荐 GPT Image 2.6 Sunburst／Flare，目录只收录到 2.5；移除四个 2.5 标记，不修改其历史价格说明。
- **Amazon**：Nova Premier 的最强描述属于 [Nova V1](https://docs.aws.amazon.com/nova/latest/userguide/what-is-nova.html)，不能据此覆盖后续 Nova 系列；未确认目录中当前旗舰，不增标。
- **NVIDIA**：[Nemotron 3.5 Super VL 研究说明](https://research.nvidia.com/labs/nemotron/Nemotron-3.5-Super-and-Lightning/)提供部分能力超越 Ultra 的证据，但没有足够整体旗舰映射，暂不标记。
- **字节**：[Seed 2.1 官方发布](https://seed.bytedance.com/en/blog/seed2-1-officially-released-advancing-ai-productivity)的最强 Pro 未入目录，不把 Turbo 自动当旗舰。
- **百度**：[ERNIE 5.5 Flash Preview](https://ernie.baidu.com/release/ernie-5-5-flash-preview/)仍是训练中 checkpoint，缺少全面取代既有型号的依据，暂不标记。
- **LongCat**：官方发布正文未能完整读取，暂不根据搜索摘要补标。
- **其他小型厂商及匿名路由**：仍有未独立核实的型号（如 Sakana、Liquid、IBM、Upstage 等）；保持未标记。全目录扫描不等于每个未标型号都得到“非 SOTA”的结论。
- **第三方别名**：DeepSeek 普通 V4.1 Flash 不自动等同 1017；Ling 普通 3.1 Flash 不自动等同 1019；未验证 Fast／Ultrafast／Prime／动态 latest／free 映射的入口不继承。Kimi Bedrock K3.1 的显示名明确为 Pro Highspeed，予以继承；不从价格推断身份。

## 验证

逐条对比修改前后 JSON：模型顺序与数量、provider 统计以及所有非 sota 字段完全一致。每个 SOTA 标记都有合法能力分类、官方来源与本轮核对日期；检查新旗舰、旧标记移除及同型号入口。执行 JavaScript 语法检查和 git diff 空白检查。
