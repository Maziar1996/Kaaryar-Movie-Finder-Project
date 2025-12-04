### Kaaryar-Movie-Finder-Project

An IMDB-like website designed to give certain informations about series &amp; movies.
Built with pure HTML, CSS &amp; JavaScript.

# Movie Finder

**A modern, fast, framework-free Movie & TV Series discovery web app powered by TMDB API**

## Features

| Feature                           | Status  | Description                                                           |
| --------------------------------- | ------- | --------------------------------------------------------------------- |
| Fully Responsive Design           | ✅ Done | Looks perfect on mobile, tablet & desktop                             |
| Mobile Hamburger Menu             | ✅ Done | Slide-in from right, X animation, overlay, scroll lock                |
| Genre Dropdown (Desktop + Mobile) | ✅ Done | Hover on desktop · Click toggle on mobile · Second click → genre page |
| Live Search with Suggestions      | ✅ Done | Type → instant results dropdown                                       |
| Hero Slider (Top 5 Popular)       | ✅ Done | Auto-play, dots navigation, backdrop images                           |
| Movie Grid + Pagination           | ✅ Done | Top-rated movies with skeleton loading                                |
| Header Blur Effect on Scroll      | ✅ Done | Transparent → solid + backdrop blur (Netflix-style)                   |
| Genre Page with Sidebar & Sorting | ✅ Done | Load more, sort by popularity/rating/date                             |
| Movie Details Page                | ✅ Done | Poster, cast, images, overview, runtime, etc.                         |
| Search Results Page               | ✅ Done | Dedicated page with pagination                                        |
| No Framework · Pure Vanilla JS    | ✅ Done | Maximum performance & control                                         |

## Tech Stack

- **HTML5** – Semantic structure
- **CSS3** – Flexbox, Grid, custom properties, backdrop-filter
- **Vanilla JavaScript (ES6 Modules)** – Clean, modular, no build step
- **TMDB API** – All movie/series data
- **Font Awesome 6** – Icons
- **Google Fonts – Inter** – Modern typography

Zero dependencies · Lighthouse score 95–100

## Project Structure

├── index.html
├── pages/
│ ├── genre.html
│ ├── movie-details.html
│ └── search-results.html
├── styles/
│ └── style.css
├── js/
│ ├── api.js
│ ├── home.js
│ ├── slider.js
│ ├── mobile-menu.js
│ ├── genre-dropdown.js
│ ├── common-search.js
│ ├── ui.js
│ └── movie-details.js
└── assets/ (optional images)

## Key Implementations

### Mobile Navigation

- Smooth slide-in with cubic-bezier easing
- Hamburger → X transform animation
- Body scroll lock + overlay click/Escape to close

### Genre Dropdown

- Desktop: hover open/close
- Mobile: single click toggle, second click navigates to `/genre.html`
- Fixed duplicate ID & visibility bugs (opacity + visibility + max-height)

### Performance

- Lazy loading images
- Skeleton screens while fetching
- Debounced search
- Efficient event listeners (no memory leaks)

### Author

- MAB – Junior Web Developer

GitHub: https://github.com/Maziar1996

Built with passion - 2025
