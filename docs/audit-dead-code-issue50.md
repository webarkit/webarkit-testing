# Dead / duplicated / orphan code inventory — WebARKitLib#50

Inventory pass for [WebARKitLib#50](https://github.com/webarkit/WebARKitLib/issues/50).
**This document is an inventory only — no code is removed.** Each finding feeds a
later cleanup PR (acceptance criterion #2 — recompile + examples track — is verified
*then*, not here).

- **WebARKitLib submodule SHA audited:** `28ff065` (merged `dev`).
- **webarkit-testing:** `audit/dead-code-issue50` branch off `dev`.
- **Method:** manual xref, ripgrep-based, cross-referenced across **both** repos
  (incl. emscripten bindings → JS consumers). `lib/SRC/AR/**`, `include/AR/**`,
  OpenCV and `build/`/`_deps/` are out of scope.

## Legend

| Verdict | Meaning | Action |
|---|---|---|
| 🔴 **DEAD** | declared; no read (field) / no call (function) anywhere in scope or in any live consumer | remove |
| 🟡 **LOAD-BEARING** | looks dead from C++ alone but a real consumer reaches it (binding/JS/internal) | keep, consumer cited |
| 🟠 **AMBIGUOUS** | no live consumer found, but removal is intent-dependent (public API / debug scaffolding / parity) | your decision |
| 🔵 **DUPLICATE** | two paths do the same thing | collapse to the canonical one |

## API policy (maintainer)

> **Rename decision (Option A, rides with #55):** `getPoseMatrix` → `getPoseMatrixCV`
> (raw OpenCV 4×4 pose) and `getPoseMatrix2` → `getPoseMatrixGL` (right-handed/GL
> pose). The `2` suffix hid that they differ in *both* convention and shape; the new
> names state the convention. Rollout (hard rename vs one-release deprecated aliases)
> to be settled in the #55 PR.

The matrix getters exposed to JS (`getPoseMatrix`, `getPoseMatrix2`,
`getGLViewMatrix`, `getTransformationMatrix`, `getCameraProjectionMatrix`,
`getHomography`, `getCorners`) are **intentional public API**: a downstream user
is not obliged to use our (limited) examples and may do their own math, so the
library must keep handing out the pose / view / transform / projection matrices
even when no in-repo example renders a given one. Therefore **"no example calls
it" is NOT grounds for removal** for these — they are 🟡 *keep — public API*.
This policy applies only to the JS-bound API surface, not to internal C++
duplicates, vestigial constants, or unreachable scaffolding.

See the **[Cleanup decision table](#cleanup-decision-table)** for the per-item
keep/remove/fix call.

---

## Named suspects from #50 — resolution

| Suspect | Verdict | Evidence |
|---|---|---|
| `getPoseMatrix` vs `getPoseMatrix2` | 🟡 **keep — public API, but ⚠️ `getPoseMatrix` is currently BROKEN** | `WebARKitController.getPoseMatrix()` (src/WebARKitController.js:183) calls `webarkit.getPoseMatrix2()`, so our examples never hit the cv::Mat path. But it's bound API, so keep it. **However:** `tracker::getPoseMatrix()` returns `_patternTrackingInfo.pose3d`, and the live path never writes `pose3d` (it writes the local `_pose` → `transMat` → `trans`, which `getPoseMatrix2` returns). So `getPoseMatrix()` returns the **zero matrix** from the ctor. Decision: *keep + FIX* (wire `pose3d` to the live pose, or delegate to the `trans` data). |
| `computePose` (WebARKitPattern) | 🔴 **DEAD** | only call site is commented (WebARKitTracker.cpp:460). Live path uses `cameraPoseFromPoints`. |
| `getTransformationMatrix` / `getGLViewMatrix` / `matrixGL_RH` | 🟡 **keep — public API** | `process_raw` emits both in the `getMarker` event; no shipped example renders them (examples use `matrixGL_RH` only), but per the API policy they stay — a user may consume them. Both are populated in the live path (`getTransformationMatrix` from `trans`; `glViewMatrix` from `computeGLviewMatrix(_pose)`), so unlike `getPoseMatrix` they return real data. |
| `_trackVizActive` / `TrackerVisualization` | 🟠 **AMBIGUOUS — unreachable** | `_trackVizActive` is only ever initialised to `false` (ctor) — **no setter exists anywhere**, so every `if (_trackVizActive)` block and all of `TrackerVisualization` is dead at runtime. Either expose a toggle or remove the instrumentation. |
| `process_raw` vs `processFrame` | 🟡 **both live — NOT duplicate** | `process_raw` is the public entry (all workers call it); `processFrame` is its internal helper (writes the WASM heap + calls the C++ frame). Keep both. |
| `points2d` / `points3d` on `_pattern` | 🔴 **DEAD (verify at removal)** | populated in `initTracker` (WebARKitTracker.cpp:127-139) but no read site found — `solvePnP` object points come from `_trackSelection.GetTrackedFeatures3d()`, not `_pattern.points3d`. |
| `convert2Grayscale` / `GrayScale` JS / `convertJSArrayToNumberVector` | 🟡 **distinct layers, all live** | `convert2Grayscale` (C++, 2 overloads, both used). `GrayScale.js` is a separate webpack bundle used by `feature_trackers_example.html`. `convertJSArrayToNumberVector` used in `WebARKitJS::initTrackerGray`. Not duplicates of each other. |

---

## WebARKitLib — per-file

### `WebARKit/WebARKitManager.{h,cpp}`
- 🔴 `getWebARKitVersion()` — no caller; JS uses `packageInfo.version`, internal init uses the `webarkitGetVersion()` free function. (`versionString` member stays — used by ctor/dtor/`initialiseBase`.)
- 🔴 `getTracker()` — inline accessor, no caller.
- 🔴 `update()` — **declared in header, never defined, never called.**
- 🔴 `initTracker(cv::Mat, …)` overload — only the `uchar*` overload is used (`WebARKitJS::initTrackerGray`). The cv::Mat overload (and its `tracker::initTracker(cv::Mat)` partner) is unused.
- 🟡 `getPoseMatrix()` (cv::Mat) — **keep (public API)**, but the `pose3d` it ultimately returns is never populated live → see the ⚠️ in the suspects table / incidental notes (keep + FIX).
- 🟡 `getGLViewMatrix()`, `getTransformationMatrix()` — keep (public API); both return live data.
- 🟢 LIVE: `initialiseBase`, `initTracker(uchar*)`, `processFrameData`, `setLogLevel`, `shutdown` (called in `initialiseBase`), `getOutputData`, `getPoseMatrix2`, `getCameraProjectionMatrix`, `isValid`, `setOriginCentered`.

### `WebARKit/WebARKitPattern.{h,cpp}`
- 🔴 `computePose()` — only commented call.
- 🔴 `invertPose()` — only caller is the dead `computePose`.
- 🔴 `computeGLviewMatrix()` (no-arg) — only the `cv::Mat&` overload is called (WebARKitTracker.cpp:463).
- 🔴 `pose3d` member — written/read only inside the dead cluster (`computePose`/`invertPose`/`computeGLviewMatrix()`/`getPoseMatrix`).
- 🔴 `setScale()` / `getScale()` — never called (`m_scale` stays at its `1.0` init; the member itself is read in `updateTrackable`, so keep the field, drop the accessors).
- 🔴 `WebARKitPattern::points2d`, `points3d`; `WebARKitPatternTrackingInfo::points2d` — write-only; the orphaned inputs of the dead `computePose` (line 460). **Keep the `WebARKitPattern` struct** — its `size` is live (#38 centered origin, lines 449-450).
- 🔴 Commented struct members in `WebARKitPattern` (`grayImg`, `keypoints`, `descriptors`).
- 🟢 LIVE: `cameraPoseFromPoints`, `getTrackablePose`, `updateTrackable`, `computeGLviewMatrix(cv::Mat&)` (feeds the ambiguous `getGLViewMatrix`), `transMat`, `trans`, `glViewMatrix`, `m_scale`, `homography`, `size`.

### `WebARKit/WebARKitGL.{h,cpp}`
- 🔴 `arglCameraViewRHf(cv::Mat, std::array<double,16>&, double)` overload — only the `float[3][4]` overload is called (`WebARKitManager::getTransformationMatrix`).
- 🟢 LIVE: `arglCameraViewRHf(float[3][4], …)`, `cameraProjectionMatrix`.

### `WebARKit/WebARKitCamera.{h,cpp}`
- 🔴 `getDistortionCoefficients()` — no caller (the tracker builds `m_distortionCoeff` locally).
- 🟢 LIVE: `setupCamera`, `getCameraData`, `setFocalLength`, `printSettings`.

### `WebARKit/WebARKitTrackers/WebARKitOpticalTracking/WebARKitConfig.{h,cpp}`
- 🔴 `N` — no use-site.
- 🔴 `featureDetectPyramidLevel` (the `double`) — no use-site; **vestigial pyramid-scale constant superseded by the `int _featureDetectPyrLevel` member added in #44.**
- 🟠 `WEBARKIT_HEADER_VERSION_MAJOR / MINOR / TINY / DEV` — only `_STRING` is consumed (`webarkitGetVersion`); the numeric parts appear unused (low-value version metadata — your call).
- 🟢 LIVE: `searchRadius`, `match_method`, `featureBorder`, `blurSize`, `ransac_thresh`, `DEFAULT_NN_MATCH_RATIO`, `TEBLID_NN_MATCH_RATIO`, `DEFAULT_MAX_FEATURES`, `TEBLID_MAX_FEATURES`, `MIN_NUM_MATCHES`, `minRequiredDetectedFeatures`, `markerTemplateWidth`, `maxLevel`, `winSize`, `termcrit`, `featureImageMinSize`, `rng`, `m_pi`, `WEBARKIT_HEADER_VERSION_STRING`.

### `WebARKit/WebARKitTrackers/WebARKitOpticalTracking/TrackingPointSelector.{h,cpp}`
- 🔴 `GetAllFeatures()` — no caller (artoolkitX inheritance).
- 🔴 `CleanUp()` — no caller (artoolkitX inheritance).
- 🟢 LIVE: ctors, `DistributeBins`, `SetHomography`, `GetHomography`, `UpdatePointStatus`, `ResetSelection`, `GetInitialFeatures`, `GetTrackedFeatures`, `GetTrackedFeatures3d`, `GetTrackedFeaturesWarped`.

### `WebARKit/WebARKitTrackers/WebARKitOpticalTracking/WebARKitHomographyInfo.{h,cpp}`
- 🔴 `inlier_matches` member — written in the ctor, never read.
- 🟢 LIVE: `validHomography`, `homography`, `status` (read at WebARKitTracker.cpp:627), both ctors.

### `WebARKit/WebARKitTrackers/WebARKitOpticalTracking/TrackedPoint.{h,cpp}`
- 🔴 `IsSelected()` — no caller.
- 🔴 `markerRoi` — write-only (set at TrackingPointSelector.cpp:83, never read; verify at removal).
- 🟢 LIVE: `IsTracking`, `SetTracking`, `SetSelected`, `pt`, `pt3d`, `selected`, `tracking`. (`id` — not observed used; low-value, leave.)

### `WebARKit/WebARKitTrackers/WebARKitOpticalTracking/WebARKitUtils.h`
- 🔴 `im_gray()` — fully commented-out.
- 🔴 `grayscale(uchar[], …)` — no caller (superseded by `convert2Grayscale`).
- 🔴 `webarkitGetVersion(char**)` (BCD overload) — no caller. (Its removal frees the `VERSION_MAJOR/MINOR/TINY/DEV` constants.)
- 🟢 LIVE: `Points`, `getHomographyInliers`, `convert2Grayscale` (both overloads), `webarkitGetVersion()` (std::string).

### `WebARKit/WebARKitTrackers/WebARKitOpticalTracking/WebARKitEnums.h`
- 🟢 Clean — `TRACKER_TYPE`, `ColorSpace`, `BLUR_TYPE` are all bound (`bindings.cpp`) and consumed. No orphans.

### `WebARKit/WebARKitTrackers/WebARKitOpticalTracking/WebARKitTracker.{h,cpp}`
- 🔴 `getPoseMatrix()` impl (returns `pose3d`) — dead cluster.
- 🔴 `getPoseMatrix3` — commented decl in header (WebARKitTracker.h:38).
- 🔴 Numerous commented `_trackables[trackableId]…` lines (multi-marker artoolkitX scaffolding superseded by the single-marker members) — e.g. lines 215, 245, 254, 322-323, 460, 489, 537, 541, 543, 548, 553-554.
- 🟠 `_trackVizActive` + all guarded blocks + `TrackerVisualization _trackViz` + `TrackerVisualization.h` — unreachable (no setter). Decide: wire a toggle or remove.
- 🟢 The active tracking path (initialize, initTracker(uchar*), processFrameData, processFrame, MatchFeatures, runOpticalFlow, RunTemplateMatching, createFeatureMask, buildImagePyramid, getCameraProjectionMatrix, getGLViewMatrix*, getOutputData, isValid, setOriginCentered, getPoseMatrix2).

---

## webarkit-testing — per-file

### `emscripten/WebARKitJS.{h,cpp}` + `emscripten/bindings.cpp`
- 🟡 `getPoseMatrix()` method + `.function("getPoseMatrix", …)` binding — keep (public API); underlying `pose3d` needs the FIX noted above.
- 🟡 `getGLViewMatrix` / `getTransformationMatrix` methods + bindings — keep (public API).
- 🟢 LIVE: `initTrackerGray`, `initFrameBuffer`, `getFrameBufferPtr`, `processFrame`, `setLogLevel`, `getHomography`, `getPoseMatrix2`, `getCameraProjectionMatrix`, `getCorners`, `isValid`, `setOriginCentered`.

### `src/WebARKitController.js`
- 🟡 `process_raw` (public entry, called by all workers) and `processFrame` (internal helper) — both live; not a duplicate pair.
- 🟡 `getTransformationMatrix()` / `getGLViewMatrix()` wrappers — keep (public API); they feed the `transMatrix`/`viewMatrix_GL` event fields, which a downstream user may consume even though our examples don't.
- 🟢 LIVE: `init_raw`, `_initialize_raw`, `setTrackerType`, `loadTrackerGrayImage`, `initFrameBuffer`, `isValid`, `setOriginCentered`, `getHomography`, `getPoseMatrix`(→pose2), `getCameraProjectionMatrix`, `getCorners`, `transMatToGLMat`, `arglCameraViewRHf`, the event helpers.

### `src/utils/GrayScale.js`
- 🟢 LIVE — separate webpack bundle consumed by `feature_trackers_example.html`. (Distinct from the C++ `convert2Grayscale`; not a cross-layer duplicate.)

### `examples/`
- 🟢 No orphans. Live graph: `feature_trackers_example.html`→`worker_setup.js`→`worker.js`; `threejs_teblid_static_image_ES6_example.html`→`threejs_static_image_worker_ES6.js`→`worker_threejs.js`; `threejs_teblid_webcam_ES6_example.html`→`threejs_teblid_webcam_worker_ES6.js`→`worker_teblid_webcam_threejs.js`. Note: the workers forward `transMatrix`/`viewMatrix_GL` (worker.js) but downstream rendering uses only `matrixGL_RH`/`pose`/`corners`/homography.

### `tools/makem.js`, `package.json`, `webpack.config.js`
- 🟢 `makem.js` `webarkit_sources` lists only real, compiled `.cpp` files — no orphan entries. (`ar_sources`/`ar2_sources` are the vendored AR code — out of scope.)
- 🟢 `webpack.config.js` builds `webarkit` + `GrayScale` entries — both consumed.
- ⏳ `package.json` scripts not individually swept (low risk; `SpeedyVisionSinkImageData` already trimmed in webarkit-testing#41).

---

<a name="cleanup-decision-table"></a>
## Cleanup decision table

The authoritative keep/remove/fix call per item, for the later cleanup PR.
Decision values: **KEEP-API** (public API per policy) · **KEEP-live** (used) ·
**REMOVE-redundant** (duplicate of a kept twin) · **REMOVE-internal** (never
exposed, no unique value) · **FIX** (kept but currently wrong) · **DECIDE**
(needs a maintainer call).

| Item | Location | Verdict | Decision |
|---|---|---|---|
| `getPoseMatrix` → **rename `getPoseMatrixCV`** (JS binding + WebARKitJS + manager + tracker) | both repos | 🟡 | **KEEP-API + FIX + RENAME** — wire `pose3d` to the live pose (returns zeros today) and rename to `getPoseMatrixCV` (raw OpenCV 4×4). Rides with #55. |
| `pose3d` member | WebARKitPattern | 🟡 | **KEEP + FIX** — populate in the live path (needed by `getPoseMatrixCV`) |
| `getPoseMatrix2` → **rename `getPoseMatrixGL`** | tracker/manager/binding | 🟡 | **KEEP-live + RENAME** — `getPoseMatrixGL` (right-handed/GL-corrected pose). Rides with #55. |
| `getGLViewMatrix`, `getTransformationMatrix`, `getCameraProjectionMatrix`, `getHomography`, `getCorners` | both repos | 🟡 | **KEEP-API** |
| `computePose` | WebARKitPattern | 🔴 | REMOVE-redundant (dup of `cameraPoseFromPoints`) |
| `invertPose` | WebARKitPattern | 🔴 | REMOVE-internal (only caller is dead `computePose`) |
| `computeGLviewMatrix()` (no-arg) | WebARKitPattern | 🔴 | REMOVE-redundant (dup of `cv::Mat&` overload) |
| `setScale` / `getScale` | WebARKitPattern | 🔴 | REMOVE-internal (keep `m_scale` field) |
| `WebARKitPattern::points2d`/`points3d`, `WebARKitPatternTrackingInfo::points2d` | WebARKitPattern | 🔴 | REMOVE-internal — orphaned **inputs** of the dead `computePose` (line 460, commented); confirmed write-only. Keep the `WebARKitPattern` struct itself: `size` is live (#38 origin, lines 449-450). |
| commented struct members (`grayImg`/`keypoints`/`descriptors`) | WebARKitPattern | 🔴 | REMOVE-internal |
| `getWebARKitVersion` | WebARKitManager | 🔴 | REMOVE-internal |
| `getTracker` | WebARKitManager | 🔴 | REMOVE-internal |
| `update()` (declared, undefined) | WebARKitManager | 🔴 | REMOVE-internal |
| `initTracker(cv::Mat)` overload (manager + tracker) | both | 🔴 | REMOVE-redundant (dup of `uchar*`) |
| `arglCameraViewRHf(cv::Mat,…)` overload | WebARKitGL | 🔴 | REMOVE-redundant (dup of `float[3][4]`) |
| `getDistortionCoefficients` | WebARKitCamera | 🔴 | REMOVE-internal |
| `GetAllFeatures`, `CleanUp` | TrackingPointSelector | 🔴 | REMOVE-internal |
| `N`, `featureDetectPyramidLevel` (double) | WebARKitConfig | 🔴 | REMOVE-internal |
| `WEBARKIT_HEADER_VERSION_MAJOR/MINOR/TINY/DEV` | WebARKitConfig | 🔴 | REMOVE-internal — their only reader is the dead `webarkitGetVersion(char**)`; remove as a pair |
| `grayscale()` (uchar[]) | WebARKitUtils.h | 🔴 | REMOVE-redundant (superseded by `convert2Grayscale`; no caller) |
| `webarkitGetVersion(char**)` (BCD overload) | WebARKitUtils.h | 🔴 | REMOVE-internal (no caller; keep the `std::string` overload) |
| `im_gray()` (fully commented) | WebARKitUtils.h | 🔴 | REMOVE-internal |
| `WebARKitHomographyInfo::inlier_matches` | WebARKitHomographyInfo | 🔴 | REMOVE-internal (write-only; `status`/`homography`/`validHomography` stay) |
| `TrackedPoint::IsSelected` | TrackedPoint | 🔴 | REMOVE-internal (no caller; `SetSelected`/`IsTracking`/`SetTracking` are live) |
| `TrackedPoint::markerRoi` | TrackedPoint | 🔴 | REMOVE-internal (write-only at TrackingPointSelector.cpp:83; verify at removal) |
| `getPoseMatrix3` commented decl | WebARKitTracker.h | 🔴 | REMOVE-internal |
| commented `_trackables[…]` blocks | WebARKitTracker.cpp | 🔴 | REMOVE-internal (multi-marker scaffolding) |
| `_trackVizActive` + `TrackerVisualization` + guarded blocks | tracker + header | 🟠 | DECIDE — wire a toggle (keep) **or** remove (currently unreachable, no setter) |

## Coverage status (honest)

| Area | Coverage |
|---|---|
| Manager, Pattern, GL, Camera, Config, TrackingPointSelector | ✅ full xref |
| WebARKitTracker.cpp/.h | ✅ active paths + named suspects; commented-block sweep characterised (~37 commented code lines, almost all the `_trackables[trackableId]…` multi-marker scaffolding — remove as a batch) |
| WebARKitJS / bindings / WebARKitController.js / examples | ✅ full xref |
| `WebARKitHomographyInfo.{h,cpp}`, `TrackedPoint.{h,cpp}`, `WebARKitUtils.h`, `WebARKitEnums.h` | ✅ full xref |
| `tools/makem.js`, `webpack.config.js` | ✅ swept — clean |
| `WebARKitLog.{h,cpp}` | ⏳ spot-checked — the `WEBARKIT_LOG*` macros + `webarkitLog`/`webarkitLogLevel` are live; no obvious orphans, deeper confirming pass optional |
| `package.json` scripts | ⏳ not individually swept (low risk) |

At removal time, gate each change with a `-Wunused-*` build + the static-image and webcam examples (acceptance #2).

---

## Decision Log

| Decision | Alternatives | Why |
|---|---|---|
| Inventory now, removals later | full deferral behind #48; remove-as-we-go | #48 lands far out; cleanup shouldn't wait, but removals want their own verified PR |
| Manual xref, cross-repo | clang-tidy/cppcheck; hybrid | core risk is "dead in C++ but live via JS binding" — only xref resolves it; no toolchain/include-path noise |
| Single doc in `webarkit-testing/docs/` | per-repo docs; #50 comment only | one source of truth; matches `docs/design-*.md` convention |
| Approach A (suspects → per-file) | pure per-file; by-category | front-loads known suspects; per-file pass backstops exhaustiveness |
| 4-bucket rubric | binary dead/alive | cross-repo + parity cases need "keep with reason" and "your call" verdicts |

## Incidental notes (not acted on)
- ⚠️ **`getPoseMatrix()` returns a zero matrix.** `tracker::getPoseMatrix()` returns `_patternTrackingInfo.pose3d`, which the live tracking path never writes (it populates the local `_pose` → `transMat` → `trans`; `pose3d` is touched only by the dead `computePose`/`invertPose`). Surfaced by the API-policy decision to keep `getPoseMatrix`: it's kept API, but a JS caller gets zeros today. Fix = populate `pose3d` in the live path (or have `getPoseMatrix` return the same data as `getPoseMatrix2`, reshaped). Tracked here as the `getPoseMatrix`/`pose3d` **KEEP+FIX** rows.
- `WebARKitManager::processFrameData` has a commented `//return false;` after an error log (line 89) — the error path logs but continues; behavioural, not dead code.
- The `transMatrix`/`viewMatrix_GL` event fields are a coherent removable unit *if* you also drop the C++ `getGLViewMatrix`/`getTransformationMatrix` chain — but they are public-ish API, hence 🟠 not 🔴.
