export function renderSkeleton(grid, count = 6) {
  grid.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement("div");
    skeleton.classList.add("skeleton-card");

    const skeletonImg = document.createElement("div");
    skeletonImg.classList.add("skeleton-img");

    const skeletonInfo = document.createElement("div");
    skeletonInfo.classList.add("skeleton-info");

    const skeletonTitle = document.createElement("div");
    skeletonTitle.classList.add("skeleton-title");

    const skeletonText = document.createElement("div");
    skeletonText.classList.add("skeleton-text");

    skeletonInfo.appendChild(skeletonTitle);
    skeletonInfo.appendChild(skeletonText);
    skeleton.appendChild(skeletonImg);
    skeleton.appendChild(skeletonInfo);
    grid.appendChild(skeleton);
  }
}
// Genre

let GENRES = {};

export function setGenres(genresList) {
  GENRES = {};
  genresList.forEach((genre) => (GENRES[genre.id] = genre.name));
}

export function getGenreNames(ids = []) {
  return ids
    .map((id) => GENRES[id])
    .filter(Boolean)
    .join(", ");
}
// Render Movie Card

export function renderMovieCard(grid, movie) {
  const card = document.createElement("div");
  card.classList.add("movie-card");

  const img = document.createElement("img");
  const posterPath = movie.poster_path || movie.Poster;
  const posterUrl = posterPath
    ? `${TMDB.IMG_URL}w500${posterPath}`
    : TMDB.DEFAULT_POSTER;

  img.src = posterUrl;
  img.onerror = function () {
    this.onerror = null;
    this.src = TMDB.DEFAULT_POSTER;
  };
  img.alt = movie.Title || "Movie poster";
  img.loading = "lazy";
  const info = document.createElement("div");
  info.classList.add("movie-info");

  const titleRow = document.createElement("div");
  titleRow.classList.add("title-row");

  const title = document.createElement("h3");
  title.classList.add("movie-title");
  title.textContent = movie.Title;

  const year = document.createElement("span");
  year.classList.add("movie-year");
  year.textContent = movie.Year;

  titleRow.appendChild(title);
  titleRow.appendChild(year);
  info.appendChild(titleRow);

  const genre = document.createElement("p");
  genre.classList.add("movie-genre");
  genre.textContent = movie.Genre || "Unknown";
  info.appendChild(genre);

  const bottomRow = document.createElement("div");
  bottomRow.classList.add("bottom-row");

  const rating = document.createElement("span");
  rating.classList.add("movie-rating");
  rating.textContent =
    movie.imdbRating && movie.imdbRating !== "N/A"
      ? `⭐ ${movie.imdbRating}/10`
      : "⭐ -";

  const viewBtn = document.createElement("button");
  viewBtn.textContent = "View Info";
  viewBtn.classList.add("view-btn");
  viewBtn.onclick = () => {
    window.location.href = `/pages/movie-details.html?id=${movie.id}`;
  };

  bottomRow.appendChild(rating);
  bottomRow.appendChild(viewBtn);
  info.appendChild(bottomRow);

  card.appendChild(img);
  card.appendChild(info);
  grid.appendChild(card);
}

export function renderPagination(
  container,
  currentPage,
  onPageChange,
  totalPages = null
) {
  container.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => onPageChange(currentPage - 1);
  container.appendChild(prevBtn);

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages || currentPage + 5, currentPage + 4);

  if (startPage > 1) {
    const first = document.createElement("button");
    first.textContent = "1";
    first.onclick = () => onPageChange(1);
    container.appendChild(first);

    if (startPage > 2) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.style.margin = "0 10px";
      container.appendChild(dots);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    if (i === currentPage) pageBtn.classList.add("active");
    pageBtn.onclick = () => onPageChange(i);
    container.appendChild(pageBtn);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.style.margin = "0 10px";
      container.appendChild(dots);
    }
    const last = document.createElement("button");
    last.textContent = totalPages;
    last.onclick = () => onPageChange(totalPages);
    container.appendChild(last);
  }
  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;
  nextBtn.onclick = () => onPageChange(currentPage + 1);
  container.appendChild(nextBtn);
}
