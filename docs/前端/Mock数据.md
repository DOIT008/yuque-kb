---
description: "背景现在开发一般都是前后台分离的，一般前端都要等待后台接口联调，但是如何在后台接口还没出来之前进行数据的模拟呢。这就要用到我们要说的mockjs说明vite 的数据模拟插件，是基于 vite.js 开发的。 并同时支持本地环境和生产环境。 Connect 服务中间件在本地使用，mockjs 在..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pl6z2x"
updated: "2023-03-02T06:26:24.000Z"
---

# Mock数据

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pl6z2x)

<details class="toc-details">
<summary>本页结构（12 个小节）</summary>

- 背景
- 说明
- 安装
- 代码示例
- 使用
- 配置vite.config.js
- 项目配置
- 配置package.json
- 其他配置
- 请求模板

</details>

## 背景

现在开发一般都是前后台分离的，一般前端都要等待后台接口联调，但是如何在后台接口还没出来之前进行数据的模拟呢。这就要用到我们要说的mockjs

## 说明

vite 的数据模拟插件，是基于 vite.js 开发的。 并同时支持本地环境和生产环境。 Connect 服务中间件在本地使用，mockjs 在生产环境中使用。

## 安装

## 代码示例

```vue
yarn add mockjs
或者
npm i mockjs -S

yarn add vite-plugin-mock -D
#or
npm i vite-plugin-mock -D

npm i cross-env -D// 下面会进行说明
```

## 使用

开发环境是使用 Connect 中间件实现的。与生产环境不同，您可以在 Google Chrome 控制台中查看网络请求记录。

### 配置vite.config.js

```js
import { defineConfig, loadEnv, ConfigEnv, UserConfigExport } from "vite";
import vue from "@vitejs/plugin-vue";
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
      ],
    },
    plugins: [vue(), viteMockServe({supportTs:false})], // 使用该插件
  });
};

export default config;

```

### 项目配置

需要在项目的根目录创建mock文件夹，然后你就可以在里面创建文件并写你模拟的请求了，举个例子：

```tsx
import Mock from 'mockjs';
// 设置拦截ajax请求的相应时间
Mock.setup({
  timeout: '200-600'
});

Mock.mock(RegExp('/api/2.0/login.*'), 'post', () => { 
  return {
    status:200, //请求成功状态码
    data: {
      token: 'aaa1221adqwaasuiwqe0283q'
    } 
  }
})
// 获取用户信息,带参数，可以模糊匹配
Mock.mock(RegExp('/api/2.0/userInfo.*'),'get',()=>{
  return {
    status:200,
    message:'请求列表成功！',
    data: { 
      userName: 'admin',
      avatar:'https://tse1-mm.cn.bing.net/th/id/OIP-C.IfSiOlQrOF7a_IzH4s92AQAAAA?w=150&h=150&c=7&r=0&o=5&pid=1.7'
    }
  }
})

// 退出登录，不带参数，只能严格匹配/api/2.0/logout
Mock.mock('/api/2.0/logout','post',()=>{
  return {
    status:200,
    message:'success',
  }
})
```

更多的可以查看[Mock.js官网](https://github.com/nuysoft/Mock/wiki)。

然后就可以在Vue文件内模拟请求了，比如你使用fetch模拟请求上面的请求（当然你也可以使用axios）：

```vue
<script>
	// 模拟数据
fetch("/api/getUser")
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
  });
</script>
```

axios

```js
npm install axios
import axios from 'axios'
axios.get("/api/getUser").then((res) => {
  console.log(res);
});
```

​  

### 配置package.json

改造dev命令

```json
  "scripts": {
    "dev": "cross-env NODE_ENV=development vite"
  },
```

## 其他配置

### 请求模板

在mock数据的时候，模板是这样的：

```js
{
  // 请求地址
  url: string;
  // 请求方式
  method?: MethodType;
  // 设置超时时间
  timeout?: number;
  // 状态吗
  statusCode?:number;
  // 响应数据（JSON）
  response?: ((opt: { [key: string]: string; body: Record<string,any>; query:  Record<string,any>, headers: Record<string, any>; }) => any) | any;
  // 响应（非JSON）
  rawResponse?: (req: IncomingMessage, res: ServerResponse) => void;
}
```

### viteMockServe配置项：

```json
{
	supportTs:false,// 如果在模拟数据的时候你使用的是js，要将其设置成false,默认是true
  mockPath: 'mock',// 设置模拟.ts/.js 文件的存储文件夹，如果watchFiles：true，将监视文件夹中的文件更改。 并实时同步到请求结果，默认mock
  watchFiles:true,//是否监控mockPath对应的文件夹内文件中的更改，默认是true
  logger:true,// 是否在控制台显示请求日志（就是能不能看到这个请求）
}
```

注意：**使用Mock不要使用配置Proxy**

## 参考文章：

1.  [cross-env使用](https://www.jianshu.com/p/e8ba0caa6247)
2.  [vite-plugin-mock](https://github.com/anncwb/vite-plugin-mock/blob/main/README.zh_CN.md)
3.  [带参数mock](https://www.cnblogs.com/jiaoshou/p/14162862.html)​
