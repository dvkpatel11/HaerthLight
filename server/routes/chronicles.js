import express from 'express';
import { nanoid } from 'nanoid';
import { getChronicle, saveChronicle, logView, getViewCount } from '../storage.js';

export const chroniclesRouter = express.Router();

// Create / save a chronicle
chroniclesRouter.post('/', async (req, res) => {
  try {
    const {
      recipient,
      occasion,
      narrative,
      narrativeContext,
      theme,
      prose,
      imageUrl,
      animationUrl,
    } = req.body;

    if (!prose) return res.status(400).json({ error: 'prose is required' });

    const chronicle = {
      id: nanoid(),
      slug: nanoid(10),
      creatorToken: nanoid(32),
      recipient,
      occasion,
      narrative,
      narrativeContext: narrativeContext || null,
      theme,
      prose,
      imageUrl: imageUrl || null,
      animationUrl: animationUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveChronicle(chronicle);

    res.json({
      slug: chronicle.slug,
      creatorToken: chronicle.creatorToken,
      shareUrl: `/c/${chronicle.slug}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save chronicle' });
  }
});

// Get a chronicle by slug (public)
chroniclesRouter.get('/:slug', async (req, res) => {
  try {
    const chronicle = await getChronicle(req.params.slug);
    if (!chronicle) return res.status(404).json({ error: 'Not found' });

    // Strip creator token from public response
    const { creatorToken, ...publicData } = chronicle;
    res.json(publicData);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Log a view
chroniclesRouter.post('/:slug/view', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    // Simple hash — not cryptographic, just for privacy
    const ipHash = Buffer.from(ip).toString('base64').slice(0, 16);
    await logView(req.params.slug, ipHash);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get stats (requires creatorToken)
chroniclesRouter.get('/:slug/stats', async (req, res) => {
  try {
    const chronicle = await getChronicle(req.params.slug);
    if (!chronicle) return res.status(404).json({ error: 'Not found' });

    const token = req.headers['x-creator-token'];
    if (token !== chronicle.creatorToken) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const views = await getViewCount(req.params.slug);
    res.json({ views, createdAt: chronicle.createdAt });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
