document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");

  if (!movieId) {
    console.error("Movie ID not fund in the URL");
    return;
  }
  loadMovieDetails(movieId);
});

async function loadMovieDetails(id) {
  try {
    const movie = await TMDB.getMovieDetails(id);

    if (!movie) {
      console.error("Movie not found");
      return;
    }

    renderMovieDetails(movie);
  } catch (error) {
    console.error("Error loading movie details:", error);
  }
}

function renderMovieDetails(movie) {
  const container = document.getElementById("details-container");

  const genres = movie.genres.map((g) => g.name).join(", ");

  const runtime = movie.runtime ? `${movie.runtime} min` : "N/A";

  const rating = movie.vote_average?.toFixed(1) ?? "N/A";

  const backdrop = movie.backdrop_path
    ? `${TMDB.IMG_URL}original${movie.backdrop_path}`
    : TMDB.DEFAULT_POSTER;

  const poster = movie.poster_path
    ? `${TMDB.IMG_URL}w500${movie.poster_path}`
    : TMDB.DEFAULT_POSTER;

  container.innerHTML = `
    <div class="movie-hero" style="background-image: url('${backdrop}')">
    <div class="overlay"></div>
    <div class="info">
        <img class="poster" src="${poster}" alt="${movie.title}" />
        
        <div class="text">
        <h1>${movie.title}</h1>
        <p class="facts">${
          movie.release_date?.split("-")[0] || "----"
        } • ${genres} • ${runtime}</p>
        <p class="rating">⭐ ${rating}/10</p>
        <p class="overview">${movie.overview}</p>
        </div>
        </div>
        </div>
    
    `;
}
