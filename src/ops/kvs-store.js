// Step 1 — Forge KVS
// Skeleton — fill in the storage calls live.
//
// Each pet is stored as a single key→value record.

import { kvs } from '@forge/kvs';
import { feedHappiness, INITIAL_HAPPINESS } from '../shared/happiness.js';

const petKey = (projectId) => `pet:${projectId}`;

export async function getPet(projectId) {
  // TODO: read with kvs.get(petKey(projectId))
  return { projectId, happiness: INITIAL_HAPPINESS, lastFedAt: null };
}

export async function feedPet(projectId) {
  // TODO: read, bump, write with kvs.set
  return {
    projectId,
    happiness: feedHappiness(INITIAL_HAPPINESS),
    lastFedAt: new Date().toISOString(),
  };
}
