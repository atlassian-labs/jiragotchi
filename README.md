# Jiragotchi

[![Atlassian license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat-square)](LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

A digital pet for your Jira project. Feed it to keep it happy.

Built as a live-coding demo for **Atlas Camp 2026 (Bengaluru)** to show off Forge's storage capabilities.

The same simple app is rebuilt three times using three different Forge storage primitives, so you can see the trade-offs side-by-side:

| Step | Storage primitive | What it adds |
|------|-------------------|--------------|
| 1 | **KVS** (Key-Value Store) | Persist this project's pet across page reloads |
| 2 | **Custom Entities** | Indexed leaderboard of the happiest pets across all projects |
| 3 | **Forge SQL** | Time-series analytics: daily feed counts and average happiness |


## Usage

Each demo step has two git tags:

- `step-N-<name>-start` — empty skeleton, ready to live-type from
- `step-N-<name>-done` — fully implemented, working

```bash
git checkout step-0-scaffold              # nothing wired up yet
git checkout step-1-kvs-start             # start typing KVS code
git checkout step-1-kvs-done              # working KVS state
git checkout step-2-entities-start
git checkout step-2-entities-done
git checkout step-3-sql-start
git checkout step-3-sql-done              # final state (same as main)
```

## Installation

### Prerequisites

Follow our guide to [Prepare to build your first Forge app|https://developer.atlassian.com/platform/forge/getting-started/#before-you-begin] to ensure your local development environment is setup correctly. 

### Building

To build and deploy a version of this app yourself, run the following commands:

* `forge register` - to associate a new copy of this app with your developer space
* `npm install` - to install project dependencies
* `cd static/custom-ui && npm install && npm run build && cd ../..` - to build the UI resources for the app
* `forge deploy` - to deploy the app to Forge's development environment
* `forge install` - to run an interactive wizard to install the app in your Atlassian Jira instance.

Then open any Jira project and look for:
- **Jiragotchi** in the issue panel sidebar
- **Jiragotchi Clubouse** in the **Apps* menu in the Jira navigation menu.

## Documentation

Press the `Feed Pet` button on the Jira issue to feed your space's pet and keep it happy.

The Custom Entities and SQL demos look empty until there's data across multiple projects. Use the seed web trigger:

```bash
forge webtrigger
# pick "seed-leaderboard", copy the URL, then:
curl -X POST '<that-url>'
```

## Tests

* There are no tests for this repo currently. 

## Contributions

Contributions to Jiragotchi are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

Copyright (c) [2026] Atlassian US., Inc.
Apache 2.0 licensed, see [LICENSE](LICENSE) file.

<br/>

[![With â¤ï¸ from Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-cheers.png)](https://www.atlassian.com)
