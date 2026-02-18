# 🕯️ Hearthlight

> Craft living, personalized chronicles for the people who matter most.

## Stack

- **Frontend**: React + Vite + TypeScript + Framer Motion
- **Backend**: Node.js + Express
- **Storage**: Local JSON files (`server/data/chronicles.json`)
- **AI Prose**: Google Gemini 1.5 Pro
- **AI Images**: Replicate (Stable Diffusion XL)

## Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and add your API keys:
- **GEMINI_API_KEY** → [Google AI Studio](https://aistudio.google.com/app/apikey)
- **REPLICATE_API_KEY** → [Replicate](https://replicate.com/account/api-tokens)

### 3. Run

```bash
npm run dev
```

Opens:
- Frontend → http://localhost:5173
- API → http://localhost:3001

## Flow

```
/           → Landing page
/create     → 5-step wizard
  Step 1    → Recipient (name, age, relationship)
  Step 2    → Occasion (type + date)
  Step 3    → Narrative (tone, memory, traits, notes)
  Step 4    → Theme (5 cinematic options)
  Step 5    → Preview, edit, regenerate, share
/c/:slug    → Recipient view (cinematic, animated)
```

## Data

Chronicles are stored at `server/data/chronicles.json`. Each entry is a full snapshot — nothing depends on mutable config.

Creator tokens are stored in `localStorage` under `hl_token_<slug>`. The creator can see view stats when visiting their chronicle link.

## Notes

- No auth required. No accounts. Pure shareable links.
- Image generation is gracefully degraded — if Replicate fails, the chronicle still works.
- All themes have per-theme accent colors, particle colors, and overlay gradients on the recipient view.
