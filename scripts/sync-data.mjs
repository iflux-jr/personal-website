import { access, cp, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const fromRoot = (...segments) => path.join(root, ...segments);

function toProjectPath(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, '/');
}

async function ensureDirs() {
  await Promise.all([
    mkdir(fromRoot('public', 'book-covers'), { recursive: true }),
    mkdir(fromRoot('public', 'bookmark-covers'), { recursive: true }),
    mkdir(fromRoot('src', 'data'), { recursive: true }),
  ]);
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyOptionalSource(source, target, options = {}) {
  if (!(await exists(source))) {
    console.log(`Skipped missing optional source: ${toProjectPath(source)}`);
    return;
  }

  await cp(source, target, {
    force: true,
    ...options,
  });
}

async function copyOptionalJsonSource(source, target, fallback) {
  if (!(await exists(source))) {
    console.log(`Skipped missing optional source: ${toProjectPath(source)}`);
    await writeFile(target, `${JSON.stringify(fallback, null, 2)}\n`, 'utf8');
    return;
  }

  await cp(source, target, { force: true });
}

async function syncData() {
  await ensureDirs();

  await copyOptionalSource(
    fromRoot('data', 'output', 'book-covers'),
    fromRoot('public', 'book-covers'),
    {
      recursive: true,
      errorOnExist: false,
      verbatimSymlinks: false,
    }
  );

  await copyOptionalSource(
    fromRoot('data', 'output', 'bookmark-covers'),
    fromRoot('public', 'bookmark-covers'),
    {
      recursive: true,
      errorOnExist: false,
      verbatimSymlinks: false,
    }
  );

  await copyOptionalJsonSource(
    fromRoot('data', 'output', 'books.json'),
    fromRoot('src', 'data', 'books.json'),
    {
      lastUpdated: null,
      count: 0,
      aktiv: [],
      merkliste: [],
      abgeschlossen: {},
    }
  );

  await copyOptionalJsonSource(
    fromRoot('data', 'output', 'bookmarks.json'),
    fromRoot('src', 'data', 'bookmarks.json'),
    {
      lastUpdated: null,
      count: 0,
      items: [],
    }
  );
}

await syncData();
