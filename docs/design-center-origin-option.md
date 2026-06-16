# Design: opt-in centered marker origin (webarkit-testing#38)

Library change in `WebARKitLib` (branch off `webarkit/WebARKitLib:dev` in the
`kalwalt/WebARKitLib` fork → PR to `webarkit:dev`). Verified against the static +
webcam Teblid examples (webarkit/webarkit-testing).

## Understanding Summary

- **What:** an **opt-in** option so the tracked pose **origin is the marker
  centre** instead of the reference image's top-left corner. With it on, AR
  content placed at `(0,0,0)` sits in the middle of the marker.
- **Why:** webarkit-testing#38 — content currently anchors at the top-left
  corner. Centring is the intuitive AR placement.
- **Who:** WebARKit example / app developers.
- **Default:** OFF (opt-in) — preserves today's behaviour for all consumers.

## ArtoolkitX investigation (the maintainer's question: does it already center?)

Checked the full ArtoolkitX OCVT chain — **it never centers anywhere**:

| Layer | What it does |
|---|---|
| `TrackingPointSelector` | `pt3d = cv::Point3f(x, y, 0)` — raw top-left pixels (identical to WebARKit). The extra `(width0,height0)` ctor args feed `_scalef`/`ScaleFeatures3d` = a real-world **size scale**, not a centre offset. |
| `PlanarTracker` | emits the corner-origin pose; `GetTrackablePose` gated on `_isDetected\|\|_isTracking`. |
| `ARTrackable2d::updateWithTwoDResults` | Y,Z **column** negation (WebARKit already mirrors) + translation **scale** `m_twoDScale/m_refImageX`. **No `+width/2` offset.** |
| Example `draw.cpp` (`drawCube`) | `pose · scale(40) · translate(0,0,0.5)` — only a **+Z lift**; cube sits at the **corner**. |

**Conclusion:** WebARKit's current corner placement already matches ArtoolkitX.
Centring is a genuine WebARKit enhancement → justifies **default OFF** for parity.

## Decision Log

| Decision | Alternatives | Why |
|---|---|---|
| Library-side origin centring (Option 2) | Per-example `box.position` offset (Option 1) | Consistent across all consumers; sidesteps the scaled-translation/unscaled-rotation quirk (origin is the one consistent anchor); no per-example offset tuning. |
| **Default OFF (opt-in)** | Default ON (opt-out) | ArtoolkitX never centres + zero change for existing consumers; examples opt in. |
| **Runtime setter** `setOriginCentered(bool)` | `initTracker` parameter; `TrackingPointSelector` ctor param | Flexible, minimal one-bool surface, mirrors how other options are exposed. |
| Offset **only the 3D `solvePnP` object points** | Offset the shared object points | The 2D points feed matching/template/homography in **image space** and must NOT move; only the pose origin should shift. |
| Read dims from `_pattern.size` | Add new `refCols/refRows` members | Already populated at `initTracker` (`_pattern.size = cv::Size(refCols, refRows)`). |

## Final Design

### Mechanism
At pose time in `WebARKitTrackerImpl::processFrame` (the `_isDetected || _isTracking`
block), after gathering the object points:

```cpp
std::vector<cv::Point3f> objPoints = _trackSelection.GetTrackedFeatures3d();
if (_centerOrigin) {
    const float cx = _pattern.size.width  * 0.5f;
    const float cy = _pattern.size.height * 0.5f;
    for (auto& p : objPoints) { p.x -= cx; p.y -= cy; }
}
// ... cameraPoseFromPoints(objPoints, imgPoints, ...)
```

Offsetting the object points moves the solved translation `t` to the marker
centre and leaves the rotation `R` unchanged → orientation unaffected, only the
anchor moves. The 2D `imgPoints` and all matching/template/homography paths are
untouched.

### API plumbing (one bool, threaded through the chain)
- `WebARKitTrackerImpl`: `bool _centerOrigin = false;` + `setCenterOrigin(bool)`.
- `WebARKitTracker`: `setOriginCentered(bool)` → impl.
- `WebARKitManager`: `setOriginCentered(bool)` → tracker.
- `WebARKitJS` (`emscripten/`): `setOriginCentered(bool)` + `bindings.cpp` binding.
- `src/WebARKitController.js`: `setOriginCentered(bool)` → `this.webarkit.setOriginCentered(b)`.

### Example usage (no offset math needed)
```js
// after init, before/while processing:
wark.setOriginCentered(true);
// box stays at (0,0,0.3): now centred on the marker, lifted on +Z.
```
Both the static and webcam examples call it; the cube + axes then anchor at the
marker centre with no other change.

## Testing
1. **Static + webcam examples** with `setOriginCentered(true)`: cube/axes sit at
   the marker **centre** (not the corner), correctly oriented; `(0,0,0.3)` lifts
   on +Z as before.
2. **Default (no call / false):** unchanged — content at the top-left corner
   (regression check).
3. Toggling at runtime moves the anchor between corner and centre.

## Risks
- **Minimal.** Pure additive option; default path byte-unchanged. Only risk is
  threading the bool correctly through the 5 layers + the binding (mechanical).
- Centring uses the reference **pixel** centre; if real-world size scaling is
  added later (ArtoolkitX `width0/height0`), the centre offset must scale with it
  — noted, out of scope here.

## Non-goals
- Changing the default behaviour.
- ArtoolkitX real-world-size scaling (`ScaleFeatures3d`).
- The scaled-translation / unscaled-rotation quirk (orthogonal; untouched).
- Per-example offset approach (rejected in favour of the library option).
