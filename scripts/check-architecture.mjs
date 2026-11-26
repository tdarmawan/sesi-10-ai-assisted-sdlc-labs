import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = resolve(dir, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (file.endsWith('.js')) {
      const source = await readFile(file, 'utf8');
      const imports = [...source.matchAll(/(?:from\s*|import\s*\()\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
      const name = basename(file);
      for (const dep of imports) {
        const pure = ['domain.js', 'quota.js'].includes(name);
        const service = name === 'service.js';
        if ((pure && (!dep.startsWith('./') || /repository|service|http|app|node:/.test(dep))) ||
            (service && (!dep.startsWith('./') || /repository|http|app|node:/.test(dep)))) {
          failures.push(`${relative(root, file)} imports forbidden dependency ${dep}`);
        }
      }
      if (['domain.js','quota.js','service.js'].includes(name) && /\b(?:require|import)\s*\(/.test(source)) {
        failures.push(`${relative(root,file)}: dynamic imports/require need manual architecture review`);
      }
    }
  }
}
for (const lab of ['material-request', 'material-transfer']) await walk(resolve(root, lab, 'src'));
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log('Architecture checks passed (local imports; not a full static analyzer).');
