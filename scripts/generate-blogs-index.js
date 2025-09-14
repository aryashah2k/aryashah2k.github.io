#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const BLOGS_DIR = path.join(ROOT, 'blogs');
const INDEX_PATH = path.join(BLOGS_DIR, 'index.json');

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => f.toLowerCase().endsWith('.md'))
    .map(f => path.join(dir, f));
}

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}

function extractTitleAndDescription(md) {
  const lines = md.split(/\r?\n/);
  let title = '';
  let desc = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!title && /^#\s+/.test(line)) {
      title = line.replace(/^#\s+/, '').trim();
      // find first non-empty following line as description
      for (let j = i + 1; j < lines.length; j++) {
        const l2 = lines[j].trim();
        if (l2) { desc = l2; break; }
      }
      break;
    }
  }
  if (!title) {
    // fallback: use first non-empty line
    const first = lines.find(l => l.trim());
    title = (first || 'Untitled').replace(/^#+\s*/, '').slice(0, 120);
  }
  if (!desc) {
    // fallback: short snippet of content
    const content = lines.join(' ').replace(/\s+/g, ' ').trim();
    desc = content.slice(0, 160);
  }
  return { title, description: desc };
}

function gitLastCommitDate(filePath) {
  try {
    const out = execSync(`git log -1 --format=%cI -- "${filePath}"`, { encoding: 'utf8' }).trim();
    return out || null;
  } catch {
    return null;
  }
}

function main() {
  const files = listMarkdownFiles(BLOGS_DIR);
  const items = files.map(fp => {
    const md = readFileSafe(fp);
    const { title, description } = extractTitleAndDescription(md);
    const slug = path.basename(fp).replace(/\.md$/i, '');
    const date = gitLastCommitDate(path.relative(ROOT, fp));
    return {
      slug,
      title,
      description,
      date: date || undefined,
      thumbnail: undefined
    };
  });

  // sort by date desc if present, else by title
  items.sort((a, b) => {
    if (a.date && b.date) return a.date < b.date ? 1 : -1;
    if (a.date) return -1;
    if (b.date) return 1;
    return (a.title || '').localeCompare(b.title || '');
  });

  const json = JSON.stringify(items, null, 2) + '\n';
  if (!fs.existsSync(BLOGS_DIR)) fs.mkdirSync(BLOGS_DIR, { recursive: true });

  const prev = readFileSafe(INDEX_PATH);
  if (prev.trim() === json.trim()) {
    console.log('No changes in blogs/index.json');
    return;
  }

  fs.writeFileSync(INDEX_PATH, json, 'utf8');
  console.log('Updated blogs/index.json with', items.length, 'items');
}

if (require.main === module) {
  main();
}
