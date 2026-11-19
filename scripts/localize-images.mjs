import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const DOCS = path.join(ROOT, 'docs');
const IMG_DIR = path.join(ROOT, 'docs', 'public', 'images');
const MANIFEST = path.join(ROOT, 'scripts', 'image-manifest.json');

const IMAGE_RE = /!\[[^\]]*\]\((https?:\/\/[^\s)]+)/g;

function collectUrls() {
  const urls = new Set();
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === '.vitepress' || entry.name === 'public') continue;
        walk(full);
      } else if (entry.name.endsWith('.md')) {
        const text = fs.readFileSync(full, 'utf8');
        for (const m of text.matchAll(IMAGE_RE)) urls.add(m[1]);
      }
    }
  };
  walk(DOCS);
  return [...urls].sort();
}

function localFile(url) {
  const hash = crypto.createHash('sha256').update(url).digest('hex').slice(0, 16);
  let ext = 'png';
  try {
    const pathname = new URL(url).pathname;
    const m = pathname.match(/\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i);
    if (m) ext = m[1].toLowerCase();
  } catch {
    // keep png fallback
  }
  if (ext === 'jpeg') ext = 'jpg';
  return `${hash}.${ext}`;
}

function isImage(buf) {
  if (buf.length < 8) return false;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  if (buf.slice(0, 6).toString('ascii').toUpperCase().startsWith('GIF8')) return true;
  if (buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') return true;
  if (buf[0] === 0x42 && buf[1] === 0x4d) return true;
  if (buf.slice(0, 200).toString('utf8').trimStart().startsWith('<svg')) return true;
  return false;
}

function refererFor(url) {
  try {
    const host = new URL(url).hostname;
    if (host.includes('yuque') || host.includes('nlark')) return 'https://www.yuque.com/';
    if (host.includes('github')) return 'https://github.com/';
    if (host.includes('jianshu')) return 'https://www.jianshu.com/';
    if (host.includes('cnblogs')) return 'https://www.cnblogs.com/';
    return `https://${host}/`;
  } catch {
    return 'https://www.yuque.com/';
  }
}

// camo.githubusercontent.com 的路径是原图 URL 的十六进制编码；
// 简书带 imageMogr2 缩略参数时容易 403，去掉参数取原图。
function normalizeUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname === 'camo.githubusercontent.com') {
      const hex = u.pathname.split('/').filter(Boolean).pop() || '';
      if (/^[0-9a-f]+$/i.test(hex) && hex.length % 2 === 0) {
        const decoded = Buffer.from(hex, 'hex').toString('utf8');
        if (/^https?:\/\//.test(decoded)) return decoded;
      }
    }
    if (u.hostname.includes('jianshu')) {
      u.search = '';
      return u.toString();
    }
  } catch {
    // fall through to original url
  }
  return url;
}

async function fetchImage(url, file) {
  const target = path.join(IMG_DIR, file);
  if (fs.existsSync(target) && fs.statSync(target).size > 0) return { url, file, ok: true, cached: true };

  const fetchUrl = normalizeUrl(url);
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const res = await fetch(fetchUrl, {
        signal: AbortSignal.timeout(30000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36',
          Referer: refererFor(fetchUrl),
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (!isImage(buf)) throw new Error('response is not an image');
      fs.writeFileSync(target, buf);
      return { url, file, ok: true, cached: false };
    } catch (err) {
      lastError = err;
      if (attempt < 3) await new Promise(r => setTimeout(r, 800 * attempt));
    }
  }
  return { url, file, ok: false, error: String(lastError?.message || lastError) };
}

async function main() {
  fs.mkdirSync(IMG_DIR, { recursive: true });

  const urls = collectUrls();
  console.log(`发现图片外链：${urls.length} 个`);

  const old = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
  const results = [];
  const concurrency = 8;

  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const done = await Promise.all(batch.map(url => fetchImage(url, localFile(url))));
    results.push(...done);
    console.log(`进度：${Math.min(i + concurrency, urls.length)}/${urls.length}`);
  }

  const failed = results.filter(r => !r.ok);
  const manifest = {};
  for (const r of results) {
    if (r.ok) manifest[r.url] = `/images/${r.file}`;
    else if (old[r.url]) manifest[r.url] = old[r.url];
  }

  // 源站已失效的图片：用本地占位图代替，避免出现破图；原链接写入 dead-images.txt 备查。
  if (failed.length) {
    const placeholder = path.join(IMG_DIR, 'source-missing.svg');
    if (!fs.existsSync(placeholder)) {
      fs.writeFileSync(placeholder, `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="240" viewBox="0 0 640 240">
  <rect width="640" height="240" rx="12" fill="#f3f5f7"/>
  <g fill="#9aa7b3" font-family="system-ui, -apple-system, Segoe UI, sans-serif" text-anchor="middle">
    <text x="320" y="102" font-size="42">🖼</text>
    <text x="320" y="142" font-size="20">原图链接已失效</text>
    <text x="320" y="174" font-size="14">图片来自语雀原文，源站已无法访问</text>
  </g>
</svg>`, 'utf8');
    }
    for (const f of failed) {
      if (!manifest[f.url]) manifest[f.url] = '/images/source-missing.svg';
    }
    fs.writeFileSync(
      path.join(ROOT, 'scripts', 'dead-images.txt'),
      failed.map(f => `${f.url}\t${f.error}`).join('\n') + '\n',
      'utf8'
    );
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`下载成功：${results.filter(r => r.ok).length}，失败：${failed.length}（已用本地占位图替代）`);
  if (failed.length) {
    console.log('失效图片：');
    for (const f of failed.slice(0, 30)) console.log(`  ${f.url} -> ${f.error}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
