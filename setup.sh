#!/usr/bin/env bash
set -e

# Always run from repo root
cd "$(dirname "$0")"

echo "🔎 Checking Node version..."
node -v
echo

echo "🔧 Installing root dependencies..."
npm ci

echo "🔧 Installing server dependencies..."
npm --prefix server ci

echo "🔧 Installing client dependencies..."
npm --prefix client ci

echo
echo "✅ Dependencies installed successfully."
echo
echo "🚀 Start the app with:"
echo "   npm run dev"
