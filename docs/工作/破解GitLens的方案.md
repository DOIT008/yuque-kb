---
description: "最近看到GitLens这个插件，试了下，感觉极好。但是付费提示很烦，这极不好。查了下，GitLens源代码是托管在GitHub上的，那么有没有可能无限试用这个插件？开干！"
source: "https://www.yuque.com/alipayqxigqpgusn/nmkii5/ygcp38e7hutx720a"
updated: "2026-10-09T08:04:16.000Z"
---

# 破解GitLens的方案

> 来源：语雀「工作」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/nmkii5/ygcp38e7hutx720a)

最近看到[GitLens](https://zhida.zhihu.com/search?content_id=238182884&content_type=Article&match_order=1&q=GitLens&zhida_source=entity)这个插件，试了下，感觉极好。但是付费提示很烦，这极不好。查了下，GitLens源代码是托管在[GitHub](https://zhida.zhihu.com/search?content_id=238182884&content_type=Article&match_order=1&q=GitHub&zhida_source=entity)上的，那么有没有可能无限试用这个插件？开干！

首先clone一下整个项目：

## 代码示例

```plain
git clone https://github.com/gitkraken/vscode-gitlens.git
```

下载[node.js](https://zhida.zhihu.com/search?content_id=238182884&content_type=Article&match_order=1&q=node.js&zhida_source=entity)（目前项目推荐为node18）并暂时加入[PowerShell](https://zhida.zhihu.com/search?content_id=238182884&content_type=Article&match_order=1&q=PowerShell&zhida_source=entity)路径（建议管理员模式执行以防止报错）：

```plain
$env:Path+=";your-path-to-node"
```

如果你网络不佳，可以：

```plain
npm config set registry https://registry.npmmirror.com
```

安装yarn：

```plain
npm install yarn -g
```

与先前一样，如果网络不佳，可以：

```plain
yarn config set registry https://registry.npmmirror.com
```

切换到先前clone的文件夹，并执行：

```plain
yarn
```

我这里报错[Sharp](https://zhida.zhihu.com/search?content_id=238182884&content_type=Article&match_order=1&q=Sharp&zhida_source=entity)这个模块装不上报无法解决依赖。所以直接：

```plain
npm install sharp --force
```

基本准备工作完成，可以先试着rebuild一下：

```plain
yarn run rebuild
```

找到computeSubscriptionState，自行发挥：

```plain
// 比如
return SubscriptionState.Paid;
```

然后打包：

```plain
yarn run package
```

一切顺利的话能在文件夹内找到一个vsix文件。直接安装即可。**用自己的破解安装包就行（阿里云盘）**

> 来自: [(8 封私信 / 26 条消息) 无限试用GitLens的方案 - 知乎](https://zhuanlan.zhihu.com/p/675238420)

## 悬停

vscode 自带的有行内悬停，gitlens 也有，如果想停掉其中一个，在配置文件中 `settings.json` 配置：

```json
"gitlens.hovers.currentLine.enabled": false,
"gitlens.currentLine.enabled": false,
```

​  

​
