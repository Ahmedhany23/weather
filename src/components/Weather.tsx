import "./Weather.css";
import clearSun from "../../public/images/weather-icons/sunny.png";
import cloudy from "../../public/images/weather-icons/cloud.png";
import rain from "../../public/images/weather-icons/rain.png";
import thunder from "../../public/images/weather-icons/thunder.png";
import snow from "../../public/images/weather-icons/snow.png";
import mist from "../../public/images/weather-icons/mist.png";
import celsuis from "../../public/images/weather-icons/celsius.png";
import wind from "../../public/images/weather-icons/wind.png";
import humidity from "../../public/images/weather-icons/humdity.png";
import axios from "axios";
import { useEffect, useState } from "react";

type WeatherData = {
  location: string;
  temp: number;
  icon: string;
  humidity: number;
  wind: number;
};

type Icons = {
  [key: string]: string;
};

export default function Weather() {
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [searchinput, setSearchinput] = useState("");

  const allIcons: Icons = {
    "01d": clearSun,
    "01n": clearSun,
    "02d": cloudy,
    "02n": cloudy,
    "03d": cloudy,
    "03n": cloudy,
    "04d": cloudy,
    "04n": cloudy,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "11d": thunder,
    "11n": thunder,
    "13d": snow,
    "13n": snow,
    "50d": mist,
    "50n": mist,
  };

  const search = async (country: string) => {
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country}&units=metric&appid=${
          import.meta.env.VITE_APP_ID
        }`
      );
      const icon = allIcons[data.weather[0].icon] || clearSun;
      setWeatherData({
        location: data.name,
        temp: Math.floor(data.main.temp),
        icon: icon,
        humidity: data.main.humidity,
        wind: data.wind.speed,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    search(searchinput || "giza");
  }, [searchinput]);

  if (weatherData) {
    return (
      <div className="weather">
        <div className="search">
          <input
            type="search"
            name="search"
            placeholder="Search.."
            autoComplete="off"
            value={searchinput}
            onChange={(e) => setSearchinput(e.target.value)}
          />
        </div>
        <img src={weatherData.icon} alt="icon" className="weather-icon" />
        <div className="temperature">
          <p>{weatherData.temp}</p>
          <img src={celsuis} alt="celsius" className="weather-icon" />
        </div>
        <p className="country">{weatherData.location}</p>
        <div className="details">
          <div className="humidity">
            <p>{weatherData.humidity}%</p>
            <img src={humidity} alt="humidity icon" className="details-icon" />
          </div>
          <div className="wind">
            <p>{weatherData.wind} m/s</p>
            <img src={wind} alt="wind icon" className="details-icon" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather isLoading">
      <div></div>
      <div></div>
      <div></div>
    
    </div>
  

  );
}
