const {
  getMovieDetails,
  getMovieCredits,
  getMovieImages,
  getMovieReleaseDates,
  IMG_URL,
  DEFAULT_POSTER,
} = window.TMDB || {};

function pickCertification(releaseResults = []) {
  if (!Array.isArray(releaseResults)) return "N/A";

  const us = releaseResults.find((r) => r.iso_3166_1 === "US");
  const pickFrom = us || releaseResults[0];
  if (
    !pickFrom ||
    !pickFrom.release_dates ||
    pickFrom.release_dates.length === 0
  )
    return "N/A";

  const cert = pickFrom.release_dates.find(
    (d) => d.certification && d.certification.trim()
  );
  return cert && cert.certification ? cert.certification : "N/A";
}

function formatRuntime(mins) {
  if (!mins && mins !== 0) return "N/A";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function renderMainStructure(container) {
  container.innerHTML = `
  <div class="details-wrapper">

    <div class="movie-header">
      <h1 class="movie-title"></h1>
      <div class="movie-meta"></div>
    </div>

    <div class="movie-body">

    <div class="top-row">
    
      <div class="poster-col"></div>
      
      <div class="info-col"></div>
      
      
      </div>
<div class="gallery-inside-body"></div>
      
    </div>

    <div class="movie-cast"></div>

  </div>
`;
}

function fillTopInfo(container, movie, certification) {
  const titleEl = container.querySelector(".movie-title");
  const metaEl = container.querySelector(".movie-meta");

  titleEl.textContent = movie.title || movie.original_title || "No Title";

  const year = movie.release_date ? movie.release_date.split("-")[0] : "----";
  const runtime = movie.runtime ? formatRuntime(movie.runtime) : "N/A";

  metaEl.innerHTML = `
  <span class="meta-item">${year}</span>
  <span class="meta-sep">•</span>
  <span class="meta-item">${certification}</span>
  <span class="meta-sep">•</span>
  <span class="meta-item">${runtime}</span>
`;
}

function fillPosterAndInfo(container, movie, credits) {
  const posterCol = container.querySelector(".poster-col");
  const infoCol = container.querySelector(".info-col");

  const posterUrl = movie.poster_path
    ? `${IMG_URL}w500${movie.poster_path}`
    : DEFAULT_POSTER;

  posterCol.innerHTML = `
    <img class="detail-poster" src="${posterUrl}" alt="${movie.title}" />
  `;

  const director = (credits.crew || []).find((c) => c.job === "Director");
  const writers = (credits.crew || [])
    .filter((c) => ["Writer", "Screenplay", "Story"].includes(c.job))
    .map((w) => w.name);

  const stars = (credits.cast || []).slice(0, 6).map((c) => c.name);

  const genres = Array.isArray(movie.genres)
    ? movie.genres.map((g) => g.name).join(", ")
    : "";

  const overview = movie.overview || "No overview available.";

  infoCol.innerHTML = `
    <div class="info-row"><span class="info-label">Genre:</span> <span class="info-value">${genres}</span></div>
    <div class="info-row"><span class="info-label">Plot:</span> <p class="info-value info-plot">${overview}</p></div>
    <div class="info-row"><span class="info-label">Director:</span> <span class="info-value">${
      director ? director.name : "N/A"
    }</span></div>
    <div class="info-row"><span class="info-label">Writers:</span> <span class="info-value">${
      writers.join(", ") || "N/A"
    }</span></div>
    <div class="info-row"><span class="info-label">Stars:</span> <span class="info-value">${
      stars.join(", ") || "N/A"
    }</span></div>
  `;
}

function fillGallery(container, images) {
  const gallery = container.querySelector(".gallery-inside-body");

  const backdrops = (images.backdrops || []).slice(0, 3);
  if (backdrops.length === 0) {
    gallery.innerHTML = "";
    return;
  }

  gallery.innerHTML = `<div class = "gallery-row"></div>`;
  const row = gallery.querySelector(".gallery-row");

  backdrops.forEach((b) => {
    const url = b.file_path ? `${IMG_URL}w780${b.file_path}` : DEFAULT_POSTER;
    const imgWrap = document.createElement("div");
    imgWrap.className = "gallery-item";
    imgWrap.innerHTML = `<img src="${url}" alt="scene" />`;
    row.appendChild(imgWrap);
  });
}

function fillCast(container, credits) {
  const castSection = container.querySelector(".movie-cast");
  castSection.innerHTML = `<h2>Cast</h2><div class="cast-grid"></div>`;
  const grid = castSection.querySelector(".cast-grid");

  (credits.cast || []).slice(0, 6).forEach((actor) => {
    const photo = actor.profile_path
      ? `${IMG_URL}w200${actor.profile_path}`
      : DEFAULT_POSTER;
    const char = actor.character || "";
    const name = actor.name || "";
    const card = document.createElement("div");
    card.className = "cast-card";
    card.innerHTML = `
    <img src ="${photo}" alt="${name}" />
    <p class="char-name">${char}</p>
    <p class="actor-name">${name}</p>
  `;
    grid.appendChild(card);
  });
}

async function loadMoviePage(id) {
  const detailsContainer = document.getElementById("details-container");
  if (!detailsContainer) return;

  renderMainStructure(detailsContainer);

  try {
    const [movie, credits, images, releaseResults] = await Promise.all([
      getMovieDetails(id),
      getMovieCredits(id),
      getMovieImages(id),
      getMovieReleaseDates ? getMovieReleaseDates(id) : Promise.resolve([]),
    ]);

    const certification = pickCertification(releaseResults);

    fillTopInfo(detailsContainer, movie, certification);
    fillPosterAndInfo(detailsContainer, movie, credits);
    fillGallery(detailsContainer, images);
    fillCast(detailsContainer, credits);
  } catch (error) {
    console.error("Error loading movie page:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");

  if (!movieId) {
    console.error("Movie ID not found in the URL");
    return;
  }
  loadMoviePage(movieId);
});
