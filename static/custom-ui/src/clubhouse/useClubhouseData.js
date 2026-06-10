import { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';

// Loads both clubhouse datasets in parallel:
//   - leaderboard:  entities:getLeaderboard  (Custom Entities, sorted by happiness DESC)
//   - analytics:    sql:getDailyAnalytics    (Forge SQL,       7-day daily rollup)

export function useClubhouseData() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      invoke('entities:getLeaderboard', { limit: 10 }),
      invoke('sql:getDailyAnalytics'),
    ])
      .then(([lb, an]) => { setLeaderboard(lb ?? []); setAnalytics(an ?? []); })
      .catch(() => { /* leave empty */ })
      .finally(() => setLoading(false));
  }, []);

  return { leaderboard, analytics, loading };
}
