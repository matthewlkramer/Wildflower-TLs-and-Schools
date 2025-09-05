import { execSync } from 'child_process';

const diff = execSync('git diff --name-only HEAD^ HEAD').toString().trim().split('\n').filter(Boolean);

const paths = ['client/', 'server/', 'api/', 'shared/'];
const files = [
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'npm-shrinkwrap.json',
  'yarn.lock'
];

const hasChanges = diff.some((file) =>
  paths.some((p) => file.startsWith(p)) || files.includes(file)
);

if (hasChanges) {
  console.log('Changes detected in build-relevant files. Running build.');
  process.exit(1);
} else {
  console.log('No relevant changes found. Skipping build.');
  process.exit(0);
}
