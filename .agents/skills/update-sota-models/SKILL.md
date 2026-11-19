---
name: update-sota-models
description: 当用户要求刷新本项目所有模型的 SOTA 状态、更新旗舰标记或参考 AIHOT 调整 SOTA 配置时使用。同时维护 SOTA 独立页的模型展示与发布日期。仅同步目录或价格时使用 update-model-catalog。
---

# 更新 SOTA 模型

在项目根目录操作，默认简体中文。用户已要求更新时，核实后直接写入；默认不提交、不推送、不部署。

## 口径

先读 README 的「SOTA 标记」和 `data.json`。SOTA 表示**各研发厂商在相应能力方向的当前旗舰**，不等同跨厂商第一、全部榜单前 N 名或每个平台最贵型号。除非用户要求调整，否则保持此定义。

模型以 `(p, id)` 唯一标识；`p` 是 API provider，不一定是研发方。`sota` 对象包含 `categories`（非空数组，值限 general／reasoning／coding／image）、`verifiedAt`（实际核对的北京时间日期）及 `source`（官方 HTTPS URL）。未标记时删除 `sota`；未重新核实不得刷新日期。

## 更新流程

1. 检查 `git status`，复制**当前工作区**数据作为校验基线，不以 HEAD 替代工作区已有改动：
   ```bash
   sota_before=$(mktemp /tmp/ai-models-sota-before.XXXXXX)
   cp data.json "$sota_before"
   ```
2. 扫描全部模型和存量标记，按研发厂商归并候选，不只检查已有 SOTA。参考 [AIHOT 模型榜](https://aihot.news/leaderboard)，按需要读取编程／科研分榜和模型详情；关注更新时间、评测覆盖及暂不排名原因。榜单用于发现候选与交叉核对，不自动按名次打标，不复制完整评测库或分数。按当前环境可用联网工具读取真实页面，来源受阻时如实报告。
3. 读取厂商当前模型目录、发布、模型卡或 API 文档，确认旗舰定位、能力及取代关系，保存实际读取的官方来源。版本号、Flash 后缀不能单独决定旗舰。榜单与官方定位不一致时记录维护判断及理由；未知不等于非 SOTA。历史 `docs/sota-review-*.md` 仅作导航，不能当作当前证据。
4. 按精确 `(p, id)` 更新已确认同型号入口，移除被取代的旧标记。区域、固定快照和 batch 需身份映射清楚；Highspeed／UltraSpeed 需官方同能力依据；Fast／Ultrafast／Prime／Pro／free／动态 latest 不凭名称或价格继承。普通别名不自动等同最新日期快照，显示名仅辅助映射，歧义需平台证据。
5. **模型数据仅改 `sota` 和经核实的 `release`**，保留条目顺序、provider 统计、价格、上下文、traits、图片计价及其他字段。`release` 含 `date` 和 HTTPS `source`，优先使用官方来源，用于 SOTA 页与 PK 对比的发布时间；日期按官方发布的年月日原样记录，只有月份时保留 `YYYY-MM`，未知不编造，不使用核对日期、平台上架日期或模型 ID 日期替代。新旗舰未入库时移除过时标记并记录缺口，不顺带同步目录或新增模型。
6. **主动补齐发布时间**：扫描所有 SOTA 和主流研发方当前主力型号的 `release`，同时检查仅到月份的记录，覆盖 OpenAI、Anthropic、Google、SpaceX/xAI、小米 MiMo、MiniMax、Qwen 等。缺失时全网搜索，优先官网发布页、官方 changelog、模型卡和公告，区分首次发布、开放权重、平台上架与网页更新时间。无官方日期证据时可使用可信评测机构等次级来源，加 `release.sourceType: secondary` 并在审计中说明；无法确认则保留未知或月份并报告缺口。精确同型号入口同步日期，不凭相近名称继承。SOTA 页与 PK 对比共用这些字段。审计输出日期新增／校正数量、来源、未覆盖型号。
7. 更新 README 的核对日期、实时标记／provider 数及维护说明；写入 `docs/sota-review-YYYY-MM-DD.md`，记录采用型号、官方依据、更替判断、缺口和未核实范围。不沿用历史数量，不将全目录扫描称为全厂商核实。

8. **同步验收独立页 `sota.html`**。页面由 `app.js` 的 `renderSotaPage()` 读取 `data.json`，不要复制一份静态模型清单。检查本轮新增旗舰可见、旧旗舰消失、发布日期和倒序排列正确、来源可点击；页面有原厂 provider、自研系列和地区去重规则，新增研发方应检查这些规则。原厂条目缺失而只有已核实第三方入口时，可在 `representatives` 中添加精确 `(p, id)` 映射，以研发方身份显示一次；不得放开全部第三方入口，也不凭名称匹配动态别名。未核实的映射或日期记录为缺口。
9. 浏览器验证 SOTA 独立页的中英文、明暗主题与移动端；用当前本地服务实际端口，不硬编码用户给出的端口。至少检查新增与移除型号、日期排序和重复卡片，记录控制台错误及实际可见数量。同步 README 和审计记录中的页面规则、日期补充与未覆盖范围。

## 校验与交付

```bash
python3 .agents/skills/update-sota-models/scripts/validate_sota.py --before "$sota_before" --date YYYY-MM-DD
node --check app.js
git diff --check
```

替换为实际核对日期。校验脚本只读，检查仅 `sota`／`release` 变更、格式、日期并计算数量，不替代联网事实核实；未变动旧标记可保留原日期。运行过程中保留基线路径，跨终端调用时显式传递该路径。

检查新旧旗舰及跨平台映射后，汇报新增／移除／变更／最终标记数、重要缺口、核对记录链接及提交部署状态。若仅部分来源可核实，明确实际范围。
