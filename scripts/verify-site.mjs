import { readdir, readFile, stat } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';

const root = resolve('dist');
const problems = [];

async function walk(dir) {
  const entries = await readdir(dir);
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry);
    const info = await stat(path);
    if (info.isDirectory()) files.push(...await walk(path));
    else if (entry.endsWith('.html')) files.push(path);
  }
  return files;
}

function routeFor(file) {
  return '/' + file.slice(root.length + 1).replaceAll('\\', '/').replace(/index\.html$/, '').replace(/\.html$/, '');
}

function localTargetExists(href) {
  const path = href.split(/[?#]/)[0];
  if (!path || path === '/') return true;
  const direct = join(root, path.replace(/^\//, ''));
  return Promise.allSettled([stat(direct), stat(join(direct, 'index.html')), stat(`${direct}.html`)]).then((results) => results.some((r) => r.status === 'fulfilled'));
}

for (const file of await walk(root)) {
  const html = await readFile(file, 'utf8');
  const route = routeFor(file);
  const utility = ['/404', '/og-image/', '/thank-you/'].includes(route);
  if (!utility) {
    if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${route}: missing title`);
    if (!/<meta name="description" content="[^"]+"/.test(html)) problems.push(`${route}: missing description`);
    if (!/<link rel="canonical" href="https:\/\/mobileoffload\.com\/[^"]*"/.test(html)) problems.push(`${route}: missing/invalid canonical`);
    const h1s = (html.match(/<h1\b/g) || []).length;
    if (h1s !== 1) problems.push(`${route}: expected 1 h1, found ${h1s}`);
  }

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]); }
    catch (error) { problems.push(`${route}: invalid JSON-LD (${error.message})`); }
  }

  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    if (!(await localTargetExists(href))) problems.push(`${route}: broken local link ${href}`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log('Verified metadata, one-H1 structure, JSON-LD syntax, and local links for all generated HTML routes.');
