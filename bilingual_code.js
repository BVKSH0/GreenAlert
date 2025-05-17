// In your weather.js or bilingual_code.js
document.addEventListener("DOMContentLoaded", function () {
  const API_KEY = "5366c22be6854bb7a71113401251705"; // Replace with your actual key
  let currentLocation = "Unknown";

  // DOM Elements
  const detectBtn = document.getElementById("detect-location");
  const searchBtn = document.getElementById("search-location");
  const locationInput = document.getElementById("location-input");
  const locationDisplay = document.getElementById("location-display");
  const lastUpdated = document.getElementById("last-updated");

  // Weather Display Elements
  const currentTemp = document.getElementById("current-temp");
  const weatherIcon = document.getElementById("weather-icon");
  const weatherCondition = document.getElementById("weather-condition");
  const windSpeed = document.getElementById("wind-speed");
  const humidity = document.getElementById("humidity");
  const precipitation = document.getElementById("precipitation");
  const visibility = document.getElementById("visibility");
  const forecastCards = document.getElementById("forecast-cards");

  // Event Listeners
  detectBtn.addEventListener("click", detectLocation);
  searchBtn.addEventListener("click", () => {
    const location = locationInput.value.trim();
    if (location) getWeatherData(location);
  });

  // Auto-detect location
  function detectLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherData(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not detect your location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }

  // Get weather data from WeatherAPI
  async function getWeatherData(location) {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=7&aqi=no&alerts=no`
      );
      const data = await response.json();

      if (data.error) {
        alert(data.error.message);
        return;
      }

      updateCurrentWeather(data);
      updateForecast(data.forecast.forecastday);
      updateLocationInfo(data.location);
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Error fetching weather data. Please try again.");
    }
  }

  // Update current weather display
  function updateCurrentWeather(data) {
    currentTemp.textContent = Math.round(data.current.temp_c);
    weatherIcon.src = `https:${data.current.condition.icon}`;
    weatherCondition.textContent = data.current.condition.text;
    windSpeed.textContent = `${Math.round(data.current.wind_kph)} km/h`;
    humidity.textContent = `${data.current.humidity}%`;
    precipitation.textContent = `${data.current.precip_mm}mm`;
    visibility.textContent = `${data.current.vis_km} km`;
  }

  // Update location info
  function updateLocationInfo(location) {
    currentLocation = `${location.name}, ${location.country}`;
    locationDisplay.textContent = currentLocation;
    const now = new Date();
    lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;
  }

  // Update forecast display
  function updateForecast(forecastDays) {
    forecastCards.innerHTML = "";

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    forecastDays.forEach((day) => {
      const date = new Date(day.date);
      const dayName = days[date.getDay()];

      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
        <div class="forecast-day">${dayName}</div>
        <div class="forecast-icon">
          <img src="https:${day.day.condition.icon}" alt="${
        day.day.condition.text
      }">
        </div>
        <div class="forecast-condition">${day.day.condition.text}</div>
        <div class="forecast-temp">
          <span class="high-temp">${Math.round(day.day.maxtemp_c)}°</span>
          <span class="low-temp">${Math.round(day.day.mintemp_c)}°</span>
        </div>
      `;

      forecastCards.appendChild(card);
    });
  }

  // Initialize with default location
  getWeatherData("Dhaka");
});
