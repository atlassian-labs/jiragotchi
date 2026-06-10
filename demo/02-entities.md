## Implementing Custom Entities

### Setup

1. Demo the clubhouse module (but it's empty!)

### Declare entity schema

1. Open `manifest.yml` and add schema to `app: storage: element`

```yaml
app:
  storage:
    entities:
      - name: pet
        attributes:
          projectId: { type: string }
          happiness: { type: integer }
          lastFedAt: { type: string }
        indexes:
          - name: leaderboard
            range: [happiness]
```

2. Stop tunnel (and explain why)
3. Run `forge deploy && ./tunnel.sh`
5. Explain what's happening: Entity schema is provisioned and indices are built asynchronously (in production must be defensive)

### Implement custom entities read/write

1. Open `entity-store.js`
2. Define Pet entity:

```js
import {kvs, Sort} from '@forge/kvs';
const Pet = kvs.entity('pet');
```

3. Implement upsert:

```js
export const upsertPet = async (projectId, happiness) => {
  await Pet.set(projectId, {
    projectId,
    happiness,
    lastFedAt: new Date().toISOString(),
  });
}
```

4. Implement load:

```js
const LEADERBOARD_LIMIT = 10;
export const getTopHappiest = async() => {
  
  const result = await Pet.query()
    .index('leaderboard')
    .sort(Sort.DESC)
    .limit(LEADERBOARD_LIMIT)
    .getMany();
  
  return result.results.map((row) => ({
    projectId: row.value.projectId,
    happiness: row.value.happiness,
    lastFedAt: row.value.lastFedAt,
  }));
}
```

### Demo

1. Load sample data via `./setData.sh entities`

2. Run `forge storage entities indexes list -e development` to show the index has been provisioned. 

3. NOTE: Indices are permanent in production!

4. Feed the pet to generate some sample data. 

5. Load the clubhouse and show the leaderboard working!

6. What we achieved

7. What next? Load up `03-sql.md` 
