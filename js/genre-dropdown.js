import { setGenres } from "./ui.js";

const MAIN_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 878, name: "Science Fiction" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 9648, name: "Mystery" },
  { id: 53, name: "Thriller" },
];

async function initGenreDropdown() {
  const genres = await window.TMDB.getGenres();

  const desktopList = document.getElementById("genre-list");
  const mobileList = document.getElementById("genre-list-mobile");

  if (!desktopList && !mobileList) return;

  const createLink = (genre) => {
    const a = document.createElement("a");
    a.href = `/pages/genre.html?id=${genre.id}&name=${encodeURIComponent(
      genre.name
    )}`;
    a.textContent = genre.name;
    return a;
  };

  [desktopList, mobileList].forEach((list) => {
    if (list) {
      list.innerHTML = "";
      MAIN_GENRES.forEach((genre) => {
        list.appendChild(createLink(genre));
      });
    }
  });

  const desktopBtn = document.getElementById("genre-button");
  if (desktopBtn && desktopList) {
    const show = () => desktopList.classList.add("active");
    const hide = () => desktopList.classList.remove("active");

    desktopBtn.addEventListener("mouseenter", show);
    desktopList.addEventListener("mouseenter", show);
    desktopBtn.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!desktopList.matches(":hover")) hide();
      }, 100);
    });
    desktopList.addEventListener("mouseleave", hide);
  }

  const mobileBtn = document.getElementById("genre-button-mobile");
  if (mobileBtn && mobileList) {
    mobileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileList.classList.toggle("active");
    });
  }

  if (desktopBtn) {
    desktopBtn.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      e.preventDefault();
      window.location.href = "/pages/genre.html";
    });
  }
  if (mobileBtn) {
    mobileBtn.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      e.preventDefault();
      window.location.href = "/pages/genre.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", initGenreDropdown);

export default initGenreDropdown;
