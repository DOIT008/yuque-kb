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

let nav = '[\n  { text: "首页", link: "/" },\n';
let sidebar = '[\n';
for (const g of groups) {
  const label = bookLabels[g] || g.replace(/^\d+-/, '').replace(/^\d+-[\w-]+-/, '').replace(/^[^-]+-/, '');
  const files = fs.readdirSync(path.join(docs, g)).filter(f => f.endsWith('.md')).sort();
  sidebar += `  {\n    text: ${JSON.stringify(label)},\n    collapsed: true,\n    items: [\n`;
  for (const f of files) {
    const name = f.replace(/\.md$/, '');
    sidebar += `      { text: ${JSON.stringify(name)}, link: ${JSON.stringify('/' + g + '/' + name)} },\n`;
  }
  if (files.length) {
    const firstName = files[0].replace(/\.md$/, '');
    nav += `  { text: ${JSON.stringify(label)}, link: ${JSON.stringify('/' + g + '/' + firstName)} },\n`;
  }
  sidebar += '    ]\n  },\n';
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
