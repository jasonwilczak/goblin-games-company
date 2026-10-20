// Turns the TTFs in content/fonts into WOFF2 in src/fonts (generated, not committed).
// WOFF2 is about half the size, which matters on a phone connection.
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { compress } from 'wawoff2';

const src = new URL('../content/fonts/', import.meta.url);
const out = new URL('../src/fonts/', import.meta.url);
await mkdir(out, { recursive: true });

for (const name of await readdir(src)) {
  if (!name.endsWith('.ttf')) continue;
  const target = new URL(name.replace(/\.ttf$/, '.woff2'), out);
  const from = await stat(new URL(name, src));
  const done = await stat(target).catch(() => null);
  if (done && done.mtimeMs >= from.mtimeMs) continue;
  await writeFile(target, await compress(await readFile(new URL(name, src))));
  console.log(`fonts: ${name} -> ${name.replace(/\.ttf$/, '.woff2')}`);
}
