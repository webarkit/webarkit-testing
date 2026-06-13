# Design: declare tracking lost when the marker leaves the frame (WebARKitLib#46)

Library change in `WebARKitLib` (branch off `webarkit/WebARKitLib:dev` in the
`kalwalt/WebARKitLib` fork → PR to `webarkit:dev`). Verified against the merged
webcam Teblid example (webarkit/webarkit-testing#37).

## Understanding Summary

- **What:** make the OCVT tracker declare tracking *lost* when the marker leaves
  the frame, so `isValid()` / the `getMarker` event stop emitting `found` with a
  stale, frozen pose.
- **Why:** continuous (webcam/video) consumers currently show AR content frozen
  on screen indefinitely after the marker is gone (#46; observed in the webcam
  example as a "Marker tracked" status that never clears).
- **Root cause:** the loss-detection logic already exists inside
  `runOpticalFlow()` — when `updateTrackableHomography()` cannot fit a homography
  from the tracked points it resets `_isDetected`/`_isTracking`/`_valid` and
  returns false. But `runOpticalFlow()` is only called from a block gated by
  `if (_isDetected)`. Once the marker leaves, `MatchFeatures` fails →
  `_isDetected = false` → the block is skipped → optical flow never runs →
  `_isTracking`/`_valid` keep their last `true` value → `found` forever.

## Assumptions

- `GetInitialFeatures()` / `GetTrackedFeaturesWarped()` persist between frames and
  remain valid in the tracking-only path; existing guards
  (`updateTrackableHomography`'s `matchedPoints1.size() > 4`, the pose block's
  `imgPoints.size() >= 4`) prevent degenerate runs. *(verify in implementation)*
- Acceptable loss latency: ~1–2 frames after the marker leaves (one optical-flow
  failure cycle).
- **Performance:** negligible. Optical flow already runs every frame while the
  marker is detected; this only adds optical-flow runs during exit/dropout frames
  (when `_isTracking` is true but `_isDetected` is false).
- **Reliability:** false-"lost" risk is low — continuation still requires a valid
  bidirectional-checked optical-flow homography (the same quality bar tracking
  already uses).
- **Scope:** `WebARKitLib` only; needs `npm run build` + `npm run build-es6`;
  no example changes required (the webcam example already maps `not found` →
  hidden content + "Searching…").

## Decision Log

| Decision | Alternatives | Why |
|---|---|---|
| **Scope = minimal:** run optical flow on `_isDetected \|\| _isTracking` | (Option 2) also add a confidence gate (template-match `TM_SQDIFF_NORMED` correlation, homography inlier ratio, homography sanity) to catch drift-onto-background | One-condition change, directly fixes the reported bug, lowest regression risk on the working tracker. YAGNI on drift-robustness → documented follow-up. |
| Reuse the existing reset path in `runOpticalFlow`/`updateTrackableHomography` | Add a separate explicit "lost" transition + `clear_output()` | The reset already happens on optical-flow failure; `resetTracking()` already calls `clear_output()` each frame, so no extra clearing is needed. |
| Verify via the webcam example (visual) | Add a C++ unit test | Loss detection is a multi-frame runtime behavior; a gtest would need a synthetic frame sequence (out of scope). Visual verification with the live example is sufficient. |

## Final Design

### The change (`WebARKitTracker.cpp`, `resetTracking()`)

The optical-flow block is currently:

```cpp
if (_isDetected) {
    if (_frameCount > 0 && _prevPyramid.size() > 0) {
        ... runOpticalFlow(...) ...  // refine with template matching
    }
}
```

Change the guard to also run while tracking:

```cpp
if (_isDetected || _isTracking) {
    if (_frameCount > 0 && _prevPyramid.size() > 0) {
        ... runOpticalFlow(...) ...
    }
}
```

### Behavior after the change

- **Marker present, detected:** unchanged — optical flow runs as before.
- **Marker present, detection hiccup** (`_isDetected=false`, `_isTracking=true`):
  optical flow now runs, succeeds, updates the pose → smoother tracking (bonus;
  previously the pose froze for that frame).
- **Marker leaves** (`_isDetected=false`, `_isTracking=true`): optical flow runs,
  its points fail the bidirectional check / can't fit a homography →
  `updateTrackableHomography` returns false → `runOpticalFlow` resets
  `_isDetected`/`_isTracking`/`_valid=false` → `isValid()` is false → the
  controller does not dispatch `getMarker` → worker emits `not found` → the
  example hides content and shows "Searching…". Latency ~1–2 frames.
- **Marker absent, not tracking** (`_isDetected=false`, `_isTracking=false`):
  block skipped (as today); pose not computed; `not found`.

### Testing strategy

1. **Webcam example** (`threejs_teblid_webcam_ES6_example.html`): acquire the
   marker → status "Marker tracked", cube/axes shown. Remove the marker from view
   → within ~1–2 frames the status returns to "Searching for marker…" and the
   cube/axes disappear. Re-introduce the marker → re-acquires.
2. **Regression:** with the marker continuously in view, tracking stays stable
   (no spurious "lost" flicker) and the pose is at least as smooth as before.
3. **Static example** (`threejs_teblid_static_image_ES6_example.html`): still
   tracks the still image (one-shot path unaffected).

## Risks

- **False "lost" while present:** if optical flow is momentarily poor on a
  present marker it could blip to `not found`. Mitigated by the existing
  bidirectional + homography-validity bar; acceptable for this fix. If observed,
  the Option-2 confidence gate (follow-up) is the place to add hysteresis.
- **Selection validity in the tracking-only path:** confirm the points used by
  optical flow are populated when entering via `_isTracking` (not just freshly
  detected). Guards prevent crashes; verify no empty-vector edge case.
- **Interplay with every-frame detection (#44):** detection still runs every
  frame; this fix is independent of, and compatible with, restoring the
  detection guard/downsampling later.

## Non-goals (follow-ups)

- Drift-onto-background robustness / confidence gating (Option 2) — possible
  later layer on #46 or its own issue.
- Restoring downsampling + detection guard for performance — webarkit/WebARKitLib#44.
- Centering AR content on the marker — webarkit/webarkit-testing#38.
