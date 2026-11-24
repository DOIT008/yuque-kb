---
description: "Vite是什么尤雨溪开发的一款想要取代webpack的项目构建工具，其特点就是一个字——快！特点冷服务启动：在开发的时候不进行打包，使用ES6的import会发送请求去加载文件。开发中热更新：代码变化就会直接提现到页面中按需更新：不会全部刷新界面，只是局部刷新原理利用ES6的import会发送..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/favafa"
updated: "2024-10-15T00:53:31.000Z"
---

# Vite

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/favafa)

<details class="toc-details">
<summary>本页结构（15 个小节）</summary>

- Vite是什么
- 特点
- 原理
- 初始化项目
- 代码示例
- ​
- Vite的各种支持
- TS
- JSON文件
- sass

</details>

## Vite是什么

尤雨溪开发的一款想要取代webpack的项目构建工具，其特点就是一个字——快！

## 特点

1.  **冷服务启动**：在开发的时候不进行打包，使用ES6的import会发送请求去加载文件。
2.  **开发中热更新**：代码变化就会直接提现到页面中
3.  **按需更新**：不会全部刷新界面，只是局部刷新

## 原理

利用ES6的import会发送请求去加载文件的特性，拦截这些请求，做预编译，省去webpack冗长的打包时间。

> 下面的一切都是以vite2.x为基础的

## 初始化项目

## 代码示例

```powershell
# npm 6.x 一步步选择即可
npm init vite@latest

# npm 7+，需要加上额外的双短横线
npm init vite@latest <project-name> -- --template vue

cd <project-name>
npm install
npm run dev
```

使用yarn

```bash
yarn create vite <project-name> --template vue
cd <project-name>
yarn
yarn dev
```

## ​

## Vite的各种支持

### TS

需要在Vue组件中的`script`标签中添加属性`lang = "ts"`，然后使用vue的`defineComponent`方法(包裹之后，你在写代码的时候会有很强的代码提示)

```vue
<template>
  <div>这是详情页</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped></style>
```

### JSON文件

json文件可以帮助我们创建一些静态数据，以供我们在程序中调用

```js
//test.json
{
	name:'张三',
  age:18
}
```

使用

```vue
// 某个vue文件
<script lang="ts">
	// 使用import引入json文件,其实和es6的export default引入方法差不多
  import data from 'test.json'
  ...
</script>
```

> 当然，我么也可以使用js文件来初始化数据

### sass

首先要安sass

```vue
npm install sass -D
```

然后就可以使用了

```html
<style lang="scss">
.container {
  border: 1px solid #f00;
  h1 {
    color: yellow;
  }
}
</style>
```

其实对于`.scss`文件也是支持的

```css
//index.scss
.container {
  background: red;
  p {
    color: yellow;
  }
}

```

引用，像Vue2.x一样，使用`import`直接引用即可

```vue
<script lang="ts">
	import "../assets/style/index.scss";
</script>
```

## Vite的各种配置

首先要在项目根目录下创建`vite.config.js`

```js
export default {
// 各种配置

}
```

### 路径别名

安装path

```ts
npm install --save-dev @types/node
```

以后找文件直接通过别名找就可以了，更快

```js
// vite.config.js
{
	resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "src"),
        },
        {
          find: "views",
          replacement: resolve(__dirname, "src/views"),
        },
        {
          find: "components",
          replacement: resolve(__dirname, "src/components"),
        },
      ],
    },
}

```

使用

```vue
<script>
// vite.config.js 配置的是/@/
import HelloWorld from "components/HelloWorld.vue";// 表示：根目录/src/components/HelloWorld.vue

export default {
  name: "App",
  components: {
    HelloWorld,
  },
};
</script>
```

### 跨域支持

```js
{
	resolve:...,
  server:{
  	host:'localhost',//一般是本地的ip地址
    port:'8080',//监听的端口号
    proxy:{
    	// 选项写法
      '^/api': {
        target: 'http://jsonplaceholder.typicode.com',// 要代理的服务器地址，一般是后台的服务器地址或者各种开发域名
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/haha')// 前端写代码的时候请求有api，但是在代理的时候api被替换成了'haha'，相当于
      },
    }
  }
}

上述配置：在前端请求的时候是 '/api/alive/getData',实际上发送的请求是'http://jsonplaceholder.typicode.com/haha/alive/getData'
```

#### TS版本的路径别名

首先安装依赖：

```bash
npm i @types/node -D
```

修改`vite.config.ts`

```ts
import { defineConfig } from 'vite'
import { resolve } from 'path'
export default defineConfig {
    // ...
    resolve: {
         alias: [
            {
              find: "@",
              replacement: resolve(__dirname, "src"),// 根目录下的src文件夹
            },
            {
              find: "views",
              replacement: resolve(__dirname, "src/views"),// 根目录下的src/views文件夹
            },
            {
              find: "components",
              replacement: resolve(__dirname, "src/components"),// 根目录下的src/components文件夹
            },
            {
              find: "public",
              replacement: resolve(__dirname, "public"),//根目录下的public文件夹
            },
          ],
        extensions: ['.js', '.json', '.ts'] // 使用路径别名时想要省略的后缀名，可以自己增减(其实不配置也行，用默认的配置就可以)
    }
    // ...
}
```

> vite 官方文档中 不建议忽略 .vue 后缀的文，所以在 import 引入文件的时候需要加 .vue

你会发现上述配置完之后，在路由文件中使用还是会报类型错误，这时可以修改`tsconfig.json`

```json
{
    "compilerOptions" : {
        "moduleResolution": "node", // 编译模式
        // ...
        "baseUrl": ".", // 用于设置解析非相对模块名称的基本目录，相对模块不会受到baseUrl的影响
        "paths": { // 用于设置模块名到基于baseUrl的路径映射
            "@/*": ["src/*"],
          	"components/*": ["src/components/*"],
      			"views/*": ["src/views/*"],
            "public/*": ["public/*"]
        }
        // ...
    }
}
```

## 一个比较完整的配置(参考)

```js
// vite.config.js
import { defineConfig, loadEnv, ConfigEnv, UserConfigExport } from "vite";
import vue from "@vitejs/plugin-vue";
// npm install --save-dev @types/node
import { resolve } from "path";
import { viteMockServe } from "vite-plugin-mock"; // 引用mock插件
// https://vitejs.dev/config/
const config = ({ command, mode }: ConfigEnv): UserConfigExport => {
  return defineConfig({
    publicDir: "public",
    // 别名
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "src"),
        },
        {
          find: "views",
          replacement: resolve(__dirname, "src/views"),
        },
        {
          find: "components",
          replacement: resolve(__dirname, "src/components"),
        },
        {
          find: "public",
          replacement: resolve(__dirname, "public"),
        },
      ],
    },
    plugins: [
      vue(),
      viteMockServe({
        supportTs: false, // 不使用ts写Mock接口
      }),
    ], // 使用该插件
  });
};

export default config;

```

## 参考文章

1.  [vite vue-ts 配置 “@” 路径别名](https://juejin.cn/post/7006213924588617735)​
