// 👀 Pure storage operations for the Custom Entities layer.
//
// Custom Entities give us indexed, sortable, paginated queries over typed records.
// We declared the schema in manifest.yml under app.storage.entities.
//
// The 'leaderboard' index has happiness as its range key, so .sort(Sort.DESC)
// returns the happiest pets first — natively, no in-memory sort.

import { kvs, Sort } from '@forge/kvs';

const Pet = kvs.entity('pet');

export async function upsertPet(projectId, happiness) {
  await Pet.set(projectId, {
    projectId,
    happiness,
    lastFedAt: new Date().toISOString(),
  });
}

export async function getTopHappiest(limit = 10) {
  const result = await Pet.query()
    .index('leaderboard')
    .sort(Sort.DESC)
    .limit(limit)
    .getMany();
  return result.results.map((row) => ({
    projectId: row.value.projectId,
    happiness: row.value.happiness,
    lastFedAt: row.value.lastFedAt,
  }));
}
