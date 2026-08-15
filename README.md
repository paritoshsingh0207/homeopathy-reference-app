# Homeopathy Reference App

Deployment-only repository for the audited Homeopathy Reference PWA.

## Production snapshot

- Source corpus and build pipeline remain private in `paritoshsingh0207/homeopathy-phase2`.
- This public repository contains only the compiled static application and runtime data required by end users.
- Production source: audited Unified v3 build, workflow run `31894550729`.
- Deployment branch: `gh-pages`.
- Runtime manifest: v3, 1,835 files, 683 medicines, 38 symptom chapters.
- Kent repertory release contract: 38 canonical chapters.
- No live AI or paid backend is required by the deployed PWA.

## GitHub Pages

Publish from the `gh-pages` branch and the repository root (`/`). The expected project-site URL is:

`https://paritoshsingh0207.github.io/homeopathy-reference-app/`

The compiled PWA uses relative asset/data paths so it works correctly under the GitHub Pages project subpath.
