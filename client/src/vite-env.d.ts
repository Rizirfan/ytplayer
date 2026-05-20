/// <reference types="vite/client" />
/// <reference types="react" />

import type React from 'react';

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// react-youtube / youtube-player can ship typings that rely on prop-types and other deep paths.
// These declarations prevent TS7016 from breaking local builds.
// Avoid module augmentation here; we just want TS to accept the modules as `any`.
// Let @types/prop-types provide typings for prop-types.






