import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { build, root } from './build.mjs';
await build();
let timer;
let pending = Promise.resolve();
for (const folder of ['docs', 'templates', 'assets']) watch(path.join(root, folder), { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(() => { pending = pending.then(build).catch(console.error); }, 100);
});
watch(path.join(root, 'navigation.json'), () => { pending = pending.then(build).catch(console.error); });
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon' };
const output = path.join(root, 'site');
createServer(async (request, response) => {
  try {
    await pending;
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = path.resolve(output, `.${pathname}`);
    if (!file.startsWith(`${output}${path.sep}`) && file !== output) { response.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith('/')) { response.writeHead(301, { Location: `${pathname}/` }).end(); return; }
      file = path.join(file, 'index.html');
    }
    response.writeHead(200, { 'Content-Type': `${types[path.extname(file)] || 'application/octet-stream'}; charset=utf-8`, 'Cache-Control': 'no-store' });
    response.end(await readFile(file));
  } catch { response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); response.end(await readFile(path.join(output, '404.html')).catch(() => '<h1>Page not found</h1>')); }
}).listen(8000, '127.0.0.1', () => console.log('Preview: http://localhost:8000 (refresh after editing)'));
