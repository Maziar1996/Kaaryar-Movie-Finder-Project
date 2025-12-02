import {
  renderSkeleton,
  renderMovieCard,
  renderPagination,
  setGenres,
  getGenreNames,
} from "./ui.js";

let currentPage =
  parseInt(new URLSearchParams(window.location.search).get("page")) || 1;
const moviesPerPage = 20;

async function loadMovies(page = currentPage) {
  const grid = document.getElementById("movies-grid");
  const paginationContainer = document.getElementById("pagination");

  renderSkeleton(grid, moviesPerPage);

  const movies = await TMDB.getTopRated(page);

  grid.innerHTML = "";

  movies.forEach((movie) => {
    if (!movie) return;

    renderMovieCard(grid, {
      Title: movie.title || "Unknown Title",
      Year: movie.release_date?.split("-")[0] || "----",
      Poster: movie.poster_path
        ? `${TMDB.IMG_URL}w500${movie.poster_path}`
        : TMDB.DEFAULT_POSTER,
      imdbRating: movie.vote_average?.toFixed(1) || "-",
      Genre: getGenreNames(movie.genre_ids || []),
      id: movie.id,
    });
  });

  const url = new URL(window.location);
  url.searchParams.set("page", page);
  window.history.pushState({}, "", url);
  renderPagination(paginationContainer, page, goToPage);

  currentPage = page;
}

// No home page return, when refreshing.

function goToPage(newPage) {
  if (newPage >= 1) {
    loadMovies(newPage);
  }
}
window.addEventListener("popstate", () => {
  const page =
    parseInt(new URLSearchParams(window.location.search).get("page")) || 1;
  loadMovies(page);
});

document.addEventListener("DOMContentLoaded", async () => {
  const genresList = await TMDB.getGenres();

  setGenres(genresList);

  loadMovies(currentPage);

  // Hamburger Menu

  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("overlay");

  hamburgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle("open");
    overlay.classList.toggle("show");
    document.body.classList.toggle("menu-open");
  });

  document.addEventListener("click", (e) => {
    if (
      mobileMenu.classList.contains("open") &&
      !mobileMenu.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      mobileMenu.classList.remove("open");
      overlay.classList.remove("show");
      document.body.classList.remove("menu-open");
    }
  });
});

document.querySelector(".logo").addEventListener("click", () => {
  window.location.href = "index.html";
});

window.loadMainContent = loadMovies;
