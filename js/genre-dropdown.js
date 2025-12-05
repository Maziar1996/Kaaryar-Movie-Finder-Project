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

function initGenreDropdown() {
  const desktopList = document.getElementById("genre-list");
  const mobileList = document.getElementById("genre-list-mobile");

  const createLink = (genre) => {
    const a = document.createElement("a");
    a.href = `pages/genre.html?id=${genre.id}&name=${encodeURIComponent(
      genre.name
    )}`;
    a.textContent = genre.name;
    return a;
  };

  if (desktopList) {
    desktopList.innerHTML = "";
    MAIN_GENRES.forEach((g) => desktopList.appendChild(createLink(g)));
  }
  if (mobileList) {
    mobileList.innerHTML = "";
    MAIN_GENRES.forEach((g) => mobileList.appendChild(createLink(g)));
  }

  const desktopBtn = document.getElementById("genre-button");
  if (desktopBtn && desktopList) {
    const show = () => desktopList.classList.add("active");
    const hide = () => desktopList.classList.remove("active");
    desktopBtn.addEventListener("mouseenter", show);
    desktopList.addEventListener("mouseenter", show);
    desktopBtn.addEventListener("mouseleave", () =>
      setTimeout(() => !desktopList.matches(":hover") && hide(), 100)
    );
    desktopList.addEventListener("mouseleave", hide);
    desktopBtn.addEventListener(
      "click",
      (e) =>
        !e.target.closest("a") &&
        (e.preventDefault(), (location.href = "pages/genre.html"))
    );
  }

  const mobileBtn = document.getElementById("genre-button-mobile");
  const mobileDropdown = document.getElementById("genre-list-mobile");

  if (mobileBtn && mobileDropdown) {
    mobileBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = mobileDropdown.classList.contains("active");

      if (isOpen) {
        window.location.href = "pages/genre.html";
      } else {
        mobileDropdown.classList.add("active");
        mobileBtn.classList.add("active");
        const icon = mobileBtn.querySelector("i");
        if (icon) icon.classList.replace("fa-chevron-down", "fa-chevron-up");
      }
    });

    document.addEventListener("click", function () {
      if (mobileDropdown.classList.contains("active")) {
        mobileDropdown.classList.remove("active");
        mobileBtn.classList.remove("active");
        const icon = mobileBtn.querySelector("i");
        if (icon) icon.classList.replace("fa-chevron-up", "fa-chevron-down");
      }
    });

    mobileDropdown.addEventListener("click", (e) => e.stopPropagation());
  }
}

document.addEventListener("DOMContentLoaded", initGenreDropdown);
