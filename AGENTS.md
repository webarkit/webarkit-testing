# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Copilot, Antigravity/Gemini, …)
working in **webarkit-testing**. This file is the single source of truth; `CLAUDE.md`,
`GEMINI.md` and `.github/copilot-instructions.md` point here.

## What this repo is

The WebARKit **superproject**: build glue, the JavaScript controller and examples around the
[WebARKitLib](https://github.com/webarkit/WebARKitLib) C++ tracker, compiled to WASM.

| Path | Contents |
|---|---|
| `emscripten/WebARKitLib/` | git submodule: the C++ library (its own repo, its own PRs) |
| `emscripten/WebARKitJS.cpp`, `bindings.cpp` | Embind glue between C++ and JS |
| `src/` | JS controller (`WebARKitController.js`), entry `index.js`, `utils/` (GrayScale + GLSL) |
| `tools/makem.js` | emscripten compile driver |
| `build/` | WASM outputs (`webarkit_ES6_wasm.js`, `…simd.js`) — **committed** |
| `dist/` | webpack bundles (`WebARKit.js`, `GrayScale.js`) — **committed** |
| `examples/` | runnable demos (static image, webcam, workers) |
| `docs/` | design / audit notes only — **not** the live demo site |
| `opencv/`, `opencv_contrib/` | submodules (forked OpenCV 4.10.0); `opencv_js/` is the built output (git-ignored) |

## Build

Two stages. The WASM toolchain (emsdk 3.1.26) runs in Docker; no local emscripten needed.

```bash
npm install
npm run setup-docker          # one-time: creates container emscripten-webarkit-testing
./build_cv_w_docker.sh        # one-time: builds OpenCV into opencv_js/
npm run build-docker          # C++ -> build/*.js  (use this, NOT bare `npm run build`)
npm run build-es6             # JS bundle -> dist/
```

- If the container is stopped: `docker start emscripten-webarkit-testing`.
- **After any change to the WebARKitLib submodule or the C++ glue, run both
  `build-docker` and `build-es6`** and commit the regenerated `build/` + `dist/`.
  The emscripten output is not byte-reproducible; expect those files to change.

## Test

**Browser (this repo):** serve the repo root (`npm run serve`) and open
`examples/threejs_teblid_static_image_ES6_example.html`. It is deterministic (no webcam).
Despite the filename the default tracker is **AKAZE**; use `?tracker=teblid|orb|freak|akaze`.
A pass logs `Marker tracked ! Num. matches : N` and draws the cube on the pinball marker.
Check all four trackers when touching tracking code.

**Native C++ tests (inside the submodule):** CI runs them on `ubuntu-24.04`.
The prebuilt native OpenCV needs glibc ≥ 2.38, so they do **not** link in the
emscripten container (Ubuntu 20.04); use an `ubuntu:24.04` container.
Build in `tests/build` exactly as CI does — tests load `../pinball.jpg` relative to the
build directory:

```bash
cd emscripten/WebARKitLib/tests && mkdir build && cd build
cmake -DEMSCRIPTEN_COMP=0 .. && make
./webarkit_test && ./webarkit_nft_test && ./webarkit_nft_limit_test \
  && ./webarkit_nft_core_test && ./webarkit_param_test
```

## Workflow rules

- Branch from **`dev`**; PRs target `dev`. `main` is for releases.
- **Conventional Commits** (`feat:`, `fix:`, `docs:`, `test:`, `chore:` …), **signed** (`git commit -S`).
- Use the repository's own git identity — never override author/committer.
- A change that spans both repos is a **PR pair**: submodule PR → `WebARKitLib:dev`,
  superproject PR → `webarkit-testing:dev`. After the submodule PR merges, re-point the
  submodule at the merged `dev` tip (not at the PR branch commit).
- Do not push, tag or open PRs unless the maintainer asks.
- Releases are **tag only** (no GitHub Releases). Prepare the version bump; the maintainer pushes the tag.

## Things that are easy to get wrong

- **Two independent versions:** the npm package (`package.json`, e.g. 0.5.0) and the C++
  library (`WebARKitConfig.cpp` in the submodule, e.g. v0.12.0). Never bump one to match the other.
- **Live demos** are hosted in the `webarkit/webarkit.github.io` repo, not in `docs/`.
- Do not hand-edit `build/` or `dist/`; regenerate them.
- Don't mount a host folder at `/lib` in a Linux container (it shadows system libraries) — use `/work`.
- Performance claims need an A/B measurement (baseline build vs. change), not a single number.
