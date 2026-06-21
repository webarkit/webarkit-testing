# webarkit-testing

The **WebARKit** superproject: the build glue, the JavaScript controller, and the
examples that exercise the [WebARKitLib](https://github.com/webarkit/WebARKitLib)
C++/WASM tracker in the browser.

WebARKit is a browser-side Augmented Reality tracker — an emscripten port of the
**OCVT** planar-tracking design from [ArtoolkitX](https://github.com/artoolkitx/artoolkitx).
This repo compiles that C++ library to WebAssembly, wraps it in a small JS API, and
ships runnable examples. It is the experimental/testing home for WebARKit while the
design stabilises.

> **Two version numbers, on purpose.** The npm package (`package.json`) and the C++
> library (`WebARKitLib/.../WebARKitConfig.cpp`) version independently — they are
> different artifacts, so their version numbers differ.

## Repository layout

| Path | What |
|---|---|
| `src/WebARKitController.js` | the public JS API — `init_raw()` / `process_raw()`, the `getMarker` event, and the pose/matrix getters |
| `src/utils/GrayScale.js` | standalone grayscale helper (separate webpack bundle, used by the feature-trackers example) |
| `emscripten/WebARKitJS.{h,cpp}` | the C++↔JS wrapper class exposed to WebAssembly |
| `emscripten/bindings.cpp` | emscripten `EMSCRIPTEN_BINDINGS` — the C++ methods/enums surfaced to JS |
| `emscripten/WebARKitLib/` | **git submodule** → the [WebARKitLib](https://github.com/webarkit/WebARKitLib) C++ source (the actual tracker) |
| `tools/makem.js` | the emscripten compile driver (invoked by `npm run build`) |
| `build/` | WASM build outputs (`webarkit_ES6_wasm.js`, `…simd.js`) |
| `dist/` | webpack bundles (`WebARKit.js`, `GrayScale.js`) — what consumers load |
| `examples/` | runnable demos (see below) |
| `docs/` | design docs for the architectural decisions (see [Design docs](#design-docs)) |

## Prerequisites

- **Docker** (the WASM toolchain runs in a container — you do not need a local emscripten install).
- **Node.js** + npm (for the webpack bundle and the dev server).
- Emscripten **emsdk 3.1.26** and a forked **OpenCV 4.10.0** — both handled via Docker below. OpenCV does **not** need a separate download: `opencv` and `opencv_contrib` are vendored as git submodules (fetched by the recursive clone) and compiled by `build_cv_w_docker.sh`.

## Getting started

Clone **recursively** — the WebARKitLib, `opencv`, and `opencv_contrib` submodules
are all vendored, so this fetches everything (no separate OpenCV download):

```bash
git clone --recursive https://github.com/webarkit/webarkit-testing.git
cd webarkit-testing
npm install
```

### Build flow (two steps)

The build is **two stages**: compile the C++ to WASM, then bundle the JS.

```bash
# 1. one-time: create the emscripten build container
npm run setup-docker

# 2a. build OpenCV (only needed once, or when the OpenCV fork changes)
./build_cv_w_docker.sh

# 2b. compile WebARKitLib -> WASM (build/), inside the container
npm run build-docker

# 3. bundle the JS -> dist/WebARKit.js
npm run build-es6
```

- **`npm run build-docker`** runs the emscripten build (`tools/makem.js`) inside the
  `emscripten-webarkit-testing` container — use this, not the bare `npm run build`,
  unless you have a local emscripten 3.1.26 toolchain.
- **`npm run build-es6`** produces the production `dist/` bundle. For an auto-rebuilding
  dev bundle use `npm run dev-es6`; for a debug WASM build use `npm run build-docker-debug`.

> After **any** change to the C++ submodule you must re-run `build-docker` **and**
> `build-es6`; the committed `build/` + `dist/` artifacts are the built output. (The
> emscripten output is generally not byte-reproducible, so expect those files to change.)

### Run the examples

```bash
npm run serve          # serves the repo (npx http-server)
# then open examples/index.html in a browser
```

Point the camera (or the static demo image) at `examples/data/pinball.jpg`. On a match
you'll see the tracked overlay. Examples are desktop-first.

| Example | Tracker | Notes |
|---|---|---|
| `examples/threejs_teblid_static_image_ES6_example.html` | Teblid | three.js cube on a still image |
| `examples/threejs_teblid_webcam_ES6_example.html` | Teblid | three.js cube on the live webcam |
| `examples/feature_trackers_example.html` | Akaze / ORB / Freak / Teblid | picks the detector via a URL param |

Live demos: [www.webarkit.org/examples/webarkit-testing](https://www.webarkit.org/examples/webarkit-testing)

## The WebARKitLib submodule

The C++ tracker lives in `emscripten/WebARKitLib` as a submodule tracking
`webarkit/WebARKitLib`'s `dev` branch. For **cross-repo work**:

1. Branch from `dev` in *both* repos.
2. Make the C++ change in the submodule; make the glue/example/build change here.
3. Open a **PR pair** (submodule PR → `WebARKitLib:dev`, superproject PR → `webarkit-testing:dev`).
4. After the submodule PR merges, re-bump the submodule pointer to the merged `dev` tip.

## Design docs

The architecture and the non-obvious tracking decisions are documented under `docs/`:

- [`design-projection-and-pose-artoolkitx-alignment.md`](docs/design-projection-and-pose-artoolkitx-alignment.md) — the pose/projection/handedness pipeline, aligned to ArtoolkitX.
- [`design-pose-cv-to-gl-fix.md`](docs/design-pose-cv-to-gl-fix.md) — OpenCV→GL pose conversion (D·R·D).
- [`design-center-origin-option.md`](docs/design-center-origin-option.md) — `setOriginCentered`.
- [`design-detection-downsampling.md`](docs/design-detection-downsampling.md) + [`design-detection-guard.md`](docs/design-detection-guard.md) — detection-side performance.
- [`design-tracking-loss-fix.md`](docs/design-tracking-loss-fix.md) — tracking-loss handling.
- [`design-static-image-teblid-example.md`](docs/design-static-image-teblid-example.md) + [`design-webcam-teblid-example.md`](docs/design-webcam-teblid-example.md) — the examples.
- [`audit-dead-code-issue50.md`](docs/audit-dead-code-issue50.md) — the C++ dead-code inventory + keep/remove decisions.

## Contributing

Please read [`./CONTRIBUTING.md`](./CONTRIBUTING.md) for the full guidelines. In short:

- Branch from `dev`; PR back to `dev`; sign your commits.
- **Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/)**
  (e.g. `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- For C++ changes, see the cross-repo PR-pair flow above and verify against both examples.

## License

LGPL-3.0.
