// Skeleton Loading - Render Movie Card - Pagination

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

// Render Movie Card

export function renderMovieCard(grid, details) {
  const card = document.createElement("div");
  card.classList.add("movie-card");

  const img = document.createElement("img");
  img.src =
    details.Poster && details.Poster !== "N/A"
      ? details.Poster
      : OMDB.DEFAULT_POSTER;

  img.alt = details.Title;

  const info = document.createElement("div");
  info.classList.add("movie-info");

  const titleRow = document.createElement("div");
  titleRow.classList.add("title-row");

  const title = document.createElement("h3");
  title.classList.add("movie-title");
  title.textContent = details.Title;

  const year = document.createElement("span");
  year.classList.add("movie-year");
  year.textContent = details.Year;

  titleRow.appendChild(title);
  titleRow.appendChild(year);
  info.appendChild(titleRow);

  const genre = document.createElement("p");
  genre.classList.add("movie-genre");
  genre.textContent = details.Genre || "Unknown";
  info.appendChild(genre);

  const bottomRow = document.createElement("div");
  bottomRow.classList.add("bottom-row");

  const rating = document.createElement("span");
  rating.classList.add("movie-rating");
  rating.textContent =
    details.imdbRating && details.imdbRating !== "N/A"
      ? `⭐ ${details.imdbRating}/10`
      : "⭐ -";

  const viewBtn = document.createElement("button");
  viewBtn.textContent = "View Info";
  viewBtn.classList.add("view-btn");
  viewBtn.onclick = () => {
    window.location.href = `pages/movie-details.html?id=${details.imdbID}`;
  };

  bottomRow.appendChild(rating);
  bottomRow.appendChild(viewBtn);
  info.appendChild(bottomRow);

  card.appendChild(img);
  card.appendChild(info);
  grid.appendChild(card);
}

// Pagination

export function renderPagination(
  container,
  currentPage,
  onPageChange,
  totalPages = null
) {
  container.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Previous";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => onPageChange(currentPage - 1);

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  if (totalPages) {
    nextBtn.disabled = currentPage === totalPages;
  }
  nextBtn.onclick = () => onPageChange(currentPage + 1);

  container.appendChild(prevBtn);

  if (totalPages) {
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      if (i === currentPage) pageBtn.classList.add("active");
      pageBtn.onclick = () => onPageChange(i);
      container.appendChild(pageBtn);
    }
  }

  container.appendChild(nextBtn);
}
