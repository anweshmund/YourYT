# YouTube Player UI

A beautiful, fully-featured web-based YouTube player with search functionality, video controls, and download capability.

## Features

- 🔍 **Search YouTube videos** by name or paste YouTube URLs
- ▶️ **Video Controls**: Play, Pause, Stop, and Volume control
- ⬇️ **Download Videos**: Download YouTube videos directly to your device
- 🎨 **Modern, Responsive UI**: Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Fast and Lightweight**: Optimized for performance

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Searching and Playing Videos
1. **Search for videos**: Type any video name or song title in the search bar and click "Search"
2. **Paste YouTube links**: Paste any YouTube URL (e.g., `https://www.youtube.com/watch?v=...`) and click "Search"
3. **Play videos**: The video will automatically play in an embedded player

### Video Controls
- **Play/Pause**: Click the play/pause button to control playback
- **Stop**: Stop the video completely
- **Volume**: Use the volume slider or +/- buttons to adjust volume (0-100%)

### Downloading Videos
- Click the "Download Video" button to download the current video
- The video will be saved with its original title as the filename
- Downloads are in MP4 format

## How It Works

- **Frontend (`script.js`)**: 
  - Handles UI interactions and user input
  - Uses YouTube IFrame API for video playback and controls
  - Manages video state and control buttons

- **Backend (`server.js`)**: 
  - Provides API endpoints for search and download
  - Detects if input is a YouTube URL or search query
  - Searches YouTube if it's a query
  - Streams video downloads using ytdl-core

## Responsive Design

The UI is fully responsive and optimized for:
- **Desktop**: Full-featured experience with all controls visible
- **Tablet**: Adapted layout with touch-friendly controls
- **Mobile**: Compact design with essential controls, labels hidden on small screens

## Requirements

- Node.js (v14 or higher)
- npm

## Dependencies

- **express**: Web server framework
- **cors**: Enable CORS for API requests
- **ytdl-core**: YouTube video download library

## API Endpoints

- `POST /api/search`: Search YouTube or resolve video URL
- `GET /api/download/:videoId`: Download video by video ID

## Notes

- Video downloads may take some time depending on video length and your internet connection
- Some videos may have download restrictions based on YouTube's policies
- The player uses YouTube's official embed API for reliable playback
