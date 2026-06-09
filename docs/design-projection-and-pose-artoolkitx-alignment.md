# Design: Static-image Teblid AR example — localization, pose & projection fix (issues #30, #35, WebARKitLib#42)

> **STATUS: SOLVED ✅** — the static-image example tracks the pinball marker and
> renders AR content correctly localized, oriented and right-side-up.
>
> This top section is the **authoritative resolution**. Everything below the
> `Investigation history` divider is the original design/debate record; several
> of its hypotheses — a *projection-only* #35 fix (X+/Y−), the `GrayScale`
> Y-flip theory, and the example-side `markerFrame` / row+column pose correction
> — were **superseded** by the root cause documented here. Kept for the record.

## Headline finding

The symptom (AR content mirrored / on the wrong panel, later off-screen) looked
like one "mirror" bug but was **three independent bugs stacked**. The headline —
and the one that masked the other two for weeks — was a feature-detection
**scale-factor bug**, *not* the pose/projection conventions we first chased.
All three fixes are orthogonal; each addresses a different stage:

1. **position** — keypoint scale-factor double-application (`WebARKitTracker.cpp`)
2. **screen-X mirror** — projection X-focal sign (`WebARKitGL.cpp`)
3. **handedness** — marker-frame Y,Z column negation / D·R·D (`WebARKitPattern.cpp`)

## Fix 1 — scale-factor double-application *(root cause)* — `WebARKitTracker.cpp`

`WebARKitTrackerImpl::initialize()` derives `_featureDetectScaleFactor` from an
image-pyramid downsample level, meant to scale keypoints detected on a
*downsampled* image back up to full-frame coords. **But downsampling is
disabled** — the `pyrDown` block in `resetTracking()` is commented out and
`extractFeatures()` runs on the **full-resolution** frame. The already-full-res
matched keypoints were nevertheless multiplied by the factor in `MatchFeatures()`:

```cpp
finalMatched1[i].pt.x *= _featureDetectScaleFactor[0];
finalMatched1[i].pt.y *= _featureDetectScaleFactor[1];
```

With `featureImageMinSize = 640×480`:

| Frame | pyrLevel | factor | effect |
|---|---|---|---|
| 640×480 (typical webcam) | 0 | **1.0** | harmless — why it stayed hidden |
| 2000×1500 (this static image) | 1 | **2.0** | every matched keypoint doubled |
| 1920×1080 | 1 | 2.0 | also broken (never tested) |

Doubling the keypoints localized the marker at ~2× its true position
(bottom-right), exploded the homography, and fed `solvePnP` doubled image points
→ wrong translation → content on the wrong panel. **This is a general library
bug: any frame larger than `featureImageMinSize` is mis-localized.**

**Fix:** while detection is full-res the factor must be identity —
`_featureDetectScaleFactor = cv::Vec2f(1.0f, 1.0f)`, with the pyramid-derived
computation commented out (restore it together with the `pyrDown` detection path
if downsampled detection is ever re-enabled).

## Fix 2 — projection X-focal sign — `WebARKitGL.cpp`

`cameraProjectionMatrix` used a **negative** X focal (`-2*f_x/w`), mirroring
screen-X. The modelview already does the CV→GL handedness flip (Y,Z **row**
negation in `arglCameraViewRHf`), so the projection must be the plain pinhole
form with **both focals positive**:

```cpp
projectionMatrix[0] = 2.0f * f_x / screenWidth;   // was -2.0f
projectionMatrix[5] = 2.0f * f_y / screenHeight;  // unchanged (+)
```

gtests `TestCameraProjectionMatrix` / `CheckCameraProjectionMatrix` updated:
`[0]` → `+1.7851850084276433`.

> Supersedes the earlier #35 plan (X+/**Y−**). With WebARKit's row-negating
> modelview the correct pair is X+/**Y+** (standard GL), not ArtoolkitX's X+/Y−
> (which pairs with a *different* modelview convention).

## Fix 3 — marker-frame handedness (D·R·D) — `WebARKitPattern.cpp`

`updateTrackable()` negates the Y,Z rotation **columns** of `trans` (matching
ArtoolkitX `ARTrackable2d::updateWithTwoDResults`). With the downstream Y,Z
**row** negation in `arglCameraViewRHf` this yields `D·R·D` (`D = diag(1,−1,−1)`)
— a right-handed marker frame with **X=right, Y=up, Z=toward the viewer**, so
content at `+Z` pops up out of the marker:

```cpp
trans[j][0] =  transMat[j][0];
trans[j][1] = -transMat[j][1];
trans[j][2] = -transMat[j][2];
trans[j][3] = (transMat[j][3] * m_scale * 0.001f * 1.64f);   // translation NOT negated
```

The translation column is untouched → this **cannot move position**, only
orientation. (Earlier D·R·D attempts looked wrong only because Fix 1 was
simultaneously corrupting position.)

## How it was diagnosed (the method that cracked it)

Instrumenting the pipeline beat theorizing about conventions:

1. **`MATCH centroid` log** (`MatchFeatures`): centroid of matched reference vs
   frame keypoints read `ref(1034,908) → frame(1816,1250)` on a 2000×1500 frame,
   while the marker physically sits at ~(908,625). **(1816,1250) = 2×(908,625)**
   → exposed the scale factor.
2. **Debug overlay** (example JS, no rebuild): drew `getCorners()` (warped bbox,
   `output[9..16]`) on the tracker's actual input frame. Pre-fix the quad
   exploded off-screen; post-fix it sat tightly on the panel, corners in order →
   localization confirmed correct.
3. **Pose-log NDC math** (example JS): `matrixGL_RH` translation
   `(−1.996, 2.223, −9.094)` projected through the negative-X projection to NDC
   `(+0.39, +0.58)` (upper-right, behind the debug overlay) but corner-0 sits at
   NDC `(−0.32, +0.61)` (upper-left) → **X mirrored, Y correct**. `proj[0]→+`
   gave `(−0.39, +0.58)` ✓. The rotation columns then showed Z=−0.94 (into the
   table) → the handedness fix (#3).

| projection | ndc_x | ndc_y | cube appeared |
|---|---|---|---|
| X+ / Y− | −0.39 | −0.58 | bottom |
| X− / Y+ (old baseline) | +0.39 | +0.58 | upper-right (behind overlay) |
| **X+ / Y+ (fix)** | **−0.39** | **+0.58** | **upper-left, on the marker** ✓ |

## Final verified state

Marker correctly localized; cube + axes anchored at the marker origin (reference
top-left corner) on the panel; right-handed frame red→right, green→up,
blue→toward viewer; **no** example-side pose correction, **no** `markerFrame`
hack, **no** `GrayScale`. Diagnostics (the `MATCH centroid` log, the JS debug
overlay, the `[POSE]`/`[PROJ]` logs) were removed after verification.

## Changes / commits

WebARKitLib (`fix/pose-drd-convention`):
- **scale-factor fix** — `WebARKitTracker.cpp` — *its own commit (broad bug)*
- projection X sign + D·R·D + gtests — `WebARKitGL.cpp`, `WebARKitPattern.cpp`,
  `tests/webarkit_test.cc`

webarkit-testing (`fix/pose-drd-convention`):
- static-image example (`examples/threejs_static_image_worker_ES6.js`), rebuilt
  `build/` + `dist/`, submodule pointer bump.

---

# Investigation history (superseded in part — kept as record)

> ⚠️ The reasoning below predates the root-cause discovery above. The
> "three coordinated changes / revert #36" framing and the `GrayScale`
> Y-flip "BREAKTHROUGH" were **wrong about the static-image case** — the actual
> cause was the scale-factor bug (Fix 1). Read as history, not guidance.

## The reference chain (ArtoolkitX, webarkit/artoolkitx master)

Note: ArtoolkitX's `PlanarTracker::CameraPoseFromPoints` is identical to
WebARKit's (`solvePnPRansac` -> `Rodrigues` -> `hconcat` -> `[R|t]`, no flips).
The CV->GL conversion happens in TWO downstream steps, plus the projection:

| Step | ArtoolkitX function | Operation | Result |
|---|---|---|---|
| 1 | `ARTrackable2d::updateWithTwoDResults` | negate Y,Z **columns** of `[R\|t]` | `trans = P · D` |
| 2 | `arglCameraViewRHf` (paramGL.c) | negate Y,Z **rows** | `modelview = D · trans = D · P · D` |
| 3 | `arglCameraFrustumRHf` (paramGL.c) | X focal **+**, Y focal **−** | projection |

where `D = diag(1, -1, -1)`. Net rotation `D·P·D` (a proper similarity — the
standard CV->GL frame flip), net translation `D·t`, paired with an X+/Y−
projection. The three steps are mutually consistent.

## WebARKit's actual state

| Concern | WebARKit | vs ArtoolkitX |
|---|---|---|
| JS `arglCameraViewRHf` (row-negate Y,Z) | present | ✓ matches step 2 |
| `cameraProjectionMatrix` | X**−** / Y**+** focal | ✗ swapped vs step 3 (this is #35) |
| `updateTrackable` (Y,Z column negation) | **originally present**, **removed by #36** | ✗ #36 diverged from step 1 |
| Example consumed field | switched `pose` -> `matrixGL_RH` | ✓ (this was the real #34 fix) |

### Consequences

- The genuine #34 bug ("object behind camera") was the **example reading
  `pose`** (which lacks the step-2 row negation, so translation Z stayed
  positive). Switching to `matrixGL_RH` fixed it. **That part was correct.**
- #36 *additionally* removed the step-1 column negation. Net rotation became
  `D·P` instead of `D·P·D` — the object's Y/Z axes are left flipped. **This
  missing right-side `D` is precisely the axis tilt filed as #35.**
- The projection sign swap (X−/Y+ vs X+/Y−) is a **second, independent**
  divergence.

## Multi-agent review outcome (REVISE)

A structured review (Skeptic / Constraint Guardian / User Advocate / Arbiter)
**revised** the original "three coordinated changes, applied together" plan:

- **APPROVED:** #36 diverged from ArtoolkitX; reverting it (restore the Y,Z
  column negation) is the correct fix for the axis **orientation**, and it
  **provably cannot move position** (the translation column is never negated,
  only scaled — identical before/after the pose fix).
- **REVISED — decouple the fixes:** the projection sign flip (X+/Y−) is **not**
  bundled. Position is governed by the projection, and a prior experiment showed
  flipping `proj[0]` moved the overlay to the wrong panel. So the projection
  change is downgraded from "required" to a **separate, empirically-gated
  hypothesis**, applied/verified on its own rebuild. **One variable per rebuild.**
- **GATED:** removing the example `markerFrame` hack and updating the gtests
  happen only after the corresponding change is visually verified.
- **Open verification item:** confirm the canvas feed orientation (Y-down
  `drawImage` of `<img>`) matches the orientation ArtoolkitX assumes, before
  asserting full projection parity.

### Revised sequencing (one variable per rebuild)

1. **Revert #36** (restore column negation) in WebARKitLib. Rebuild. Verify:
   axes orientation improves (Z out, Y up), **position unchanged**. Keep the
   example reading `matrixGL_RH`.
2. **Assess axes** with the `markerFrame` hack **removed**. If orientation is
   now correct without it, drop the hack. Rebuild/verify.
3. **Only if a residual X-mirror remains:** apply the projection X+/Y− change +
   gtest updates as a **separate** step; rebuild; verify position is still on
   the marker (watch for the wrong-panel regression seen before).

## Final design — components (apply per the revised sequencing above)

### A. WebARKitLib: revert #36's pose change

Restore the ArtoolkitX-equivalent column negation in
`WebARKitPatternTrackingInfo::updateTrackable()` (keep the existing translation
scale `m_scale * 0.001f * 1.64f`, which is WebARKit's analog of ArtoolkitX's
`m_twoDScale / m_refImageX`):

```cpp
for (int j = 0; j < 3; j++) {
    trans[j][0] =  transMat[j][0];
    trans[j][1] = -transMat[j][1];   // restore: matches ARTrackable2d::updateWithTwoDResults
    trans[j][2] = -transMat[j][2];
    trans[j][3] = (transMat[j][3] * m_scale * 0.001f * 1.64f);
}
```

### B. WebARKitLib: fix the projection signs (issue #35)

In `cameraProjectionMatrix` (`WebARKitGL.cpp`), match `arglCameraFrustumRHf`
for the centered-pinhole case:

```cpp
projectionMatrix[0] =  2.0f * f_x / screenWidth;   // was -2.0f (X focal: now +)
projectionMatrix[5] = -2.0f * f_y / screenHeight;  // was +2.0f (Y focal: now -)
```

Principal-point terms `[8]`,`[9]` stay `0` (centered camera; full ArtoolkitX
parity would negate them, but it is a no-op here — out of scope).

Update the two gtests asserting these values
(`WebARKitGLTest::TestCameraProjectionMatrix`,
`WebARKitTest::CheckCameraProjectionMatrix`): `[0]` -> `+1.7851850084276433`,
`[5]` -> `-2.3802466779035241`.

### C. webarkit-testing: drop the example hack

In `examples/threejs_static_image_worker_ES6.js`, keep reading `matrixGL_RH`
but **remove** the `markerFrame` 180-degree rotation (it was compensating for
the missing step-1 `D`). After A+B the object frame should be correct directly.

## Expected result

With A+B+C, WebARKit's full chain equals ArtoolkitX's: rotation `D·P·D`,
translation `D·t`, projection X+/Y−. The static-image sphere should sit on the
marker with axes aligned to the marker edges (red=width/+X right,
green=height, blue=out toward camera) and **no** example-side rotation.

## Assumptions

1. Maintainer rebuilds WASM locally; verification is visual + iterative.
2. Regression scope: static-image example only.
3. Two repos, branched from `dev`: WebARKitLib (revert #36 + projection +
   gtests) and webarkit-testing (drop hack, rebuild artifacts, bump submodule).
4. Translation scale (`0.001 * 1.64`) is intentionally kept.

## Risks

- **Sign-composition algebra** (`D·P·D` vs `D·P`, plus projection signs) is the
  crux and is error-prone by hand -> hand off to `multi-agent-brainstorming`
  for independent verification before coding.
- Reverting a merged PR (#36) must be done as a new revert commit on a `dev`
  branch (no history rewrite).
- Empirical contingency: if A+B+C still misaligns, the residual is in the
  object-point (`pt3d`) convention or the JS `transMatToGLMat` layout -> trace
  at source, do not re-add an example hack.

## Decision Log

| Decision | Alternatives | Why |
|---|---|---|
| Trace full ArtoolkitX OCVT->render chain (not just projection) | Fix projection in isolation | Maintainer's lead: projection code is custom, not from ArtoolkitX; the pose conversion lives in ARTrackable2d, which WebARKit reimplemented |
| Revert #36 (restore Y,Z column negation) | Keep #36, compensate elsewhere | #36 diverged from `ARTrackable2d::updateWithTwoDResults`; restoring matches the reference and removes the example hack |
| Fix projection to X+/Y− | Keep X−/Y+; full ARParam delegation | Matches `arglCameraFrustumRHf` for centered pinhole; minimal, math-justified |
| Keep example on `matrixGL_RH`, drop markerFrame hack | Re-introduce a rotation | Source-correct goal; the hack was compensating for the #36 regression |
| Keep translation scale `0.001*1.64` | Replace with ArtoolkitX `m_twoDScale/m_refImageX` | Per maintainer; out of scope |
| Static-image-only regression scope | All examples | Per maintainer |
| Hand off to multi-agent-brainstorming before code | Implement directly | High-confidence change that revises merged work |

### Multi-agent review log

| Objection (raised by) | Resolution |
|---|---|
| Position is projection-governed; bundling the projection flip risks regressing the currently-correct position (Skeptic) | **Accepted.** Decouple: pose-fix first (cannot move position), projection separate + empirically gated |
| "Match ArtoolkitX exactly ⇒ correct" assumes feed orientation matches (Skeptic) | **Accepted.** Added explicit step to confirm canvas (Y-down) feed orientation before asserting projection parity |
| Reverting a working merged PR to chase axes is net-negative if projection half is wrong (Skeptic) | **Mitigated.** Pose-fix provably leaves position unchanged; only orientation changes — safe incremental step |
| One variable per rebuild for attributable regressions (Constraint Guardian) | **Accepted.** Sequenced 1→2→3, each its own rebuild |
| gtests assert projection values; update in same commit (Constraint Guardian) | **Accepted.** gtest update bound to the projection step |
| `pose` semantics churn on revert (Constraint Guardian) | **Accepted.** Note in commit message |
| Don't regress position for axis perfection (User Advocate) | **Accepted.** Position is the priority; axes are secondary |
| Don't remove the markerFrame hack until verified (User Advocate) | **Accepted.** Hack removal gated on verification |

**Arbiter disposition: REVISE** — finding approved (revert #36); projection flip
decoupled into a separate empirically-gated step; example/gtest changes gated on
verification.

---

## BREAKTHROUGH (resolved the static-image orientation) — example-side fix

> ⚠️ **SUPERSEDED.** This `GrayScale` Y-flip theory and the example-side
> row+column / `markerFrame` correction did NOT survive. `GrayScale` does flip
> vertically, but that was never the static example's problem — the static path
> (`getImageData` → OpenCV) is top-down on both sides. The real cause was the
> scale-factor bug (Fix 1, top of doc); once fixed, no example-side pose
> correction is needed. Retained only to show the path not taken.

After the multi-agent review, the actual root cause and a working fix were found
empirically. Status: **kept as an example-side correction**; folding into the
library is still **undecided**.

### Root cause confirmed

`GrayScale` (the WebGL helper used by `teblid_example`) **flips the image
vertically** — directly observed: a face rendered through `GrayScale.getFrame()`
appears upside-down (its shader does `tex_coords.y = 1 - tex_coords.y` and
`gl_Position.y *= flipY(-1)`, and it outputs single-channel GRAY). So:

- `teblid_example` feeds the tracker (marker **and** frames) **bottom-up**.
- The static example feeds canvas-2D `getImageData` — **top-down**.

The whole WebARKit pose/projection chain was tuned against the **bottom-up**
(`GrayScale`) convention. Fed top-down (canvas) input, the rendered pose is
mirrored. (A clean canvas Y-flip of the feed did NOT reproduce `GrayScale` — it
broke matching — so the fix was done on the rendered pose, not the feed.)

### Working fix (in `examples/threejs_static_image_worker_ES6.js`)

All example-side; no `GrayScale`, normal/right-side-up display, standard
projection, unflipped feed:

1. **Anchoring correction** in `found()`, applied to the modelview `world`
   (= `matrixGL_RH`): negate the **Y row** and the **Z column**.
   - Y row (column-major): `world[1], world[5], world[13]`
   - Z column: `world[8], world[10]`
   - `world[9]` (M12) is in both → left unchanged.
   - One row + one column negation = determinant +1 → a **proper rotation**
     (not a reflection), so normals/back-faces stay correct for real meshes.
2. **Content convention** via a `markerFrame` child of `root`,
   `markerFrame.rotation.x = Math.PI` (180° about X) → +Y toward the bottom of
   the reference image, +Z into the marker (the marker's image convention).
   AR content is attached to `markerFrame`.

Verified with a cube: it rests flat on the marker and stands off the surface
with the expected convention.

### Open decision

- Keep as the example-side correction above (current choice), **or**
- Fold the equivalent into the library so any top-down/canvas consumer gets it
  for free. Regression canary: `teblid_example` (bottom-up via `GrayScale`).

## Next investigation: real camera calibration (camera_para.dat / ARParamLT)

`WebARKitCamera::setupCamera(w,h)` currently **synthesizes** the intrinsics from
a hard-coded **70° diagonal FOV** (no real calibration, zero distortion). That
guessed focal length feeds both `solvePnP` (pose) and `cameraProjectionMatrix`
(the GL frustum), and is a likely source of projection inaccuracy.

ArtoolkitX's `PlanarTracker::Initialise` instead receives a real `ARParam`
(loaded from `camera_para.dat` via `arParamLoad` / `arParamLTLoad` →
`arParamLTCreate`) and builds OpenCV `_K` directly from `cParam.mat[i][j]`, plus
distortion from `cParam.dist_factor` (v4: 5 coeffs, v5: 12 coeffs).
Ref: webarkit/artoolkitx `Source/ARX/OCVT/PlanarTracker.cpp` L99–133.

**Good news — the loaders are already vendored** in `emscripten/WebARKitLib`:

- `arParamLoadFromBuffer(buffer, bufsize, ARParam*)` — `lib/SRC/AR/paramFile.c:368`
  (buffer variant is the right one for WASM: fetch the `.dat` in JS, pass bytes).
- `arParamChangeSize(ARParam* src, xsize, ysize, ARParam* dst)` —
  `lib/SRC/AR/paramChangeSize.c:55` (rescale calibration to the actual frame size).
- `arParamLTCreate(ARParam*, offset)` — `lib/SRC/AR/paramLT.c:168`.
- `ARParam` / `ARParamLT` structs — `include/AR/param.h`.

### Proposed approach

1. Add `WebARKitCamera::loadCameraParamFromBuffer(buffer, size, width, height)`:
   `arParamLoadFromBuffer` → `arParamChangeSize` (to width×height) → fill `cmat`
   from `cParam.mat` (3×3 part) and `kc` from `cParam.dist_factor`.
2. Expose it through `emscripten/bindings.cpp` so JS can pass a fetched
   `camera_para.dat` ArrayBuffer.
3. Optionally build the GL projection with the vendored `arglCameraFrustumRHf`
   (from the `ARParam`) instead of the custom `cameraProjectionMatrix` — this
   would sidestep the custom projection's sign questions in #35 entirely.

Note: this calibration work is **largely independent** of the orientation fix
above (that was a Y-flip convention issue, not a focal-length issue), but a
correct `ARParam` + `arglCameraFrustumRHf` could also clean up the projection.
Verify against `upstream/dev` first (check whether the merged #171 changes any
camera/param code before starting).
