// Demo data web trigger — "demo magic".
//
// All the seeding/clearing logic lives HERE so the files you live-code during
// the demo (ops/kvs-store.js, ops/entity-store.js, ops/sql-store.js) stay clean
// and focused on the storage story. This file is intentionally not part of the
// walkthrough — it just gets the stage ready.
//
// Three actions, selected via the URL path (Forge exposes trailing path
// segments as `request.userPath`):
//
//   .../<base>/leaderboard   → seed Custom Entities leaderboard data
//   .../<base>/sql           → seed ~7 days of Forge SQL feed events
//   .../<base>/clear         → wipe KVS + Custom Entities + SQL to a clean state
//
// To keep the demo ops files pristine, this trigger talks to the storage SDKs
// (@forge/kvs, @forge/sql) directly rather than adding seed/clear helpers to
// them. Duplication is fine — it's demo scaffolding, not production code.

import { kvs, WhereConditions } from '@forge/kvs';
import { SEED_PETS } from './shared/seed-data.js';

// @forge/sql is imported lazily (only inside the sql/clear branches) so this
// trigger stays safe at checkpoints where SQL isn't provisioned yet (step 2).
const loadSql = async () => (await import('@forge/sql')).default;

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': ['application/json'] },
  body: JSON.stringify(body),
});

const petKey = (projectId) => `pet:${projectId}`;
const Pet = kvs.entity('pet');

// --- leaderboard: seed Custom Entities --------------------------------------
async function seedLeaderboard() {
  for (const pet of SEED_PETS) {
    await Pet.set(pet.projectId, {
      projectId: pet.projectId,
      happiness: pet.happiness,
      lastFedAt: new Date().toISOString(),
    });
  }
  return SEED_PETS.length;
}

// --- sql: seed ~7 days of feed events ---------------------------------------
async function seedFeedEvents() {
  const sql = await loadSql();
  // Make sure the table exists (mirrors the ensureSchema probe in sql-store).
  try {
    await sql.executeRaw('SELECT 1 FROM feed_events LIMIT 1');
  } catch {
    await sql.executeRaw(`
      CREATE TABLE IF NOT EXISTS feed_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id VARCHAR(255) NOT NULL,
        happiness_after INT NOT NULL,
        fed_at DATETIME NOT NULL,
        INDEX idx_fed_at (fed_at)
      )
    `);
  }

  let inserted = 0;
  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    const feedsThatDay = 3 + Math.floor(Math.random() * 6); // 3–8 feeds/day
    for (let i = 0; i < feedsThatDay; i++) {
      const projectId = SEED_PETS[Math.floor(Math.random() * SEED_PETS.length)].projectId;
      const happiness = 20 + Math.floor(Math.random() * 80);
      await sql
        .prepare(
          'INSERT INTO feed_events (project_id, happiness_after, fed_at) ' +
          'VALUES (?, ?, DATE_SUB(NOW(), INTERVAL ? DAY))'
        )
        .bindParams(projectId, happiness, daysAgo)
        .execute();
      inserted++;
    }
  }
  return inserted;
}

// --- clear: wipe everything to a clean state --------------------------------
async function clearAll() {
  let kvsCleared = 0;
  const results = await kvs.query()
    .where('key', WhereConditions.beginsWith('pet'))
    .getMany();

  if (results?.results?.length > 0) {
    console.log(`${results.results.length} entities to delete`);
    const itemsToDelete = results.results.map((item) => {
      return {
        key: item.key
      }
    });

    const deleteResult = await kvs.batchDelete(itemsToDelete);
    kvsCleared = deleteResult.successfulKeys.length;
  }

  // Custom Entities CAN be enumerated via an index — clear them thoroughly.
  let entitiesCleared = 0;
  let cursor;
  do {
    let q = Pet.query().index('leaderboard').limit(100);
    if (cursor) q = q.cursor(cursor);
    const page = await q.getMany();
    for (const row of page.results) {
      await Pet.delete(row.key);
      entitiesCleared++;
    }
    cursor = page.nextCursor;
  } while (cursor);

  // SQL: drop all feed events (ignore if SQL isn't provisioned / table absent).
  try {
    const sql = await loadSql();
    await sql.executeRaw('DELETE FROM feed_events');
  } catch {
    /* SQL not provisioned yet, or table not created — nothing to clear */
  }

  return { kvs: kvsCleared, entities: entitiesCleared, sql: 'ok' };
}

export const handler = async (request) => {
  const action = String(
    request?.queryParameters?.type?.[0] ?? request?.userPath ?? ''
  )
    .replace(/^\/+/, '')
    .trim()
    .toLowerCase();

  try {
    switch (action) {
      case 'leaderboard':
      case 'entities':
        return json(200, { action: 'leaderboard', seeded: await seedLeaderboard() });

      case 'sql':
        return json(200, { action: 'sql', seeded: await seedFeedEvents() });

      case 'clear':
        return json(200, { action: 'clear', cleared: await clearAll() });

      default:
        return json(400, {
          error: 'Unknown action',
          received: action || '(none)',
          usage: 'Append /leaderboard, /sql, or /clear to the trigger URL.',
        });
    }
  } catch (err) {
    return json(500, { error: String(err?.message ?? err), action });
  }
};
