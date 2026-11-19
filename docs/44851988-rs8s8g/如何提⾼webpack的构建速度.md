---
description: "通过 externals 配置来提取常⽤库。利⽤ DllPlugin 和 DllReferencePlugin 预编译资源模块 通过 DllPlugin 来对那些我们引⽤但是绝对不会修改的npm包来进⾏预编译，再通过 DllReferencePlugin 将预编译的模块加载进来。使⽤ Happ..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/gamndw"
updated: "2021-03-19T12:13:19.000Z"
---

# 如何提⾼webpack的构建速度

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/gamndw)

1.  通过 externals 配置来提**取常⽤库**。
2.  利⽤ DllPlugin 和 DllReferencePlugin 预编译资源模块 通过 DllPlugin 来对那些我们引⽤但是绝对不会修改的npm包来进⾏预编译，再通过 DllReferencePlugin 将预编译的模块加载进来。
3.  使⽤ Happypack实现**多线程加速编译**。
4.  使⽤ Tree-shaking 和 Scope Hoisting 来剔除多余代码。
5.  当然还有其他的，比如css压缩，js压缩等

## 如果打包体积比较大，怎么优化

1.  **分割代码块**：splitChunksPlugin对chunk进行拆分，可以将哪些不经常变动的第三方库分离出来单独打包。

-   新的代码块被共享或者来自node\_modules文件夹
-   新的代码块大于20kb

2.  **压缩**：使用uglifyJsPlugin和cssNano对css和js文件进行压缩，fileloaderu压缩图片
3.  **路由的懒加载：**在配置路由的component选项的时候使用函数import..，进行懒加载
4.  **提取样式到css文件**：ExtractTextPlugin，将样式提取到单独的css文件，而不是内嵌到打包的js文件中。这样带来的好处时分离出来的css和js是可以并行下载的，这样可以更快地加载样式和脚本。

> webpack-bundle-analyzer：webpack打包文件体积和依赖关系的可视化

![2021-03-19_201247.png](/images/41adec08c88b137f.png)
