# Katla Patla

Offline-first iOS merge-and-chain puzzle built with Expo and TypeScript.

## Current design direction

The next product direction is Karbasan, a snowy fantasy mining and jewelry workshop. The [screen review package](design/karbasan/README.md) contains the selected C logo, gameplay reference and 21 additional screen/state concepts. See the [implementation sequence](docs/IMPLEMENTATION_PLAN.md) and [current product decisions](docs/PRODUCT.md). Application code still runs the earlier packet/pepper/capsule prototype; the new designs have not been implemented. Earlier explorations are preserved under `design/archive/`.

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

The running prototype's original Imagegen prompts remain in `docs/art-prompts.md`. Its V2 saves preserve V1 progress while assigning the formerly generic pieces stable families. Current visual direction is linked from `docs/ART_DIRECTION.md`; new screen-generation prompts are in `design/karbasan/PROMPTS.md`.
