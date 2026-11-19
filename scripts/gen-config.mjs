import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const docs = path.join(ROOT, 'docs');

// 语雀目录名是内部 slug，直接显示在导航里读者看不懂；映射成中文知识库名。
const bookLabels = {
  '24013644-nmkii5': '工作',
  '44851824-qmvy1p': '生活',
  '44851988-rs8s8g': '前端',
  '48466893-qd0t47': '开源',
  '58796906-gzq3v8': 'Python'
};
const bookOrder = ['24013644-nmkii5', '44851824-qmvy1p', '58796906-gzq3v8', '44851988-rs8s8g', '48466893-qd0t47'];

const groups = fs.readdirSync(docs)
  .filter(d => fs.statSync(path.join(docs, d)).isDirectory() && d !== '.vitepress' && d !== 'public')
  .sort((a, b) => {
    const ia = bookOrder.indexOf(a);
    const ib = bookOrder.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

// 前端库 209 篇全部堆在一个折叠组里很难找，按主题拆成子分组。
const frontendRules = [
  ['Vue 框架与生态', /vue|pinia|vuex|\$attrs|v-model|v-if|nexttick|computed|watch|suspense|teleport|definemodel|composition api|组件|插槽|指令|混入|动态组件|异步组件|状态共享|响应式|生命周期|过渡和动画|render|eventbus|全局注册|函数式组件|父子组件|mvvm|diff算法|key的作用|手写vue|谈谈你对vue|谈谈你对mvc|扩展一个组件|使用vue模拟|vue2|vue.plugin|vue.extend|vue.observable|vue动画|vue性能|vue父子|vue的render|vue的几个概念|vue组件化|vue自定义指令|vue项目中|vuex|why组件的data/i],
  ['TypeScript 与类型', /(^|[^a-z])ts([^a-z]|$)|typescript|泛型|联合类型|类型守护|声明文件|命名空间|枚举|^\s*类型$|^\s*类$|^\s*接口$|const xxx as const|module\.exports|export|^\s*type$/i],
  ['工程化与工具链', /webpack|vite|babel|eslint|prettier|git|verdaccio|npm|nvm|打包|发布|模块化|loader|plugin|rollup|grunt|gulp|环境变量|构建|按需加载|单元测试|vitest|前端性能|怎么打包/i],
  ['JavaScript 深入', /^js|es6|es深入|promise|async|iterator|reflect|proxy|symbol|generator|let.{0,3}const|模板字符串|箭头函数|柯里化|防抖|节流|深拷贝|浅拷贝|闭包|作用域|执行上下文|this|事件循环|事件触发|v8|垃圾回收|堆和栈|栈和堆|原型|继承|instanceof|call.{0,3}apply|json\.parse|高阶函数|内置对象|null和undefined|数据类型|参数按值传递|异步异常|模块加载|object\.create|0\.1|模拟实现|^\s*函数$|weakmap|map与weakmap|模块加载方案/i],
  ['算法与计算机基础', /算法|排序|二分|图（|树（|链表|队列|^\s*栈$|集合|字典|散列表|递归|设计模式|计算机|网络|浏览器|dom|输入url|渲染页面|重排|重绘|线程和进程|页面中有多少种标签|前端安全|http|cookie|localstorage|sessionstorage|存储|垃圾回收|事件循环|v8引擎/i]
];
const frontendGroups = new Map();

function classifyFrontend(name) {
  for (const [label, re] of frontendRules) {
    if (re.test(name)) return label;
  }
  return '综合与其他';
}

function sidebarItems(g, files, indent) {
  const pad = ' '.repeat(indent);
  let out = '';
  for (const f of files) {
    const name = f.replace(/\.md$/, '');
    out += `${pad}{ text: ${JSON.stringify(name)}, link: ${JSON.stringify('/' + g + '/' + name)} },\n`;
  }
  return out;
}

let nav = '[\n  { text: "首页", link: "/" },\n';
let sidebar = '[\n';
for (const g of groups) {
  const label = bookLabels[g] || g.replace(/^\d+-/, '').replace(/^\d+-[\w-]+-/, '').replace(/^[^-]+-/, '');
  const files = fs.readdirSync(path.join(docs, g)).filter(f => f.endsWith('.md')).sort();
  if (files.length) {
    const firstName = files[0].replace(/\.md$/, '');
    nav += `  { text: ${JSON.stringify(label)}, link: ${JSON.stringify('/' + g + '/' + firstName)} },\n`;
  }

  if (g === '44851988-rs8s8g') {
    // 前端：顶层折叠，子分组也默认折叠
    frontendGroups.clear();
    for (const f of files) {
      const name = f.replace(/\.md$/, '');
      const bucket = classifyFrontend(name);
      if (!frontendGroups.has(bucket)) frontendGroups.set(bucket, []);
      frontendGroups.get(bucket).push(name);
    }
    sidebar += `  {\n    text: "前端",\n    collapsed: true,\n    items: [\n`;
    for (const [bucket, names] of frontendGroups) {
      sidebar += `      {\n        text: ${JSON.stringify(`${bucket} · ${names.length}`)},\n        collapsed: true,\n        items: [\n`;
      sidebar += sidebarItems(g, names.map(n => `${n}.md`), 10);
      sidebar += `        ]\n      },\n`;
    }
    sidebar += '    ]\n  },\n';
  } else {
    sidebar += `  {\n    text: ${JSON.stringify(label)},\n    collapsed: true,\n    items: [\n`;
    sidebar += sidebarItems(g, files, 6);
    sidebar += '    ]\n  },\n';
  }
}
nav += ']\n';
sidebar += ']\n';

const config = `import { defineConfig } from 'vitepress'

const rawBase = process.env.VITE_BASE_PATH || '/'
const base = rawBase.startsWith('/')
  ? rawBase
  : ('/' + String(rawBase).replace(/^.*[\\\\\\/]([^\\\\\\/]+)[\\\\\\/]?$/, '$1') + '/')

export default defineConfig({
  base,
  title: 'DOIT 的知识库',
  description: '从语雀迁移而来 · VitePress 排版版',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  // 浏览器标签页 favicon（base 拼在前面，GitHub Pages 项目站点才找得到）
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: \`\${base}favicon.svg\` }]
  ],
  markdown: {
    container: {
      tipLabel: '提示',
      warningLabel: '注意',
      dangerLabel: '警告',
      infoLabel: '信息',
      detailsLabel: '详情'
    },
    lineNumbers: true
  },
  themeConfig: {
    nav: ${nav.trim()},
    sidebar: ${sidebar.trim()},
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdatedText: '最后更新于',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    search: { provider: 'local', options: { translations: { button: { buttonText: '搜索知识库', buttonAriaLabel: '搜索知识库' }, modal: { noResultsText: '没有找到结果', displayNoResults: '没有找到结果', footer: { selectText: '选择', navigateText: '切换', closeText: '关闭', upText: '上', downText: '下' } } } } }
  }
})
`;

fs.mkdirSync(path.join(docs, '.vitepress'), { recursive: true });
fs.writeFileSync(path.join(docs, '.vitepress', 'config.mts'), config, 'utf8');
console.log('config.mts 已生成，分组数:', groups.length);
