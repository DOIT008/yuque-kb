---
description: "Vite启动服务器后，会按需加载，当请求哪个模块时才会对该模块进行编译，这样的打包过程使得Webpack在启动服务器的过程中比Vite慢很多。Vite使用Esbuild预构建依赖，Esbuild使用Go语言编写，比以Node.js编写的打包器预构建依赖快10-100倍。Vite采用了不同的开发..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/gp3lg0l9dontfx0f"
updated: "2024-07-24T13:29:52.000Z"
---

# Vite为啥比webpack快

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/gp3lg0l9dontfx0f)

## 背景与思路

-   **Vite启动服务器后，会按需加载，当请求哪个模块时才会对该模块进行编译，**这样的打包过程使得Webpack在启动服务器的过程中比Vite慢很多。
-   **Vite使用Esbuild预构建依赖**，**Esbuild使用Go语言编写，比以Node.js编写的打包器预构建依赖快10-100倍。**
-   Vite采用了**不同的开发模式**、**充分利用了现代浏览器的ES Modules支持、使用了更高效的底层语言，并优化了热更新的处理**。
-   Vite通过削减开发过程中的不必要操作、利用现代浏览器特性和内存处理等手段，实现了更快的启动时间、更快的重新加载和更高的开发效率。
-   Vite支持ESM的能力，使得它比Webpack拥有更小粒度的热更新能力。
