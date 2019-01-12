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

//Function for the concert-this command.
function bandsInTown (artist) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function (response) {
            // console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
                console.log("");
                console.log("Artist: ");
                //Checking if the lineup of artists has repeats.
                for (var j = 0; j < response.data[i].lineup.length; j++) {
                    var check = response.data[i].lineup[j+1] + "";
                    var checkTrim = check.trim();
                    var current = response.data[i].lineup[j] + "";
                    var currentTrim = current.trim();
                    if (currentTrim != checkTrim) {
                        console.log(response.data[i].lineup[j]);
                    }
                }
                console.log("Name of venue: " + response.data[i].venue.name);
                //Checking whether a region is present in the data.
                if (response.data[i].venue.region.length > 0) {
                    console.log("Venue location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + " " + response.data[i].venue.country);
                } else {
                    console.log("Venue location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                }
                //Converting the date into a MM/DD/YYYY format.
                var date = response.data[i].datetime;
                var dateConverted = moment(date);
                console.log("Date of Event: " + moment(dateConverted).format("MM/DD/YYYY"));
            }
        })
        .catch(
            function(error) {
                if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
                } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
                }
            console.log(error.config);
    });
}

//Function for spotify-this-song command.
function spotifyThis (song) {
    var songTitlized = titleCase(song);
    spotify.search({ type: "track", query: songTitlized })
    .then(function(response) {
        for (var i = 0; i < response.tracks.items.length; i++) {
            console.log("");
            console.log("Artists: ");
            for (var j = 0; j < response.tracks.items[i].artists.length; j++) {
                console.log(response.tracks.items[i].artists[j].name + "");
            }
            console.log("Name: " + response.tracks.items[i].name);
            console.log("Spotify URL: " + response.tracks.items[i].external_urls.spotify);
            console.log("Album: " + response.tracks.items[i].album.name);
        }
    })
    .catch(function(err) {
        console.log(err);
    });
}

function ombdThis (movie) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
        function (response) {
            // console.log(response.data);
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            //Determining where in the Ratings the Rotten Tomatoes ratings are.
            var tomatoIndex;
            for (var i = 0; i < response.data.Ratings.length; i++) {
                if (response.data.Ratings[i].Source.includes("Rotten Tomatoes")) {
                    tomatoIndex = i;
                }
            }
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[tomatoIndex].Value);
            console.log("Country produced: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
    ).catch(
        function(error) {
            if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
            }
        console.log(error.config);
    });
}

// Determining which of the functions to use, plus whether to use the predefined variables if the user does not provide a second input.
if (userInputs[2] == "concert-this" && userInputs[3] != undefined) {
    var artist = "";
    for (var i = 3; i < userInputs.length; i++) {
        artist += userInputs[i] + " ";
    }
    artist = artist.trim();
    artist = artist
    bandsInTown(artist);
} else if (userInputs[2] == "concert-this" && userInputs[3] == undefined) {
    var artist = "Styx";
    bandsInTown(artist);
}

if (userInputs[2] == "spotify-this-song" && userInputs[3] != undefined) {
    var song = "";
    for (var i = 3; i < userInputs.length; i++) {
        song += userInputs[i] + " ";
    }
    song = song.trim();
    spotifyThis(song);
} else if (userInputs[2] == "spotify-this-song" && userInputs[3] == undefined) {
    var song = "The Sign";
    spotifyThis(song);
}

if (userInputs[2] == "movie-this" && userInputs[3] != undefined) {
    var movie = "";
    for (var i = 3; i < userInputs.length; i++) {
        movie += userInputs[i] + " ";
    }
    movie = movie.trim();
    ombdThis(movie);
} else if (userInputs[2] == "movie-this" && userInputs[3] == undefined) {
    var movie = "Mr. Nobody";
    console.log("If you haven't watched \"Mr. Nobody,\" then you should: http://www.imdb.com/title/tt0485947/");
    console.log("It's on Netflix! (for now)");
    ombdThis(movie);
}

if (userInputs[2] == "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        if (dataArr[0] == "concert-this" && dataArr[1] != undefined) {
            bandsInTown(dataArr[1]);
        } else if (dataArr[0] == "concert-this" && dataArr[1] == undefined) {
            var artist = "Styx";
            bandsInTown(artist);
        }

        if (dataArr[0] == "spotify-this-song" && dataArr[1] != undefined) {
            spotifyThis(dataArr[1]);
        } else if (dataArr[0] == "spotify-this-song" && dataArr[1] == undefined) {
            var song = "The Sign";
            spotifyThis(song);
        }

        if (dataArr[0] == "movie-this" && dataArr[1] != undefined) {
            ombdThis(dataArr[1]);
        } else if (dataArr[0] == "movie-this" && dataArr[1] == undefined) {
            var movie = "Mr. Nobody";
            //Why do we keep talking about Mr. Nobody....?
            console.log("If you haven't watched \"Mr. Nobody,\" then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix! (for now)");
            ombdThis(movie);
        }
    });
}

//Give user some instructions on available commands if they don't know what the commands are.
if (userInputs[2] == undefined) {
    console.log("- Your options are \"concert-this\", \"spotify-this-song\", \"movie-this\", and \"do-what-it-says\".");
    console.log("- \"concert-this\", \"spotify-this-song\", and \"movie-this\" will all take in more inputs after the command for the particular band, song, or movie about which you would like to find information.");
    console.log("- \"do-what-it-says\" will just read the file random.txt and execute the function with the inputs that are in that file.");
}