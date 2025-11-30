const TMDB_API_KEY = "fc059bc1b9bc62f15639c5474b4fbe62";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p/";

function buildUrl(path, params = {}) {
  const url = new URL(TMDB_BASE_URL + path);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", "en-US");

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

async function searchMovies(query, page = 1) {
  try {
    const url = buildUrl("/search/movie", { query, page });
    const response = await fetch(url);
    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error("Error connecting to the server:", error);
    return [];
  }
}
async function getMovieDetails(id) {
  try {
    const url = buildUrl(`/movie/${id}`);
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error getting movie details:", error);
    return null;
  }
}

async function getMovieCredits(id) {
  try {
    const url = buildUrl(`/movie/${id}/credits`);
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error getting the credits:", error);
    return { cast: [], crew: [] };
  }
}

async function getMovieImages(id) {
  try {
    const url = buildUrl(`/movie/${id}/images`);
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error getting images:", error);
    return { backdrops: [], posters: [] };
  }
}

async function getPopular(page = 1) {
  try {
    const url = buildUrl("/movie/popular", { page });
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error getting popular movies:", error);
    return [];
  }
}

async function getTopRated(page = 1) {
  try {
    const url = buildUrl("/movie/top_rated", { page });
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error getting top rated movies", error);
    return [];
  }
}

async function getGenres() {
  try {
    const url = buildUrl("/genre/movie/list");
    const response = await fetch(url);
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error("Error getting genres:", error);
    return [];
  }
}

async function getMovieReleaseDates(id) {
  try {
    const url = buildUrl(`/movie/${id}/release_dates`);
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error getting release dates:", error);
    return [];
  }
}
window.TMDB = {
  searchMovies,
  getMovieDetails,
  getMovieCredits,
  getMovieImages,
  getPopular,
  getTopRated,
  getGenres,
  getMovieReleaseDates,
  IMG_URL: TMDB_IMG,
  IMG: TMDB_IMG,
  DEFAULT_POSTER:
    "https://via.placeholder.com/500x750/333333/ffffff?text=No+Image",
};
