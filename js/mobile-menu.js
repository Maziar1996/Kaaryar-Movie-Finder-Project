document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("overlay");

  if (!hamburgerBtn || !mobileMenu || !overlay) return;

  const openMenu = () => {
    hamburgerBtn.classList.add("active");
    mobileMenu.classList.add("open");
    overlay.classList.add("show");
    document.body.classList.add("menu-open");
  };

  const closeMenu = () => {
    hamburgerBtn.classList.remove("active");
    mobileMenu.classList.remove("open");
    overlay.classList.remove("show");
    document.body.classList.remove("menu-open");
  };

  hamburgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (mobileMenu.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      closeMenu();
    }
  });

  mobileMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});
