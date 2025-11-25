document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("movies-grid");
  grid.innerHTML = "";

  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement("div");
    skeleton.classList.add("skeleton-card");

    const skeletonImg = document.createElement("div");
    skeletonImg.classList.add("skeleton-img");

    const skeletonInfo = document.createElement("div");
    skeletonInfo.classList.add("skeleton-info");

    const skeletonTitle = document.createElement("div");
    skeletonTitle.classList.add("skeleton-title");

    const skeletonText = document.createElement("div");
    skeletonText.classList.add("skeletonText");

    skeletonInfo.appendChild(skeletonTitle);
    skeletonInfo.appendChild(skeletonText);

    skeleton.appendChild(skeletonImg);
    skeleton.appendChild(skeletonInfo);

    grid.appendChild(skeleton);
  }

  const movies = await OMDB.searchMovies("top", 1);
  console.log("My favorite moives:", movies);

  const detailsPromises = movies.map((movie) =>
    OMDB.getMovieDetails(movie.imdbID)
  );
  const allDetails = await Promise.all(detailsPromises);

  grid.innerHTML = "";

  movies.forEach((movie, index) => {
    const details = allDetails[index];

    const card = document.createElement("div");
    card.classList.add("movie-card");

    const img = document.createElement("img");
    img.src =
      movie.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : OMDB.DEFAULT_POSTER;
    img.alt = movie.Title;

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
    genre.textContent = details?.Genre || "Unknown";
    info.appendChild(genre);

    const bottomRow = document.createElement("div");
    bottomRow.classList.add("bottom-row");

    const rating = document.createElement("span");
    rating.classList.add("movie-rating");
    rating.textContent =
      details?.imdbRating && details.imdbRating !== "N/A"
        ? `⭐ ${details.imdbRating}/10`
        : "⭐ -";

    const viewBtn = document.createElement("button");
    viewBtn.textContent = "View Info";
    viewBtn.classList.add("view-btn");
    viewBtn.onclick = () => {
      window.location.href = `pages/movie-details.html?id=${movie.imdbID}`;
    };

    bottomRow.appendChild(rating);
    bottomRow.appendChild(viewBtn);

    info.appendChild(bottomRow);
    card.appendChild(img);
    card.appendChild(info);
    grid.appendChild(card);
  });
});

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
