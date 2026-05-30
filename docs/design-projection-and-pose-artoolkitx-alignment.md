# Design: Align WebARKit Pose + Projection with ArtoolkitX (issue #35)

Tracks: webarkit/WebARKitLib#35 (projection X-mirror) and the related
pose-convention correction. Supersedes part of the reasoning in
webarkit/WebARKitLib#34 / PR #36.

## Headline finding

By tracing the **complete** ArtoolkitX OCVT -> render chain (which WebARKit
reimplemented rather than vendored) and comparing it to WebARKit, we found that
**PR #36 (already merged) diverged from the ArtoolkitX reference.** The correct
fix for the axis-orientation bug (#35) requires three *coordinated* changes, one
of which is reverting #36's pose change.

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
