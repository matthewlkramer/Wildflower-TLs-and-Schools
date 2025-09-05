import { build } from 'esbuild';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Use cwd to be robust within Vercel's build sandboxes
const projectRoot = process.cwd(); // points to repoRoot/api when Root Directory=api
const repoRoot = path.resolve(projectRoot, '..');
const serverDir = path.resolve(repoRoot, 'server');
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
    '@shared': path.resolve(repoRoot, 'shared')
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
