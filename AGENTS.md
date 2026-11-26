# 项目协作说明

这是以 Pi 为主要数据源的 AI 模型与价格目录，使用原生 HTML、CSS 和 JavaScript，无发布构建步骤。

- 本地预览用 `npm install` 和 `npm run dev`，默认端口为 3456。`index.html` 为目录，`about.html` 为介绍页，两者都读取 `data.json`。
- 刷新目录、上下文和价格时使用 `.agents/skills/update-model-catalog/SKILL.md`。刷新旗舰标记时使用 `.agents/skills/update-sota-models/SKILL.md`。
- 数据同步摘要维护在 README 的「数据」章节。`docs/sota-review-*.md` 是对应日期的审计记录。`reference/` 保存本地提取快照。
- README 保留入口和同步摘要；现行数据口径、SOTA 核对日期与统计维护在 `docs/catalog-data.md`。本地配置和部署流程见 `docs/maintenance.md`。提交、推送和部署按当前请求执行。
