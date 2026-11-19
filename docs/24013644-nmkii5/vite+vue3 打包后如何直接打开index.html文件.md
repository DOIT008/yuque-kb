---
description: "vite + vue3 打包的文件，如果使用类似于nginx或者其他的服务器打开，可以正常打开，但如果直接点击打开index.html文件，页面会白屏，打开调试工具后发现如下跨域的报错。这是因为打包后并不支持file引用协议。这就给混合式开发等时候带来困扰，因为在这种场景下，是有需要直接打开i..."
source: "https://www.yuque.com/alipayqxigqpgusn/nmkii5/oyqgvgcon4wsmgro"
updated: "2025-11-10T06:39:08.000Z"
---

# vite+vue3 打包后如何直接打开index.html文件

> 来源：语雀「工作」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/nmkii5/oyqgvgcon4wsmgro)

<details class="toc-details">
<summary>本页结构（4 个小节）</summary>

- 1.安装兼容插件 @vitejs/plugin-legacy
- 代码示例
- 2.手动修改打包完的index.html文件（不建议使用，可直接略过使用第三步）
- 3.自动修改打包完的index.html文件（建议使用）

</details>

vite + vue3 打包的文件，如果使用类似于nginx或者其他的服务器打开，可以正常打开，但如果直接点击打开index.html文件，页面会白屏，打开调试工具后发现如下跨域的报错。

![1762756504110-3f449300-e582-4135-98fd-964416724022.webp](/images/723772ea70e032c8.webp)

这是因为打包后并不支持file引用协议。这就给混合式开发等时候带来困扰，因为在这种场景下，是有需要直接打开index.html文件的需求的。  
在经历一段时间的困扰后，还是找到了解决方案。

首先**路由模式改成 Hash 模式**

### 1.安装兼容插件 @vitejs/plugin-legacy

## 代码示例

```powershell
npm i  @vitejs/plugin-legacy
```

在vite.config.ts 中进行配置

```jsx
import legacy from '@vitejs/plugin-legacy';

legacy({
  targets: ['defaults', 'not IE 11']
}),
```

![1762756504108-47913ccf-863e-4d33-9bb8-9e9f7f633309.webp](/images/b5a3fecb8a37005f.webp)

vite.config.ts文件配置完的效果图.png

### 2.手动修改打包完的index.html文件（不建议使用，可直接略过使用第三步）

先执行 npm run build 命令进行打包，打包完成后打开 dist/index.html。  
将index.html中所有的&lt;script&gt;&lt;script&gt; 标签中的 type="module"、crossorigin、nomodule 删除。

```html
举例
修改前
……
<script type="module" crossorigin src="./assets/index.5617d2f4.js"></script>
<script nomodule crossorigin id="vite-legacy-polyfill" src="./assets/polyfills-legacy.7fa4d18d.js"></script>
……
修改后
<script src="./assets/index.5617d2f4.js"></script>
<script id="vite-legacy-polyfill" src="./assets/polyfills-legacy.7fa4d18d.js"></script>
```

### 3.自动修改打包完的index.html文件（建议使用）

作为程序员，实现的就是将需要手动的变成自动的，如果每次打完包之后都要像第二步那样手动更改，那太麻烦了，太不符合程序员的风格了。  
自动化的话，最简单的方式就是将原本符合条件的引用中需要保留的（src地址、标签内部的js），重新创建一个引用标签，重新引用。这样做，虽然页面打开的时候还会报错，页面会自动处理相关的错误的标签引用，在处理完毕后，页面会正常显现。  
在项目的根目录下的index.html文件中的尾部添加新的&lt;script&gt;&lt;script&gt;来处理，一定要添加在尾部。

```html
<script>
  (function (win) {
    // 获取页面所有的 <script > 标签对象
    let scripts = document.getElementsByTagName('script')
    // 遍历标签
    for(let i = 0; i < scripts.length; i++) {
      // 提取单个<script > 标签对象
      let script = scripts[i]
      // 获取标签中的 src
      let url = script.getAttribute("src")
      // 获取标签中的 type
      let type = script.getAttribute("type")
      // 获取标签中的js代码
      let scriptText = script.innerHTML
      // 如果有引用地址或者 type 属性 为 "module" 则代表该标签需要更改
      if (url || type === "module") {
        // 创建一个新的标签对象
        let tag=document.createElement('script');
        // 设置src的引入
        tag.setAttribute('url',url);
        // 设置js代码
        tag.innerHTML = scriptText
        // 删除原先的标签
        script.remove()
        // 将标签添加到代码中
        document.getElementsByTagName('head')[0].appendChild(tag)
      }
    }
  })(window)
</script>
```

  

> 来自: [vite+vue3 打包后如何直接打开index.html文件 - 简书](https://www.jianshu.com/p/41dc11b94c92)

​  

​
