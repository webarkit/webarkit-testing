# Design: restore detection-side pyramid downsampling (WebARKitLib#44, part A)

Library change in `WebARKitLib` (branch off `webarkit/WebARKitLib:dev` in the
`kalwalt/WebARKitLib` fork → PR to `webarkit:dev`). Verified against the static
(2000×1500) + webcam (640×480) Teblid examples.

This is **part A** of #44 (perf). Part B (the detection *guard* — skip detection
while tracking) is a separate follow-up PR with its own design.

## Understanding Summary

- **What:** detect frame features on a `pyrDown`'d `detectionFrame` instead of the
  full-resolution frame, then rescale matched keypoints back to full-frame
  coordinates via `_featureDetectScaleFactor`. Mirrors ArtoolkitX OCVT
  `PlanarTracker::ProcessFrame`.
- **Why:** detection currently runs full-res **every frame** — expensive on HD.
  Downsampling cuts detection cost on frames larger than `featureImageMinSize`.
  It is also the *proper* fix for #43: the keypoint rescale becomes correct
  because detection is genuinely downsampled, replacing the `_featureDetectScaleFactor = 1`
  workaround from `c1ae096`.
- **Who:** HD consumers (the 2000×1500 static example; future HD webcam). 640×480
  webcams are unaffected (pyrLevel 0).
- **Constraints:** must not regress #43 (localization), #38 (centered origin),
  #46 (tracking-loss). 640×480 path stays byte-identical.

## ArtoolkitX reference (verified via `gh api`)

`Source/ARX/OCVT/PlanarTracker.cpp`:
- ctor: `_featureDetectPyrLevel = min(floor(log2(frameX)-log2(minW)), floor(log2(frameY)-log2(minH)))`,
  `_featureDetectScaleFactor = CalcPyrDownScaleFactor(...)` (exact pyrDown factor).
- `ProcessFrame`: build `detectionFrame` by `pyrDown` ×`_featureDetectPyrLevel`;
  `CreateFeatureMask(detectionFrame)`; `DetectFeatures(detectionFrame, mask)`;
  `MatchFeatures` rescales matched keypoints `*= _featureDetectScaleFactor`.
- `CreateFeatureMask`: bbox `/_featureDetectScaleFactor` (mask is in downsampled
  space).
- **Reference features** (`AddMarker`, line ~726): detected on `_image[0]` —
  **full-resolution reference, not downsampled.** Only the live frame is
  downsampled; the ref/frame scale asymmetry is inherent and handled by the
  multi-scale descriptors + the homography.

## Decision Log

| Decision | Alternatives | Why |
|---|---|---|
| Two sequential PRs: (A) downsampling, then (B) guard | Both in one PR; A only | Different risk profiles; the guard was historically "unstable" (likely the pre-#46 optical-flow gate); clean attribution if a regression appears. |
| Keep `featureImageMinSize = 640×480` | Larger floor (e.g. 1280×720) | ArtoolkitX default; 640×480 unaffected; it's what the `_featureDetectScaleFactor` machinery was designed around. Optical flow still refines on full-res, so pose precision is largely retained. |
| Reference detection stays full-res (unchanged) | Downsample the reference too | Matches ArtoolkitX (`_image[0]`); WebARKit already does this; avoids touching `initTracker`. |
| Exact iterative scale factor `(x+1)/2` | `2^pyrLevel` | Matches `cv::pyrDown`'s integer rounding; avoids sub-pixel drift in the rescale. |
| Restore downsampling + rescale + mask divide **together** | Restore piecemeal | They are a matched set; splitting them is exactly how #43 happened (rescale without downsampling). |

## Final Design — four edits to `WebARKitTracker.cpp`

### 1. Members + `initialize()`
Re-add `int _featureDetectPyrLevel;` and `cv::Vec2f _featureDetectScaleFactor;`
(init `0` / `(1,1)` in the ctor). In `initialize()` compute pyrLevel from
`featureImageMinSize` (clamped ≥ 0) and the exact scale factor via the iterative
`(x+1)/2` loop.

### 2. `processFrame()` — detect on the downsampled frame
```cpp
cv::Mat detectionFrame;
if (_featureDetectPyrLevel < 1) {
    detectionFrame = frame;
} else {
    cv::Mat src = frame;
    for (int lvl = 1; lvl <= _featureDetectPyrLevel; lvl++) {
        cv::pyrDown(src, detectionFrame, cv::Size(0, 0));
        src = detectionFrame;
    }
}
cv::Mat featureMask = createFeatureMask(detectionFrame);
if (!extractFeatures(detectionFrame, featureMask, frameKeyPts, frameDescr)) { ... }
```

### 3. `MatchFeatures()` — rescale matched frame keypoints to full-frame coords
```cpp
for (auto& kp : finalMatched1) {
    kp.pt.x *= _featureDetectScaleFactor[0];
    kp.pt.y *= _featureDetectScaleFactor[1];
}
```
Applied before `getHomographyInliers`, so the homography maps reference-coords →
full-frame coords (the optical-flow/pose paths already work in full-frame space).

### 4. `createFeatureMask()` — mask in downsampled space
Built on the passed (downsampled) `detectionFrame` (already `frame.size()`); restore
the bbox `/_featureDetectScaleFactor` divide so the masked-out tracked region lands
in downsampled coordinates matching the mask.

**Unchanged:** reference detection (full-res), optical flow + `solvePnP` (full-res),
`_isDetected || _isTracking` gate (#46), centered-origin offset (#38). Detection
still runs **every frame** (the guard is part B).

## Testing strategy

1. **640×480 webcam** — pyrLevel 0 ⇒ `detectionFrame == frame` ⇒ byte-identical
   behavior. Regression check.
2. **2000×1500 static** — pyrLevel 1 ⇒ detect on ~1000×750. Verify:
   - still acquires + tracks; content centered (#38) and right-handed (#42/#46);
   - **no 2× doubling** (#43) — the match centroid should sit on the pinball
     panel, not bottom-right;
   - tracking-loss still flips to "not found" when the marker leaves (#46);
   - worker FPS / detection cost improves.
3. **Match count** — confirm downsampled detection still yields enough matches to
   lock (fewer features at half-res).

## Risks
- **Rescale/detection desync → #43-style doubling.** Mitigated by restoring all
  three pieces together (ArtoolkitX design) and the centroid check.
- **Fewer features on downsampled HD** → weaker match. If it fails to lock,
  options: nudge `featureImageMinSize` up, or raise `TEBLID_MAX_FEATURES`.
- **`createFeatureMask` exclusion** only fires when `_isDetected`; with detection
  every-frame, `_isDetected` is reset each frame so the exclusion rarely triggers —
  low risk, and it becomes properly meaningful once part B (the guard) lands.

## Non-goals
- The detection **guard** (`_currentlyTrackedMarkers < _maxNumberOfMarkersToTrack`) — part B.
- ArtoolkitX's template-matching pyramid array (`_trackSelection[level]`) — WebARKit
  keeps a single-level selection.
