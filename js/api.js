const OMDB_API_KEY = "9decd8f5";
const OMDB_BASE_URL = "https://www.omdbapi.com/";

async function searchMovies(query = "movie", page = 1) {
  const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${query}&page=${page}&type=movie`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.Response === "False") {
      return [];
    }
    return data.Search || [];
  } catch (error) {
    console.error("Error connecting to the server:", error);
    return [];
  }
}
async function getMovieDetails(imdbID) {
  const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.Response === "True" ? data : null;
  } catch (error) {
    console.error("Error getting movie details:", error);
    return null;
  }
}
window.OMDB = {
  searchMovies,
  getMovieDetails,
  IMG_URL: "",
  DEFAULT_POSTER:
    "https://via.placeholder.com/500x750/333333/ffffff?text=No+Image",
};
