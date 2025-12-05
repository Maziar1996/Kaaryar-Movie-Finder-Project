import { setGenres } from "./ui.js";

const genreSidebarList = document.getElementById("genre-sidebar-list");
const currentGenreNameEl = document.getElementById("current-genre-name");
const pageTitle =
  document.getElementById("page-title") || document.querySelector("title");
const totalResultsEl = document.getElementById("total-results");
const sortButton = document.getElementById("sort-button");
const sortDropdown = document.getElementById("sort-dropdown");
const sortText = document.getElementById("sort-text");
const moviesGrid = document.getElementById("genre-movies-grid");
const loadMoreBtn = document.getElementById("load-more-btn");
const loadMoreContainer = document.getElementById("load-more-container");

let currentGenreId = null;
let currentGenreName = "";
let currentPage = 1;
let currentSort = "popularity.desc";
let isLoading = false;
let totalPages = 1;
let moviesPerPage = 7;

const MAIN_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 878, name: "Science Fiction" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 9648, name: "Mystery" },
  { id: 53, name: "Thriller" },
];

function populateSidebar() {
  if (!genreSidebarList) return;

  genreSidebarList.innerHTML = "";
  MAIN_GENRES.forEach((genre) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `?id=${genre.id}&name=${encodeURIComponent(genre.name)}`;
    a.textContent = genre.name;

    if (genre.id === currentGenreId) {
      a.classList.add("active");
      if (currentGenreNameEl) currentGenreNameEl.textContent = genre.name;
      if (pageTitle)
        pageTitle.textContent = `${genre.name} Movies - Movie Finder`;
    }

    li.appendChild(a);
    genreSidebarList.appendChild(li);
  });
}

function renderGenreMovieCard(movie) {
  if (!moviesGrid) return;

  const card = document.createElement("div");
  card.className = "genre-movie-card";

  const poster = movie.poster_path
    ? `${TMDB.IMG_URL}w500${movie.poster_path}`
    : TMDB.DEFAULT_POSTER;

  const genres = (movie.genre_ids || [])
    .slice(0, 3)
    .map((id) => window.TMDB_GENRES?.[id] || "")
    .filter(Boolean);

  card.innerHTML = `
    <img src="${poster}" alt="${movie.title}" loading="lazy">
    <div class="genre-movie-info">
      <h3 class="genre-movie-title">${movie.title}</h3>
      <div class="genre-movie-meta">
        ${movie.release_date?.split("-")[0] || "N/A"} • 
        ${
          movie.runtime
            ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
            : "N/A"
        }
      </div>
      <div class="genre-movie-genres">
        ${
          genres.length
            ? genres.map((g) => `<span>${g}</span>`).join("")
            : "<span>Unknown</span>"
        }
      </div>
      <p class="genre-movie-overview">${
        movie.overview || "No overview available."
      }</p>
      <div class="genre-movie-details">
        <strong>Director:</strong> ${movie.director || "Unknown"}<br>
        <strong>Stars:</strong> ${
          movie.cast?.slice(0, 3).join(", ") || "Unknown"
        }
      </div>
      <div class="genre-movie-rating">
        ⭐ ${movie.vote_average?.toFixed(1) || "N/A"} (${
    movie.vote_count?.toLocaleString() || 0
  })
      </div>
    </div>
  `;

  card.style.cursor = "pointer";
  card.addEventListener("click", () => {
    window.location.href = `/pages/movie-details.html?id=${movie.id}`;
  });

  moviesGrid.appendChild(card);
}

async function loadGenreMovies(append = false) {
  if (isLoading) return;
  isLoading = true;

  if (!append) {
    moviesGrid.innerHTML =
      "<p style='text-align:center;padding:80px;color:#aaa;'>Loading movies...</p>";
  }

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${currentGenreId}&sort_by=${currentSort}&page=${currentPage}&language=en-US`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!append) {
      totalResultsEl.textContent = `${data.total_results?.toLocaleString()} titles`;
      totalPages = data.total_pages || 1;
      moviesGrid.innerHTML = "";
    }

    for (const movie of data.results.slice(0, 7)) {
      const details = await TMDB.getMovieDetails(movie.id);
      const credits = await TMDB.getMovieCredits(movie.id);

      const director =
        credits.crew?.find((c) => c.job === "Director")?.name || "Unknown";
      const cast = credits.cast?.slice(0, 5).map((c) => c.name) || [];

      renderGenreMovieCard({
        ...movie,
        director,
        cast,
        runtime: details.runtime || null,
      });
    }

    currentPage++;
    isLoading = false;

    if (data.results.length < 20 || currentPage > data.total_pages) {
      if (loadMoreContainer) loadMoreContainer.style.display = "none";
    } else {
      if (loadMoreContainer) loadMoreContainer.style.display = "block";
    }
  } catch (error) {
    isLoading = false;
    moviesGrid.innerHTML +=
      "<p style='color:#f66;text-align:center;'>Error loading more movies.</p>";
    console.error(error);
  }
}

if (sortButton && sortDropdown) {
  sortButton.addEventListener("click", (e) => {
    e.stopPropagation();
    sortDropdown.classList.toggle("active");
  });

  document.querySelectorAll(".sort-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      currentSort = option.dataset.value;
      sortText.textContent = option.textContent;
      sortDropdown.classList.remove("active");
      currentPage = 1;
      if (loadMoreContainer) loadMoreContainer.style.display = "block";
      moviesGrid.innerHTML = "";
      loadGenreMovies(false);
    });
  });

  document.addEventListener("click", (e) => {
    if (!sortButton.contains(e.target) && !sortButton.contains(e.target)) {
      sortDropdown.classList.remove("active");
    }
  });
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => loadGenreMovies(true));
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  currentGenreId = parseInt(params.get("id"));
  currentGenreName = params.get("name") || "All Genres";

  if (!currentGenreId) {
    moviesGrid.innerHTML = `
      <div style="text-align:center; padding:120px 20px; color:#aaa;">
        <i class="fa-solid fa-film" style="font-size:80px; margin-bottom:30px; opacity:0.3;"></i>
        <h2>Please select a genre</h2>
        <p>Choose a genre from the sidebar or header menu to see movies</p>
      </div>
    `;
    if (currentGenreNameEl) currentGenreNameEl.textContent = "All Genres";
    if (pageTitle) pageTitle.textContent = "Genres - Movie Finder";
    if (loadMoreContainer) loadMoreContainer.style.display = "none";
    populateSidebar();
    return;
  }

  try {
    const genres = await TMDB.getGenres();
    setGenres(genres);
    window.TMDB_GENRES = {};
    genres.forEach((g) => (window.TMDB_GENRES[g.id] = g.name));
  } catch (err) {
    console.error("Failed to load genres:", err);
  }

  populateSidebar();
  loadGenreMovies(false);
});
