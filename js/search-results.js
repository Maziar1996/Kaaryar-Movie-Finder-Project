import {
  renderSkeleton,
  renderMovieCard,
  renderPagination,
  getGenreNames,
  setGenres,
} from "./ui.js";

const grid = document.getElementById("movies-grid");
const paginationContainer = document.getElementById("pagination");
const titleEl = document.getElementById("search-title");

let currentQuery = "";
let currentPage = 1;

async function loadSearchResults(query, page = 1) {
  currentQuery = query;
  currentPage = page;

  renderSkeleton(grid, 20);

  const movies = await TMDB.searchMovies(query, page);

  grid.innerHTML = "";

  if (movies.length === 0) {
    titleEl.textContent = `No results found for "${query}"`;
    grid.innerHTML = `<p style="text-align:center; padding:60px; color:#aaa;">No movies found.</p>`;
    paginationContainer.innerHTML = "";
    return;
  }

  titleEl.textContent = `Search Results for: "${query}" (${movies.length}+ movies)`;

  movies.forEach((movie) => {
    renderMovieCard(grid, {
      Title: movie.title || "Unknown",
      Year: movie.release_date?.split("-")[0] || "----",
      Poster: movie.poster_path,
      imdbRating: movie.vote_average?.toFixed(1) || "-",
      Genre: getGenreNames(movie.genre_ids || []),
      id: movie.id,
    });
  });

  renderPagination(paginationContainer, page, (newPage) => {
    loadSearchResults(query, newPage);
    grid.scrollIntoView({ behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query") || params.get("search");
  const page = parseInt(params.get("page")) || 1;

  if (!query) {
    titleEl.textContent = "Please enter a search term";
    grid.innerHTML =
      "<p style='text-align:center;padding:60px;color:#aaa;'>No search query provided.</p>";
    return;
  }

  document.getElementById("search-input").value = query;

  const genres = await TMDB.getGenres();
  setGenres(genres);

  loadSearchResults(query, page);
});
