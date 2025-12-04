document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const dropdown = document.getElementById("search-dropdown");
  const resultsContainer = document.getElementById("dropdown-results");

  if (!searchInput || !searchButton) {
    console.warn("Search bar not found on this page");
    return;
  }

  let debounceTimeout;

  const performSearch = () => {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `/pages/search-results.html?query=${encodeURIComponent(
        query
      )}`;
    }
  };

  searchButton.addEventListener("click", performSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  });

  if (dropdown && resultsContainer && window.TMDB) {
    const showDropdown = () => dropdown.classList.add("show");
    const hideDropdown = () => dropdown.classList.remove("show");

    const fetchSuggestions = async (query) => {
      if (!query.trim()) {
        hideDropdown();
        return;
      }
      try {
        const movies = await window.TMDB.searchMovies(query, 1);
        const limited = movies.slice(0, 8);

        if (limited.length === 0) {
          resultsContainer.innerHTML = `<div class="dropdown-empty">No results found</div>`;
          showDropdown();
          return;
        }

        resultsContainer.innerHTML = limited
          .map((movie) => {
            const poster = movie.poster_path
              ? `${window.TMDB.IMG_URL}w92${movie.poster_path}
          `
              : window.TMDB.DEFAULT_POSTER;
            const year = movie.release_date?.split("-")[0] || "----";

            return `
            <div class="dropdown-item" data-id="${movie.id}">
              <img src="${poster}" alt="${movie.title}" loading="lazy">
              <div class="info">
                <div class="title">${movie.title}</div>
                <div class="year">${year}</div>
              </div>
            </div>
          `;
          })
          .join("");

        document.querySelectorAll(".dropdown-item").forEach((item) => {
          item.addEventListener("click", () => {
            window.location.href = `/pages/movie-details.html?id=${item.dataset.id}`;
          });
        });

        showDropdown();
      } catch (error) {
        console.error("Live search error:", error);
        hideDropdown();
      }
    };

    const debounceSearch = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        fetchSuggestions(searchInput.value.trim());
      }, 400);
    };

    searchInput.addEventListener("input", debounceSearch);
    searchInput.addEventListener("focus", () => {
      if (searchInput.value.trim()) debounceSearch();
    });

    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        hideDropdown();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hideDropdown();
        searchInput.blur();
      }
    });
  }
});
