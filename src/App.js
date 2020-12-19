import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import './App.css';
import Demo from './demo';

 
const Component = () => (
  <div>
    <GooglePlacesAutocomplete
      apiKey="{google_api_key}"
    />
  </div>
);

const owm_api_key = 'ab509b50d11e54bad26c982f90d58174';
const api_base_url = 'http://api.openweathermap.org/data/2.5';
// const google_api_key = 'AIzaSyBk-5LibUN9s7J7y00kp_2lXc4AiGug6BQ';
const google_api_key = 'AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE';
// AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


const WeatherDemo = () => {
  const [weatherData, setWeatherData] = useState({});
  const [cityID, setCityID] = useState('524901');
  const [cityValue, setCityValue] = useState(null);
  
  // const cityID = '524901';
  const weatherBalloon = (cityID) => {
    let url = `${api_base_url}/weather?id=${cityID}&appid=${owm_api_key}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let celcius = Math.round(parseFloat(data.main.temp) - 273.15);
        let celcius_feel = Math.round(parseFloat(data.main.feels_like) - 273.15);
        setWeatherData({
          temp: celcius,
          feels_like: celcius_feel,
          description: data.weather[0].description,
          location: data.name,
          ...data
        });
      });
  };

  // useEffect will run weatherBalloon function only once
  useEffect(() => {
    weatherBalloon(cityID);
  }, []);

  const classes = useStyles();

  return (
    <Container maxWidth="sm">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Weather
          </Typography>
          <Button color="inherit"  onClick={() => weatherBalloon(cityID)}>See</Button>
        </Toolbar>
      </AppBar>
      <div>
        <GooglePlacesAutocomplete
          apiKey={google_api_key}
          selectProps={{
            cityValue,
            onChange: setCityValue,
          }}
        />
      </div>
      <Card>
        <CardContent>
          <Typography color="primary" gutterBottom variant="h4" component="h2">
          {weatherData.location}
          </Typography>
          <Typography color="secondary" gutterBottom variant="h5" component="h2">
          {new Intl.DateTimeFormat("en-US", {
              dateStyle: 'full', timeStyle: 'medium'
            }).format(new Date())}
          </Typography>
          <Typography variant="h4" component="h2">
          {weatherData.description}
          {weatherData.temp && <img src={'http://openweathermap.org/img/w/'+weatherData.weather[0].icon+'.png'} />}
          </Typography>
          <Typography variant="body2" component="div">
          { weatherData.temp && <h2>Temperature: {weatherData.temp}&deg; </h2>}
          { weatherData.feels_like && <h2>Feel like: {weatherData.feels_like}&deg; </h2>}
          { weatherData.wind && <h2>Wind: {weatherData.wind.speed}m/s </h2>}
          { weatherData.main && <h2>Humidity: {weatherData.main.humidity}% </h2>}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => weatherBalloon(cityID)} variant="contained" color="primary">Update Weather</Button>
        </CardActions>
      </Card>
    </Container>
  );
};


function App() {
  return (
    <WeatherDemo />
  );
}

export default App;
