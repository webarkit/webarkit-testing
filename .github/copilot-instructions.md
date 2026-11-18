# Copilot instructions

Full agent instructions are in [AGENTS.md](../AGENTS.md) at the repository root. Key rules:

- This is the WebARKit superproject; the C++ tracker is the `emscripten/WebARKitLib` submodule.
- Build: `npm run build-docker` (WASM, inside the `emscripten-webarkit-testing` container),
  then `npm run build-es6` (bundle). Both are needed after any C++/submodule change, and the
  regenerated `build/` and `dist/` are committed. Never hand-edit them.
- Verify with `examples/threejs_teblid_static_image_ES6_example.html?tracker=akaze|teblid|orb|freak`.
- Native C++ tests run on Ubuntu 24.04 from `emscripten/WebARKitLib/tests/build`.
- Branch from `dev`; Conventional Commits, signed.
- The npm package version and the C++ library version are independent — don't sync them.
