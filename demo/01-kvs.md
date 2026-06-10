## Implementing Forge KVS

### Prep

1. `nvm use`
2. `rm -rf ./node_modules`
3. `rm -rf ./static/custom-ui/build`
4. `rm -rf ./static/custom-ui/node_modules`
5. `git checkout step-3-sql-done` 
6. `npm install` (Install all deps up front)
5. `git checkout step-1-kvs-start`
7. `cd ./static/custom-ui`
8. `npm install && npm run build`
9. `cd ../..`
10. `forge deploy`
11. `forge install --upgrade --site joe-clark-demo.atlassian.net`
12. Ensure two terminal windows open in root, `nvm use` in both.
13. Open 1 browser window on Jira site - `https://joe-clark-demo.atlassian.net/`
14. Open 1 browser window on Dev Console - `https://developer.atlassian.com/console/myapps/fc400b8e-f0c4-4085-8144-384d098adcee/overview`
15. Run `./setData.sh clear`

### Setup

1. Run 
```bash
./tunnel.sh
```

2. While tunnel is starting, demo the app's existing UI.

### Explain UI structure

1. Open `manifest.yml` and highlight `jira:issueContext` module. 

2. Highlight reference to `main` resource and `resolver` function

3. Open `usePet.js` React component

4. Explain `invoke` function from `@forge/bridge`

### KVS Pre-requisites

1. Open `manifest.yml` and show `storage:app` scope

### Implement backend

1. From `manifest.yml` click-through to `pet-kvs.js`

2. Explain context inputs, then jump to `kvs-store.js`

3. KVS overview

4. Highlight `@forge/kvs` import, avoiding `npm install`

5. Implement get:

```js
  // NOTE: explain petKey helper
  const stored = await kvs.get(petKey(projectId));
  // NOTE: reading & writing to KVS is always JSON
  // and resolver input/output is also always JSON
  return {
    projectId,
    happiness: stored?.happiness ?? INITIAL_HAPPINESS,
    lastFedAt: stored?.lastFedAt ?? null,
  };
```

6. Implement feed:

```js
  const stored = await kvs.get(petKey(projectId));
  const next = {
    // NOTE: examine feedHappiness helper function
    happiness: feedHappiness(stored?.happiness),
    lastFedAt: new Date().toISOString(),
  };
  await kvs.set(petKey(projectId), next);
  return { projectId, ...next };
```

7. Demo functionality working!

8. Examine values in Dev Console

9. Recap what we just built!

10. What's next? Leaderboard and why KVS isn't ideal.

11. Load up `02-entities.md`
