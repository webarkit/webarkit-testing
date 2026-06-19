# Design: skip detection while tracking (WebARKitLib#44, part B)

Library change in `WebARKitLib` (branch off `webarkit/WebARKitLib:dev` in the
`kalwalt/WebARKitLib` fork → PR to `webarkit:dev`). Follows part A
(detection-side pyramid downsampling, merged in webarkit/WebARKitLib#52).

## Understanding Summary

- **What:** stop running feature detection (`extractFeatures` + descriptor
  matching via `MatchFeatures`) on every frame. Run it only while the marker is
  **not** currently tracked; once optical flow holds a lock, rely on optical
  flow + template matching to maintain the pose.
- **Why:** detection is the dominant per-frame cost (TEBLID/ORB detect+compute
  plus k-NN matching against the reference descriptors). In the steady tracking
  state that work is redundant — optical flow already produces the pose. This is
  the second half of #44 (perf); part A cut the cost of each detection, part B
  removes most detections entirely.
- **Who:** every consumer once a marker is acquired (webcam + static). Bigger
  win on HD where detection is most expensive.
- **Constraints:** must not regress re-acquisition (#46 tracking-loss →
  re-detect), the centered origin (#38), or localization (#43/#42). The
  static-image example (same frame fed repeatedly) must still acquire and hold.

## ArtoolkitX reference

`Source/ARX/OCVT/PlanarTracker.cpp::ProcessFrame` runs detection only when
`_currentlyTrackedMarkers < _maxNumberOfMarkersToTrack`, then runs optical flow
+ template matching for the already-tracked markers. Part B applies the same
"don't detect while tracking" principle.

## Decision Log

| Decision | Alternatives | Why |
|---|---|---|
| Guard the detection block with `if (!_isTracking)` | `if (_currentlyTrackedMarkers < _maxNumberOfMarkersToTrack)` (ArtoolkitX-literal) | `_isDetected` is reset to `false` at the top of every frame, and on the **first** detection frame optical flow is skipped (`_frameCount == 0`), so the marker is *detected* but not yet *tracking*. A counter-based guard would then see `_currentlyTrackedMarkers == _max` on the next frame and skip **both** detection and optical flow (gate is `_isDetected \|\| _isTracking`, both false) → permanent freeze. This is guaranteed in the static-image example, which feeds the same frame repeatedly. Gating on `_isTracking` re-detects until optical flow actually holds a lock, then skips. |
| Keep detection running every frame until `_isTracking` (not just `_isDetected`) | Skip after first `_isDetected` | `_isTracking` is the real "optical flow has a lock" signal; `_isDetected` is a single-frame match flag. Skipping on `_isDetected` alone reintroduces the first-frame freeze. |
| Leave `_currentlyTrackedMarkers` as-is (cosmetic) | Make it a clean 0/1 and guard on it | The counter increments in `MatchFeatures` every frame a match succeeds and only decrements on loss, so it is not a clean tracked-count today. Fixing it is orthogonal to the guard and carries its own risk; out of scope for part B. Noted as a possible cleanup (see Non-goals). |

## Final Design — one guarded block in `processFrame()`

Wrap the detection block (downsampled `detectionFrame` build →
`createFeatureMask` → `extractFeatures` → `MatchFeatures`) in `if (!_isTracking) { … }`.

```cpp
_isDetected = false;            // reset each frame (unchanged)

if (!_isTracking) {
    // part A downsampling + detection + match (unchanged body)
    cv::Mat detectionFrame = /* pyrDown × _featureDetectPyrLevel */;
    cv::Mat featureMask = createFeatureMask(detectionFrame);
    extractFeatures(detectionFrame, featureMask, frameKeyPts, frameDescr);
    if (frameKeyPts.size() > minRequiredDetectedFeatures)
        MatchFeatures(frameKeyPts, frameDescr);
}

// unchanged: optical flow + template (gated on _isDetected || _isTracking)
// unchanged: solvePnP pose (gated on _isDetected || _isTracking)
```

**Unchanged:** the optical-flow/template gate `_isDetected || _isTracking`
(so while tracking, `_isTracking` keeps optical flow running — including #46's
loss detection), the pose path, the centered-origin offset (#38), and part A's
downsampling/rescale.

### State walk-through (single marker)

| Frame | `_isTracking` in | Detection? | Result |
|---|---|---|---|
| 0 (acquire) | false | yes | match → `_isDetected=true`; OF skipped (`_frameCount==0`) → `_isTracking` stays false |
| 1 | false | yes | match again; OF runs (`_frameCount>0`) → `_isTracking=true` |
| 2…N (hold) | true | **no** | OF + template maintain pose; detection skipped (the win) |
| loss | true→false | — | OF/template fail → `_isTracking=false`, `_valid=false` (#46) |
| N+1 (re-acquire) | false | yes | detection resumes |

## Testing strategy

1. **Static image (1920×1440, pyrLevel 1)** — must still acquire and hold
   `Marker tracked!`; confirm it does **not** freeze after the first frames
   (this is the case the counter-guard would break).
2. **Webcam (640×480)** — acquire, occlude/remove marker → flips to "not found"
   (#46 still works), then re-acquires when shown again.
3. **Perf** — worker FPS / per-frame time improves in the steady tracking state
   (detection skipped); compare against part A baseline.
4. **No regression** — content centered (#38), right-handed (#42/#46), no
   #43-style doubling.

## Risks

- **Re-acquisition latency:** one frame after loss (detection resumes next
  frame) — negligible.
- **Drift while tracking without re-detection:** optical flow + template
  matching already refine every frame; this is exactly how ArtoolkitX operates.
  If long-term drift appears, a future option is periodic re-detection every N
  frames — not needed now.
- **First-frame ordering:** handled by gating on `_isTracking` (see decision
  log); verified by the static-image test.

## Non-goals

- Cleaning up `_currentlyTrackedMarkers` into a true 0/1 tracked count
  (cosmetic; not used for control flow once the guard is on `_isTracking`).
- Multi-marker tracking / `_maxNumberOfMarkersToTrack > 1`.
- Periodic re-detection while tracking.
