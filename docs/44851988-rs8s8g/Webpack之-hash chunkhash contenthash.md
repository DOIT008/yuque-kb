---
description: "HashHash是项目构建的时候，每次构建hash直都不一样，没有缓存性可言特点每次构建都不一样没有缓存性可言作用于 ​.js​ 和 ​.css​ 文件，图片不遵循hashChunkHashchunkhash 就是解决这个问题的，它根据不同的入口文件(Entry)进行依赖文件解析(多入口项目)..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/qrwtmm"
updated: "2021-02-06T13:56:31.000Z"
---

# Webpack之-hash chunkhash contenthash

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/qrwtmm)

## 

![timg.png](https://cdn.nlark.com/yuque/0/2020/png/1528528/1593957037659-7f38adb1-7006-4547-939d-ccb72f98634c.png)

## Hash

Hash是项目构建的时候，每次构建hash直都不一样，没有缓存性可言

### 特点

-   每次构建都不一样
-   没有缓存性可言
-   作用于 `.js` 和 `.css` 文件，图片不遵循hash

## ChunkHash

chunkhash 就是解决这个问题的，它根据不同的入口文件(Entry)进行依赖文件解析(多入口项目)、构建对应的 chunk，生成对应的哈希值。

**Chunkhash是针对某个chunk而言的，****不同的chunk的hash值不一样，**只要这个chunk的文件发生改变，那么其hash直就会发生改变，其他chunk不受影响。

### 特点

-   多入口项目

## ContentHash

**contenthash 将根据资源内容创建出唯一 hash，也就是说文件内容不变，hash 就不变。**

Content hash，我们更进一步，index.js 和 index.css 同为一个 chunk，在index.js文件中引入了css文件，那么如果js文件发生了变化chunkhash就会发生变化（包括里面的css），但是如果在webpack配置文件中把css文件设置为contenthash这样css文件为contenthash就不会发生变化，因为css文件本身未发生变化。

### 特点

跟文件的内容有关

## 参考文章

[webpack 中那些最易混淆的 5 个知识点](https://juejin.im/post/5cede821f265da1bbd4b5630)
