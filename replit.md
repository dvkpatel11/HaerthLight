# Hearthlight

## Overview
Hearthlight is a web application for crafting personalized, AI-generated chronicles for people who matter most. Users go through a multi-step wizard to create living messages with cinematic themes.

## Tech Stack
- **Frontend**: React + Vite + TypeScript + Framer Motion (port 5000 in dev)
- **Backend**: Node.js + Express (port 3001 in dev)
- **Storage**: Local JSON files (`server/data/chronicles.json`)
- **AI Prose**: Google Gemini 1.5 Pro
- **AI Images**: Replicate (Stable Diffusion XL)

## Project Structure
```
/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── types/
│   └── vite.config.ts
├── server/          # Express backend
│   ├── routes/
│   ├── data/        # JSON file storage
│   ├── scripts/
│   └── index.js
└── package.json     # Root package with concurrently
```

## Running
- Dev: `npm run dev` runs both client (port 5000) and server (port 3001) via concurrently
- The Vite dev server proxies `/api` requests to the Express backend

## Environment Variables
- `GEMINI_API_KEY` - Google AI Studio API key for prose generation
- `REPLICATE_API_KEY` - Replicate API key for image generation

## Architecture Decisions
- Vite configured with `host: '0.0.0.0'`, `port: 5000`, `strictPort: true`, `allowedHosts: true` for Replit compatibility
- Express CORS is open (no origin restriction) for Replit proxy compatibility
- In production, Express serves the built Vite client and listens on `0.0.0.0:5000`
