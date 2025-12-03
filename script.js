// Client-side JavaScript for YouTube Player UI with Controls

let ytPlayer = null;
let currentVideoData = null;
let isPlaying = false;
let ytAPIReady = false;

// Wait for YouTube IFrame API to load
window.onYouTubeIframeAPIReady = function() {
  ytAPIReady = true;
  console.log('YouTube IFrame API ready');
};

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const videoContainer = document.getElementById('videoContainer');
  const controlsContainer = document.getElementById('controlsContainer');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const errorMessage = document.getElementById('errorMessage');
  const videoInfo = document.getElementById('videoInfo');
  const currentVideoUrl = document.getElementById('currentVideoUrl');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const stopBtn = document.getElementById('stopBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeDownBtn = document.getElementById('volumeDownBtn');
  const volumeUpBtn = document.getElementById('volumeUpBtn');
  const volumeValue = document.getElementById('volumeValue');
  const downloadBtn = document.getElementById('downloadBtn');
  const downloadProgress = document.getElementById('downloadProgress');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');

  // Handle search button click
  searchButton.addEventListener('click', handleSearch);
  
  // Handle Enter key in search input
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });

  // Control button event listeners
  playPauseBtn.addEventListener('click', togglePlayPause);
  stopBtn.addEventListener('click', stopVideo);
  volumeSlider.addEventListener('input', updateVolume);
  volumeDownBtn.addEventListener('click', () => {
    volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
    updateVolume();
  });
  volumeUpBtn.addEventListener('click', () => {
    volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
    updateVolume();
  });
  downloadBtn.addEventListener('click', downloadVideo);

  async function handleSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
      showError('Please enter a YouTube link or search query');
      return;
    }

    // Clear previous results
    hideError();
    hideVideo();
    showLoading();

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      // Store video data
      currentVideoData = data;

      // Display the video
      displayVideo(data);
      
    } catch (error) {
      console.error('Error:', error);
      showError(error.message || 'Failed to search YouTube. Please try again.');
    } finally {
      hideLoading();
    }
  }

  function displayVideo(data) {
    // Wait for YouTube API if not ready
    if (!ytAPIReady || typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
      showError('YouTube API is loading. Please wait a moment and try again.');
      setTimeout(() => displayVideo(data), 1000);
      return;
    }

    // Destroy existing player if any
    if (ytPlayer) {
      ytPlayer.destroy();
      ytPlayer = null;
    }

    // Create YouTube player
    ytPlayer = new YT.Player('player', {
      height: '500',
      width: '100%',
      videoId: data.videoId,
      playerVars: {
        'autoplay': 1,
        'controls': 1,
        'rel': 0,
        'modestbranding': 1,
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError
      }
    });

    // Show video info
    if (currentVideoUrl) {
      currentVideoUrl.href = data.url;
      currentVideoUrl.textContent = data.url;
      currentVideoUrl.target = '_blank';
    }

    videoContainer.style.display = 'block';
    if (videoInfo) {
      videoInfo.style.display = 'block';
    }
  }

  function onPlayerReady(event) {
    // Set initial volume
    event.target.setVolume(parseInt(volumeSlider.value));
    isPlaying = true;
    updatePlayPauseButton();
    controlsContainer.style.display = 'block';
  }

  function onPlayerStateChange(event) {
    // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
    if (event.data === YT.PlayerState.PLAYING) {
      isPlaying = true;
    } else if (event.data === YT.PlayerState.PAUSED) {
      isPlaying = false;
    } else if (event.data === YT.PlayerState.ENDED) {
      isPlaying = false;
    }
    updatePlayPauseButton();
  }

  function onPlayerError(event) {
    showError('Error loading video. Please try another video.');
    console.error('YouTube player error:', event.data);
  }

  function togglePlayPause() {
    if (!ytPlayer) return;

    if (isPlaying) {
      ytPlayer.pauseVideo();
    } else {
      ytPlayer.playVideo();
    }
  }

  function stopVideo() {
    if (!ytPlayer) return;
    ytPlayer.stopVideo();
    isPlaying = false;
    updatePlayPauseButton();
  }

  function updateVolume() {
    if (!ytPlayer) return;
    const volume = parseInt(volumeSlider.value);
    ytPlayer.setVolume(volume);
    volumeValue.textContent = volume + '%';
  }

  function updatePlayPauseButton() {
    const icon = playPauseBtn.querySelector('.btn-icon');
    const label = playPauseBtn.querySelector('.btn-label');
    
    if (isPlaying) {
      icon.textContent = '⏸';
      label.textContent = 'Pause';
    } else {
      icon.textContent = '▶';
      label.textContent = 'Play';
    }
  }

  async function downloadVideo() {
    if (!currentVideoData || !currentVideoData.videoId) {
      showError('No video selected');
      return;
    }

    downloadBtn.disabled = true;
    downloadProgress.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Preparing download...';

    try {
      const response = await fetch(`/api/download/${currentVideoData.videoId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Get filename from headers or use default
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'video.mp4';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      progressFill.style.width = '100%';
      progressText.textContent = 'Download complete!';

      setTimeout(() => {
        downloadProgress.style.display = 'none';
        downloadBtn.disabled = false;
      }, 2000);

    } catch (error) {
      console.error('Download error:', error);
      showError('Failed to download video. Please try again.');
      downloadProgress.style.display = 'none';
      downloadBtn.disabled = false;
    }
  }

  function showLoading() {
    if (loadingSpinner) {
      loadingSpinner.style.display = 'block';
    }
  }

  function hideLoading() {
    if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }
  }

  function showError(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
    }
  }

  function hideError() {
    if (errorMessage) {
      errorMessage.style.display = 'none';
    }
  }

  function hideVideo() {
    if (ytPlayer) {
      ytPlayer.destroy();
      ytPlayer = null;
    }
    videoContainer.style.display = 'none';
    controlsContainer.style.display = 'none';
    if (videoInfo) {
      videoInfo.style.display = 'none';
    }
  }
});
