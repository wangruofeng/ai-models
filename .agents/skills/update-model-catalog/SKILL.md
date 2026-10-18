---
name: update-model-catalog
description: 基于 pi.dev/models 最新目录更新本项目 data.json、原始数据快照和 README 统计。当用户要求刷新模型目录、同步 Pi 模型或更新模型价格数据时使用。
---

# 更新模型目录

本项目是零构建依赖的静态站点，数据源为 https://pi.dev/models 的服务端 HTML 表格。

在项目根目录执行：

```bash
python3 .agents/skills/update-model-catalog/scripts/update_models.py
python3 .agents/skills/update-model-catalog/scripts/update_models.py --write
node --check app.js
git diff --check
```

第一条只抓取、校验并预览新增／移除／变更统计。用户已经要求更新时，校验通过后直接执行 `--write`，无需重复确认。第二条会重新获取最新数据并写入文件。调试或离线回归可用 `--html /tmp/pi-models.html` 指定先前下载的原始 HTML。

## 数据约束

- `data.json` 是页面实际消费的数据；`reference/pi-models-data.json` 是原始提取快照，`reference/` 已被 Git 忽略，不强制提交。
- 模型以 `(provider, id)` 唯一标识；保持源站 provider 和模型顺序。源站移除的普通条目随同步移除。
- 现有带 `source` 的条目属于官方补充数据，必须完整保留，包括 `imagePricing`、`verifiedAt`、`null` 等字段。脚本遇到源站同 ID 条目会停止，先比较双方数据再决定如何合并，不自动覆盖。
- 金额单位为美元／百万 tokens。`Varies` 保持字符串，未知值转为 `null`，不能当作免费或零上下文。
- `traits` 保存开源（包含开放权重）与国产属性，值为 `true`／`false`／`null`，附官方来源与核对日期。脚本按 `(provider, id)` 保留；新型号或未核实型号视为未知，不能凭托管平台推断国产，也不能凭同厂商其他型号推断开源。更新时遵循 README 的标识口径，未复核不得刷新日期。
- `sota` 是人工核实的旗舰标记，包含能力分类、官方依据和核对日期。脚本按 `(provider, id)` 保留现有标记，新型号不自动标记；更新目录时核对 README 的 SOTA 维护规则与各厂商官方发布，及时移除过时标记、补充新旗舰。不得根据价格或版本号自动认定，不修改未重新核实的日期。
- 脚本核对页面总数、provider 分组数、重复 ID、数值和补充数据，再开始写入；解析失败时不修改文件。不要将当前模型数量硬编码为未来更新的验收条件。
- README 的总数和同步日期自动更新。保留已有 GPT 生图说明；如果 README 结构变动导致脚本停止，先适配脚本再重跑。

完成后检查差异并报告源站数量、补充数量、总数、provider 数量和新增／移除／变更数量。默认不提交、不推送、不部署。
