import React from 'react';

export default function Analytics({ rows, loading }) {
  return (
    <div className="list-pane">
      <h2>Daily feeds + average happiness (last 7 days)</h2>
      {loading && <p className="muted">Loading…</p>}
      {!loading && rows.length === 0 && (
        <p className="muted">No analytics yet. Feed a few pets and come back!</p>
      )}
      <ul className="analytics">
        {rows.map((row, i) => (
          <li key={i}>
            <strong>{row.day}</strong>
            <span className="pill">{row.feeds} feeds</span>
            <span className="pill pill-mood">avg {row.avg_happiness}/100</span>
          </li>
        ))}
      </ul>
      <p className="muted">
        Powered by <strong>Forge SQL</strong> —{' '}
        <code>SELECT DATE(fed_at), COUNT(*), AVG(...) GROUP BY DATE(fed_at)</code>
      </p>
    </div>
  );
}
