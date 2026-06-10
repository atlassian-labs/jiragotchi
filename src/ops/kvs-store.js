// 👀 Pure storage operations for the KVS layer.
// This is the file we live in when talking about KVS.
//
// Each pet is stored as a single key→value record. KVS gives us:
//   - kvs.get(key)  → undefined or stored value
//   - kvs.set(key, value)  → upsert
//   - kvs.delete(key)
//
// What it doesn't give us: querying across keys. That's why step 2 exists.

import { kvs } from '@forge/kvs';
import { feedHappiness, INITIAL_HAPPINESS } from '../shared/happiness.js';

const petKey = (projectId) => `pet:${projectId}`;

export async function getPet(projectId) {
  const stored = await kvs.get(petKey(projectId));
  return {
    projectId,
    happiness: stored?.happiness ?? INITIAL_HAPPINESS,
    lastFedAt: stored?.lastFedAt ?? null,
  };
}

export async function feedPet(projectId) {
  const stored = await kvs.get(petKey(projectId));
  const next = {
    happiness: feedHappiness(stored?.happiness),
    lastFedAt: new Date().toISOString(),
  };
  await kvs.set(petKey(projectId), next);
  return { projectId, ...next };
}
