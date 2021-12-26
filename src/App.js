import React, { useState, useEffect } from "react";

// CssBaseline -> normalize the style
import { CssBaseline, Grid } from "@material-ui/core";

import { getPlacesData, getWeatherData } from "./api";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import PlaceDetails from "./components/PlaceDetails/PlaceDetails";

const App = () => {
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("");

  // top right and bottom left corner of the map are called bounds
  const [bounds, setBounds] = useState({});

  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState([]);

  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const [childClicked, setChildClicked] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [coordinates, setCoordinates] = useState({
    lat: 18.960515447706,
    lng: 72.83043437613193,
    // coards for new york
    //lat: 40.73061,
    // lng: -73.935242,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);
  // comment: 1

  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating > rating);

    setFilteredPlaces(filteredPlaces);
  }, [rating]);

  useEffect(() => {
    if (bounds.sw && bounds.ne) {
      setIsLoading(true);

      getWeatherData(coordinates.lat, coordinates.lng).then((data) => {
        console.log(weatherData);
        setWeatherData(data);
      });

      getPlacesData(type, bounds?.sw, bounds?.ne).then((data) => {
        // console.log(data);
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
        setFilteredPlaces([]);
        setIsLoading(false);
      });
    }
  }, [type, bounds]);
  return (
    <>
      <Alert severity="warning">
        <AlertTitle>
          Note from the developer <strong>Priyam</strong>
        </AlertTitle>
        Some google maps features may not work
        <strong> there are no bugs </strong>
        Just have to verify payment details at console.cloud.google.com/billing
      </Alert>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{ width: "100%" }}>
        {/* comment: 2 */}
        <Grid item xs={12} md={4}>
          {/* comment: 3 */}
          <List
            places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;

// commetn: 1
// Empty dependency array means the code inside the functional
// block will happen only at the start of the application

// comment: 2
// since we are doing inline styles it has to be an object so in double {braces}

// comment: 3
// xs = 12 means it will take full width on mobile devices
// and take 4/12 space on medium and large devices
