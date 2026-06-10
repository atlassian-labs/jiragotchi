// 👀 Pure storage operations for the Forge SQL layer.
//
// We use SQL for what SQL is best at: append-only event logs and rollup queries.
// GROUP BY, AVG, DATE() — things KVS and Custom Entities can't do natively.
//
// Schema lives at the top so the storage code reads like a story.

import sql, { migrationRunner } from '@forge/sql';

// All the SQL strings used by this file. Resolver bodies stay focused on flow.
const SQL = {
  probeFeedEvents: 'SELECT 1 FROM feed_events LIMIT 1',
  createFeedEvents: `
    CREATE TABLE IF NOT EXISTS feed_events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id VARCHAR(255) NOT NULL,
      happiness_after INT NOT NULL,
      fed_at DATETIME NOT NULL,
      INDEX idx_fed_at (fed_at)
    )
  `,
  insertFeedEvent:
    'INSERT INTO feed_events (project_id, happiness_after, fed_at) VALUES (?, ?, NOW())',
  dailyAnalytics: `
    SELECT
      DATE(fed_at)               AS day,
      COUNT(*)                   AS feeds,
      ROUND(AVG(happiness_after)) AS avg_happiness
    FROM feed_events
    WHERE fed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY DATE(fed_at)
    ORDER BY day DESC
  `,
};

// Ensure the feed_events table exists before we touch it.
//
// Fast path: probe the table with a trivial read. If it succeeds, we're done —
// we keep the migration runner OFF the critical path for every invocation.
// Slow path (first time only): the probe throws because the table is missing,
// so we run the migration runner to create it (CREATE TABLE IF NOT EXISTS keeps
// it defensive under races). We don't cache a "has it run?" flag, because these
// functions are serverless: that flag would be lost on cold start and wouldn't
// be shared across concurrent invocations anyway.
//
// NOT production-ready: doing schema creation lazily on a read is fine for a demo,
// but in production you'd run migrations on app install via a scheduledTrigger
// (see Forge SQL "Manage your database schema" docs), not on the request path.
async function ensureSchema() {
  try {
    await sql.executeRaw(SQL.probeFeedEvents);
  } catch {
    await migrationRunner
      .enqueue('v001_create_feed_events', SQL.createFeedEvents)
      .run();
  }
}

export async function logFeed(projectId, happiness) {
  await ensureSchema();
  await sql
    .prepare(SQL.insertFeedEvent)
    .bindParams(projectId, happiness)
    .execute();
}

export async function getDailyAnalytics() {
  await ensureSchema();
  const result = await sql.executeRaw(SQL.dailyAnalytics);
  return result.rows ?? [];
}
