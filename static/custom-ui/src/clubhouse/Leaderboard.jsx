import React from 'react';
import { happinessToEmoji } from '../happiness.js';

export default function Leaderboard({ rows, loading }) {
  return (
    <div className="list-pane">
      <h2>Top 10 happiest pets across all projects</h2>
      {loading && <p className="muted">Loading…</p>}
      {!loading && rows.length === 0 && (
        <p className="muted">No pets yet. Visit any Jira issue, find the Jiragotchi card, and feed your pet to join the leaderboard.</p>
      )}
      <ol className="leaderboard">
        {rows.map((row, i) => (
          <li key={i} className={`lb-row rank-${i + 1}`}>
            <span className="rank">#{i + 1}</span>
            <span className="row-emoji">{happinessToEmoji(row.happiness)}</span>
            <span className="row-name">{row.projectId}</span>
            <span className="row-score">{row.happiness}/100</span>
          </li>
        ))}
      </ol>
      <p className="muted">Powered by <strong>Forge Custom Entities</strong> — native indexed sort, no in-memory sorting needed.</p>
    </div>
  );
}
