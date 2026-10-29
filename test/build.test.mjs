import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat, mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { build, root } from '../scripts/build.mjs';

test('all documentation routes, navigation, assets and fragment links resolve', async (context) => {
  const output = await mkdtemp(path.join(tmpdir(), 'composable-forms-test-'));
  context.after(() => rm(output, { recursive: true, force: true }));
  await build(output);
  const navigation = JSON.parse(await readFile(path.join(root, 'navigation.json'), 'utf8'));
  const pages = navigation.flatMap(([, target]) => Array.isArray(target) ? target : [['Home', target]]);
  assert.equal(pages.length, 17);
  for (const [, slug] of pages) {
    const route = slug === 'index' ? '' : `${slug}/`;
    const html = await readFile(path.join(output, route, 'index.html'), 'utf8');
    assert.ok(html.includes('<main id="content">'));
    assert.ok(!html.includes('{{'));
    assert.ok(!html.includes('.md"'));
    for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = new URL(value, `https://docs.example/project/${route}`);
      if (url.origin !== 'https://docs.example') continue;
      assert.ok(url.pathname.startsWith('/project/'), `Hosting prefix lost: ${value}`);
      let target = path.join(output, url.pathname.slice('/project/'.length));
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      if (url.hash) {
        const page = await readFile(target, 'utf8');
        assert.ok(page.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing anchor: ${slug}: ${value}`);
      }
    }
  }
  const search = JSON.parse(await readFile(path.join(output, 'assets/search.json'), 'utf8'));
  assert.equal(search.length, pages.length);
  assert.ok(search.every((page) => page.text.length && !page.text.includes('<h1')));
});
