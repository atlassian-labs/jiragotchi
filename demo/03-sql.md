## Implementing Forge SQL

### Setup

1. Show the analytics tab (but it's empty!)

### Add SQL capablity

1. Open `manifest.yml` and add SQL module (what does this do?):

```yaml
modules:
  sql:
    - key: main
      engine: mysql
```

2. Stop tunnel, `forge deploy`
3. Run `forge install --upgrade` [if needed]
4. Run `./tunnel.sh`

### Implement SQL queries

1. Open `sql-store.js`

2. Add imports 

```js
import sql, { migrationRunner } from '@forge/sql';
```

3. Declare static SQL queries and explain them:

```js
const SQL = {
  createFeedEvents: `
    CREATE TABLE IF NOT EXISTS feed_events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id VARCHAR(255) NOT NULL,
      happiness_after INT NOT NULL,
      fed_at DATETIME NOT NULL,
      INDEX idx_fed_at (fed_at)
    )
  `,

  probeFeedEvents: 'SELECT 1 FROM feed_events LIMIT 1',

  insertFeedEvent:
    'INSERT INTO feed_events (project_id, happiness_after, fed_at) VALUES (?, ?, NOW())',

  dailyAnalytics: `
    SELECT
      DATE(fed_at)               AS day,
      COUNT(*)                   AS feeds,
      ROUND(AVG(happiness_after)) AS avg_happiness
    FROM feed_events
    WHERE fed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY DATE(fed_at)
    ORDER BY day DESC
  `,
};
```

4. Implement `ensureSchema`:

```js
// NOTE: ⚠️ This is not an appropriate production-ready solution. 
// Follow the Forge SQL tutorial to learn about robust schema migrations: https://developer.atlassian.com/platform/forge/storage-reference/sql-tutorial
async function ensureSchema() {
  try {
    await sql.executeRaw(SQL.probeFeedEvents);
  } catch {
    await migrationRunner
      .enqueue('v001_create_feed_events', SQL.createFeedEvents)
      .run();
  }
}
```

5. Implement SQL write:

```js
export const logFeed = async (projectId, happiness) => {
  await ensureSchema();
  await sql
    .prepare(SQL.insertFeedEvent)
    .bindParams(projectId, happiness)
    .execute();
}
```

6. Implement SQL query:

```js
export const getDailyAnalytics = async() => {
  await ensureSchema();
  const result = await sql.executeRaw(SQL.dailyAnalytics);
  return result.rows ?? [];
}
```

### Demo functionality

1. Open browser and feed a pet

2. Run `./setData.sh sql

3. Go to Clubhouse and show Analytics feed

4. Show SQL management features in Developer Console
