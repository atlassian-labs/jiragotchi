// Step 3 — Forge SQL resolvers.
// Thin glue: receive the invoke, hand off to ops/sql-store.js.

import { logFeed, getDailyAnalytics } from '../ops/sql-store.js';
import { projectFromContext } from '../shared/context.js';

export function registerSqlResolvers(resolver) {
  resolver.define('sql:logFeed', ({ payload, context }) =>
    logFeed(projectFromContext(context, payload?.projectId), payload.happiness)
  );

  resolver.define('sql:getDailyAnalytics', () => getDailyAnalytics());
}
