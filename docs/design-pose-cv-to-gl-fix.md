# Design: CV → GL Pose Conversion Fix

Tracks: webarkit-testing#31 and WebARKitLib#34.

## Understanding Summary

- **What:** Fix the OpenCV → OpenGL pose conversion so 3D objects rendered
  with a tracked marker pose actually appear in front of the camera in
  three.js (today they're frustum-clipped behind it).
- **Why:** Tracking works, but the pose emitted by the library applies an
  inconsistent partial conversion (rotation columns Y/Z negated, translation
  not), so translation Z stays positive while the GL projection expects
  negative Z forward.
- **Who:** WebARKitLib (C++ pose pipeline) + webarkit-testing (the static
  image example as the visible consumer).
- **Approach:** Keep `pose` semantically as the **raw OpenCV pose**
  (`[R|t]`, +Z forward). Make `matrixGL_RH` the **blessed OpenGL
  right-handed modelview** (Y/Z rows negated including translation). The
  C++ change produces both correctly; the static-image example switches
  from reading `pose` to reading `matrixGL_RH`.
- **Scope:** library C++ change + WASM rebuild + the static image example
  only. Other threejs examples are deferred.
- **Non-goals:** changing the `0.001 * 1.64` translation scale; updating
  webcam / bufferCopy / jsfeat examples; fixing the related first-frame
  `perspectiveTransform` crash (a different latent bug, worked around).

## Assumptions

1. WASM rebuild is done locally (maintainer has emsdk + build scripts).
2. The `pose` field's silent semantic shift (partially-converted → fully
   raw CV) is acceptable; no external consumer relies on the current
   behavior.
3. The lib PR merges first so the new submodule SHA is canonical before
   webarkit-testing bumps the pointer.

## Risks

- **C++ ripple:** other internal callers of `getPoseMatrix2()` / `trans`
  shift in meaning. Verified: `WebARKitManager::getGLViewMatrix()` (the
  one in-tree caller) becomes a clean `diag(1,-1,-1,1) * pose` modelview
  after the change — improved, not broken.
- **Rotation handedness in three.js:** the proper CV→GL conversion is
  mathematically correct, but three.js may still need a rotation
  adjustment depending on its conventions. Verified empirically via the
  static image example.
- **External consumers** that depend on the current partially-converted
  `pose` would silently break — flagged in the lib PR / commit message.
- **WASM build** must succeed locally before the artifact is committed.

## Decision Log

| Decision | Alternatives | Why |
|---|---|---|
| Fix in C++ + rebuild WASM | JS-only fix; investigate first | Library is source of truth |
| `matrixGL_RH` is the blessed GL field | Repurpose `pose`; use `viewMatrix_GL` | Clearest naming; smallest example diff; least semantic surprise |
| Drop the rotation-column negation in `updateTrackable()` | Add a new C++ method; wire `invertPose()` into the active path | Single minimal hunk; makes downstream paths self-consistent |
| Keep `0.001 * 1.64` translation scale | Replace with `1.0` / expose `m_scale` | Per maintainer; intentional |
| Static image example only | All threejs examples | Per maintainer; defer the rest |
| Maintainer rebuilds WASM locally | I attempt build; CI build | Toolchain on maintainer's side |
| Two PRs, lib first | Single mega-PR | Submodule pointer needs canonical SHA |

## Final Design

### C++ change — `WebARKit/WebARKitPattern.cpp::updateTrackable()`

```diff
 void WebARKitPatternTrackingInfo::updateTrackable() {
     if (transMat) {
         for (int j = 0; j < 3; j++) {
             trans[j][0] =  transMat[j][0];
-            trans[j][1] = -transMat[j][1];
-            trans[j][2] = -transMat[j][2];
+            trans[j][1] =  transMat[j][1];
+            trans[j][2] =  transMat[j][2];
             trans[j][3] = (transMat[j][3] * m_scale * 0.001f * 1.64f);
         }
     }
 }
```

After this change, `getPoseMatrix2()` returns the raw OpenCV pose (rotation
unchanged, translation scaled). All downstream conversions (`pose` in JS,
`matrixGL_RH` via JS `arglCameraViewRHf`, `getGLViewMatrix` via C++
`arglCameraViewRHf` in `WebARKitManager`) are then mathematically clean
CV→GL conversions when needed.

### webarkit-testing changes

1. **`examples/worker_threejs.js`** — additive: forward `matrixGL_RH` in
   the `found` message alongside `pose`:

   ```js
   markerResult = {
     type: "found",
     pose: JSON.stringify(event.data.pose),
     matrixGL_RH: JSON.stringify(event.data.matrixGL_RH),
   };
   ```

2. **`examples/threejs_static_image_worker_ES6.js`** — in `found(msg)`,
   parse `msg.matrixGL_RH` instead of `msg.pose` into `world`. One line.

3. **`dist/WebARKit.js`** — replace with the WASM artifact rebuilt from
   the lib branch.

4. **`emscripten/WebARKitLib`** — bump the submodule pointer to the SHA
   of the lib fix commit on `upstream/dev` (after the lib PR merges).

### Branches

- **WebARKitLib (submodule):** `fix/pose-cv-to-gl` from `dev`. One commit
  with the `updateTrackable` hunk. PR'd to `upstream/dev`.
- **webarkit-testing:** `fix/pose-renders-behind-camera` from `dev`.
  Single commit (or two) with the example updates, rebuilt `dist/`, and
  bumped submodule pointer. PR'd to `dev` after the lib PR merges.

### Testing

Visual verification:

1. Build WASM locally from `fix/pose-cv-to-gl` and replace `dist/WebARKit.js`.
2. Serve `examples/` over HTTP, open `threejs_teblid_static_image_ES6_example.html`.
3. Expected: the sphere appears anchored to the marker in
   `pinball-demo.jpg` (no longer clipped behind the camera).
4. If orientation looks mirrored, that's a three.js handedness
   adjustment in the example — not a library issue.
