---
description: "一、安装环境1.1 安装ts首先要安装node，然后可以全局安装：npm install typescript -g  // 查看ts版本 tsc --version1.2 tsconfig.jsontsconfig.json是.ts文件的编译配置文件，在项目的根目录下使用：tsc --ini..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/oygsuh"
updated: "2024-03-10T13:26:59.000Z"
---

# TS环境搭建

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/oygsuh)

<details class="toc-details">
<summary>本页结构（11 个小节）</summary>

- 一、安装环境
- 1.1 安装ts
- 1.2 tsconfig.json
- 1.3 配合alloy-team
- 1.4 集成Prettier
- 二、VS Code相关配置
- 三、运行
- 3.1、原生运行
- 3.2、使用nodemon
- 四、webpack打包TS

</details>

## 一、安装环境

## 1.1 安装ts

首先要安装`node`，然后可以全局安装：

```bash
npm install typescript -g

// 查看ts版本
tsc --version
```

## 1.2 tsconfig.json

`tsconfig.json`是`.ts`文件的编译配置文件，在项目的根目录下使用：

```bash
tsc --init
```

生成`tsconfig.json`，在[这篇文章](https://segmentfault.com/a/1190000022809326/)中有关于该配置文件的详细解析，可以在项目中使用

```json
{
  "compilerOptions": {
    "target": "ES5", // 目标语言的版本
    "module": "commonjs", // 指定生成代码的模板标准
    "noImplicitAny": true, // 不允许隐式的 any 类型
    "removeComments": true, // 删除注释 
    "preserveConstEnums": true, // 保留 const 和 enum 声明
    "sourceMap": false, // 不生成目标文件的sourceMap文件
    "outDir": "./dist" // 编译出的js代码所放置的文件夹
  },
  "files": [ // 指定待编译文件,即要编译成.js文件的ts文件
    "./src/index.ts"
  ],
  "compileOnSave": true // 是否保存时编译
}
```

自动编译运行，这里要使用到`菜单-终端-运行任务-显示所有任务-tsc:监视tsconfig.json`，如下图所示：

![image.png](/images/fb5f29d6d31d3dad.png)

## 1.3 配合alloy-team

```bash
// 参考eslint-alloy
npm install --save-dev eslint  @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-alloy

```

## 1.4 集成Prettier

Prettier 是一个专注于对代码风格进行统一格式化的工具，由于与 TSLint 的部分配置冲突，故需要使用 `tslint-config-prettier` 禁用掉 TSLint 的部分规则。

首先安装 `prettier` 和 `tslint-config-prettier`：

```bash
npm install --save-dev prettier tslint-config-prettier
```

在你的项目根目录下创建 `tslint.json`，并将以下内容复制到文件中：

```json
{
    "extends": ["tslint-config-alloy","tslint-config-prettier"],
    "linterOptions": {
        "exclude": ["**/node_modules/**"]
    },
    "rules": {
        // 这里填入你的项目需要的个性化配置，比如：
        //
        // // 一个缩进必须用两个空格替代
        // // @has-fixer 可自动修复
        // // @prettier 可交由 prettier 控制
        // "indent": [true, "spaces", 2]
    }
}
```

Perttier配置`prettier.config.js`或者`.prettier.js`

```json
// prettier.config.js or .prettierrc.js
module.exports = {
    // 一行最多 100 字符
    printWidth: 100,
    // 使用 4 个空格缩进
    tabWidth: 4,
    // 不使用缩进符，而使用空格
    useTabs: false,
    // 行尾需要有分号
    semi: true,
    // 使用单引号
    singleQuote: true,
    // jsx 不使用单引号，而使用双引号
    jsxSingleQuote: false,
    // 末尾不需要逗号
    trailingComma: 'none',
    // 大括号内的首尾需要空格
    bracketSpacing: true,
    // jsx 标签的反尖括号需要换行
    jsxBracketSameLine: false,
    // 箭头函数，只有一个参数的时候，也需要括号
    arrowParens: 'always',
    // 每个文件格式化的范围是文件的全部内容
    rangeStart: 0,
    rangeEnd: Infinity,
    // 不需要写文件开头的 @prettier
    requirePragma: false,
    // 不需要自动在文件开头插入 @prettier
    insertPragma: false,
    // 使用默认的折行标准
    proseWrap: 'preserve',
    // 根据显示样式决定 html 要不要折行
    htmlWhitespaceSensitivity: 'css',
    // 换行符使用 lf
    endOfLine: 'lf'
};

```

## 二、VS Code相关配置

1.  参考ESlint即可，因为TSlint插件已经废除了

## 三、运行

之后就可以创建`ts`文件并可以运行了，运行方式有两种：原生运行和使用`ts-node`

## 3.1、原生运行

创建ts文件`01.ts`，首先使用命令`tsc 01.ts`将其转化为同名的`js`文件，然后使用命令`node 01.js`即可；

## 3.2、使用nodemon

`nodemon`可以直接用来在开发环境下运行js文件，可以在文件改变时自动刷新和重启服务器，

安装`ts-node`，因为它是一个依赖包：

```bash
// 安装nodemon
npm install --save-dev nodemon 
```

运行（命令式）

```bash
nodemon -e ts --exec tsc ts/01.ts
// 大概意思就是监听ts类型的文件，并执行tsc ts/01.ts命令
```

运行（配置文件）nodemon，新建`nodemon.json`，并设置如下内容：

```json
{
  "verbose": false,
  "debug": false,
  "exec": "tsc ts/01.ts",// 执行nodemon时执行的命令
  "ignore": [// 忽略监控的文件
    "mochawesome-report",
    "node_modules",
    "./test",
    "**/*.d.ts",
    "*.test.ts",
    "*.spec.ts",
    "fixtures/*",
    "test/**/*",
    "docs/*"
  ],
  "events": {
    "restart": ""
  },
  "watch": ["./ts"],// 监控哪些文件夹下的文件，这里指的是根目录下的ts文件夹
  "ext": "ts tsx",// 监控的是啥类型的文件
  "inspect": true
}
```

以后执行的时候就直接执行命令nodemon即可

```bash
nodemon
```

## 四、webpack打包TS

主要使用的是一个`ts-loader`​

```json
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

## 五、参考文章

1.  [怎么在Typescript中利用nodemon实现项目热更新](https://www.yisu.com/zixun/157331.html)
2.  [eslint-config-alloy](https://github.com/Arcer22/eslint-config-alloy/blob/master/README.zh-CN.md)​
