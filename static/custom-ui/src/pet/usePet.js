import { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';
import { INITIAL_HAPPINESS } from '../happiness.js';

// Single source of truth for the pet's state and the action that mutates it.
// Encapsulates:
//   - Initial load (kvs:getPet)
//   - The 'feed' action, which writes to ALL THREE storage layers in parallel:
//       1. KVS         — primary, authoritative pet state          (await)
//       2. Custom Ent  — leaderboard projection                    (fire-and-forget)
//       3. SQL         — append-only feed event for analytics      (fire-and-forget)

export function usePet() {
  const [pet, setPet] = useState({ happiness: INITIAL_HAPPINESS });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    invoke('kvs:getPet')
      .then((p) => { setPet(p); setError(null); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const feed = async () => {
    try {
      const updated = await invoke('kvs:feedPet');           // 1. KVS — authoritative
      setPet(updated);
      setError(null);
      invoke('entities:upsertPet', { happiness: updated.happiness }).catch(() => {});  // 2. Custom Entities
      invoke('sql:logFeed',        { happiness: updated.happiness }).catch(() => {});  // 3. Forge SQL
    } catch (e) {
      setError(e.message);
    }
  };

  return { pet, loading, error, feed };
}
