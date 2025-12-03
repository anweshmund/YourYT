const express = require('express');
const https = require('https');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Detect YouTube URL
function isYouTubeURL(str) {
  return /(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\b/i.test(str);
}

// YouTube Search Function
function searchYouTube(query) {
  const url =
    "https://www.youtube.com/results?search_query=" +
    encodeURIComponent(query);

  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          // Try multiple patterns to find video ID
          let match = data.match(/"videoId":"([^"]+)"/);
          if (!match) match = data.match(/videoIds":\["([^"]+)"/);
          if (!match) match = data.match(/watch\?v=([a-zA-Z0-9_-]{11})/);
          
          if (match && match[1]) {
            const videoId = match[1];
            resolve({
              videoId: videoId,
              url: "https://www.youtube.com/watch?v=" + videoId,
              embedUrl: "https://www.youtube.com/embed/" + videoId
            });
          } else {
            reject(new Error("No results found"));
          }
        });
      })
      .on("error", reject);
  });
}

// API endpoint to search/resolve YouTube link
app.post('/api/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const input = query.trim();

    // If it's already a YouTube URL, return it
    if (isYouTubeURL(input)) {
      // Extract video ID from URL
      const videoIdMatch = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      
      if (videoId) {
        return res.json({
          videoId: videoId,
          url: input,
          embedUrl: `https://www.youtube.com/embed/${videoId}`
        });
      } else {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
      }
    }

    // Otherwise, search YouTube
    const result = await searchYouTube(input);
    res.json(result);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message || 'Failed to search YouTube' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


