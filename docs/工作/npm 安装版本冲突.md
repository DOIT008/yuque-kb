---
description: "方案一npm install --legacy-peer-deps方案二用 pnpm overrides 强制统一嵌套依赖版本（嵌套冲突场景）若冲突来自「嵌套依赖」（如 A 依赖 node-ipc@9.2.2，B 依赖 minimatch@10.1.1），可通过 pnpm 的overrides..."
source: "https://www.yuque.com/alipayqxigqpgusn/nmkii5/ff9vgpdtygmeli0q"
updated: "2025-12-08T08:16:45.000Z"
---

# npm 安装版本冲突

> 来源：语雀「工作」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/nmkii5/ff9vgpdtygmeli0q)

## 方案一

## 代码示例

```powershell
npm install --legacy-peer-deps
```

## 方案二

**用 pnpm overrides 强制统一嵌套依赖版本（嵌套冲突场景）**

若冲突来自「嵌套依赖」（如 A 依赖 node-ipc@9.2.2，B 依赖 minimatch@10.1.1），可通过 pnpm 的`overrides`强制其中一个包的版本适配目标 Node 版本（需先切换到 pnpm）

1.  安装 pnpm

```powershell
npm install -g pnpm
```

2.  在`package.json`中添加 `overrides` 配置

```json
{
  "pnpm": {
    "overrides": {
      // 强制所有依赖中的minimatch降级到9.0.4（适配Node16.x）
      "minimatch": "9.0.4"
      // 或强制node-ipc升级到支持Node18.x的版本
      // "@achrinza/node-ipc": "^10.0.0"
    }
  }
}
```

3.  安装依赖

```powershell
rm -rf node_modules pnpm-lock.yaml
pnpm install
```
