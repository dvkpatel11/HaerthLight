import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { chroniclesRouter } from './routes/chronicles.js';
import { generateRouter } from './routes/generate.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

app.use('/api/chronicles', chroniclesRouter);
app.use('/api/generate', generateRouter);

app.get('/health', (_, res) => res.json({ ok: true }));

if (isProduction) {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (_, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const host = isProduction ? '0.0.0.0' : 'localhost';
app.listen(PORT, host, () => {
  console.log(`🕯️  Hearthlight server running on http://${host}:${PORT}`);
});
