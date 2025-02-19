// animation play
window.onload = function() {
    setTimeout(function() {
        document.getElementById("preloader").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("preloader").style.display = "none";
        }, 500); // Smooth fade-out effect
    }, 3000); // Display for 5 seconds
};
// header js
window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
});

// api 

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".search-input");
    const suggestionBox = document.querySelector(".suggestions");
    const searchIcon = document.querySelector(".search-icon");
    const movieDetails = document.querySelector(".movie-details");

    movieDetails.style.display = "none";

    async function fetchMovieDetails(title) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=afaed853`);
            const movie = await response.json();

            if (movie.Response === "True") {
                movieDetails.innerHTML = `
                    <h1 id="search-result">Your Search Result:</h1>
                    <div class="d-flex flex-column flex-md-row align-items-center align-items-md-start text-white mt-3 movie-box">
                        <img src="${movie.Poster}" alt="${movie.Title}" class=" img-fluid">
                        <div>
                            <h2>${movie.Title} (${movie.Year})</h2>
                            <p><strong>Genre:</strong> ${movie.Genre}</p>
                            <p><strong>Director:</strong> ${movie.Director}</p>
                            <p><strong>Actors:</strong> ${movie.Actors}</p>
                            <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
                            <p><strong>Plot:</strong> ${movie.Plot}</p>
                        </div>
                    </div>
                `;
                movieDetails.style.display = "block";
                movieDetails.scrollIntoView({ behavior: "smooth", block: "start" });
                fetchRelatedMovies(title);
            } else {
                movieDetails.innerHTML = "<p class='text-white'>Movie not found.</p>";
                movieDetails.style.display = "block";
            }
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    }

    async function fetchMovieSuggestions(query) {
        if (query.length < 2) {
            suggestionBox.innerHTML = "";
            suggestionBox.style.display = "none";
            return;
        }

        try {
            const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=afaed853`);
            const data = await response.json();

            suggestionBox.innerHTML = "";
            if (data.Search) {
                suggestionBox.style.display = "block";

                data.Search.forEach(movie => {
                    const li = document.createElement("li");
                    li.classList.add("list-group-item", "text-white", "d-flex", "align-items-center", "border-light");
                    li.style.cursor = "pointer";

                    const img = document.createElement("img");
                    img.src = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/50";
                    img.classList.add("me-2");
                    img.style.width = "50px";
                    img.style.height = "50px";
                    img.style.borderRadius ="100%";

                    const title = document.createElement("span");
                    title.textContent = movie.Title;

                    li.appendChild(img);
                    li.appendChild(title);

                    li.addEventListener("click", () => {
                        searchInput.value = movie.Title;
                        suggestionBox.innerHTML = "";
                        suggestionBox.style.display = "none";
                        fetchMovieDetails(movie.Title);
                    });

                    suggestionBox.appendChild(li);
                });
            } else {
                suggestionBox.style.display = "none";
            }
        } catch (error) {
            console.error("Error fetching movie data:", error);
        }
    }

    async function fetchRelatedMovies(title) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?s=${title}&apikey=afaed853`);
            const data = await response.json();
            
            if (data.Search) {
                let relatedMoviesHTML = "";
                for (const movie of data.Search) {
                    const movieDetailsResponse = await fetch(`https://www.omdbapi.com/?t=${movie.Title}&apikey=afaed853`);
                    const movieDetailsData = await movieDetailsResponse.json();
                    
                    if (movieDetailsData.Response === "True") {
                        relatedMoviesHTML += `
                            <div class="d-flex flex-column flex-md-row align-items-center align-items-md-start text-white mt-3 movie-box">
                                <img src="${movieDetailsData.Poster !== "N/A" ? movieDetailsData.Poster : "https://via.placeholder.com/150"}" alt="${movieDetailsData.Title}" class="img-fluid">
                                <div>
                                    <h2>${movieDetailsData.Title} (${movieDetailsData.Year})</h2>
                                    <p><strong>Genre:</strong> ${movieDetailsData.Genre}</p>
                                    <p><strong>Director:</strong> ${movieDetailsData.Director}</p>
                                    <p><strong>Actors:</strong> ${movieDetailsData.Actors}</p>
                                    <p><strong>IMDB Rating:</strong> ${movieDetailsData.imdbRating}</p>
                                    <p><strong>Plot:</strong> ${movieDetailsData.Plot}</p>
                                </div>
                            </div>
                        `;
                    }
                }
                movieDetails.innerHTML += relatedMoviesHTML;
            }
        } catch (error) {
            console.error("Error fetching related movies:", error);
        }
    }

    searchInput.addEventListener("input", function () {
        fetchMovieSuggestions(searchInput.value.trim());
    });

    searchIcon.addEventListener("click", function () {
        const query = searchInput.value.trim();
        if (query) {
            fetchMovieDetails(query);
        }
    });
});
