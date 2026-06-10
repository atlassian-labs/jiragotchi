// 👀 Sibling to PetPanel — orchestration only.
// Leaderboard tab → Custom Entities. Analytics tab → Forge SQL.
// Data loading lives in useClubhouseData; rendering lives in the tab components.

import React, { useState } from 'react';
import { useClubhouseData } from '../clubhouse/useClubhouseData.js';
import Leaderboard from '../clubhouse/Leaderboard.jsx';
import Analytics from '../clubhouse/Analytics.jsx';

export default function Clubhouse() {
  const [tab, setTab] = useState('leaderboard');
  const { leaderboard, analytics, loading } = useClubhouseData();

  return (
    <div className="container">
      <header className="hdr">
        <h1>🏆 Jiragotchi Clubhouse</h1>
        <p className="tagline">How everyone's pets are doing across the site.</p>
      </header>

      <div className="tabs">
        <button className={tab === 'leaderboard' ? 'tab active' : 'tab'} onClick={() => setTab('leaderboard')}>🏆 Leaderboard</button>
        <button className={tab === 'analytics'   ? 'tab active' : 'tab'} onClick={() => setTab('analytics')}>📊 Analytics</button>
      </div>

      {tab === 'leaderboard' && <Leaderboard rows={leaderboard} loading={loading} />}
      {tab === 'analytics'   && <Analytics   rows={analytics}   loading={loading} />}
    </div>
  );
}
