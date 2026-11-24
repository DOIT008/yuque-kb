---
description: "安装npm i postcss-pxtorem -D  npm i amfe-flexible -D引用在main.ts中引用import 'amfe-flexible/index.js'配置在项目的根目录创建css的预处理配置文件postcss.config.js：module.export..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/dbghyi"
updated: "2021-12-13T14:05:21.000Z"
---

# Rem布局

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/dbghyi)

## 安装

## 代码示例

```bash
npm i postcss-pxtorem -D

npm i amfe-flexible -D
```

## 引用

在`main.ts`中引用

```ts
import 'amfe-flexible/index.js'
```

## 配置

在项目的根目录创建css的预处理配置文件`postcss.config.js`：

```js
module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 37.5,
      propList: ["*"],
      unitPrecision: 5,
    },
  },
};

```

## 参考文章

1.  [vue3.0+vite 使用 postcss-pxtorem 实现移动自适应（px转rem）](https://blog.csdn.net/weixin_42164539/article/details/113999807)​
