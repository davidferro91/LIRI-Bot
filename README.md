# LIRI-Bot
David Ferro

This application is run from the command line instead of from a webpage.

## Description
This is a command line application that can find you information on concerts from your favorite band/artist, information on your favorite songs, and information on your favorite movies.

To find concert information, type in `node liri.js concert-this <artist-you'd-like>` when you are in the folder containing the `liri.js` file.

![Image of concert-this working with Paul McCartney](/images/concert-this.png)

To find song information, type in `node liri.js spotify-this-song <song-you'd-like>` when you are in the folder containing the `liri.js` file.

![Image of spotify-this-song working with Silly Love Songs](/images/spotify-this-song.png)

To find movie information, type in `node liri.js movie-this <movie-you'd-like>` when you are in the folder containing the `liri.js` file.

![Image of movie-this working with Magical Mystery Tour](/images/movie-this.png)

If you have a file named `random.txt` with one of those three commands and an input for it separated by a comma (no spaces around the comma), then you can type in `node liri.js do-what-it-says` when you are in the folder containing the `liri.js` file.  It will do whatever is in the file.

![Image of do-what-it-says working](/images/do-what-it-says.png)
![Image of random.txt file](/images/random-txt.png)

The LIRI-Bot also writes all of the inputs and information outputed to a log file called `log.txt`.

![Image of log.txt file](/images/log-txt.png)

If you forget the commands to make the application work, it will give you a list of what you can do and what commands to use.

![Image of what happens with no/incorrect input](/images/no-incorrect.png)

The concert-this command uses the Bands In Town API, the spotify-this-song uses the Spotify API, and the movie-this command uses the OMBD API.  The application also uses the moment.js API in order to display the times for the concerts in the MM/DD/YYYY format.

If you have any questions, feel free to contact me at david-ferro@sbcglobal.net.

Enjoy!