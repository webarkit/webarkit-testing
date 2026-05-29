# Design: Static Image Example with Teblid Tracker (Issue #30)

## Understanding Summary

- **What:** A static-image AR example under `examples/` that feeds a fixed JPEG
  (`pinball-demo.jpg`) into the existing Teblid tracker instead of a webcam stream.
- **Why:** Test/debug the Teblid tracker without camera access; provide a
  reproducible case for CI/CD.
- **Who:** WebARKit developers and CI pipelines.
- **Structure:** Mirrors `threejs_ES6_example.html` + `threejs_worker_ES6.js`,
  reusing `worker_threejs.js` and `data/pinball.jpg` (marker) unchanged.
- **Key change:** `<video>` -> hidden `<img>`; `drawImage(video,...)` ->
  `drawImage(image,...)`; no `initCamera`; the `<img>` load event triggers `start()`.
- **Non-goals:** No GrayScale class, no tracker logic changes, no worker changes,
  no docs/index update.

## Assumptions

1. `examples/data/pinball-demo.jpg` will be provided separately by the maintainer;
   code is written assuming it exists.
2. `setTrackerType()` returns `'teblid'`; marker dimensions stay hardcoded 1637x2048.
3. `worker_threejs.js` and `data/pinball.jpg` are reused verbatim.

## Decision Log

| Decision | Alternatives | Why |
|---|---|---|
| Test image provided by maintainer | reuse pinball.jpg / generate placeholder | Keeps demo authentic |
| Keep `requestAnimationFrame` loop as-is | process-once variants | Initial decision; superseded below |
| Process at FULL resolution, single frame, no letterbox proj scaling | (B) init at downscaled pw×ph | Fixes init/process dimension mismatch in `worker_threejs.js`: the WASM frame buffer is sized `videoWidth×videoHeight` (init dims) but the mirrored worker sent a downscaled `pw×ph` frame, so the tracker read garbage. Full-res maximizes detection for a static image; processing once is sufficient since input never changes. |
| Decode the marker JPEG to RGBA pixels via a 2D canvas before sending to the tracker | pass raw JPEG bytes (original, broken); use the GrayScale WebGL class (working example's approach) | `initTrackerGray()` treats its buffer as raw pixels — it does NOT decode JPEG. The original threejs workers passed the ~764 KB compressed `pinball.jpg` bytes as if they were 13 MB of 1637×2048 RGBA, corrupting the reference marker so matching always failed. A plain 2D canvas decodes to pixels without the GrayScale class (user requirement), and decoding client-side keeps `worker_threejs.js` unchanged. |
| Send a blank warmup frame first, then feed the static image via worker ping-pong; stop once tracked | process the real image immediately / process once | The tracker crashes on its first detected frame: when `_frameCount == 0` the optical-flow branch that calls `GetInitialFeatures()` (the only thing that fills `_selectedPts`) is skipped, yet `_isDetected` is set, so `GetTrackedFeaturesWarped()` runs `perspectiveTransform` on an empty point set → OpenCV `scn+1 == m.cols` assert (2==3) throws. A static image detects on frame 0, so we must delay first detection past frame 0. A blank warmup frame increments `_frameCount` without detecting; the next real frame then has a valid prev pyramid and tracks. Ping-pong (send next frame on worker reply) throttles the heavy full-res processing; stopping after `found` avoids needless re-detection on an unchanging image. **NOTE: this is a workaround for a latent library bug in `WebARKitTracker::processFrame` — see below.** |

## Known library bug (workaround in place)

`emscripten/WebARKitLib/.../WebARKitTracker.cpp::processFrame` can call
`GetTrackedFeaturesWarped()` (line ~391) with an empty `_selectedPts` whenever a
marker is detected on the very first processed frame (`_frameCount == 0`), because
`GetInitialFeatures()` is only invoked from the optical-flow branch guarded by
`_frameCount > 0`. `perspectiveTransform` then asserts on the empty (1-channel)
input and throws. The proper fix belongs in the library (e.g. guard the
`_isDetected || _isTracking` block on a non-empty tracked-feature set, or populate
the selection on first detection). The example works around it with a blank warmup
frame. Worth filing against WebARKitLib.
| Translate comments to English | verbatim Italian / strip | Repo convention is English |
| No docs/index.md change | add link | Existing threejs examples are not listed there |

## Final Design

### Files to create

1. **`examples/threejs_teblid_static_image_ES6_example.html`**
   - Based on `threejs_ES6_example.html`.
   - Replaces `<video>` with `<img id="static-image" src="data/pinball-demo.jpg" style="display:none;">`.
   - Drops `index.js` / `initCamera`.
   - `setTrackerType()` returns `'teblid'`.
   - On `window load`, waits for image (`complete` or `load` event), sizes the
     target canvas to the image's natural dimensions, then calls `start()` with
     the marker URL, the image element, and its natural width/height.
   - Loads `threejs_static_image_worker_ES6.js`.

2. **`examples/threejs_static_image_worker_ES6.js`**
   - Mirrors `threejs_worker_ES6.js` exactly.
   - `start(markerUrl, image, input_width, input_height, render_update, track_update)`
     — `image` is an `HTMLImageElement`.
   - Single functional change in `process()`:
     `context_process.drawImage(image, 0, 0, vw, vh, ox, oy, w, h);`
   - Keeps `load()` + `tick()` (requestAnimationFrame) loop unchanged.
   - English comments.

### Reused unchanged

- `examples/worker_threejs.js`
- `examples/data/pinball.jpg` (marker, 1637x2048)
- `examples/css/nft-style.css`, `js/stats.min.js`, `js/three.min.js`

### Data flow

`<img> load` -> `initTargetCanvas` -> `start()` -> `load()` fetches marker,
spawns `worker_threejs.js`, posts `initTracker` -> worker returns
`loadedTracker` (camera proj matrix) -> `process()` draws static image to
process canvas, posts `process` with imageData -> worker returns `found`/`not found`
pose -> `draw()` renders sphere at pose. Loop continues via `tick()`.

### Testing strategy

- Manual: serve `examples/` over HTTP, open the new HTML, confirm the marker is
  tracked (`Marker tracked ! Num. matches : N` in the console) and the loader
  disappears.
- Requires `pinball-demo.jpg` to be present and to contain the pinball marker.

## Final status

- The example **tracks the Teblid marker successfully** from the static image —
  the goal of #30 is met.
- The 3D **sphere is not visible**, but this is a pre-existing pose-convention
  bug, not specific to this example. Runtime evidence: a valid pose *is* delivered
  (e.g. translation `(0.953, -0.384, +5.824)`), but with the OpenGL projection
  (`proj[11] = -1`, camera looks down −Z) the object lands at `clip.w < 0`
  (behind the camera) and is frustum-clipped. The `pose` field is in OpenCV
  convention (+Z forward); the GL-ready `matrixGL_RH` throws. Tracked in
  **webarkit-testing#31**.
- A **temporary** `console.log('[TEMP DEBUG] found …')` remains in
  `threejs_static_image_worker_ES6.js` (used to capture the runtime pose) — remove
  it before finalizing.
- Correction to an earlier note: the pose is NOT all-zeros. The submodule source
  under `emscripten/WebARKitLib` differs from the compiled `dist/WebARKit.js`
  actually running, so source-only reasoning about the pose was misleading; the
  runtime value is authoritative.
