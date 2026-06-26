#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const templateDir = path.join(root, 'template');
const helpFlags = new Set(['--help', '-h']);

function printHelp() {
  console.log(`
create-svelte-tv-app

  Interactive project generator for Svelte TV.

  Includes TypeScript, routing, ESLint, Prettier, and a tiny two-route app.

    create-svelte-tv-app
`);
}

function toPackageName(value) {
  return path
    .basename(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toAppTitle(value) {
  return value
    .trim()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toAppId(value) {
  const parts = toPackageName(value)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((part) => (/^[a-z]/.test(part) ? part : `app${part}`));

  return `com.sveltetv.${parts.join('.') || 'app'}`;
}

function toTizenPackage(value) {
  return toPackageName(value).replace(/[^a-z0-9]/g, '') || 'sveltetv';
}

function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent ?? '';

  if (userAgent.startsWith('pnpm')) return 'pnpm';
  if (userAgent.startsWith('yarn')) return 'yarn';
  if (userAgent.startsWith('bun')) return 'bun';
  return 'npm';
}

async function replaceTemplateValues(dir, values) {
  const textExtensions = new Set([
    '.gradle',
    '.html',
    '.java',
    '.js',
    '.json',
    '.ts',
    '.xml',
    '.yaml',
    '.yml',
  ]);

  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await replaceTemplateValues(entryPath, values);
      continue;
    }

    if (!textExtensions.has(path.extname(entry.name))) continue;

    let contents = await readFile(entryPath, 'utf8');

    for (const [key, value] of Object.entries(values)) {
      contents = contents.replaceAll(key, value);
    }

    await writeFile(entryPath, contents);
  }
}

function installCommand(packageManager) {
  if (packageManager === 'yarn') return ['yarn', []];
  if (packageManager === 'bun') return ['bun', ['install']];
  return [packageManager, ['install']];
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} failed`));
    });
  });
}

if (process.argv.some((arg) => helpFlags.has(arg))) {
  printHelp();
  process.exit(0);
}

if (process.argv.length > 2) {
  console.log('create-svelte-tv-app is interactive and does not accept arguments.');
  printHelp();
  process.exit(1);
}

console.log('');
console.log('Svelte TV');
console.log('Create a remote-first Svelte app.');
console.log('');

const pipedAnswers = process.stdin.isTTY
  ? []
  : readFileSync(0, 'utf8').split(/\r?\n/);
const rl = process.stdin.isTTY
  ? readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  : undefined;

async function ask(question, defaultValue = '') {
  if (!rl) {
    process.stdout.write(question);
    return (pipedAnswers.shift() ?? defaultValue).trim();
  }

  const answer = await rl.question(question).catch(() => defaultValue);
  return answer.trim();
}

const projectName = await ask('Project name: ');

if (!projectName) {
  rl?.close();
  console.error('Project name is required.');
  process.exit(1);
}

const packageManager = detectPackageManager();
const installAnswer = await ask(
  `Install dependencies with ${packageManager}? (Y/n) `,
  'yes',
);
rl?.close();

const shouldInstall = !['n', 'no'].includes(installAnswer.toLowerCase());
const targetDir = path.resolve(process.cwd(), projectName);
const packageName = toPackageName(projectName) || 'svelte-tv-app';
const appTitle = toAppTitle(projectName) || 'Svelte TV App';
const appId = toAppId(projectName);
const tizenPackage = toTizenPackage(projectName);
const existingFiles = await readdir(targetDir).catch(() => []);

if (existingFiles.length > 0) {
  console.error(`Target directory is not empty: ${targetDir}`);
  process.exit(1);
}

await mkdir(targetDir, { recursive: true });
await cp(templateDir, targetDir, {
  recursive: true,
  errorOnExist: false,
  force: false,
});

await replaceTemplateValues(targetDir, {
  __PROJECT_NAME__: packageName,
  __APP_TITLE__: appTitle,
  __APP_ID__: appId,
  __TIZEN_PACKAGE__: tizenPackage,
});

console.log('');
console.log(`Created ${packageName} at ${targetDir}`);

if (shouldInstall) {
  const [command, args] = installCommand(packageManager);
  console.log('');
  console.log(`Installing dependencies with ${packageManager}...`);
  await run(command, args, targetDir);
}

console.log('');
console.log('Next steps');
console.log(`  cd ${path.relative(process.cwd(), targetDir) || '.'}`);
if (!shouldInstall) console.log(`  ${packageManager} install`);
console.log(`  ${packageManager} run dev`);
