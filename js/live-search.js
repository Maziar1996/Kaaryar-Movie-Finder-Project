const searchInput = document.getElementById("search-input");
const dropdown = document.getElementById("search-dropdown");
const resultsContainer = document.getElementById("dropdown-results");

if (!searchInput || !dropdown || !resultsContainer) {
  console.warn("Live Search: Required elements not found!");
}

let debounceTimeout;

function showDropdown() {
  dropdown.classList.add("show");
}
function hideDropdown() {
  dropdown.classList.remove("show");
}

async function fetchSuggestions(query) {
  if (!query.trim()) {
    hideDropdown();
    return;
  }
  try {
    const movies = await TMDB.searchMovies(query, 1);
    const limited = movies.slice(0, 8);

    if (limited.length === 0) {
      resultsContainer.innerHTML = `<div class="dropdown-empty">No results found</div>`;
      showDropdown();
      return;
    }

    resultsContainer.innerHTML = limited
      .map((movie) => {
        const poster = movie.poster_path
          ? `${TMDB.IMG_URL}w92${movie.poster_path}`
          : TMDB.DEFAULT_POSTER;

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
        const id = item.dataset.id;
        window.location.href = `pages/movie-details.html?id=${id}`;
      });
    });

    showDropdown();
  } catch (error) {
    console.error("Live search error:", error);
    hideDropdown();
  }
}
function debounceSearch() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    fetchSuggestions(searchInput.value);
  }, 400);
}

searchInput?.addEventListener("input", debounceSearch);

searchInput?.addEventListener("focus", () => {
  if (searchInput.value.trim()) {
    debounceSearch();
  }
});

document.addEventListener("click", (e) => {
  if (!searchInput?.contains(e.target) && !dropdown?.contains(e.target)) {
    hideDropdown();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideDropdown();
    searchInput?.blur();
  }
});
