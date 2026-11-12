# Validation log

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
