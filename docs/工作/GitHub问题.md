---
description: "一 、提不上去、拉不下来&gt; git pull --tags origin main fatal: unable to access 'https://github.com/xxx/xxx.git/': Failed to connect to github.com port 443 after..."
source: "https://www.yuque.com/alipayqxigqpgusn/nmkii5/fhc2lqkgqwen4xta"
updated: "2025-08-27T01:38:18.000Z"
---

# GitHub问题

> 来源：语雀「工作」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/nmkii5/fhc2lqkgqwen4xta)

## 一 、提不上去、拉不下来

## 代码示例

```bash
> git pull --tags origin main fatal: unable to access 'https://github.com/xxx/xxx.git/': Failed to connect to github.com port 443 after 21108 ms: Could not connect to server
```

错误原因：可能是由于你使用了 [VPN](https://so.csdn.net/so/search?q=VPN&spm=1001.2101.3001.7020) 改变了系统端口。 

![57bd48a5-dcbb-4ebf-8566-d433d9bddd72.png](/images/0a98960a0554702a.png)

  
查看系统[网络设置](https://so.csdn.net/so/search?q=%E7%BD%91%E7%BB%9C%E8%AE%BE%E7%BD%AE&spm=1001.2101.3001.7020)\-代理-复制这个端口号  
然后到在[git](https://so.csdn.net/so/search?q=git&spm=1001.2101.3001.7020)中

```plain
git config --global http.proxy 127.0.0.1:<复制的端口号>

git config --global https.proxy 127.0.0.1:<复制的端口号>
```

再次推送/拉取发现可以了！**同样的道理针对 clone 仓库也是这样：**[参考来源](< Git%20提交推送时\>%20git%20pull%20--tags%20origin%20main%20fatal:%20unable%20to%20access%20Failed%20to%20connect%20to%20github.com%20port%20...-CSDN博客>)

​  

​
