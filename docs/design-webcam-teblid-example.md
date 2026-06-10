# Design: Live-webcam Teblid AR example (issue #36)

Branch: `feat/teblid-webcam-example` (webarkit/webarkit-testing). Adds a new
working live-camera AR example using the Teblid tracker, plus an `index.html`
landing page for all examples. **No existing example is modified or removed**
(the cleanup half of #36 is deferred).

Depends on the library fixes merged in webarkit/WebARKitLib#45 (#43 scale-factor,
#35 projection X-sign, #42 D*R*D handedness) — so the example consumes
`matrixGL_RH` directly with no render-side pose correction.

## Understanding Summary

- **What:** a new live-webcam AR example using the **Teblid** tracker, *added*
  to `examples/` (nothing removed), plus a new `examples/index.html` listing all
  examples.
- **Why:** the existing webcam examples are broken; we need a working live
  reference built on the now-correct library.
- **Who:** WebARKit developers wanting a live-camera Teblid starting point.
- **Shape:** the static-image example's *conventions* (consume `matrixGL_RH`
  directly, projection as-is, no pose hack) + the bufferCopy example's
  *continuous main↔worker ping-pong loop* + a `getUserMedia` feed.
- **Hard constraints:** don't touch/delete the other examples; RGBA end-to-end
  (the tracker converts via `convert2Grayscale`); **never mirror the processed
  feed**; no library changes and no rebuild (pure example HTML/JS).

## Assumptions

- **Files:** `threejs_teblid_webcam_ES6_example.html`,
  `threejs_teblid_webcam_worker_ES6.js` (the `start()` module),
  `worker_teblid_webcam_threejs.js` (dedicated worker), `index.html`.
- **Marker:** `data/pinball.jpg`, decoded to RGBA via the static example's
  Image → canvas → `getImageData` → `loadTrackerGrayImage` path.
- **Content:** cube (0.6) at +Z 0.3 **+ `AxesHelper`**, attached to `root`,
  anchored at the marker origin (object 0,0,0 = reference top-left).
- **Capture:** 640×480, `facingMode:"environment"`, reusing `initCamera.js`;
  capture size taken from `video.videoWidth/Height` (actual, not requested);
  `CAPTURE_W`/`CAPTURE_H` constants at the top of the HTML.
- **No build artifacts, no library edits.** Uses the existing `dist/WebARKit.js`.

## Decision Log

| Decision | Alternatives | Why |
|---|---|---|
| **bufferCopy ping-pong** (recycle one transferable `ArrayBuffer`) | getImageData one-way per frame; SharedArrayBuffer zero-copy | Continuous video needs to avoid per-frame allocation/GC; SAB needs COOP/COEP headers (out of scope). The bufferCopy example exists for exactly this. |
| **New dedicated `worker_teblid_webcam_threejs.js`** emitting `matrixGL_RH` | Modify `worker_bufferCopy_threejs.js`; reuse static `worker_threejs.js` | Isolation honors "don't touch other examples"; the static worker can't ping-pong (one-way transfer). One duplicated ~80-line worker is acceptable. |
| **Match-aspect display, projection as-is** | Letterbox-pad + `ratioW/ratioH` projection scaling (bufferCopy style); CSS cover, no compensation | Same proven convention as the corrected static example; no projection arithmetic to get wrong; exact AR alignment. Letterbox bars on mismatched windows are acceptable. |
| **640×480 `environment`, reuse `initCamera.js`** | 1280×720 default; `user` (front) default | Fast, lands on the factor-1.0 path, ideal for pointing at a printout; front feeds invite mirroring which would break handedness. Resolution is a constant so the "also works at 1280×720" criterion is one edit away. |
| **Consume `matrixGL_RH` directly, no correction** | Re-add an example-side pose tweak | The library now emits a correct D*R*D pose + standard projection (#45). |
| **Hide content on `not found`** (`world = null`) | Freeze last pose (static example behavior) | Live tracking: content should disappear when the marker leaves frame. |
| **Use actual `video.videoWidth/Height`** | Trust the requested 640×480 | Browsers may not honor the exact request; using the real size keeps tracker init + projection consistent. |
| **`index.html`: grouped, relative links, "under review (#36)" group** | Flat alphabetical; delete legacy now | Honest about state without removing anything pre-audit; relative links work from `examples/` on any static server. |
| **cube + axes** | cube-only | Axes give an immediate, unambiguous read of the marker frame (red→right, green→up, blue→toward viewer). |

## Final Design

### Files (4 new; nothing else touched)

1. **`examples/threejs_teblid_webcam_ES6_example.html`** — `<video id="video">`
   (behind, un-mirrored) + `<canvas id="canvas">` overlay; stats + loader
   (reused pattern); `CAPTURE_W`/`CAPTURE_H` constants. On `load`:
   `initCamera(CAPTURE_W, CAPTURE_H)` → read `video.videoWidth/Height` →
   `start('./data/pinball.jpg', video, w, h, …)`.
2. **`examples/threejs_teblid_webcam_worker_ES6.js`** — `start()` module:
   three.js scene/camera/`root` with cube + `AxesHelper`; spawns the worker;
   decodes `pinball.jpg` → RGBA → `initTracker`; bufferCopy `process()`;
   `found()` consumes `matrixGL_RH`; `requestAnimationFrame` render loop.
3. **`examples/worker_teblid_webcam_threejs.js`** — dedicated worker:
   `init_raw` → `loadTrackerGrayImage(RGBA)` → `initFrameBuffer(RGBA)` →
   `getCameraProjectionMatrix`; `getMarker` → emit `matrixGL_RH`;
   `process_raw(next, RGBA)`; **returns the buffer** (transfer back) for ping-pong.
4. **`examples/index.html`** — navigation page linking every example (grouped:
   feature-tracker / three.js AR / under-review-#36).

### Per-frame data flow

```
video → drawImage → getImageData → set() into recycled ArrayBuffer
   → worker.postMessage(transfer buffer) → process_raw(RGBA)
   → tracker (convert2Grayscale internally) → getMarker(matrixGL_RH)
   → postMessage('found'|'not found', transfer buffer BACK) → main
   → found(): world = matrixGL_RH (or null); process() next frame
```
A separate `requestAnimationFrame` loop renders `root` from the latest `world`.
The ping-pong sets the processing cadence; the render loop is independent.

### Projection / display
- Capture size from `video.videoWidth/Height`.
- `renderer.setSize()` + `#canvas`/`#video` sized to the capture aspect
  (letterboxed in-window). Projection set **once** on `loadedTracker`, used
  **as-is** (no `ratioW/ratioH` scaling).

### Loop / lifecycle
- Kick `process()` after `loadedTracker`; re-`process()` on each worker reply.
- Gate `process()` on `video.readyState >= HAVE_CURRENT_DATA`.
- `not found` → `world = null` → content hidden.

### No-mirror guarantee
- `drawImage(video,…)` with no flip; no `scaleX(-1)` on the processed canvas or
  the displayed `<video>`.

### Error handling
- `getUserMedia` rejected → message in loader, log, stop.
- Worker `init_raw` error → `console.error`, loader stays.

## Non-functional notes
- **Performance:** detection runs full-res every frame (the downsample/guard is
  deferred to webarkit/WebARKitLib#44); 640×480 is the smooth default, 1280×720
  is the "higher-res" check. No hard fps SLA (reference demo).
- **Scope:** single marker, single example; the examples-cleanup half of #36 is
  deferred (legacy examples only get labelled in `index.html`).

## Risks
- **Aspect mismatch** between camera capture and window → letterbox bars
  (accepted) — but if `video` and `#canvas` ever diverge in size/position, AR
  drifts. Mitigation: size both from the same capture dimensions in one place.
- **Front-camera mirroring** if someone switches to `facingMode:"user"` and adds
  a selfie flip → re-introduces a handedness flip. Mitigation: documented "never
  mirror the processed feed".
- **Browser not honoring requested resolution** → handled by reading actual
  `videoWidth/Height`.
- **getCorners/debug** not included (kept clean); re-add the static example's
  debug overlay temporarily if localization needs verifying.

## Acceptance (from #36)
- [ ] New webcam Teblid example tracks the pinball marker live, content correctly
  localized + right-handed (red→right, green→up, blue→toward viewer).
- [ ] Works at 640×480 and at least one higher resolution (e.g. 1280×720).
- [ ] No existing example modified/removed; `index.html` lists all examples.
