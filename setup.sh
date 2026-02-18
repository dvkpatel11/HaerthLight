#!/usr/bin/env bash
set -euo pipefail

# Always run from repo root
cd "$(dirname "$0")"

echo "🔧 Installing root dependencies..."
npm install

echo "🔧 Installing server dependencies..."
npm --prefix server install

echo "🔧 Installing client dependencies..."
npm --prefix client install

echo "✅ Dependencies installed."

echo
echo "You can now start both server and client with:"
echo "  npm run dev"