// Seed data for the leaderboard demo. Pre-baked.
// Used by the web trigger / dev-tools to populate fake pets across fake projects,
// so the Custom Entities / SQL leaderboards aren't empty during the demo.
//
// projectId values follow real Jira project key conventions:
// SHOUTING_CAPS, 2-10 chars, alphanumeric, no separators.

export const SEED_PETS = [
  { projectId: 'PLAT',    happiness: 98 },  // Platform team — pet thrives
  { projectId: 'MOBILE',  happiness: 91 },
  { projectId: 'GROWTH',  happiness: 84 },
  { projectId: 'DESIGN',  happiness: 77 },
  { projectId: 'BILLING', happiness: 65 },
  { projectId: 'SRE',     happiness: 52 },
  { projectId: 'LEGACY',  happiness: 38 },  // poor old Legacy
  { projectId: 'INTERN',  happiness: 25 },  // interns forgot to feed
  { projectId: 'OPS',     happiness: 70 },
  { projectId: 'DATA',    happiness: 58 },
];
