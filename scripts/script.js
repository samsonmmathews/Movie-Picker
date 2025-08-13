window.onload = function() {

    // Initialising all the variables
    var moodTitle = document.getElementById("mood-title");
    var selectedMood = document.getElementById("selected-mood");
    var controls = document.getElementById("controls");
    var moodSelect = document.getElementById("mood-select");
    var surpriseBtn = document.getElementById("surprise-me");
    var movieDisplay = document.getElementById("movie-display");
    var movieCard = document.querySelector(".movie-card");
    var backdrop = document.querySelector(".backdrop");
    var poster = document.querySelector(".poster");
    var movieTitleCard = document.querySelector(".movie-title");
    var movieYearCard = document.querySelector(".movie-year");
    var movieGenreCard = document.querySelector(".movie-genre");
    var movieSourcesCard = document.querySelector(".movie-sources");
    var anotherMovie = document.getElementById("another-movie");
    var wrongEmotion = document.getElementById("wrongEmotion");
    var resetBtn = document.getElementById("reset");

    // Set the value for the default background
    var defaultBackground = "linear-gradient(#F9BFBF, #737373)";
    
    // Watchmode api key
    const apiKey = "INSERT API KEY HERE";

    // A custom array of movies is initialised
    // User is shown a movie from the custom array of the selected mood
    const movies = {
        happy: ["The Lego Movie", 
            "Singin' in the Rain",
            "Mamma Mia!",
            "School of Rock",
            "The Princess Bride",
            "Ferris Bueller's Day Off",
            "Crazy Rich Asians",
            "Shrek",
            "Madagascar",
            "The Truman Show"],
        sad: ["The Green Mile",
            "Schindler's List",
            "Marley & Me",
            "The Fault in Our Stars",
            "A Walk to Remember",
            "Hachi: A Dog's Tale",
            "Bridge to Terabithia",
            "Million Dollar Baby",
            "Grave of the Fireflies",
            "Me Before You"],
        excited: ["Mad Max: Fury Road",
            "Avengers: Endgame",
            "Inception",
            "Jurassic Park",
            "The Dark Knight",
            "Spider-Man: No Way Home",
            "Guardians of the Galaxy",
            "The Matrix",
            "Top Gun",
            "John Wick"],
        relaxed: ["Finding Nemo",
            "Chef",
            "The Secret Life of Walter Mitty",
            "Forrest Gump",
            "About Time",
            "Before Sunrise",
            "Spirited Away",
            "Groundhog Day",
            "50 First Dates",
            "21 Jump Street"],
        adventurous: ["Raiders of the Lost Ark",
            "Back to the Future",
            "Star Wars: Episode IV - A New Hope",
            "The Mummy (1999)",
            "Jumanji: Welcome to the Jungle",
            "The Revenant",
            "Life of Pi",
            "The Lord of the Rings: The Fellowship of the Ring",
            "Pirates of the Caribbean: The Curse of the Black Pearl",
            "The Goonies"],
        thoughtful: ["Interstellar",
            "The Pursuit of Happyness",
            "Good Will Hunting",
            "A Beautiful Mind",
            "The Imitation Game",
            "Dead Poets Society",
            "The Shawshank Redemption",
            "The Theory of Everything",
            "Life Is Beautiful",
            "Manchester by the Sea"]
    };
    
    // Surprise me button functionality
    surpriseBtn.addEventListener("click", () => {

        console.log("surpriseBtn clicked");

        // If no mood is selected, display error message
        if(!moodSelect.value)
        {
            movieDisplay.style.display = "block";
            movieCard.style.display = "none";   
            movieDisplay.innerHTML = `<p style="font-weight:bold;">Please select a mood first!</p>`;
            return;
        }
        pickMovie(moodSelect.value);
    });

    // Another movie button functionality
    // If the user is not satisfied with the movie that was displayed,
    // then there should be an option to get another movie
    anotherMovie.addEventListener("click", () => {

        console.log("anotherMovie clicked");
        pickMovie(moodSelect.value);        
    });

    // Reset button functionality
    // A reset button, if the user has selected a wrong mood
    resetBtn.addEventListener("click", () => {
        console.log("resetBtn clicked");

        // Resets everything from the result page
        moodSelect.value = "";
        movieDisplay.style.display = "none";
        anotherMovie.style.display = "none";
        wrongEmotion.style.display = "none";
        selectedMood.style.display = "none";

        // Displays the homepage content again
        moodTitle.style.display = "block";
        controls.style.display = "flex";
        document.body.style.background = defaultBackground;
    });

    // Function to display the random movie based on the mood we have picked
    function pickMovie(mood)
    {
        var movieList = movies[mood];
        var randomMovie = movieList[Math.floor(Math.random() * movieList.length)];

        console.log("function pickMovie, mood selected: " + mood);
        console.log("randomMovie: " + randomMovie);

        selectedMood.innerText = `Your mood: ${mood.charAt(0).toUpperCase() + mood.slice(1)}`;

        fetchMovieDetails(randomMovie);
        anotherMovie.style.display = "block";
        wrongEmotion.style.display = "flex";

        // The screen background changes with the mood the user has selected
        switch(mood) {
            case "happy": document.body.style.background = "linear-gradient(#FFFFFF, #FFB74D)"; break;
            case "sad": document.body.style.background = "linear-gradient(#64B5F6, #8f9cff)"; break;
            case "excited": document.body.style.background = "linear-gradient(#db8080, #ee4266)"; break;
            case "relaxed": document.body.style.background = "linear-gradient(#a1fcdf, #61c9a8)"; break;
            case "adventurous": document.body.style.background = "linear-gradient(#FF8A65, #d06140ff)"; break;
            case "thoughtful": document.body.style.background = "linear-gradient(#FFFFFF, #512DA8)"; break;
        }
    }

    // Function to fetch the movie details using the api
    async function fetchMovieDetails(title) 
    {
        // Hides the mood title and controls when displaying the movie details
        moodTitle.style.display = "none";
        controls.style.display = "none";

        // Displays the movie details
        movieDisplay.style.display = "block";
        movieCard.style.display = "flex";
    
        // Search for the movie using Watchmode api
        var searchResponse = await fetch(
            `https://api.watchmode.com/v1/search/?apiKey=${apiKey}&search_field=name&search_value=${encodeURIComponent(title)}`
        );
        var searchData = await searchResponse.json();

        console.log("searchResponse: ");
        console.log(`https://api.watchmode.com/v1/search/?apiKey=${apiKey}&search_field=name&search_value=${encodeURIComponent(title)}`);

        // If there are no details for the movie, display a message
        if (!searchData.title_results || searchData.title_results.length === 0) 
        {
            movieDisplay.innerHTML = `<p>No extra info found for "${movieTitle}".</p>`;
            return;
        }

        // Stores the movie id from the api results
        const movieId = searchData.title_results[0].id;

        console.log("movieId: " + movieId);

        // Get the movie details using the movie id we received
        var detailsResponse = await fetch(
            `https://api.watchmode.com/v1/title/${movieId}/details/?apiKey=${apiKey}`
        );
        var details = await detailsResponse.json();

        console.log("detailsResponse: ");
        console.log(`https://api.watchmode.com/v1/title/${movieId}/details/?apiKey=${apiKey}`);

        // Takes the backdrop image from the api
        // If there is a backdrop image, displays it
        backdrop.src = details.backdrop;
        console.log("bckdrop.src: " + backdrop.src);
        backdrop.style.display = details.backdrop ? "block" : "none";
        
        // Takes the poster image from the api
        // If there is a poster image, displays it
        poster.src = details.poster;
        console.log("poster.src: " + poster.src);
        poster.style.display = details.poster ? "block" : "none";
        
        // Displays the movie title, release year
        movieTitleCard.textContent = details.title;
        movieYearCard.textContent = `Year: ${details.year}`;

        // Checks for movie genre and displays the first genre from the array
        if(details.genre_names && details.genre_names.length >0)
        {
            movieGenreCard.textContent = `Genre: ${details.genre_names[0]}`;
        }

        // Fetching the streaming sources
        var sourcesResponse = await fetch(
            `https://api.watchmode.com/v1/title/${movieId}/sources/?apiKey=${apiKey}`
        );
        var sources = await sourcesResponse.json();

        console.log("sourcesResponse: ");
        console.log(`https://api.watchmode.com/v1/title/${movieId}/sources/?apiKey=${apiKey}`);

        // Check if there are any streaming sources for the movie from the api data and displays the first result
        if (sources && sources.length > 0) 
        {
            movieSourcesCard.innerHTML = `Available on: <a href="${sources[0].web_url}" target="_blank">${sources[0].name}</a>`;
        } 
        else 
        {
            movieSourcesCard.innerHTML = "No streaming sources found.";
        }
    }
}