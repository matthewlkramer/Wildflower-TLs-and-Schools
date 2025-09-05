import { build } from 'esbuild';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const root = path.resolve(__dirname, '..');
const serverDir = path.resolve(root, 'server');
const outDir = path.resolve(__dirname, '_server');

const common = {
  platform: 'node',
  format: 'esm',
  bundle: true,
  sourcemap: false,
  outdir: outDir,
  external: [],
  loader: { '.ts': 'ts' },
  alias: {
    '@shared': path.resolve(root, 'shared')
  }
};

await build({
  entryPoints: [path.resolve(serverDir, 'auth.ts')],
  ...common,
});

await build({
  entryPoints: [path.resolve(serverDir, 'routes.ts')],
  ...common,
});

console.log('Bundled server into api/_server');

