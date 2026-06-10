// Step 2 — Custom Entities resolvers.
// Thin glue: receive the invoke, hand off to ops/entity-store.js.

import { upsertPet, getTopHappiest } from '../ops/entity-store.js';
import { projectFromContext } from '../shared/context.js';

export function registerEntityResolvers(resolver) {
  resolver.define('entities:upsertPet', ({ payload, context }) =>
    upsertPet(projectFromContext(context, payload?.projectId), payload.happiness)
  );

  resolver.define('entities:getLeaderboard', ({ payload }) =>
    getTopHappiest(payload?.limit ?? 10)
  );
}
