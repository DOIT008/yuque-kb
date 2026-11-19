---
description: "用来按照一定的规则格式化代码基本配置规则如下：module.exports = {   printWidth: 100, //单行长度   tabWidth: 2, // 缩进长度   useTabs: true, //使用tab缩进，false使用space代替缩进   semi: true..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/bei5xxxdw6l00ic5"
updated: "2024-03-07T03:05:53.000Z"
---

# Prettier

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/bei5xxxdw6l00ic5)

用来按照一定的规则格式化代码

基本配置规则如下：

## 代码示例

```js
module.exports = {
  printWidth: 100, //单行长度
  tabWidth: 2, // 缩进长度
  useTabs: true, //使用tab缩进，false使用space代替缩进
  semi: true, //句末使用分号
  singleQuote: true, // 使用单引号
  trailingComma: 'all', // 多行时尽可能打印尾随逗号
  arrowParens: 'always', // 单参数箭头函数参数周围使用圆括号-eg: (x) => x
  vueIndentScriptAndStyle: true, //对vue中的script及style标签缩进
};
```

完整的配置如下：

```js
//此处的规则供参考，其中多半其实都是默认值，可以根据个人习惯改写
module.exports = {
  printWidth: 100, //单行长度
  tabWidth: 2, //缩进长度
  useTabs: false, //使用空格代替tab缩进
  semi: true, //句末使用分号
  singleQuote: true, //使用单引号
  quoteProps: 'as-needed', //仅在必需时为对象的key添加引号
  jsxSingleQuote: true, // jsx中使用单引号
  trailingComma: 'all', //多行时尽可能打印尾随逗号
  bracketSpacing: true, //在对象前后添加空格-eg: { foo: bar }
  jsxBracketSameLine: true, //多属性html标签的‘>’折行放置
  arrowParens: 'always', //单参数箭头函数参数周围使用圆括号-eg: (x) => x
  requirePragma: false, //无需顶部注释即可格式化
  insertPragma: false, //在已被preitter格式化的文件顶部加上标注
  proseWrap: 'preserve', //不知道怎么翻译
  htmlWhitespaceSensitivity: 'ignore', //对HTML全局空白不敏感
  vueIndentScriptAndStyle: false, //不对vue中的script及style标签缩进
  endOfLine: 'lf', //结束行形式
  embeddedLanguageFormatting: 'auto', //对引用代码进行格式化
};
```

## 参考

::: tip
https://juejin.cn/post/6938687606687432740
:::
