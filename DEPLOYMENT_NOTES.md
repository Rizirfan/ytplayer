# Deployment notes (Vercel)

## Frontend build error fixed (ENOENT / client/client/package.json)
Vercel was previously running the build with an incorrect working directory, resulting in:
- `npm ... /vercel/path0/client/client/package.json` not found

## Current Vercel build command
`vercel.json` now uses an explicit `cd client` before running the frontend build:

```json
{
  "buildCommand": "cd client && npm run build"
}
```

## How to verify locally
From repo root:
```bash
cd client && npm run build
```

(If you can build successfully locally, Vercel should also be able to.)

