# Katla Patla

Offline-first iOS merge-and-chain puzzle built with Expo and TypeScript.

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
npm run benchmark
```

Development uses port 8082 to avoid this machine's Docker service on 8081. Install dependencies before starting Metro; do not run package installation alongside the bundler. For a standalone offline build, use a Release configuration; a Debug build still needs Metro even though gameplay and persistence are offline.

`docs/ci-workflow.example.yml` is an optional GitHub Actions template. It is not activated: the current GitHub OAuth credential cannot publish workflow files. Local validation commands remain available without extra account permissions.
