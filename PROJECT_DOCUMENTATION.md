# YTPlayer (Full Project Documentation)

## 1) Overview
YTPlayer is a React + Node/Express application that plays YouTube tracks, supports searching, trending tracks, recently played, playlists, and user **Like** functionality (saved in MongoDB).  
Authentication is done using Firebase Auth (token verification middleware), and liked songs/recently played are stored per Firebase user.

---

## 2) Tech Stack
### Frontend
- React (TypeScript)
- Vite
- React Router
- Zustand (state management)
- Tailwind CSS + custom CSS variables
- lucide-react (icons)

### Backend
- Node.js + Express
- TypeScript
- MongoDB (Mongoose)
- Firebase Admin SDK (verifyIdToken)
- Axios (frontend calls backend)

---

## 3) Key Features
### Search
- User types in the search input (Navbar).
- Debounced search calls backend:
  - Backend uses `yt-search` to fetch video candidates.
- Results are shown on Home page.

### Trending
- Backend provides a “trending” list via search-based fallback queries (since `yt-search` doesn’t have a true “trending” endpoint).
- Home page renders “Trending Now”.

### Recently Played
- When tracks are played, they are added to user’s `recentlyPlayed` list.
- A dedicated UI shows recently played items.

### Playlists
- Users can create playlists.
- Playlist pages show tracks inside a playlist.

### Like / Unlike (Saved to DB)
- Heart button toggles like for the current track.
- Liked songs are persisted in MongoDB under the logged-in user.

---

## 4) Important Pages / Components (Frontend)
- `client/src/pages/Home.tsx`
  - Trending section
  - Search results section
  - UI skeleton handling during search loading
- `client/src/components/Player.tsx`
  - Like button for currently playing track
- `client/src/components/TrackExpandedView.tsx`
  - Like button inside the “Now Playing” expanded modal
- `client/src/pages/Library.tsx`
  - Shows “Liked Songs” list
- `client/src/components/Sidebar.tsx`
  - Navigation links (e.g., Browse routed to `/`)

---

## 5) State Stores (Frontend)
- `client/src/store/useSearchStore.ts`
  - search query, results, loading state
- `client/src/store/usePlayerStore.ts`
  - currentTrack, queue, playback actions
- `client/src/store/useUserStore.ts`
  - `likedSongs`, `fetchLikedSongs`, `toggleLike`, `isLiked`

---

## 6) Backend Endpoints (API)
Base URL pattern (frontend default):
- `http://localhost:5000/api` (or value of `VITE_API_URL`)

### Auth Middleware
- `verifyToken` (Firebase)
  - Reads `Authorization: Bearer <token>`
  - Verifies Firebase token
  - Ensures a MongoDB user exists for the Firebase `uid`

### Music
- `GET /api/music/search?q=...`
- `GET /api/music/trending`

### Users (Liked Songs)
- `GET /api/users/liked-songs`
- `POST /api/users/like`
  - Body:
    
```json
    {
      "track": {
        "id": "youtubeVideoId",
        "title": "...",
        "artist": "...",
        "thumbnail": "...",
        "duration": "..."
      }
    }
    ```

### Users (Recently Played)
- `POST /api/users/recent`
  - Body:
    
```json
    { "trackId": "youtubeVideoId" }
    ```

---

## 7) Database Models
### User Model
File:
- `server/src/models/User.ts`

Collections store:
- `firebaseId` (unique)
- `email`, `displayName`, `photoURL`
- `likedSongs`: array of subdocuments:
  - `id`, `title`, `artist`, `thumbnail`, `duration` (all `String`)
- `recentlyPlayed`: array of `{ trackId, playedAt }`

---

## 8) Fixes Applied (Most Recent Bug Fixes)
### A) Search “Blank Space While Searching”
- **File:** `client/src/pages/Home.tsx`
- **Fix:** Search results rendering now shows skeleton UI whenever `isLoading` is true, preventing empty/blank layout during transitions.

### B) Like Button Not Working (500 Internal Server Error)
Symptoms:
- UI heart click triggered but no visible change.
- Console showed:
  - `POST http://localhost:5001/api/users/like 500`

Root cause:
- Backend `likedSongs.duration` in Mongoose schema expects `String`, but incoming track data could have incompatible shape/type.

Fixes:
1) **Backend sanitation**
   - **File:** `server/src/controllers/userController.ts`
   - `toggleLikeSong` now sanitizes `track` into schema-compatible fields and converts `duration` to `String`.

2) **Frontend normalization**
   - **File:** `client/src/store/useUserStore.ts`
   - Normalizes `likedSongs` response and makes `isLiked()` robust for `id` vs `videoId` vs string ids.

After these changes:
- Clicking Like/Unlike works.
- Hearts update visually.
- Liked songs persist correctly.

---

## 9) How to Run (Recommended)
> Exact steps can vary depending on your environment and Firebase configuration.

### Backend
1. Go to `server/`
2. Install dependencies:
   - `npm install`
3. Configure Firebase Admin credentials (serviceAccountKey / env vars as used in repo)
4. Start server:
   - `npm run dev` (or `npm start`)

### Frontend
1. Go to `client/`
2. Install dependencies:
   - `npm install`
3. Configure `VITE_API_URL` (if needed)
4. Start:
   - `npm run dev`

---

## 10) Test Checklist (What to Verify Manually)
### Frontend
- [ ] Search typing shows skeleton/loading (no blank area)
- [ ] Search results render correctly (cards appear)
- [ ] Clicking ♥ toggles Heart state (Player bar)
- [ ] Clicking ♥ toggles Heart state (expanded modal)
- [ ] Library → Liked Songs list updates after toggle
- [ ] Navigation links work (Browse routes to `/`)

### Backend
- [ ] `GET /api/users/liked-songs` returns correct liked list
- [ ] `POST /api/users/like` toggles like without 500
- [ ] Invalid payload handling returns 400 (if track id missing)
- [ ] User auto-create on token verify works

---

## 11) Project Structure Quick View
- `client/src/`:
  - `pages/` UI screens
  - `components/` reusable UI
  - `store/` zustand stores
  - `api/` backend client methods
- `server/src/`:
  - `routes/` API routes
  - `controllers/` request handlers
  - `models/` Mongoose schemas
  - `middleware/` auth

---

## 12) Notes / Known Logs
- You may see YouTube embed “blocked by client” and permission policy console messages.  
  These are from YouTube iframe/probing and are not related to Like/search logic.
