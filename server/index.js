import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { chroniclesRouter } from './routes/chronicles.js';
import { generateRouter } from './routes/generate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/chronicles', chroniclesRouter);
app.use('/api/generate', generateRouter);

app.get('/health', (_, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`🕯️  Hearthlight server running on http://localhost:${PORT}`);
});
