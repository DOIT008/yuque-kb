---
description: "⽤webpack优化前端性能是指优化webpack的输出结果，让打包的最终结果在浏览器运⾏快速⾼效。 压缩代码:删除多余的代码、注释、简化代码的写法等等⽅式。可以利⽤webpack的 UglifyJsPlugin 和 ParallelUglifyPlugin 来压缩JS⽂件， 利⽤ cssna..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/zn4ybd"
updated: "2021-03-05T13:50:12.000Z"
---

# webpack来优化前端性能

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/zn4ybd)

⽤webpack优化前端性能是**指优化****webpack****的输出结果，让打包的最终结果在浏览器运⾏快速⾼效**。

1.  **压缩代码**:删除多余的代码、注释、简化代码的写法等等⽅式。可以利⽤webpack的 UglifyJsPlugin 和 ParallelUglifyPlugin 来压缩JS⽂件， 利⽤ cssnano （css-loader?minimize）来压缩css
2.  **利⽤****CDN****加速**: 在构建过程中，将引⽤的静态资源路径修改为CDN上对应的路径。可以利⽤webpack对于 output 参数和各loader的 publicPath 参数来修改资源路径
3.  **Tree Shaking**: 将代码中永远不会⾛到的⽚段删除掉。可以通过在启动webpack时追加参数 \--optimize-minimize来实现
4.  **Code Splitting**: 将代码按路由维度或者组件分块(chunk),这样做到按需加载,同时可以充分利⽤浏览器缓存
5.  **提取公共第三⽅库**: SplitChunksPlugin插件来进⾏公共模块抽取,利⽤浏览器缓存可以⻓期缓存这些⽆需频繁变动的公共代码

  

## 面试

就是“抽压2CT”，

1.  **抽取公共模块**：使用splitChunksPlugin：对那些**公共模块进行抽取**，充分利用浏览器缓存
2.  **压缩**：对各种文件进行压缩比如使用cssnano对css文件进行压缩，使用uglifyjsplugin进行js压缩
3.  **CDN**：将**静态资源的路径修改为CDN路径**，output里面的publicPath修改
4.  **Code spliting**：这个是webpack的新特性，可以**将代码按照路由或者组件斤进行分块儿（chunk**），可以做到按**需加载并充分利用浏览器缓存**
5.  **treeShaking**：对于项目中根本哟用不到的代码和模块删除掉
