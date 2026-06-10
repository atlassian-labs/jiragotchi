// Step 1 — Forge KVS (not yet implemented)
import { INITIAL_HAPPINESS } from '../shared/happiness.js';
export const getPet  = async (projectId) => ({ projectId, happiness: INITIAL_HAPPINESS, lastFedAt: null });
export const feedPet = async (projectId) => ({ projectId, happiness: INITIAL_HAPPINESS, lastFedAt: null });
