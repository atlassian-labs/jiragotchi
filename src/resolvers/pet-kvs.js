// Step 1 — Forge KVS resolvers.
// Thin glue: receive the invoke, hand off to ops/kvs-store.js.

import { getPet, feedPet } from '../ops/kvs-store.js';
import { projectFromContext } from '../shared/context.js';

export function registerKvsResolvers(resolver) {
  resolver.define('kvs:getPet',  ({ context }) => getPet( projectFromContext(context)));
  resolver.define('kvs:feedPet', ({ context }) => feedPet(projectFromContext(context)));
}
