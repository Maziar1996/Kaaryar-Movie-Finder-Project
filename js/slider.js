const TMDB = window.TMDB;

const slider = document.getElementById("slider");

let currentSlide = 0;
let slideInterval;

async function loadHeroMovies() {
  try {
    const movies = await TMDB.getPopular(1);

    const top5 = movies.slice(0, 5);
    slider.innerHTML = "";

    top5.forEach((movie, index) => {
      const slide = document.createElement("div");
      slide.classList.add("slide");

      if (index === 0) slide.classList.add("active");

      const imgUrl = movie.backdrop_path
        ? `${TMDB.IMG_URL}original${movie.backdrop_path}`
        : TMDB.DEFAULT_POSTER;

      slide.style.backgroundImage = `url(${imgUrl})`;

      new Image().src = imgUrl;

      const content = document.createElement("div");
      content.classList.add("hero-content");

      content.innerHTML = `
                <h1>${movie.title}</h1>
                <p class="overview">${movie.overview || "..."}</p>
                <div class="hero-buttons">
                <button class="play-btn">Play</button>
                <button class="info-btn">View Info</button>
                </div>
                `;

      content.querySelector(".info-btn").onclick = () => {
        window.location.href = `pages/movie-details.html?id=${movie.id}`;
      };
      slide.appendChild(content);
      slider.appendChild(slide);
    });

    createDots(top5.length);

    startAutoSlide();
  } catch (error) {
    console.error("Error loading the slider:", error);
  }
}

function createDots(count) {
  const oldDots = document.querySelector(".slider-dots");
  if (oldDots) oldDots.remove();

  const dotsContainer = document.createElement("div");
  dotsContainer.classList.add("slider-dots");

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      clearInterval(slideInterval);
      goToSlide(i);
      startAutoSlide();
    });

    dotsContainer.appendChild(dot);
  }
  document.getElementById("hero").appendChild(dotsContainer);
}

function goToSlide(index) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  slides[currentSlide].classList.remove("actvie");
  dots[currentSlide].classList.remove("active");

  currentSlide = index;

  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");

  slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 6000);
}

function nextSlide() {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll("dot");

  if (slides.length === 0 || dots.length === 0) return;

  slides[currentSlide].classList.remove("active");
  dots[currentSlide].classList.remove("active");

  currentSlide = (currentSlide + 1) % slides.length;

  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");

  slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

document.addEventListener("DOMContentLoaded", loadHeroMovies);

window.addEventListener("scroll", () => {
  document.body.classList.toggle("scrolled", window.scrollY > 50);
});
