import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'chronicles.json');

async function ensureDb() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify({ chronicles: [] }, null, 2));
  }
}

export async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(DB_FILE, 'utf-8');
  return JSON.parse(raw);
}

export async function writeDb(data) {
  await ensureDb();
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

export async function getChronicle(slug) {
  const db = await readDb();
  return db.chronicles.find(c => c.slug === slug) || null;
}

export async function saveChronicle(chronicle) {
  const db = await readDb();
  const existing = db.chronicles.findIndex(c => c.id === chronicle.id);
  if (existing >= 0) {
    db.chronicles[existing] = chronicle;
  } else {
    db.chronicles.push(chronicle);
  }
  await writeDb(db);
  return chronicle;
}

export async function logView(slug, ipHash) {
  const db = await readDb();
  if (!db.views) db.views = [];
  db.views.push({ slug, ipHash, viewedAt: new Date().toISOString() });
  await writeDb(db);
}

export async function getViewCount(slug) {
  const db = await readDb();
  if (!db.views) return 0;
  return db.views.filter(v => v.slug === slug).length;
}
