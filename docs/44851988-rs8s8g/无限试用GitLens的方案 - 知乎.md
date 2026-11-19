---
description: "最近看到GitLens这个插件，试了下，感觉极好。但是付费提示很烦，这极不好。查了下，看到GitLens是以MIT协议开源的，那么有没有可能无限试用这个插件？开干！首先clone一下整个项目：git clone https://github.com/gitkraken/vscode-gitle..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/uawwgazrzfkbiicg"
updated: "2024-05-02T12:25:53.000Z"
---

# 无限试用GitLens的方案 - 知乎

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/uawwgazrzfkbiicg)

## 背景与思路

最近看到GitLens这个插件，试了下，感觉极好。但是付费提示很烦，这极不好。

查了下，看到GitLens是以MIT协议开源的，那么有没有可能无限试用这个插件？

开干！

首先clone一下整个项目：

## 代码示例

```plain
git clone https://github.com/gitkraken/vscode-gitlens.git
```

下载node.js（目前项目推荐为`node18`）并暂时加入PowerShell路径（建议管理员模式执行以防止报错）：

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
yarn config set registry https://registry.npmmirror.com
```

 

```latex
yarn 
```

基本准备工作完成，可以先试着`rebuild`一下：

全局搜找到`computeSubscriptionState`，其是一个函数，直接`return SubscriptionState.Paid`：

```plain
return SubscriptionState.Paid;
```

然后打包：

```plain
yarn run package
```

一切顺利的话能在文件夹内找到一个`vsix`文件。直接安装即可。

PS：安装后可能仍然提示试用在几天后过期，此时直接将时间调至过期后时间（如一年后）并重启VSCode以触发逻辑，随后调回正常时间。此时应该就可以无限试用了。  
  

> 来自: [无限试用GitLens的方案 - 知乎](https://zhuanlan.zhihu.com/p/675238420)
