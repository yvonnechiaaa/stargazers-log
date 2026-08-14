/**
 * Fetch and render the list of starred repositories
 */

async function fetchAndRenderRepositories() {
  const listContainer = document.getElementById('repositories-list');
  const loadingElement = document.getElementById('loading');

  try {
    // Fetch the events.json file
    const response = await fetch('events.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch events.json: ${response.statusText}`);
    }

    const repositories = await response.json();

    // Clear the loading message
    if (loadingElement) {
      loadingElement.remove();
    }

    // Render each repository
    repositories.forEach(repo => {
      const listItem = document.createElement('li');
      listItem.className = 'repository-item';

      // Format the starred date
      const starredDate = new Date(repo.starredAt);
      const formattedDate = starredDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Create the HTML content for the repository
      listItem.innerHTML = `
        <div class="repo-header">
          <a href="${repo.url}" class="repo-name" target="_blank" rel="noopener noreferrer">
            ${repo.name}
          </a>
          <span class="language-badge">${repo.language}</span>
        </div>
        <div class="repo-owner">by @${repo.owner}</div>
        <div class="repo-description">${repo.description}</div>
        <div class="repo-meta">
          <div class="repo-stars">${repo.stars.toLocaleString()}</div>
          <div class="repo-date">${formattedDate}</div>
        </div>
      `;

      listContainer.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    if (loadingElement) {
      loadingElement.textContent = 'Error loading repositories. Please check the console for details.';
    }
  }
}

// Fetch and render repositories when the DOM is loaded
document.addEventListener('DOMContentLoaded', fetchAndRenderRepositories);
