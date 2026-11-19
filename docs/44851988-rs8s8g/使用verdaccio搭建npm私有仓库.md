---
description: "在很多时候，往往一个公司的业务组件会有很多，有时候一个老项目会用到新的组件，有时候会用到老组件，或者再组件更新的时候，如果想把最新的组件功能更新到每个项目中，如果把代码拷贝过来就很麻烦...，我们能想到的办法就是使用npm库，但往往公司自己的组件库是有自己的业务逻辑的，不可能放在公共的npm库..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/mxhi5p06gk7o2e6i"
updated: "2022-12-18T07:33:19.000Z"
---

# 使用verdaccio搭建npm私有仓库

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/mxhi5p06gk7o2e6i)

::: info 本页结构
- 各种搭建方法对比
- 一、安装verdaccio
- 代码示例
- 二、修改verdaccio配置
- 三、用pm2部署
- 四、使用nrm管理仓源
- 五、注册和登录
- 5.1、注册
- 5.2、登录
- 5.3、删除用户
:::

在很多时候，往往一个公司的业务组件会有很多，有时候一个老项目会用到新的组件，有时候会用到老组件，或者再组件更新的时候，如果想把最新的组件功能更新到每个项目中，如果把代码拷贝过来就很麻烦...，

我们能想到的办法就是使用`npm`库，但往往公司自己的组件库是有自己的业务逻辑的，不可能放在公共的`npm`库中，所以搭建一个私有的`npm`库就很有必要，市面上有很多搭建私有库的方法：

## 各种搭建方法对比

-   **官方私有npm服务**：团队版$7/人/月这个价格就已经直接劝退，且不说npm在国内的网络情况不容乐观。
-   **直接安装git代码**：直接通过npm install 引入对应git代码确实有一定的便利性，但是当全局包多了之后不便于维护且权限难以管理
-   **sinopia**：基于Node.js实现的一个开源npm库，年久失修。最近一次提交是6年前，直接放弃。
-   **cnpm**：阿里出的npm私有方案，权限控制较为全面但是配置复杂，需要自己搭建mysql之类的数据库存储。
-   **verdaccio**：基于sinopia继续开发，目前维护很频繁而且配置简单，可以快速搭建。

我们主要使用**verdaccio**进行搭建：

## 一、安装verdaccio

## 代码示例

```powershell
npm install verdaccio -g
# 测试是否安装成功，启动verdaccio
verdaccio
```

如果你能看见下面的界面，则表示安装成功

![image.png](/images/1b2e31fa2b133d89.png)

访问：

![image.png](/images/23daafcbf0aa36e0.png)

表示成功。

## 二、修改verdaccio配置

上述画线的是配置文件所在的位置，我们可能要修改配置文件，具体修改可参考配置文章：

```powershell
# 存放软件所有软件包的目录
storage: ../storage
# 存放所有插件的目录
plugins: ../plugins
web:
# 网站Title
title: Verdaccio
# 禁用Gravatar头像
# gravatar: false
# 排序方式 asc|desc
# sort_packages: asc
# 是否启用暗黑模式
# darkMode: true
# logo地址
# logo: http://somedomain/somelogo.png
# favicon地址
# favicon: http://somedomain/favicon.ico | /path/favicon.ico
# i18n翻译配置
# i18n:
# 可用列表见：https://github.com/verdaccio/ui/tree/master/i18n/translations
# web: en-US
auth:
htpasswd:
file: ./htpasswd
# 最大注册用户数，默认为 "+inf".
# 可用通过设置为-1禁止注册
# max_users: 1000
# 上游npm库，这里可用设置为淘宝
uplinks:
npmjs:
url: https://registry.npmjs.org/
packages:
# 作用域包，只能是以@aipark的包才能发布
'@aipark/*':
# 只允许授权的人访问
access: $authenticated
# 注册用户可访问
publish: $authenticated
# 注册用户可访问
unpublish: $authenticated
proxy: npmjs
'**':
# 默认情况下所有用户 (包括未授权用户) 都可以查看和发布任意包
# 你可以指定 用户名/分组名 (取决于你使用什么授权插件，默认的授权插件是内置的 htpasswd)
# 访问权限有三个关键词: "$all", "$anonymous", "$authenticated"
# $all 表示不限制，任何人可访问；
# $anonymous 表示未注册用户可访问；
# $authenticated 表示只有注册用户可访问
access: $authenticated
# 允许所有注册用户发布/撤销已发布的软件包
# (注意：默认情况下任何人都可以注册)
publish: $authenticated
unpublish: $authenticated
# 如果私有包服务不可用在本地，则会代理请求到'npmjs'
proxy: npmjs
# 您可以指定传入连接的HTTP /1.1服务器保持活动超时（以秒为单位）。
# 值为0会使http服务器的行为类似于8.0.0之前的Node.js版本，后者没有保持活动超时。
# 解决方法：通过给定的配置可以解决以下问题
server:
keepAliveTimeout: 60
# 中间件
middlewares:
audit:
enabled: true
# 日志设置
logs: { type: stdout, format: pretty, level: http }
# 开放远程访问，允许所有IP
# http://192.168.10.161:4873/,前面是服务器ip地址
listen:
- 0.0.0.0:4873

```

## 三、用pm2部署

安装pm2

```powershell
# 安装
npm install pm2 -g

#使用pm2启动，pm2 start verdaccio不行
pm2 start C:\nvm\v16.10.0\node_modules\verdaccio\bin\verdaccio

```

如果是这样就表明启动成功了：

![image.png](/images/f6a5eaf2a8abed68.png)

## 四、使用nrm管理仓源

```powershell
# 全局安装nrm
$ npm install -g nrm
# 添加私有库，默认先从这里寻找并安装库（组件）
$ nrm add aipark http://192.168.10.161:4873/
# 查看现有的npm源
$ nrm ls
npm ---------- https://registry.npmjs.org/
yarn --------- https://registry.yarnpkg.com/
tencent ------ https://mirrors.cloud.tencent.com/npm/
cnpm --------- https://r.cnpmjs.org/
taobao ------- https://registry.npmmirror.com/
npmMirror ---- https://skimdb.npmjs.com/registry/
* aipark ---- http://192.168.10.161:4873/
# 设置npm源，意思是将来npm的包要发布在这里
$ nrm use aipark
```

## 五、注册和登录

### 5.1、注册

> 一般是管理员进行注册

```powershell
$ npm adduser
# npm notice Log in on http://{地址}:4873/
Username: yourusername
Password:
Email: (this IS public) xxxxxx@qq.com
# Logged in as yourusername on http://{地址}:4873/.
```

### 5.2、登录

```powershell
# 登录用户
$ npm login
# npm notice Log in on http://{地址}:4873/
Username: yourusername
Password:
Email: (this IS public) xxxxxx@qq.com
# Logged in as yourusername on http://{地址}:4873/
# 查看当前登录用户
$ npm who am i
# yourusername

```

![image.png](/images/36e62fb4e1d5c33f.png)

### 5.3、删除用户

用户的注册信息保存在`htpasswd`文件，你只需要打开文件删除某个记录即可

![image.png](/images/17d91ddff68d212b.png)

## 六、发布包

首先得登录一下，就像上面的一样：

将组件包放在这个目录下：其实就是`yaml`文件所在目录

![image.png](/images/a0af49381fd26fbc.png)

```powershell
# 来到包内部
cd C:\Users\zsf90\AppData\Roaming\verdaccio\storage\vue-tables-master
# 发布当前包
$ npm publish
npm notice Hui-ui-vue@0.1.0
npm notice === Tarball Contents ===
npm notice 611B public/index.html
npm notice 4.3kB public/favicon.ico
npm notice 73B babel.config.js
npm notice 151B packages/baseInput/index.js
npm notice 214B packages/index.js
npm notice 130B examples/main.js
npm notice 730B vue.config.js
npm notice 891B package.json
npm notice 310B README.md
npm notice 6.8kB examples/assets/logo.png
npm notice 344B examples/App.vue
npm notice 199B packages/baseInput/src/baseInput.vue
npm notice 2.0kB examples/components/HelloWorld.vue
npm notice === Tarball Details ===
npm notice name: Hui-ui-vue
npm notice version: 0.1.0
npm notice package size: 10.5 kB
npm notice unpacked size: 16.8 kB
npm notice shasum: 08de3054edbef6c1706f849e40d05e99c16c607e
npm notice integrity: sha512-6sVp52WobtHhq[...]bXfgebrphWd+Q==
npm notice total files: 13
npm notice
+ Hui-ui-vue@0.1.0
# 最后看到 + [你的包名@版本号]既可

```

刷新界面[http://192.168.10.161:4873/](http://192.168.10.161:4873/)，你就会看到已经发布成功的包了。

![image.png](/images/8e98519157f38b4b.png)

如果没有，看下到底**登陆**了没~

> 部署好之后，其实管理员如果想增加人员，直接使用“注册用户”即可，注册完之后，成员即可看到仓库目录，删除用户，参考上面即可。

## 参考文章：

1.  [pm2与Verdaccio搭建私有npm库过程详解](https://www.jb51.net/article/260292.htm)
2.  [使用verdaccio搭建npm私有库 pm2守护进程 nrm管理npm源](http://t.zoukankan.com/lgjava-p-14087984.html)​
