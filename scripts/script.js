window.onload = function() {

    var moodSelect = document.getElementById("mood-select");
    var surpriseBtn = document.getElementById("surprise-me");
    var movieDisplay = document.getElementById("movie-display");
    var anotherMovie = document.getElementById("another-movie");
    var wrongEmotion = document.getElementById("wrongEmotion");
    var resetBtn = document.getElementById("reset");

    var defaultBackground = "linear-gradient(#F9BFBF, #737373)";
    
    // Watchmode api key
    const apiKey = "zrpLliuelXMbxbD1HdRoFDH2hSYmvj3QWBy0pMQl";

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

        if(!moodSelect.value)
        {
            movieDisplay.innerText = "Please select a mood first!";
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
        moodSelect.value = "";
        movieDisplay.innerText = "";
        anotherMovie.style.display = "none";
        wrongEmotion.style.display = "none";
        document.body.style.background = defaultBackground;
    });

    // Function to display the random movie based on the mood we have picked
    function pickMovie(mood)
    {
        if(!mood || !movies[mood])
        {
            return;
        }

        var movieList = movies[mood];
        var randomMovie = movieList[Math.floor(Math.random() * movieList.length)];
        console.log("function pickMovie, mood selected: " + mood);
        console.log("randomMovie: " + randomMovie);

        movieDisplay.innerText = "Your movie suggestion: " + randomMovie;
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

    async function fetchMovieDetails(movieTitle) 
    {
        // Search for the movie using Watchmode api
        var searchResponse = await fetch(
            `https://api.watchmode.com/v1/search/?apiKey=${apiKey}&search_field=name&search_value=${encodeURIComponent(movieTitle)}`
        );
        var searchData = await searchResponse.json();

        console.log("searchResponse: ");
        console.log(`https://api.watchmode.com/v1/search/?apiKey=${apiKey}&search_field=name&search_value=${encodeURIComponent(movieTitle)}`);

        // If there are no details for the movie, display a message
        if (!searchData.title_results || searchData.title_results.length === 0) 
        {
            movieDisplay.innerHTML = `<p>No extra info found for "${movieTitle}".</p>`;
            return;
        }

        const movieId = searchData.title_results[0].id;

        console.log("movieId: " + movieId);

        // Get the movie details using the movie id we received
        var detailsResponse = await fetch(
            `https://api.watchmode.com/v1/title/${movieId}/details/?apiKey=${apiKey}`
        );
        var details = await detailsResponse.json();

        console.log("detailsResponse: ");
        console.log(`https://api.watchmode.com/v1/title/${movieId}/details/?apiKey=${apiKey}`);

        // Displaying the movie info to movieDisplay
        movieDisplay.innerHTML = `<h2>${details.title} (${details.year})</h2>
            <img src="${details.poster}" alt="${details.title}" style="max-width:200px;">`; 

        // Fetching the streaming sources
        var sourcesResponse = await fetch(
            `https://api.watchmode.com/v1/title/${movieId}/sources/?apiKey=${apiKey}`
        );
        var sources = await sourcesResponse.json();

        console.log("sourcesResponse: ");
        console.log(`https://api.watchmode.com/v1/title/${movieId}/sources/?apiKey=${apiKey}`);

        // Displaying a maximum of three sources separated by a comma
        if (sources && sources.length > 0) 
        {
            var sourceLinks = "";
            for(var i = 0; i < sources.length && i <3; i++)
            {
                sourceLinks += `<a href="${sources[i].web_url}" target="">${sources[i].name}</a>`;
                if (i < sources.length - 1 && i < 2) 
                {
                    sourceLinks += ", ";
                }
            }
            movieDisplay.innerHTML += `<p>Available on: ${sourceLinks}</p>`;
        }
    }
}