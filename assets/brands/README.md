# 品牌图标

图标来自用户指定的 [theSVG 品牌集合](https://thesvg.org/collection/brands)（`glincker/thesvg` 仓库），Radius 使用其官网公开 SVG。逐项下载地址记录在 `sources.json`；品牌标识权利归各品牌所有。`model.svg` 为项目绘制的中性占位图标，用于无法确认品牌的匿名型号和路由别名。

页面使用本地 SVG，不依赖第三方图片服务。统一采用彩色或浅底版本并放在白色小底板上，以兼容明暗主题。图标为装饰元素，名称保留完整文字。

`app.js` 中 `PROVIDER_BRANDS` 维护服务平台图标；`MODEL_BRANDS` 根据模型名称和 ID 匹配模型品牌，不使用聚合平台作为模型品牌的兜底。目录增加新品牌后，在此目录补充图标和来源，再更新对应映射。
