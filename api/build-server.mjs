import { build } from 'esbuild';
import path from 'node:path';
import url from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Try to locate the repo root and the /server + /shared dirs from various bases
const projectRoot = process.cwd(); // usually points to repoRoot/api when Root Directory=api

function findDir(dirName) {
  const bases = [projectRoot, __dirname];
  const ups = ['.', '..', '../..', '../../..', '../../../..'];
  for (const base of bases) {
    for (const up of ups) {
      const candidate = path.resolve(base, up, dirName);
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  throw new Error(`Could not locate ${dirName} from ${projectRoot}`);
}

const serverDir = findDir('server');
const sharedDir = findDir('shared');
const outDir = path.resolve(__dirname, '_server');

const common = {
  platform: 'node',
  format: 'cjs',
  bundle: true,
  sourcemap: false,
  outdir: outDir,
  outExtension: { '.js': '.cjs' },
  external: [],
  loader: { '.ts': 'ts' },
  alias: {
    '@shared': sharedDir
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
