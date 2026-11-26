# 开发与部署

## 运行

纯静态站点，无需构建。首次运行先安装开发依赖：

```bash
npm install
npm run dev
```

打开 http://localhost:3456，介绍页为 http://localhost:3456/about.html。保存 HTML、CSS、JavaScript、`data.json`、`provider-apis.json` 或 `assets/` 下的资源后，浏览器自动更新；CSS 修改直接注入，其他文件修改触发页面刷新。按 `Ctrl+C` 停止服务。

开发服务使用 BrowserSync，配置位于 `bs-config.cjs`；默认端口为 3456，占用时实际地址以终端输出为准。发布时仍直接使用静态文件，无需上传 `node_modules/` 或运行开发服务。

## 部署

Cloudflare Pages 直接连接 GitHub 仓库，推送到 `main` 后自动部署。框架预设为「无」，构建命令留空，构建输出目录为 `.`，无需安装依赖。正式域名为 `ai-models.wangruofeng007.com`。GitHub Pages 已停用。

## 目录结构

```
├── index.html      # 页面结构（导航 / 卡片 / 表格 / 页脚）
├── about.html      # 项目介绍
├── sota.html       # 旗舰模型
├── changelog.html  # 更新日志
├── styles.css      # 设计 token + 组件样式（含暗色主题）
├── app.js          # 数据加载、筛选、渲染、主题切换
├── data.json       # 模型目录数据
├── provider-apis.json # 厂商 API 地址与来源
└── reference/      # 提取过程中间产物（快照、DOM 样式、原始数据、截图）
```

## 更新目录与旗舰标记

项目提供 [update-sota-models](../.agents/skills/update-sota-models/SKILL.md)，支持参考 AIHOT 榜单和官方资料更新旗舰标记，并校验模型数据仅修改 SOTA 与经核实的发布日期字段。

下次可直接说：`使用 $update-sota-models 刷新所有模型的 SOTA 状态`。默认不提交、不推送、不部署。

更新目录与价格时使用 [update-model-catalog](../.agents/skills/update-model-catalog/SKILL.md)。脚本会更新 README 的数据同步摘要。
