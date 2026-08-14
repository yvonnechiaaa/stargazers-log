/**
 * Fetch and render the list of starred repositories
 */

/**
 * Escape HTML special characters to prevent XSS attacks
 * @param {string} text - The text to escape
 * @returns {string} - The escaped text
 */
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function fetchAndRenderRepositories() {
  const listContainer = document.getElementById('repositories-list');
  const loadingElement = document.getElementById('loading');

  // Validate that required elements exist
  if (!listContainer) {
    console.error('Error: repositories-list element not found in the DOM');
    return;
  }

  try {
    // Fetch the events.json file
    const response = await fetch('events.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch events.json: ${response.statusText}`);
    }

    const repositories = await response.json();

    // Validate that repositories is an array
    if (!Array.isArray(repositories)) {
      throw new Error('Invalid data format: expected an array of repositories');
    }

    // Check if the array is empty
    if (repositories.length === 0) {
      if (loadingElement) {
        loadingElement.textContent = 'No repositories found.';
      }
      return;
    }

    // Clear the loading message
    if (loadingElement) {
      loadingElement.remove();
    }

    // Render each repository
    repositories.forEach((repo, index) => {
      try {
        // Validate required fields
        if (!repo.name || !repo.url || !repo.description || !repo.language || repo.stars === undefined || !repo.starredAt) {
          console.warn(`Repository at index ${index} is missing required fields, skipping`, repo);
          return;
        }

        const listItem = document.createElement('li');
        listItem.className = 'repository-item';
        listItem.setAttribute('role', 'listitem');

        // Format the starred date
        const starredDate = new Date(repo.starredAt);
        const formattedDate = starredDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Escape HTML special characters to prevent XSS
        const escapedName = escapeHtml(repo.name);
        const escapedOwner = escapeHtml(repo.owner);
        const escapedDescription = escapeHtml(repo.description);
        const escapedLanguage = escapeHtml(repo.language);
        const escapedUrl = escapeHtml(repo.url);

        // Create the HTML content for the repository
        listItem.innerHTML = `
          <div class="repo-header">
            <a href="${escapedUrl}" class="repo-name" target="_blank" rel="noopener noreferrer" aria-label="${escapedName} (opens in new window)">
              ${escapedName}
            </a>
            <span class="language-badge" aria-label="Language: ${escapedLanguage}">${escapedLanguage}</span>
          </div>
          <div class="repo-owner">by @${escapedOwner}</div>
          <div class="repo-description">${escapedDescription}</div>
          <div class="repo-meta">
            <span class="repo-stars" aria-label="Stars">⭐ ${repo.stars.toLocaleString()}</span>
            <span class="repo-date" aria-label="Starred on">📅 ${formattedDate}</span>
          </div>
        `;

        listContainer.appendChild(listItem);
      } catch (itemError) {
        console.error(`Error rendering repository at index ${index}:`, itemError, repo);
      }
    });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    if (loadingElement) {
      loadingElement.textContent = 'Error loading repositories. Please check the console for details.';
      loadingElement.setAttribute('role', 'alert');
    }
  }
}

// Fetch and render repositories when the DOM is loaded
document.addEventListener('DOMContentLoaded', fetchAndRenderRepositories);
