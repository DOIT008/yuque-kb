import fs from 'node:fs';
import path from 'node:path';
import TurndownService from 'turndown';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const RAW = path.join(ROOT, 'raw', 'docs');
const OUT = path.join(ROOT, 'docs');
const MANIFEST = path.join(ROOT, 'scripts', 'image-manifest.json');
const LOGIN = 'alipayqxigqpgusn';

const imageManifest = fs.existsSync(MANIFEST)
  ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
  : {};

function localizeImages(md) {
  return md.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)([^)]*)\)/g, (all, alt, url, rest) => {
    const local = imageManifest[url];
    return local ? `![${alt}](${local}${rest})` : all;
  });
}

const books = [
  { id: 24013644, slug: 'nmkii5', name: '工作' },
  { id: 44851824, slug: 'qmvy1p', name: '生活' },
  { id: 58796906, slug: 'gzq3v8', name: 'Python' },
  { id: 44851988, slug: 'rs8s8g', name: '前端' },
  { id: 48466893, slug: 'qd0t47', name: '开源' }
];

const langMap = {
  shell: 'bash', sh: 'bash', bash: 'bash', git: 'bash', js: 'js', javascript: 'js',
  ts: 'ts', typescript: 'ts', vue: 'vue', html: 'html', css: 'css',
  json: 'json', yaml: 'yaml', yml: 'yaml', python: 'python', py: 'python',
  java: 'java', sql: 'sql', go: 'go', rust: 'rust', php: 'php', csharp: 'csharp', diff: 'diff'
};

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}

function htmlTableToMarkdown(html) {
  const rows = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)].map(m => m[1]);
  if (!rows.length) return '';
  const table = rows.map(row => {
    const cells = [...row.matchAll(/<(th|td)\b[^>]*>([\s\S]*?)<\/\1>/g)].map(m => m[2]);
    return cells.map(cell => decodeEntities(cell.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()).replace(/\|/g, '\\|')).join(' | ');
  }).filter(r => r.trim());
  if (!table.length) return '';
  const colCount = (table[0].match(/\|/g) || []).length + 1;
  const sep = Array(colCount).fill('---').join(' | ');
  return `\n\n${table[0]}\n${sep}\n${table.slice(1).join('\n')}\n\n`;
}

function decodeCardValue(raw) {
  const value = raw.startsWith('data:') ? decodeURIComponent(raw.slice(5)) : decodeURIComponent(raw);
  try { return JSON.parse(value); } catch { return null; }
}

function safeName(name, fallback) {
  return String(name || fallback).replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim() || fallback;
}

function collectHeadings(md) {
  return md.split('\n').filter(l => /^#{2,3}\s+/.test(l)).map(l => l.replace(/^#{2,3}\s+/, '').trim());
}

function convertHtml(html) {
  const tokens = [];
  let out = String(html || '');

  out = out.replace(/<table\b[\s\S]*?<\/table>/g, (html) => {
    const token = `@@YUQUETOKEN${tokens.length}@@`;
    tokens.push(htmlTableToMarkdown(html));
    return `\n\n${token}\n\n`;
  });

  out = out.replace(/<card\b([^>]*)><\/card>/g, (_m, attrs) => {
    const name = (attrs.match(/name="([^"]+)"/) || [])[1] || '';
    const raw = (attrs.match(/value="([^"]*)"/) || [])[1] || '';
    const data = decodeCardValue(raw);
    if (!data) return '';
    if (name === 'codeblock') {
      const lang = langMap[data.mode] || data.mode || 'text';
      const code = String(data.code || '').replace(/\r\n/g, '\n').replace(/```/g, '\\`\\`\\`');
      const token = `@@YUQUETOKEN${tokens.length}@@`;
      tokens.push(`\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`);
      return `\n\n${token}\n\n`;
    }
    if (name === 'image') {
      const src = data.src || data.url || '';
      const alt = data.name || data.alt || '图片';
      if (!src) return '';
      const token = `@@YUQUETOKEN${tokens.length}@@`;
      tokens.push(`\n\n![${alt}](${src})\n\n`);
      return `\n\n${token}\n\n`;
    }
    const text = data.text || data.body || data.content || data.description || '';
    if (text) {
      const kind = /warning|danger|error/i.test(name) ? 'warning' : 'tip';
      const token = `@@YUQUETOKEN${tokens.length}@@`;
      tokens.push(`\n\n::: ${kind}\n${text}\n:::\n\n`);
      return `\n\n${token}\n\n`;
    }
    return '';
  });

  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
    strongDelimiter: '**'
  });
  td.keep(['br']);
  td.addRule('removeLakeMeta', {
    filter: node => node.nodeName === 'META' || node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE',
    replacement: () => ''
  });
  td.addRule('lakeHeading', {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    replacement: (content, node) => {
      const level = Number(node.nodeName.slice(1));
      const adjusted = level <= 2 ? 2 : Math.min(level - 1, 5);
      return `\n\n${'#'.repeat(adjusted)} ${content.trim()}\n\n`;
    }
  });

  let md = td.turndown(out);
  tokens.forEach((value, i) => { md = md.replace(`@@YUQUETOKEN${i}@@`, value); });
  md = md.replace(/\u00a0/g, ' ').replace(/\r/g, '');
  md = md.replace(/\n{3,}/g, '\n\n').trim();
  return escapeProseHtml(md);
}

function improveStructure(md, info, title) {
  let out = md;

  // 正文开头若重复了文档标题，去掉重复 H2，避免页面上出现两个大标题
  const lines = out.split('\n');
  if (lines[0]?.startsWith('## ') && lines[0].slice(3).trim() === title) {
    let i = 1;
    while (i < lines.length && lines[i].trim() === '') i += 1;
    out = lines.slice(i).join('\n');
  }

  if (info.headings.length === 0) {
    out = `## 背景与思路\n\n${out}`;
  }
  if (info.codeBlocks > 0 && !/##\s+.*(示例|代码|Code)/i.test(out)) {
    out = out.replace(/```/, `## 代码示例\n\n\`\`\``);
  }
  if (info.chars < 300) {
    out = `::: tip 关于这篇短文\n内容来自语雀原文，已保留核心信息。更多上下文可点击上方「查看原文」。\n:::\n\n${out}`;
  }
  return out;
}

function escapeProseHtml(md) {
  let inFence = false;
  return md.split('\n').map(line => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return line;
    }
    if (inFence) return line;
    return line.split('`').map((part, i) => {
      if (i % 2 === 1) return part;
      return part.replace(/<\/?([A-Za-z][^>]*)>/g, '&lt;$1&gt;');
    }).join('`');
  }).join('\n');
}

function analyze(md) {
  const codeBlocks = (md.match(/```/g) || []).length / 2;
  const images = (md.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
  const headings = collectHeadings(md);
  const chars = md.length;
  const flags = [];
  if (chars > 2000 && headings.length < 3) flags.push('needs_structure');
  if (codeBlocks >= 5) flags.push('code_heavy');
  if (images >= 5) flags.push('image_heavy');
  if (chars < 300) flags.push('short');
  return { chars, codeBlocks, images, headings, flags };
}

function writeHome(report) {
  const counts = new Map();
  const firstLinks = new Map();
  for (const item of report) {
    counts.set(item.book, (counts.get(item.book) || 0) + 1);
    if (!firstLinks.has(item.book)) {
      firstLinks.set(item.book, '/' + item.file.replace(/\.md$/, ''));
    }
  }

  const descriptions = {
    工作: '项目笔记、部署排错与工具使用，保留原文链接和更新时间。',
    生活: '阅读摘录、成长记录与长期主义思考，长文自动整理结构。',
    Python: 'Python 学习与脚本记录，代码片段统一等宽字体展示。',
    前端: 'Vue、TypeScript、工程化与面试题，重点内容分级更清楚。',
    开源: '开源项目相关记录，便于快速回看原始出处。'
  };

  const features = books.map(book => {
    const title = `${book.name} · ${counts.get(book.name) || 0} 篇`;
    return [
      `  - title: ${JSON.stringify(title)}`,
      `    details: ${JSON.stringify(descriptions[book.name] || '迁移自语雀，保留原文来源。')}`,
      `    link: ${JSON.stringify(firstLinks.get(book.name) || '/')}`
    ].join('\n');
  }).join('\n');

  const home = [
    '---',
    'layout: home',
    '',
    'hero:',
    '  name: "DOIT 的知识库"',
    '  text: "从语雀迁移而来"',
    '  tagline: "更清晰的排版，更聚焦的阅读，更舒服的代码展示"',
    '  actions:',
    '    - theme: brand',
    '      text: "开始阅读"',
    `      link: ${JSON.stringify(firstLinks.get('工作') || '/')}`,
    '    - theme: alt',
    '      text: "查看语雀首页"',
    '      link: "https://www.yuque.com/dashboard"',
    '',
    'features:',
    features,
    '---',
    ''
  ].join('\n');

  fs.writeFileSync(path.join(OUT, 'index.md'), home, 'utf8');
}

fs.mkdirSync(OUT, { recursive: true });
for (const book of books) {
  fs.rmSync(path.join(OUT, `${book.id}-${book.slug}`), { recursive: true, force: true });
}

const report = [];
for (const book of books) {
  const dir = path.join(RAW, book.slug);
  if (!fs.existsSync(dir)) continue;
  const target = path.join(OUT, `${book.id}-${book.slug}`);
  fs.mkdirSync(target, { recursive: true });
  const titleCount = new Map();

  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
    const doc = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    const sourceUrl = `https://www.yuque.com/${LOGIN}/${book.slug}/${doc.slug}`;
    const converted = convertHtml(doc.content);
    const rawInfo = analyze(converted);
    const body = improveStructure(converted, rawInfo, doc.title);
    const info = analyze(body);
    if (rawInfo.flags.includes('needs_structure')) info.flags.push('structure_optimized');

    const headingList = info.headings.length >= 3 && info.chars > 1500
      ? `\n::: info 本页结构\n${info.headings.slice(0, 10).map(h => `- ${h}`).join('\n')}\n:::\n`
      : '';

    const front = [
      '---',
      `description: ${JSON.stringify(doc.description || doc.title)}`,
      `source: ${JSON.stringify(sourceUrl)}`,
      `updated: ${JSON.stringify(doc.updated_at || '')}`,
      '---',
      '',
      `# ${doc.title}`,
      '',
      `> 来源：语雀「${book.name}」 · [查看原文](${sourceUrl})`,
      headingList,
      ''
    ].join('\n');

    const finalMd = localizeImages(front + body + '\n');
    let safeName = doc.title.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
    const seen = titleCount.get(safeName) || 0;
    titleCount.set(safeName, seen + 1);
    if (seen > 0) safeName = `${safeName}-${doc.slug}`;
    fs.writeFileSync(path.join(target, `${safeName}.md`), finalMd, 'utf8');
    report.push({ book: book.name, title: doc.title, file: `${book.id}-${book.slug}/${safeName}.md`, ...info });
  }
}

writeHome(report);
fs.writeFileSync(path.join(ROOT, 'conversion-report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log(`转换完成：${report.length} 篇`);
for (const flag of ['needs_structure', 'code_heavy', 'image_heavy', 'short']) {
  console.log(`${flag}=${report.filter(r => r.flags.includes(flag)).length}`);
}
