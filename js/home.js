import { renderSkeleton, renderMovieCard, renderPagination } from "./ui.js";

let currentPage = 1;
const moviesPerPage = 20;

async function loadMovies(page = 1) {
  const grid = document.getElementById("movies-grid");
  const paginationContainer = document.getElementById("pagination");

  renderSkeleton(grid, moviesPerPage);

  const movies = await TMDB.getTopRated(page);

  grid.innerHTML = "";

  movies.forEach((movie) => {
    if (!movie) return;

    renderMovieCard(grid, {
      Title: movie.title,
      Year: movie.release_date?.split("-")[0] || "----",
      Poster: movie.poster_path
        ? `${TMDB.IMG_URL}w500${movie.poster_path}`
        : TMDB.DEFAULT_POSTER,
      imdbRating: movie.vote_average?.toFixed(1) || "-",
      Genre: movie.genre_ids?.join(", "),
      id: movie.id,
    });
  });

  renderPagination(paginationContainer, page, loadMovies);

  currentPage = page;

  grid.scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
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
