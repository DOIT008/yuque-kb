---
description: "一、使用f2elint俗话说无规范不编程，一个好的代码规范能够让自己/团队养成好的习惯，更能够写出诗一样的代码，具体可参考——https://github.com/alibaba/f2e-spec阿里巴巴前端代码规范集成工具F2ELint使用教程注意：当你使用f2elint init接入规范的..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/mf7xvl7l10pkhfer"
updated: "2024-12-24T02:12:10.000Z"
---

# ESLint

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/mf7xvl7l10pkhfer)

::: info 本页结构
- 一、使用f2elint
- 代码示例
- 错误处理
- 路径别名和ESlint
- 和Prettier擦出的火花
- 二、自己配
:::

## 一、使用f2elint

俗话说无规范不编程，一个好的代码规范能够让自己/团队养成好的习惯，更能够写出诗一样的代码，具体可参考——

::: tip
alibaba / f2e-spec
:::

1.  [阿里巴巴前端代码规范集成工具F2ELint使用教程](https://blog.csdn.net/qq_37263248/article/details/123361050)

> 注意：当你使用`f2elint init`接入规范的时候，会在`package.json->scripts中新增：`

## 代码示例

```powershell
		"scan": "f2elint scan",
    "fix": "f2elint fix"
```

> 上述的两命令，在使用的时候可能会报错，最好还是使用`f2elint scan`和`f2elint fix`。

### 错误处理

在使用`f2elint scan`命令的时候可能会报错，不要紧只需要根据报错信息安装相关依赖就行了，比如有时候你在已有的项目上使用该命令会报如下错误：

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1528528/1682577334674-63cf5d53-4b5b-4fd4-a799-772d0d2609f1.png)

或者

![image.png](https://cdn.nlark.com/yuque/0/2023/png/1528528/1682577370589-b1ba105e-0a4f-4efe-83fb-9c3db677e56d.png)

其实都是因为没有安装相关的依赖造成的，直接使用npm安装依赖即可，比如上述图片很明显是少了`eslint-config-ali`和`vue-plugin-parser`，那么我们就安装即可：

```bash
# 开发依赖
npm install eslint-config-ali vue-plugin-parser --save-dev 
```

### 路径别名和ESlint

为了引用方便我们会在项目配置中使用路径别名`alias`，但是这么一来ESlint就不认识了，就会报错，那么针对这个问题如何解决呢？

```js
module.exports = {
  // ...
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
  },
  // ...
}
```

一个比较优雅的方式是：使用eslint-import-resolver-alias插件

```bash
npm install eslint-import-resolver-alias -D
```

并在`.eslintrc`中配置

```js
module.exports = {
  ...   
    settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.js','.tsx', '.jsx', '.json', '.vue'],
      },
    },
  },
  ...
}
```

可以参考： 

::: tip
https://juejin.cn/post/7021084391065518087
:::

### 和Prettier擦出的火花

参考这个：

## 二、自己配

1.  安装 vscode`eslint`插件
2.  安装依赖

```bash
npm install --save-dev eslint vue-eslint-parser eslint-plugin-vue

# 如果用的是ts
npm i @typescript-eslint/parser -D
```

3.  项目根目录配置`·eslint.js`和`.eslintignore`文件

```js
module.exports = {
  root: true, //只在根目录寻找.eslintrc配置文件
  env: {
    node: true,
    browser: true, // 环境
    es2021: true, // 支持的特性 2021
  },
  extends: [
    'eslint:recommended'
    'plugin:vue/essential', // 基本的 Vue 语法规则
    '@vue/standard', // 标准的 JavaScript 规则
    // vue3
    'plugin:vue/vue3-strongly-recommended',
    'plugin:vue/vue3-recommended',
    'plugin:vue/vue3-essential',
    // vue2
    'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended',
    'prettier',
  ],
  // 路径别名，可能需要安装 eslint-import-resolver-typescript插件
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.js', '.tsx', '.jsx', '.json', '.vue'],
      },
    },
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: {
      js: 'espree',
      ts: '@typescript-eslint/parser', // 需要安装 npm i @typescript-eslint/parser -D
      '<template>': 'espree',
    },
    ecmaVersion: 'latest', //支持es6语法，但并不意味着同时支持新的ES6全局变量或类型（比如 Set等类型）
    sourceType: 'module', //指定来源的类型，"script(默认)"或"module"(如果你的代码是ECMAScript模块)
    //使用的额外的语言特性
    ecmaFeatures: {
      jsx: true, //启用JSX
      globalReturn: true, //允许在全局作用域下使用 return 语句
      impliedStrict: true, //启用全局 strict mode （如果 ecmaVersion 是5或更高）
    },
  },
  // "off" 或 0 - 关闭规则
  // "warn" 或 1 - 打开规则作为警告（不影响退出代码）
  // "error" 或 2 - 打开规则作为错误（触发时退出代码为 1）
  rules: {
    // eslint规则，主要对代码语法进行规范
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-var': 'error',
    'no-await-in-loop': 'error',
    'no-constructor-return': 'error',
    'no-duplicate-imports': 'error',
    'no-promise-executor-return': 'error',
    'no-self-compare': 'error',
    'no-template-curly-in-string': 'error',
    'no-unreachable-loop': 'error',
    'no-use-before-define': 'error',
    'require-atomic-updates': 'error',
    'accessor-pairs': 'error',
    'arrow-body-style': [
      'error',
      'as-needed',
      {
        requireReturnForObjectLiteral: false,
      },
    ],
    camelcase: [
      'error',
      {
        properties: 'always',
        ignoreDestructuring: true,
        ignoreImports: true,
        ignoreGlobals: true,
        allow: ['^\\$_'],
      },
    ],
    curly: 'error',
    'default-case': 'error',
    'default-case-last': 'error',
    'default-param-last': 'error',
    eqeqeq: ['error', 'always'],
    'grouped-accessor-pairs': 'error',
    'max-nested-callbacks': [
      'error',
      {
        max: 3,
      },
    ],
    'max-params': 'off',
    'no-array-constructor': 'error',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-continue': 'error',
    'no-div-regex': 'error',
    'no-empty-function': 'error',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-implicit-coercion': [
      'warn',
      {
        boolean: true,
        number: true,
        string: true,
        disallowTemplateShorthand: false,
        allow: ['!!'],
      },
    ],
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-invalid-this': 'error',
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    'no-multi-assign': 'error',
    'no-multi-str': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'error',
    'no-proto': 'error',
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-script-url': 'error',
    'no-sequences': 'error',
    'no-shadow': 'error',
    'no-throw-literal': 'error',
    'no-unneeded-ternary': 'error',
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: false,
        enforceForJSX: false,
      },
    ],
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'object-shorthand': ['error', 'always'],
    'one-var': ['error', 'never'],
    'one-var-declaration-per-line': 'error',
    'operator-assignment': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'require-await': 'error',
    'symbol-description': 'error',
    'vars-on-top': 'error',
    // eslint stylistic规则，主要对代码风格进行规范
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxBOF: 0,
        maxEOF: 1,
      },
    ],
    'keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],
    'space-before-blocks': [
      'error',
      {
        functions: 'always',
        keywords: 'always',
        classes: 'always',
      },
    ],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': [
      'error',
      {
        int32Hint: false,
      },
    ],
    'switch-colon-spacing': [
      'error',
      {
        after: true,
        before: false,
      },
    ],
    'space-unary-ops': 'error',
    'template-curly-spacing': ['error', 'never'],
    'key-spacing': [
      'error',
      {
        beforeColon: false,
        afterColon: true,
        mode: 'strict',
        align: 'value',
      },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    semi: ['error', 'always'],
    'semi-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],
    'semi-style': ['error', 'last'],
    'no-extra-semi': 'error',
    quotes: [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
      },
    ],
    'array-bracket-newline': [
      'error',
      {
        multiline: true,
        minItems: 2,
      },
    ],
    'array-bracket-spacing': ['error', 'never'],
    'array-element-newline': [
      'error',
      {
        multiline: true,
        minItems: 2,
      },
    ],
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],
    'block-spacing': ['error', 'always'],
    'brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: false,
      },
    ],
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],
    'comma-style': ['error', 'last'],
    'computed-property-spacing': ['error', 'never'],
    'dot-location': ['error', 'property'],
    'eol-last': ['error', 'always'],
    'func-call-spacing': ['error', 'never'],
    'function-call-argument-newline': ['error', 'consistent'],
    'function-paren-newline': ['error', 'multiline'],
    'generator-star-spacing': [
      'error',
      {
        before: false,
        after: true,
        anonymous: 'neither',
        method: {
          before: true,
          after: true,
        },
      },
    ],
    'implicit-arrow-linebreak': ['error', 'beside'],
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'lines-around-comment': [
      'error',
      {
        beforeBlockComment: true,
        afterBlockComment: false,
        beforeLineComment: false,
        afterLineComment: false,
        allowBlockStart: true,
        allowBlockEnd: false,
        allowObjectStart: true,
        allowObjectEnd: false,
        allowArrayStart: true,
        allowArrayEnd: false,
        allowClassStart: true,
        allowClassEnd: false,
      },
    ],
    'multiline-ternary': ['error', 'never'],
    'new-parens': ['error', 'always'],
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
    'no-extra-parens': [
      'warn',
      'all',
      {
        conditionalAssign: false,
        returnAssign: false,
        nestedBinaryExpressions: false,
        ignoreJSX: 'multi-line',
        enforceForArrowConditionals: false,
        enforceForSequenceExpressions: false,
        enforceForNewInMemberExpressions: false,
        enforceForFunctionPrototypeMethods: false,
      },
    ],
    'no-mixed-spaces-and-tabs': 'error',
    'no-multi-spaces': 'error',
    'no-trailing-spaces': [
      'error',
      {
        skipBlankLines: false,
        ignoreComments: false,
      },
    ],
    'no-whitespace-before-property': 'error',
    'object-curly-newline': [
      'error',
      {
        multiline: true,
        minProperties: 2,
        consistent: true,
      },
    ],
    'object-curly-spacing': [
      'error',
      'always',
      {
        arraysInObjects: false,
        objectsInObjects: true,
      },
    ],
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: false,
      },
    ],
    'operator-linebreak': [
      'error',
      'before',
      {
        overrides: {
          '?': 'none',
          ':': 'none',
        },
      },
    ],
    'padded-blocks': ['error', 'never'],
    'rest-spread-spacing': ['error', 'never'],
    'template-tag-spacing': ['error', 'never'],
    'unicode-bom': ['error', 'never'],
    'wrap-iife': ['error', 'outside'],
    'yield-star-spacing': ['error', 'after'],
    'no-confusing-arrow': 'error',
    'no-floating-decimal': 'error',
    'quote-props': ['error', 'as-needed'],
    // eslint-plugin-vue规则，对代码语法和风格都进行了规范
    'vue/attribute-hyphenation': 'error',
    'vue/attributes-order': 'error',
    'vue/multiline-html-element-content-newline': 'error',
    'vue/component-definition-name-casing': 'off',
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: true,
        ignores: [],
      },
    ],
    'vue/component-options-name-casing': ['error', 'PascalCase'],
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
    'vue/html-comment-content-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],
    'vue/html-comment-content-spacing': ['error', 'always'],
    'vue/match-component-file-name': [
      'error',
      {
        extensions: ['jsx', 'tsx', 'vue'],
        shouldMatchCase: false,
      },
    ],
    'vue/no-child-content': 'error',
    'vue/no-multiple-objects-in-class': 'error',
    'vue/no-potential-component-option-typo': [
      'error',
      {
        presets: ['vue'],
      },
    ],
    'vue/no-reserved-component-names': [
      'error',
      {
        disallowVueBuiltInComponents: true,
        disallowVue3BuiltInComponents: true,
      },
    ],
    'vue/no-template-target-blank': [
      'error',
      {
        allowReferrer: false,
        enforceDynamicLinks: 'always',
      },
    ],
    'vue/no-this-in-before-route-enter': 'error',
    'vue/no-unused-properties': [
      'error',
      {
        groups: ['props'],
        deepData: false,
        ignorePublicMembers: false,
      },
    ],
    'vue/no-unused-refs': 'error',
    'vue/no-use-computed-property-like-method': 'error',
    'vue/no-useless-mustaches': [
      'error',
      {
        ignoreIncludesComment: false,
        ignoreStringEscape: false,
      },
    ],
    'vue/no-useless-v-bind': [
      'error',
      {
        ignoreIncludesComment: false,
        ignoreStringEscape: false,
      },
    ],
    'vue/no-v-text-v-html-on-component': 'error',
    'vue/no-v-text': 'error',
    'vue/padding-line-between-blocks': ['error', 'always'],
    'vue/prefer-import-from-vue': 'error',
    'vue/prefer-prop-type-boolean-first': 'error',
    'vue/prefer-separate-static-class': 'error',
    'vue/prefer-true-attribute-shorthand': 'error',
    'vue/require-direct-export': [
      'error',
      {
        disallowFunctionalComponentFunction: true,
      },
    ],
    'vue/require-emit-validator': 'error',
    'vue/v-for-delimiter-style': ['error', 'in'],
    'vue/v-on-function-call': [
      'error',
      'never',
      {
        ignoreIncludesComment: false,
      },
    ],
    'vue/array-bracket-newline': [
      'error',
      {
        multiline: true,
        minItems: 2,
      },
    ],
    'vue/array-bracket-spacing': ['error', 'never'],
    'vue/eqeqeq': ['error', 'always'],
    'vue/no-constant-condition': 'error',
    'vue/no-empty-pattern': 'error',
    'vue/no-irregular-whitespace': 'error',
    'vue/no-loss-of-precision': 'error',
    'vue/no-restricted-syntax': [
      'error',
      {
        selector: 'WithStatement',
        message: 'With statement are not allowed.',
      },
    ],
    'vue/no-sparse-arrays': 'error',
    'vue/no-useless-concat': 'error',
    'vue/object-shorthand': ['error', 'always'],
    'vue/prefer-template': 'error',
    'vue/quote-props': ['error', 'as-needed'],
    'vue/multi-word-component-names': 'off', // 组件和页面的name必须是多单词组成的，可用-或者大驼峰连接
    'vue/no-undef-properties': [
      // 禁止使用未定义的属性，这个规则无法检测到外部文件、外部组件、mixins中的变量，可在ignores中加入需要忽略的关键字
      'error',
      {
        ignores: [],
      },
    ],
    'vue/no-undef-components': [
      // 禁止使用未定义的组件，这个规则无法检测到外部文件、外部组件、mixins中的变量，可在ignores中加入需要忽略的关键字
      'error',
      {
        ignorePatterns: ['^el-', '^g-gantt-', 'router-view'],
      },
    ],
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 0,
        switchCase: 0,
        ignores: [],
      },
    ],
    'vue/block-tag-newline': [
      'error',
      {
        singleline: 'always',
        multiline: 'always',
        maxEmptyLines: 0,
      },
    ],
  },
};

```

配置`package.json`

```json
"scripts": {
    "lint": "npx eslint --ext .js,.ts,.vue ./src vite.config.js .eslintrc.js",
    "lint:fix": "npx eslint --ext .js,.ts,.vue --fix ./src vite.config.js .eslintrc.js",
    "lint:out": "npx eslint --ext .js,.ts,.vue -o eslint-output.html -f html ./src vite.config.js .eslintrc.js",
    "lint:fixout": "npx eslint --ext .js,.ts,.vue --fix -o eslint-output.html -f html ./src vite.config.js .eslintrc.js"
  }
```

::: tip
https://blog.csdn.net/JarryNeverGiveup/article/details/135199592?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-2-135199592-blog-127188007.235%5Ev43%5Epc_blog_bottom_relevance_base1&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-2-135199592-blog-127188007.235%5Ev43%5Epc_blog_bottom_relevance_base1&utm_relevant_index=5
:::
