# Ultimatum

Repository: https://github.com/erditaskin/ultimatum

Offline-first iOS merge-and-chain puzzle built with Expo and TypeScript.

## Current design direction

Karbasan is the playable snowy mining and jewelry workshop. Merge eight ore families on one 6×8 board, break ready ore into bars, craft jewelry and fulfill NPC orders. Gold upgrades the workshop or buys energy. Mana enables protected chain combos.

See [implemented rules and validation limits](docs/KARBASAN_IMPLEMENTATION.md), [architecture](docs/ARCHITECTURE.md), [production plan](docs/KARBASAN_BUILD_PLAN.md), and [approved visual references](design/karbasan/README.md). Earlier prototypes and art explorations remain in the archive; their saves are untouched.

## Run

```sh
npm ci
npm run ios
```

Use Node 22.13+ (a project-local Node 22 binary is included in development dependencies). See `docs/PRODUCT.md` for Turkish product rules and `docs/ARCHITECTURE.md` for architecture. The initial build is a playable prototype, not an App Store release.

## Verify

```sh
npm run typecheck
npm test
npm run lint
npm run verify:assets
npm run benchmark:karbasan
```

Development uses port 8082 to avoid this machine's Docker service on 8081. Install dependencies before starting Metro; do not run package installation alongside the bundler. For a standalone offline build, use a Release configuration; a Debug build still needs Metro even though gameplay and persistence are offline.

`docs/ci-workflow.example.yml` is an optional GitHub Actions template. It is not activated: the current GitHub OAuth credential cannot publish workflow files. Local validation commands remain available without extra account permissions.

The earlier prototype and its V1/V2 saves remain isolated from the new Karbasan V3 save slot. Current visual direction is linked from `docs/ART_DIRECTION.md`; new screen-generation prompts are in `design/karbasan/PROMPTS.md`.
