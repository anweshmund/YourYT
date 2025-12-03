# YouTube Player UI

A beautiful web-based YouTube player with search functionality. Search for videos or paste YouTube links to play them directly in your browser.

## Features

- 🔍 Search YouTube videos by name
- 🔗 Play videos directly from YouTube URLs
- 🎨 Modern, responsive UI design
- ⚡ Fast and lightweight

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

1. **Search for videos**: Type any video name or song title in the search bar and click "Search"
2. **Paste YouTube links**: Paste any YouTube URL (e.g., `https://www.youtube.com/watch?v=...`) and click "Search"
3. **Play videos**: The video will automatically play in an embedded player

## How It Works

- The frontend (`script.js`) handles the UI and user interactions
- The backend (`server.js`) provides an API endpoint that:
  - Detects if input is a YouTube URL or search query
  - Searches YouTube if it's a query
  - Returns the video embed URL
- Videos are played using YouTube's embed API

## Requirements

- Node.js (v14 or higher)
- npm

## Dependencies

- express: Web server framework
- cors: Enable CORS for API requests


