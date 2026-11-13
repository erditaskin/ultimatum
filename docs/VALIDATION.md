# Validation log

This log describes the running legacy prototype. Karbasan screen concepts are not implemented or device-validated. The design-only update preserves application code and existing saves.

## Automated checks

- Strict TypeScript compilation.
- Engine tests: merge immutability, invalid moves, chain deduplication, low-level protection, reward claiming, spending, empty rights/full board, maximum level, save validation, Power Hour boundary refill and cap.
- Engine benchmark: 10,000 runs after 1,000 warmups; 36 level-5 machines. Initial macOS Node 22.23.5 p50 0.0096 ms, p95 0.0123 ms. This excludes React rendering, native animation, persistence and device FPS.

## Dependency audit

Initial SDK 58 installation reports three moderate findings in the Expo fingerprint/minimatch tool chain (GHSA-g3hv-75wg-m249). npm proposes a major downgrade to Expo 52; it is not applied because it would invalidate the selected SDK. Recheck upstream before release. No claim of zero vulnerabilities is made.

## Release gates

A production release needs physical-device interaction/performance checks, accessible interaction review, balance testing, branding/icon assets, signing and privacy/store metadata. Offline campaign timing uses device time, not a trusted server clock. Campaign schedule is empty until actual dates are selected.

## Toolchain findings

- Expo Doctor: 20/20 after declaring `expo-asset` directly.
- Debug native build succeeded with one upstream Expo `CoreModule` access-level warning.
- The first native binary predated Router installation; its missing `ExpoGlassEffect` error required regenerating native dependencies.
- Concurrent package installation while Metro was running caused inconsistent module reads. A clean `npm ci` restored startup. Dependency installation and Metro must run sequentially.
- Docker owns local port 8081 on this machine. Development scripts use 8082; the native debug build must use the same port.

## Simulator interaction checks

Device Hub, iPhone 17 Pro simulator (iOS 26.3.1):

- A 100 ms tap selected a machine without exploding it.
- Production consumed two rights; rights later refilled to the cap.
- Tap-to-target merging and empty-cell movement worked.
- Dragging initially exposed zero final relative translation on a fast gesture. Absolute start/end coordinates fixed the drop; dragging two level-1 Pofs produced a level-2 Pof.
- A three-machine chain awarded 600 points, unlocked the 500-point mission, and retained its result after relaunch.
- Claiming awarded 100 gold, advanced to mission 2 and carried 100 excess points forward.
- Workshop transformation spent 100 gold, changed the workshop to stage 2, and set the next price to 175.
- Sound settings toggled correctly.
- Audio playback initially exposed a native read-only `playbackRate` property despite its TypeScript declaration. Using `setPlaybackRate` and isolating optional audio errors fixed it. A subsequent long press awarded 100 points and returned to play without a runtime error.
- The workshop can also be opened directly from the gold balance, without scrolling away from the board.

Development React Profiler initially reported p95 commit duration 11.4 ms over 120 commits. This is simulator development rendering cost, not release FPS or physical-device GPU timing.

Final simulator relaunch retained workshop stage 2, score 700, mission 2 progress 200/750, gold 0 and the refilled production capacity. The on-device JavaScript blast timer reported approximately 1.05 ms for a single-machine explosion in the simulator. Subsequent 120-commit React p95 was 12.2 ms. No physical-device FPS claim is inferred from these values.

## Physical build

An automatically signed Release build for the connected iPhone 13 Pro (iOS 27.2) succeeded and installed successfully. This build embeds its JavaScript bundle and does not need Metro. The first launch request was denied because the device was locked; interactive validation requires the owner to unlock it.

## 13 November 2026 — approved art and mixed-family board

- Added the approved neon wordmark, hot-pink K / lime P icon, transparent sprite atlas, pastel pink/lilac interface and family-specific effects.
- All three families now coexist on one board. No family tabs or appearance selection remain.
- V2 save migration retained the existing user's score 800, mission progress 300/750 and workshop stage 2 on first load. Original V1 data remains as recovery data.
- Fourteen engine tests pass, including rejecting cross-family merges, preserving family on merge/production, cross-family chain propagation, malformed family rejection and migration.
- macOS engine benchmark (36 level-5 pieces, 10,000 runs): p50 0.0103 ms, p95 0.0118 ms. These remain engine timings, not rendered FPS.
- Initial development React p95 with the new artwork was 33–37 ms. Selection handlers were stabilized afterward to avoid rebuilding every cell's gesture on selection. Release FPS and physical-device performance remain unmeasured.
- Native simulator build succeeded. The KP icon was visually verified on the Home Screen.
- A separate `KatlaPatla-Visual-QA` simulator was used for destructive gameplay checks, leaving the user's main simulator progress alone.
- UI smoke test: dragging two matching packets produced level 2; attempting to merge level-3 packet and pepper was rejected; long-pressing the packet triggered the neighboring pepper and awarded 300 total points while the low-level packet remained.
- UI smoke test: two graphite capsules became steel; two steel capsules became a spring capsule. Long press exploded it and added 100 points without a runtime error.
- Explosion waves now have 550 ms presentation, with 650 ms for the final wave, so the 550 ms visual effects can complete. Reduced-motion presentation remains short.
- Phone deployment/testing was intentionally deferred until the user approves the simulator.

After stable selection callbacks were applied, subsequent development React p95 batches were approximately 11.2–16.9 ms with the new art. These samples include two running simulators and are not release frame-rate measurements. QA packet/pepper and cosmic blast calculations measured approximately 0.55 ms and 0.057 ms respectively.
