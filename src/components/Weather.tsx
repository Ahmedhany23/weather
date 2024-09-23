import "./Weather.css";
import clearSun from "/images/weather-icons/sunny.png";
import cloudy from "/images/weather-icons/cloud.png";
import rain from "/images/weather-icons/rain.png";
import thunder from "/images/weather-icons/thunder.png";
import snow from "/images/weather-icons/snow.png";
import mist from "/images/weather-icons/mist.png";
import celsuis from "/images/weather-icons/celsius.png";
import wind from "/images/weather-icons/wind.png";
import humidity from "/images/weather-icons/humdity.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
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
export default function Weather() {
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [searchinput, setSearchinput] = useState("");

  const [forecastData, setForecastData] = useState();

  useEffect(() => {
    const forecast = async (city: string) => {
      try {
        const { data } = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${
            import.meta.env.VITE_APP_ID
          }`
        );
        setForecastData(data.list);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    forecast(searchinput || "giza");
    const search = async (city: string) => {
      try {
        const { data } = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
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
    search(searchinput || "giza");
  }, [searchinput]);

  if (weatherData && forecastData) {
    return (
      <div className="weather-app">
        <Swiper
          spaceBetween={30}
          slidesPerView="auto"
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          speed={200}
          loop={false}
          className="forcast"
        >
          {forecastData.map((item, index: number) => {
            // Create a Date object from dt_txt
            const date = new Date(item.dt_txt);

            // Get hours and minutes
            let hours = date.getHours();
            const minutes = date.getMinutes();

            // Determine AM or PM suffix
            const ampm = hours >= 12 ? "PM" : "AM";

            // Convert hours to 12-hour format
            hours = hours % 12;
            hours = hours ? hours : 12; // If 0, set it to 12

            // Format minutes to always have two digits
            const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

            // Final formatted time string
            const formattedTime = hours + ":" + formattedMinutes + " " + ampm;
            return (
              <SwiperSlide key={index} className="forcast-item">
                <div className="weather-details">
                  <div className="time">{formattedTime}</div>
                  <div className="temperature">
                    <img
                      src={allIcons[item.weather[0].icon] || clearSun}
                      alt="icon"
                      className="weather-icon"
                    />

                    <p>{Math.floor(item.main.temp)}</p>
                    <img src={celsuis} alt="celsius" className="weather-icon" />
                  </div>
                </div>

                <div className="details">
                  <div className="humidity">
                    <p>{item.main.humidity}%</p>
                    <img
                      src={humidity}
                      alt="humidity icon"
                      className="details-icon"
                    />
                  </div>
                  <div className="wind">
                    <p>{item.wind.speed} m/s</p>
                    <img src={wind} alt="wind icon" className="details-icon" />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

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
              <img
                src={humidity}
                alt="humidity icon"
                className="details-icon"
              />
            </div>
            <div className="wind">
              <p>{weatherData.wind} m/s</p>
              <img src={wind} alt="wind icon" className="details-icon" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather isLoading ">
      <Skeleton variant="circular" width={40} height={40} animation="wave" />
      <Skeleton
        variant="rectangular"
        width={210}
        height={60}
        animation="wave"
      />
      <Skeleton
        variant="rectangular"
        width={210}
        height={60}
        animation="wave"
      />
    </div>
  );
}
