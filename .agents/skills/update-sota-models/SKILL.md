---
name: update-sota-models
description: 当用户要求刷新本项目所有模型的 SOTA 状态、更新旗舰标记或参考 AIHOT 调整 SOTA 配置时使用。仅同步目录或价格时使用 update-model-catalog。
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
5. **只改 `sota`**，保留条目顺序、provider 统计、价格、上下文、traits、图片计价及其他字段。新旗舰未入库时移除过时标记并记录缺口，不顺带同步目录或新增模型。
6. 更新 README 的核对日期、实时标记／provider 数及维护说明；写入 `docs/sota-review-YYYY-MM-DD.md`，记录采用型号、官方依据、更替判断、缺口和未核实范围。不沿用历史数量，不将全目录扫描称为全厂商核实。

## 校验与交付

```bash
python3 .agents/skills/update-sota-models/scripts/validate_sota.py --before "$sota_before" --date YYYY-MM-DD
node --check app.js
git diff --check
```

替换为实际核对日期。校验脚本只读，检查变更范围、格式、日期并计算数量，不替代联网事实核实；未变动旧标记可保留原日期。运行过程中保留基线路径，跨终端调用时显式传递该路径。

检查新旧旗舰及跨平台映射后，汇报新增／移除／变更／最终标记数、重要缺口、核对记录链接及提交部署状态。若仅部分来源可核实，明确实际范围。
