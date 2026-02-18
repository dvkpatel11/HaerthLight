import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Replicate from 'replicate';
import { THEMES } from '../routes/generate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const publicRoot = path.join(repoRoot, 'client', 'public');

const replicateApiKey = process.env.REPLICATE_API_KEY;

if (!replicateApiKey) {
  console.error('REPLICATE_API_KEY is not set in server/.env; cannot generate assets.');
  process.exit(1);
}

const replicate = new Replicate({ auth: replicateApiKey });

// SDXL model used previously in the project for backgrounds
const MODEL = 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b';

const backgroundTasks = Object.entries(THEMES).map(([id, cfg]) => ({
  id,
  kind: 'background',
  prompt: cfg.imagePrompt,
  outPath: path.join(publicRoot, 'assets', 'backgrounds', `${id}.webp`),
}));

const textureTasks = [
  {
    id: 'parchment',
    kind: 'texture',
    prompt:
      'subtle parchment paper texture, warm ivory, fine grain, no text, no watermark, seamless, soft lighting, high resolution',
    outPath: path.join(publicRoot, 'assets', 'textures', 'parchment.webp'),
  },
  {
    id: 'mist',
    kind: 'texture',
    prompt:
      'soft atmospheric mist overlay, transparent edges, gentle light bloom, no people, no text, seamless, cinematic lighting',
    outPath: path.join(publicRoot, 'assets', 'textures', 'mist.webp'),
  },
  {
    id: 'light-rays',
    kind: 'texture',
    prompt:
      'subtle light rays overlay, diagonal beams, very soft, transparent background, no people, no text, cinematic, high resolution',
    outPath: path.join(publicRoot, 'assets', 'textures', 'light-rays.webp'),
  },
];

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDirFor(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

async function generateAndSaveImage(prompt, outPath) {
  console.log(`→ Generating image for ${outPath}`);
  await ensureDirFor(outPath);

  const output = await replicate.run(MODEL, {
    input: {
      prompt,
      negative_prompt: 'text, watermark, logo, low quality, people, faces, cartoon',
      width: 1344,
      height: 768,
      num_inference_steps: 30,
      guidance_scale: 7.5,
    },
  });

  const imageUrl = Array.isArray(output) ? output[0] : output;
  if (!imageUrl) {
    throw new Error('Replicate did not return an image URL');
  }

  const res = await fetch(imageUrl);
  if (!res.ok) {
    throw new Error(`Failed to download image from ${imageUrl}: ${res.status} ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(outPath, buffer);

  console.log(`✓ Wrote ${outPath}`);
}

async function main() {
  const tasks = [...backgroundTasks, ...textureTasks];

  for (const task of tasks) {
    const exists = await fileExists(task.outPath);
    if (exists) {
      console.log(`⏭  Skipping ${task.kind} "${task.id}" (already exists).`);
      continue;
    }

    try {
      await generateAndSaveImage(task.prompt, task.outPath);
    } catch (err) {
      console.error(`✗ Failed to generate ${task.kind} "${task.id}":`, err);
    }
  }

  console.log('Done seeding visual assets.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

