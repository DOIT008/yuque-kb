# DOIT 的知识库（语雀迁移版）

从语雀导出的 5 个知识库、266 篇文档，转换成 VitePress Markdown 站点。

- 语雀原文链接保留在每篇文档顶部
- 自动补齐 H1、来源、最后更新时间
- 长文档自动生成「本页结构」
- 代码块统一 JetBrains Maple Mono
- Vue 官网风格主题、本地搜索、章节过渡动画

## 目录

- `raw/`：语雀接口导出的原始数据（不入库）
- `docs/`：转换后的 Markdown 与 VitePress 配置
- `scripts/export-yuque.sh`：从浏览器会话导出语雀数据
- `scripts/build-docs.mjs`：Lake HTML → Markdown，并生成排版分析报告
- `scripts/gen-config.mjs`：生成侧边栏配置

## 本地预览

```bash
npm install
npm run docs:dev
```

## 重新导出 / 转换

先确保浏览器里已登录语雀，并且 `yuque-login` 会话可用：

```bash
bash scripts/export-yuque.sh
node scripts/build-docs.mjs
node scripts/gen-config.mjs
npm run docs:build
```

## 部署

推送到 `main` 后，GitHub Actions 自动构建并部署到 GitHub Pages。
