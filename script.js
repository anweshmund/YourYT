// Client-side JavaScript for YouTube Player UI

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const videoContainer = document.getElementById('videoContainer');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const errorMessage = document.getElementById('errorMessage');
  const videoInfo = document.getElementById('videoInfo');
  const currentVideoUrl = document.getElementById('currentVideoUrl');

  // Handle search button click
  searchButton.addEventListener('click', handleSearch);
  
  // Handle Enter key in search input
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });

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
    const iframe = document.createElement('iframe');
    iframe.src = data.embedUrl;
    iframe.width = '100%';
    iframe.height = '500';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.borderRadius = '12px';
    iframe.style.marginTop = '20px';

    // Clear container and add iframe
    videoContainer.innerHTML = '';
    videoContainer.appendChild(iframe);

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
    videoContainer.style.display = 'none';
    if (videoInfo) {
      videoInfo.style.display = 'none';
    }
  }
});
