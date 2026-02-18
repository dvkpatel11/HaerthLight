import type { WizardState, Chronicle } from '../types';

const BASE = '/api';

export async function generateProse(state: Omit<WizardState, 'prose' | 'imageUrl'>): Promise<string> {
  const res = await fetch(`${BASE}/generate/prose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Prose generation failed');
  }
  const { prose } = await res.json();
  return prose;
}

export async function generateImage(theme: string): Promise<string> {
  const res = await fetch(`${BASE}/generate/image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Image generation failed');
  }
  const { imageUrl } = await res.json();
  return imageUrl;
}

export async function saveChronicle(
  state: WizardState
): Promise<{ slug: string; creatorToken: string; shareUrl: string }> {
  const res = await fetch(`${BASE}/chronicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  });
  if (!res.ok) throw new Error('Failed to save chronicle');
  return res.json();
}

export async function fetchChronicle(slug: string): Promise<Chronicle> {
  const res = await fetch(`${BASE}/chronicles/${slug}`);
  if (!res.ok) throw new Error('Chronicle not found');
  return res.json();
}

export async function logView(slug: string): Promise<void> {
  await fetch(`${BASE}/chronicles/${slug}/view`, { method: 'POST' });
}

export async function fetchStats(
  slug: string,
  creatorToken: string
): Promise<{ views: number; createdAt: string }> {
  const res = await fetch(`${BASE}/chronicles/${slug}/stats`, {
    headers: { 'x-creator-token': creatorToken },
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}
