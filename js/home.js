import { renderSkeleton, renderMovieCard, renderPagination } from "./ui.js";

let currentPage = 1;
const moviesPerPage = 20;
const currentQuery = "top";

async function loadMovies(page = 1) {
  const grid = document.getElementById("movies-grid");
  const paginationContainer = document.getElementById("pagination");

  renderSkeleton(grid, moviesPerPage);

  const movies = await OMDB.searchMovies(currentQuery, page);
  const detailsPromises = movies.map((m) => OMDB.getMovieDetails(m.imdbID));
  const allDetails = await Promise.all(detailsPromises);

  grid.innerHTML = "";
  allDetails.forEach((details) => {
    if (details) renderMovieCard(grid, details);
  });

  renderPagination(paginationContainer, page, loadMovies);
  currentPage = page;

  grid.scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", async () => {
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
