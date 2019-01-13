//All the requires for all the modules.
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var axios = require("axios");
var fs = require("fs");

moment().format();
var spotify = new Spotify(keys.spotify);

var userInputs = process.argv;


function titleCase(str) {
    str = str.toLowerCase().split(" ");
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(" ");
}

function logToFile (input) {
    var loggingText = "\r\n" + input;
    fs.appendFileSync("log.txt", loggingText, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

//Function for the concert-this command.
function bandsInTown (artist) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function (response) {
            // console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
                var lineBreak = "";
                var artistText = "Artist: ";
                logToFile(lineBreak);
                console.log(lineBreak);
                logToFile(artistText);
                console.log(artistText);
                //Checking if the lineup of artists has repeats.
                for (var j = 0; j < response.data[i].lineup.length; j++) {
                    var check = response.data[i].lineup[j+1] + "";
                    var checkTrim = check.trim();
                    var current = response.data[i].lineup[j] + "";
                    var currentTrim = current.trim();
                    if (currentTrim != checkTrim) {
                        logToFile(response.data[i].lineup[j]);
                        console.log(response.data[i].lineup[j]);
                    }
                }
                var venueName = "Name of venue: " + response.data[i].venue.name;
                logToFile(venueName);
                console.log(venueName);
                //Checking whether a region is present in the data.
                if (response.data[i].venue.region.length > 0) {
                    var venueLocation = "Venue location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + " " + response.data[i].venue.country;
                    logToFile(venueLocation);
                    console.log(venueLocation);
                } else {
                    var venueLocation = "Venue location: " + response.data[i].venue.city + ", " + response.data[i].venue.country;
                    logToFile(venueLocation);
                    console.log(venueLocation);
                }
                //Converting the date into a MM/DD/YYYY format.
                var date = response.data[i].datetime;
                var dateConverted = moment(date);
                var dateOfEvent = "Date of Event: " + moment(dateConverted).format("MM/DD/YYYY");
                logToFile(dateOfEvent);
                console.log(dateOfEvent);
            }
        })
        .catch(
            function(error) {
                if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                logToFile(error.response.data);
                console.log(error.response.data);
                logToFile(error.response.status);
                console.log(error.response.status);
                logToFile(error.response.headers);
                console.log(error.response.headers);
                } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                logToFile(error.request);
                console.log(error.request);
                } else {
                // Something happened in setting up the request that triggered an Error
                logToFile("Error", error.message);
                console.log("Error", error.message);
                }
            logToFile(error.config);
            console.log(error.config);
    });
}

//Function for spotify-this-song command.
function spotifyThis (song) {
    var songTitlized = titleCase(song);
    spotify.search({ type: "track", query: songTitlized })
    .then(function(response) {
        for (var i = 0; i < response.tracks.items.length; i++) {
            var lineBreak = "";
            var artistsText = "Artists: ";
            logToFile(lineBreak);
            console.log(lineBreak);
            logToFile(artistsText);
            console.log(artistsText);
            for (var j = 0; j < response.tracks.items[i].artists.length; j++) {
                logToFile(response.tracks.items[i].artists[j].name + "");
                console.log(response.tracks.items[i].artists[j].name + "");
            }
            var trackName = "Name: " + response.tracks.items[i].name;
            var spotURL = "Spotify URL: " + response.tracks.items[i].external_urls.spotify;
            var album = "Album: " + response.tracks.items[i].album.name;
            logToFile(trackName);
            console.log(trackName);
            logToFile(spotURL);
            console.log(spotURL);
            logToFile(album);
            console.log(album);
        }
    })
    .catch(function(err) {
        logToFile(err);
        console.log(err);
    });
}

function ombdThis (movie) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
        function (response) {
            // console.log(response.data);
            var movieTitle = "Title: " + response.data.Title;
            var releaseYear = "Release Year: " + response.data.Year;
            var movieIMDB = "IMDB Rating: " + response.data.imdbRating;
            logToFile(movieTitle);
            console.log(movieTitle);
            logToFile(releaseYear);
            console.log(releaseYear);
            logToFile(movieIMDB);
            console.log(movieIMDB);
            //Determining where in the Ratings the Rotten Tomatoes ratings are.
            var tomatoIndex;
            for (var i = 0; i < response.data.Ratings.length; i++) {
                if (response.data.Ratings[i].Source.includes("Rotten Tomatoes")) {
                    tomatoIndex = i;
                }
            }
            var rtRating = "Rotten Tomatoes Rating: " + response.data.Ratings[tomatoIndex].Value;
            var countryProd = "Country produced: " + response.data.Country;
            var language = "Language: " + response.data.Language;
            var plot = "Plot: " + response.data.Plot;
            var actors = "Actors: " + response.data.Actors;
            logToFile(rtRating);
            console.log(rtRating);
            logToFile(countryProd);
            console.log(countryProd);
            logToFile(language);
            console.log(language);
            logToFile(plot);
            console.log(plot);
            logToFile(actors);
            console.log(actors);
        }
    ).catch(
        function(error) {
            if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            logToFile(error.response.data);
            console.log(error.response.data);
            logToFile(error.response.status);
            console.log(error.response.status);
            logToFile(error.response.headers);
            console.log(error.response.headers);
            } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            logToFile(error.request);
            console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            logToFile("Error", error.message);
            console.log("Error", error.message);
            }
        logToFile(error.config);
        console.log(error.config);
    });
}

// Determining which of the functions to use, plus whether to use the predefined variables if the user does not provide a second input.
if (userInputs[2] === "concert-this" && userInputs[3] !== undefined) {
    logToFile(userInputs[2]);
    var artist = "";
    for (var i = 3; i < userInputs.length; i++) {
        artist += userInputs[i] + " ";
    }
    artist = artist.trim();
    logToFile(artist);
    bandsInTown(artist);
} else if (userInputs[2] === "concert-this" && userInputs[3] === undefined) {
    logToFile(userInputs[2]);
    var artist = "Styx";
    logToFile(artist);
    bandsInTown(artist);
}

if (userInputs[2] === "spotify-this-song" && userInputs[3] !== undefined) {
    logToFile(userInputs[2]);
    var song = "";
    for (var i = 3; i < userInputs.length; i++) {
        song += userInputs[i] + " ";
    }
    song = song.trim();
    logToFile(song);
    spotifyThis(song);
} else if (userInputs[2] === "spotify-this-song" && userInputs[3] === undefined) {
    logToFile(userInputs[2]);
    var song = "The Sign";
    logToFile(song);
    spotifyThis(song);
}

if (userInputs[2] === "movie-this" && userInputs[3] !== undefined) {
    logToFile(userInputs[2]);
    var movie = "";
    for (var i = 3; i < userInputs.length; i++) {
        movie += userInputs[i] + " ";
    }
    movie = movie.trim();
    logToFile(movie);
    ombdThis(movie);
} else if (userInputs[2] === "movie-this" && userInputs[3] === undefined) {
    logToFile(userInputs[2]);
    var movie = "Mr. Nobody";
    var whereToFindNobody = "If you haven't watched \"Mr. Nobody,\" then you should: http://www.imdb.com/title/tt0485947/";
    var netflix = "It's on Netflix! (for now)";
    logToFile(whereToFindNobody);
    console.log(whereToFindNobody);
    logToFile(netflix);
    console.log(netflix);
    logToFile(movie);
    ombdThis(movie);
}

if (userInputs[2] === "do-what-it-says") {
    logToFile(userInputs[2]);
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            logToFile(error);
            return console.log(error);
        }

        var dataArr = data.split(",");

        if (dataArr[0] === "concert-this" && dataArr[1] !== undefined) {
            logToFile(dataArr[0]);
            logToFile(dataArr[1]);
            bandsInTown(dataArr[1]);
        } else if (dataArr[0] === "concert-this" && dataArr[1] === undefined) {
            logToFile(dataArr[0]);
            var artist = "Styx";
            logToFile(artist);
            bandsInTown(artist);
        }

        if (dataArr[0] === "spotify-this-song" && dataArr[1] !== undefined) {
            logToFile(dataArr[0]);
            logToFile(dataArr[1]);
            spotifyThis(dataArr[1]);
        } else if (dataArr[0] === "spotify-this-song" && dataArr[1] === undefined) {
            logToFile(dataArr[0]);
            var song = "The Sign";
            logToFile(song);
            spotifyThis(song);
        }

        if (dataArr[0] === "movie-this" && dataArr[1] !== undefined) {
            logToFile(dataArr[0]);
            logToFile(dataArr[1]);
            ombdThis(dataArr[1]);
        } else if (dataArr[0] === "movie-this" && dataArr[1] === undefined) {
            logToFile(dataArr[0]);
            var movie = "Mr. Nobody";
            //Why do we keep talking about Mr. Nobody....?
            var whereToFindNobody = "If you haven't watched \"Mr. Nobody,\" then you should: http://www.imdb.com/title/tt0485947/";
            var netflix = "It's on Netflix! (for now)";
            logToFile(whereToFindNobody);
            console.log(whereToFindNobody);
            logToFile(netflix);
            console.log(netflix);
            logToFile(movie);
            ombdThis(movie);
        }
    });
}

//Give user some instructions on available commands if they don't know what the commands are.
var incorrectCommand = true;
var optionsArr = ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"];
for (var i = 0; i < optionsArr.length; i++) {
    if (userInputs[2] === optionsArr[i]) {
        incorrectCommand = false;
    }
}

if (userInputs[2] === undefined || incorrectCommand) {
    var optionsText = "- Your options are \"concert-this\", \"spotify-this-song\", \"movie-this\", and \"do-what-it-says\".";
    var whatTheFirstThreeDo = "- \"concert-this\", \"spotify-this-song\", and \"movie-this\" will all take in more inputs after the command for the particular band, song, or movie about which you would like to find information.";
    var whatTheLastDoes = "- \"do-what-it-says\" will read the file random.txt and execute the command with the inputs that are in that file.";
    logToFile(optionsText);
    console.log(optionsText);
    logToFile(whatTheFirstThreeDo);
    console.log(whatTheFirstThreeDo);
    logToFile(whatTheLastDoes);
    console.log(whatTheLastDoes);
}