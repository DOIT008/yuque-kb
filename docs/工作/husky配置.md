---
description: "HuskyHusky 是 Git 钩子工具，可以设置在 git 各个阶段（pre-commit、commit-msg 等）触发。 官方网站：https://typicode.github.io/huskyHusky 安装方式：安装命令：npm install --save-dev huskyn..."
source: "https://www.yuque.com/alipayqxigqpgusn/nmkii5/tms6f6a0v56ww43r"
updated: "2025-06-24T08:21:11.000Z"
---

# husky配置

> 来源：语雀「工作」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/nmkii5/tms6f6a0v56ww43r)

<details class="toc-details">
<summary>本页结构（9 个小节）</summary>

- Husky
- 代码示例
- Lint-staged
- Lint-staged 安装
- Lint-staged 配置
- Commitlint
- Commitizen & cz-git
- Commitizen 安装
- cz-git 安装

</details>

## Husky

Husky 是 Git 钩子工具，可以设置在 git 各个阶段（pre-commit、commit-msg 等）触发。

官方网站：[https://typicode.github.io/husky](https://typicode.github.io/husky)

Husky 安装方式：

![4c88c8a3-d039-4d2c-98dd-617a2bca1991.png](/images/c8f54826bd93dd75.png)

安装命令：

## 代码示例

```plain
npm install --save-dev husky
```

 

```plain
npx husky init
```

自动生成的 `.husky` 目录和指令：

![74b0810a-c7d1-40fd-a3dd-c208c88b8371.png](/images/ef0e1ba78c648223.png)

## Lint-staged

lint-staged 是一个在 git add 到暂存区的文件运行 linters (ESLint/Prettier/StyleLint) 的工具，避免在 git commit 提交时在整个项目执行。[lint-staged](https://github.com/okonet/lint-staged) 可以让你当前的代码检查 **只检查本次修改更新的代码，并在出现错误的时候，自动修复并且推送**

官方网站：[https://github.com/okonet/lint-staged](https://github.com/okonet/lint-staged)

### Lint-staged 安装

```plain
npm install --save-dev lint-staged
```

### Lint-staged 配置

**检测/格式化配置**

package.json 中添加不同文件在 git 提交执行的 lint 检测配置

  
  

**添加 lint-staged 指令**

  
  

package.json 的 scripts 添加 `lint-staged` 指令:

  
  

```plain
"lint:lint-staged": "lint-staged"
```

**修改提交前钩子命令**

根目录 `.husky` 目录下 pre-commit 文件中的 `npm test` 修改为

```plain
npm run lint:lint-staged
```

![14bd288a-4b2c-4b15-b28e-a064e64ddf62.png](/images/3b9ad1a5ed110cae.png)

**Git 提交代码检测**

**git commit -m "test husky lint-staged"**

![d55e3237-cbd0-4f46-92e2-2f58ba895557.png](/images/9d8908d1f6e7fcb4.png)

## Commitlint

Commitlint 检查您的提交消息是否符合 Conventional commit format。-- [Commitlint 官网](https://commitlint.js.org/)

#### Commitlint 安装

参考 [官方安装文档](https://commitlint.js.org/#/?id=getting-started)

```plain
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

#### Commitlint 配置

根目录下创建 `commitlint.config.js` 配置文件，**注意：确保保存为** `**UTF-8**` **的编码格式**，否则可能会出现错误。

```plain
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

**增加配置项**

```plain
extends: ['@commitlint/config-conventional'],
```

**添加提交信息校验钩子**

执行下面命令生成 `commint-msg` 钩子用于 git 提交信息校验，husky9.x版本适配

```plain
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

husky9.x版本下此命令生成的`commint-msg` 配置（编码格式为UTF-16LE）：

![4c21eee7-8b31-4d1f-8b40-fcba63fca3e1.png](/images/7bc1176ea280d650.png)

git commit -m "不规范的提交"。测试错误如下：

.husky/commit-msg: .husky/commit-msg: cannot execute binary file  
husky - commit-msg script failed (code 126)

![ba97ec11-f69a-4ad8-b82a-bd0665bbf89b.png](/images/7c232d8a144cfa26.png)

解决办法：更改 `.husky` 目录下 pre-commit 文件的编码格式为 `**UTF-8**` **的编码格式**

#### Commitlint 验证

正确的提交格式：`<type>(<scope>): <subject>` ，type 和 subject 默认必填

不规范的 commit msg（ git commit -m "不规范的提交"），提交失败 | 规范的 commit msg（ git commit -m "feat: 规范的提交" ），提交成功
--- | ---
 | 

## Commitizen & cz-git

Commitizen & cz-git

-   commitizen: 基于Node.js的 git commit 命令行工具，辅助生成标准化规范化的 commit message。–[官方文档](https://github.com/commitizen/cz-cli)
-   cz-git: 一款工程性更强，轻量级，高度自定义，标准输出格式的 commitizen 适配器。-[官方文档](https://cz-git.qbb.sh/zh/)

### Commitizen 安装

全局安装`Commitizen`

```plain
npm install -g commitizen
```

### cz-git 安装

步骤 1: 下载依赖

```plain
npm install -D cz-git
```

步骤 2: 修改 `package.json` 添加 `config` 指定使用的适配器

```plain
"path": "node_modules/cz-git"
```

**cz-git 与** [**commitlint**](https://github.com/conventional-changelog/commitlint) **进行联动给予校验信息**，所以可以编写于 [commitlint](https://github.com/conventional-changelog/commitlint#config) 配置文件(`commitlint.config.cjs`)之中

```plain
customScope: '请输入自定义的提交范围 :',

      subject: '填写简短精炼的变更描述 :\n',

      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',

      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',

      footerPrefixesSelect: '选择关联issue前缀（可选）:',

      customFooterPrefix: '输入自定义issue前缀 :',

      footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',

      generatingByAI: '正在通过 AI 生成你的提交简短描述...',

      generatedSelectByAI: '选择一个 AI 生成的简短描述:',

      confirmCommit: '是否提交或修改commit ?',

      { value: "feat",     name: "特性:     ✨  新增功能", emoji: ":sparkles:" },

      { value: "fix",      name: "修复:     🐛  修复缺陷", emoji: ":bug:" },

      { value: "docs",     name: "文档:     📝  文档变更", emoji: ":memo:" },

      { value: "style",    name: "格式:     💄  代码格式（不影响功能，例如空格、分号等格式修正）", emoji: ":lipstick:" },

      { value: "refactor", name: "重构:     ♻️  代码重构（不包括 bug 修复、功能新增）", emoji: ":recycle:" },

      { value: "perf",     name: "性能:     ⚡️  性能优化", emoji: ":zap:" },

      { value: "test",     name: "测试:     ✅  添加疏漏测试或已有测试改动", emoji: ":white_check_mark:"},

      { value: "build",    name: "构建:     📦️  构建流程、外部依赖变更（如升级 npm 包、修改 vite 配置等）", emoji: ":package:"},

      { value: "ci",       name: "集成:     🎡  修改 CI 配置、脚本",  emoji: ":ferris_wheel:"},

      { value: "revert",   name: "回退:     ⏪️  回滚 commit",emoji: ":rewind:"},

      { value: "chore",    name: "其他:     🔨  对构建过程或辅助工具和库的更改（不影响源文件、测试用例）", emoji: ":hammer:"},

    customScopesAlign: 'bottom',

    customScopesAlias: 'custom',

    emptyScopesAlias: 'empty',

    markBreakingChangeMode: false,

    allowBreakingChanges: ['feat', 'fix'],

    issuePrefixes: [{ value: 'closed', name: 'closed:   ISSUES has been processed' }],

    customIssuePrefixAlign: 'top',

    emptyIssuePrefixAlias: 'skip',

    customIssuePrefixAlias: 'custom',

    allowCustomIssuePrefix: true,

    allowEmptyIssuePrefix: true,

    maxHeaderLength: Infinity,

    maxSubjectLength: Infinity,

    scopeOverrides: undefined,
```

**cz-git 验证**

执行 git cz 指令进行代码提交流程，执行前需将改动的文件通过 `git add` 添加到暂存区

执行命令之后会出现询问交互，根据提示一步步的完善 commit msg 信息

![611e04a7-ce8f-4ca8-a30c-97fd0ae7f6b8.png](/images/5e711308b4a4004d.png)

  
参考 [有来技术](https://youlai.blog.csdn.net/?type=blog) 的 文章 [【vue3-element-admin】Husky + Lint-staged + Commitlint + Commitizen + cz-git 配置 Git 提交规范](https://blog.csdn.net/u013737132/article/details/130191363)原文链接：https://blog.csdn.net/u013737132/article/details/130191363

​  

> 来自: [Husky(husky9.x版本适配) + Lint-staged + Commitlint + Commitizen + cz-git 配置 Git 提交规范-CSDN博客](https://blog.csdn.net/weixin_51799004/article/details/138308098)

​  

​
