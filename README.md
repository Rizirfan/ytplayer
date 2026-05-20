# WaveTube 🎵

WaveTube is a high-performance, premium music streaming application inspired by Spotify, powered by the YouTube Data API and YouTube Embedded Player. Experience a cinematic interface with real-time audio visualization, global search, and personalized libraries.

![WaveTube Banner](https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=1200&h=400&fit=crop)

## ✨ Features

- **Premium UI/UX**: Futuristic dark theme with glassmorphism, dynamic gradients, and smooth Framer Motion animations.
- **Powered by YouTube**: Access millions of tracks via the YouTube Data API v3.
- **Persistent Player**: Seamless playback across the app with queue management, shuffle, and repeat modes.
- **Audio Visualizer**: Real-time canvas-based frequency visualizer.
- **Global Search**: Debounced search with instant results.
- **Smart Playlists**: Create, manage, and share your favorite tracks.
- **Authentication**: Secure Google Social Login via Firebase.

## 🚀 Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion, Zustand
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: Firebase Authentication
- **API**: YouTube Data API v3
- **Player**: `react-youtube`

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/wavetube.git
cd wavetube
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Update .env with your MongoDB URI, Firebase credentials, and YT API Key
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
cp .env.example .env
# Update .env with your Firebase and YouTube API keys
npm run dev
```

## 🌍 Deployment

### Frontend (Vercel)
1. Push your code to GitHub.
2. Import the `client` folder to Vercel.
3. Configure Environment Variables.

### Backend (Render/Railway)
1. Push your code to GitHub.
2. Deploy the `server` folder to Render/Railway as a Web Service.
3. Set up MongoDB Atlas for the database.

## 📜 License
MIT License. Created with ❤️ by WaveTube Team.
