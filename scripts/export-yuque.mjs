import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', 'raw');
const SESSION = 'yuque-login';
const AGENT_BROWSER = 'C:/Users/Administrator/.workbuddy/binaries/node/versions/22.22.2-6/agent-browser.cmd';

const books = [
  { id: 24013644, slug: 'nmkii5', name: '工作' },
  { id: 44851824, slug: 'qmvy1p', name: '生活' },
  { id: 58796906, slug: 'gzq3v8', name: 'Python' },
  { id: 44851988, slug: 'rs8s8g', name: '前端' },
  { id: 48466893, slug: 'qd0t47', name: '开源' }
];

function evalInBrowser(expression) {
  const cmd = `"${AGENT_BROWSER}" --session ${SESSION} --restore eval '${expression}'`;
  const out = execSync(cmd, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, shell: 'cmd.exe' });
  return JSON.parse(out.trim());
}

function saveJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

let totalDocs = 0;
for (const book of books) {
  const listExpr = `fetch(${JSON.stringify(`/api/books/${book.id}/docs?limit=1000`)}).then(r=>r.json()).then(d=>d.data.map(x=>({id:x.id,slug:x.slug,title:x.title,description:x.description||'',content_updated_at:x.content_updated_at})))`;
  const docs = evalInBrowser(listExpr);
  saveJson(path.join(ROOT, `${book.slug}-docs.json`), docs);
  console.log(`[${book.name}] ${docs.length} 篇`);

  for (const [i, doc] of docs.entries()) {
    const expr = `fetch(${JSON.stringify(`/api/docs/${doc.slug}?book_id=${book.id}`)}).then(r=>r.json()).then(d=>({id:d.data.id,slug:d.data.slug,title:d.data.title,description:d.data.custom_description||d.data.description||'',content:d.data.content||'',updated_at:d.data.content_updated_at||d.data.updated_at}))`;
    const full = evalInBrowser(expr);
    saveJson(path.join(ROOT, 'docs', book.slug, `${doc.slug}.json`), full);
    totalDocs += 1;
    if ((i + 1) % 20 === 0 || i + 1 === docs.length) {
      console.log(`  ${book.name}: ${i + 1}/${docs.length}`);
    }
  }
}

saveJson(path.join(ROOT, 'books.json'), books.map(b => ({ ...b, docCount: JSON.parse(fs.readFileSync(path.join(ROOT, `${b.slug}-docs.json`), 'utf8')).length })));
console.log(`导出完成：${books.length} 个知识库，${totalDocs} 篇文档`);
