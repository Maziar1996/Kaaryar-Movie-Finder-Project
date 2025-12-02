document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  if (!searchInput || !searchButton) return;

  const doSearch = () => {
    const query = searchInput.value.trim();
    if (query) {
      window.open(
        `../pages/search-results.html?query=${encodeURIComponent(query)}`,
        "_blank"
      );
    }
  };

  searchButton.addEventListener("click", doSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doSearch();
    }
  });

  const params = new URLSearchParams(window.location.search);
  const query = params.get("query") || params.get("search");
  if (query) {
    searchInput.value = query;
    doSearch();
  }
});
