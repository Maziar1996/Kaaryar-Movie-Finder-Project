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

  try {
    const movies = await TMDB.getTopRated(page);

    grid.innerHTML = "";

    movies.forEach((movie) => {
      if (!movie) return;

      renderMovieCard(grid, {
        Title: movie.title || "Unknown Title",
        Year: movie.release_date?.split("-")[0] || "----",
        Poster: movie.poster_path,
        imdbRating: movie.vote_average?.toFixed(1) || "-",
        Genre: getGenreNames(movie.genre_ids || []),
        id: movie.id,
      });
    });

    const url = new URL(window.location);
    url.searchParams.set("page", page);
    window.history.pushState({}, "", url);

    renderPagination(paginationContainer, page, goToPage, movies.total_pages);

    currentPage = page;
  } catch (error) {
    console.error("Error loading the movies:", error);
    grid.innerHTML = `<p style="text-align:center; color:#f66; padding:60px;">Error loading the movies. Please try again.</p>`;
  }
}

function goToPage(newPage) {
  if (newPage >= 1) {
    loadMovies(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

window.addEventListener("popstate", () => {
  const page =
    parseInt(new URLSearchParams(window.location.search).get("page")) || 1;
  loadMovies(page);
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const genresList = await TMDB.getGenres();
    setGenres(genresList);
  } catch (error) {
    console.warn("Error loading the genres:", error);
  }

  loadMovies(currentPage);

  document.querySelectorAll(".logo").forEach((logo) => {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "index.html";
    });
  });
});

window.loadMainContent = loadMovies;
