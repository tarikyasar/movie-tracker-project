import { useState } from "react";
import env from "react-dotenv";
import "../componentStyles/Home.css";

const axios = require("axios");
const Parse = require("parse");

const Home = () => {
  const [movie, setMovie] = useState("");

  Parse.serverURL = "https://parseapi.back4app.com";
  Parse.initialize(env.PARSE_APP_ID, env.PARSE_JS_KEY, env.PARSE_MASTER_KEY);

  const handleClick = async () => {
    const MovieClass = Parse.Object.extend("Movies");

    // Getting database to check if movie exists
    const query = new Parse.Query("Movies");
    const parseResults = await query.find();
    let movieName = document.getElementById("movieNameInput").value;

    if (movieName !== "") {
      axios
        .get(
          "http://www.omdbapi.com/?t=" +
            movieName +
            "&apikey=" +
            env.OMDB_API_KEY
        )
        .then((response) => {
          if (
            !parseResults.some(
              (e) => e.attributes.MovieName === response.data.Title
            )
          ) {
            const movieObject = new MovieClass();

            // Adding movie details to Parse Database
            movieObject.set("MovieName", response.data.Title);
            movieObject.set("Director", response.data.Director);
            movieObject.set("Writer", response.data.Writer);
            movieObject.set("Country", response.data.Country);
            movieObject.set("Language", response.data.Language);
            movieObject.set("Genre", response.data.Genre);
            movieObject.set("Plot", response.data.Plot);
            movieObject.set("Poster", response.data.Poster);
            movieObject.set("ReleaseDate", response.data.Released);
            movieObject.set("Runtime", response.data.Runtime);

            movieObject.save().then(
              (result) => {
                if (typeof document !== "undefined")
                  console.log("ParseObject created", result);
              },
              (error) => {
                if (typeof document !== "undefined")
                  console.error("Error while creating ParseObject: ", error);
              }
            );

            console.log(`Movie ${movieName} added.`);
          } else {
            alert(
              `Movie ${response.data.Title} already exists on the database.`
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("You have to enter a valid movie name!");
    }
  };

  return (
    <div className="App">
      {/* <p>{movie}</p> */}
      <input
        type="text"
        placeholder="Movie Name"
        id="movieNameInput"
        onChange={(e) => setMovie(e.target.value)}
      />
      <br />
      <button className="submitBtn" onClick={handleClick}>
        Save Movie
      </button>
    </div>
  );
};

export default Home;