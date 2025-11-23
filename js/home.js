// Hamburger Menu

const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.getElementById("overlay");

hamburgerBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
  overlay.classList.toggle("show");
});

overlay.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  overlay.classList.remove("show");
});
