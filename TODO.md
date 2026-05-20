# TODO

- [x] Investigate the TS6053 error cause (Vercel build referencing missing client tsconfig files).
- [x] Verified `client/tsconfig.app.json` and `client/tsconfig.node.json` exist.
- [x] Verified local build succeeds when running `npm -C client run build`.
- [ ] Update Vercel configuration: set Build Command to `npm --prefix client run build` (or equivalent).
- [ ] Re-run Vercel build to confirm TS6053 is resolved.

