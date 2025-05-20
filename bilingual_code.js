document.addEventListener("DOMContentLoaded", function () {
  // WEATHER SECTION CODE
  const API_KEY = "5366c22be6854bb7a71113401251705";
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
      updateFarmingConditions(data.current, data.forecast.forecastday);
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

  // FARMING ADVISORY SECTION CODE
  // Expanded crop database with tomato and potato
  const cropDatabase = {
    rice: {
      name: "Rice",
      idealTemp: { min: 20, max: 35 },
      waterReq: "1500-3000mm/season",
      frostTolerant: false,
      growthStage: "tillering",
      pests: "stem borers, leaf folders",
      waterAmount: "5cm standing water",
      actions: {
        fertilize:
          "Apply nitrogen fertilizer during tillering stage to promote shoot growth",
        water:
          "Maintain 2-4 inches of water in paddies to control weeds and regulate temperature",
        harvest:
          "Harvest when 80-85% grains are golden yellow and moisture content is 20-25%",
      },
      plantingSeason: "June-July (Kharif) or November-December (Rabi)",
      soilType: "Clay loam with good water retention",
    },
    wheat: {
      name: "Wheat",
      idealTemp: { min: 10, max: 24 },
      waterReq: "500-800mm/season",
      frostTolerant: true,
      growthStage: "vegetative",
      pests: "aphids, rust fungus",
      waterAmount: "25mm per irrigation",
      actions: {
        fertilize:
          "Apply phosphorus at planting and nitrogen during tillering for optimal growth",
        water:
          "Critical irrigation needed at crown root initiation and flowering stages",
        harvest:
          "Harvest when grain moisture content reaches 20-25% for best quality",
      },
      plantingSeason: "November-December",
      soilType: "Well-drained loamy soil",
    },
    corn: {
      name: "Corn",
      idealTemp: { min: 15, max: 30 },
      waterReq: "500-800mm/season",
      frostTolerant: false,
      growthStage: "vegetative",
      pests: "corn borers, armyworms",
      waterAmount: "30mm per week",
      actions: {
        fertilize: "Apply nitrogen fertilizer when plants are 15-20cm tall",
        water: "Ensure consistent moisture during tasseling and silking stages",
        harvest: "Harvest when kernels are firm and milky when punctured",
      },
      plantingSeason: "April-May or September-October",
      soilType: "Fertile, well-drained soil",
    },
    tomato: {
      name: "Tomato",
      idealTemp: { min: 18, max: 28 },
      waterReq: "25-50mm/week",
      frostTolerant: false,
      growthStage: "fruiting",
      pests: "whiteflies, aphids, tomato hornworms",
      waterAmount: "consistent moisture",
      actions: {
        fertilize:
          "Apply balanced fertilizer when first fruits are 1 inch diameter",
        water: "Water at base of plants to avoid leaf wetness",
        harvest: "Harvest when fruits are fully colored but still firm",
      },
      plantingSeason: "After last frost in spring or late summer for fall crop",
      soilType: "Well-drained, fertile soil with organic matter",
    },
    potato: {
      name: "Potato",
      idealTemp: { min: 15, max: 25 },
      waterReq: "25-50mm/week",
      frostTolerant: false,
      growthStage: "tuber formation",
      pests: "colorado potato beetles, aphids",
      waterAmount: "consistent moisture",
      actions: {
        fertilize: "Apply potassium-rich fertilizer during tuber formation",
        water: "Maintain even soil moisture, reduce watering near harvest",
        harvest: "Harvest 2-3 weeks after plants die back",
      },
      plantingSeason: "Early spring 2-4 weeks before last frost",
      soilType: "Loose, well-drained slightly acidic soil",
    },
  };

  // DOM Elements
  const cropSelect = document.getElementById("crop-select");
  const generateBtn = document.getElementById("generate-advice");
  const alertCards = document.getElementById("alert-cards");
  const actionTimeline = document.getElementById("action-timeline");

  // Current weather data
  let currentWeather = {
    temp: 28,
    rain: 15,
    wind: 12,
    humidity: 65,
  };

  // Update farming conditions display
  function updateFarmingConditions(weatherData, forecastData) {
    currentWeather = {
      temp: weatherData.temp_c,
      rain: weatherData.precip_mm,
      wind: weatherData.wind_kph,
      humidity: weatherData.humidity,
    };

    document.getElementById("farm-temp").textContent = `${Math.round(
      currentWeather.temp
    )}°C`;
    document.getElementById(
      "current-rain"
    ).textContent = `${currentWeather.rain}mm`;
    document.getElementById(
      "current-wind"
    ).textContent = `${currentWeather.wind}km/h`;
    document.getElementById(
      "current-humidity"
    ).textContent = `${currentWeather.humidity}%`;

    // Add weekly weather summary
    updateWeeklyWeatherSummary(forecastData);
  }

  // Add weekly weather summary
  function updateWeeklyWeatherSummary(forecastDays) {
    // Remove existing summary if it exists
    const existingSummary = document.querySelector(".weekly-summary");
    if (existingSummary) {
      existingSummary.remove();
    }

    const weeklySummaryContainer = document.createElement("div");
    weeklySummaryContainer.className = "weekly-summary";

    // Create header
    const header = document.createElement("h3");
    header.textContent = "Weekly Weather Outlook";
    weeklySummaryContainer.appendChild(header);

    // Create summary table
    const table = document.createElement("table");
    table.innerHTML = `
      <tr>
        <th>Day</th>
        <th>High/Low</th>
        <th>Rain</th>
        <th>Conditions</th>
      </tr>
    `;

    forecastDays.forEach((day) => {
      const date = new Date(day.date);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${dayName}</td>
        <td>${Math.round(day.day.maxtemp_c)}°/${Math.round(
        day.day.mintemp_c
      )}°</td>
        <td>${day.day.totalprecip_mm}mm</td>
        <td>${day.day.condition.text}</td>
      `;
      table.appendChild(row);
    });

    weeklySummaryContainer.appendChild(table);

    // Insert after current conditions
    const conditionsSection = document.querySelector(".current-conditions");
    conditionsSection.appendChild(weeklySummaryContainer);
  }

  // Generate advice
  generateBtn.addEventListener("click", function () {
    const selectedCrop = cropSelect.value || autoDetectCrop();
    if (!selectedCrop) return;

    const crop = cropDatabase[selectedCrop];
    generateAlerts(crop);
    generateTimeline(crop);
  });

  // Auto-detect crop based on location/season
  function autoDetectCrop() {
    // In a real implementation, you would use location and current season
    const month = new Date().getMonth() + 1;

    // Simple seasonal detection for demo
    if (month >= 6 && month <= 8) return "rice"; // Kharif season
    if (month >= 11 || month <= 2) return "wheat"; // Rabi season
    return "tomato"; // Default for other months
  }

  // Generate alert cards with detailed explanations
  function generateAlerts(crop) {
    alertCards.innerHTML = "";

    // Temperature check with detailed explanations
    if (currentWeather.temp < crop.idealTemp.min) {
      const tempDiff = crop.idealTemp.min - currentWeather.temp;
      addAlert(
        `Low temperature warning (${currentWeather.temp}°C). ${
          crop.name
        } grows best between ${crop.idealTemp.min}°C and ${
          crop.idealTemp.max
        }°C. 
        Current temperature is ${tempDiff}°C below ideal. 
        ${
          crop.frostTolerant
            ? "This crop can tolerate light frost."
            : "Consider using protective covers or irrigation to raise field temperature."
        }`,
        currentWeather.temp < crop.idealTemp.min - 5 ? "urgent" : "warning"
      );
    } else if (currentWeather.temp > crop.idealTemp.max) {
      const tempDiff = currentWeather.temp - crop.idealTemp.max;
      addAlert(
        `High temperature warning (${currentWeather.temp}°C). ${
          crop.name
        } experiences heat stress above ${crop.idealTemp.max}°C.
        Current temperature is ${tempDiff}°C above ideal. 
        ${
          crop.name === "rice"
            ? "Increase water level to help cool plants."
            : "Consider shade nets or adjusting irrigation to early morning."
        }`,
        currentWeather.temp > crop.idealTemp.max + 5 ? "urgent" : "warning"
      );
    }

    // Rainfall check with detailed explanations
    const weeklyRainThreshold = crop.name === "rice" ? 50 : 30;
    if (currentWeather.rain < weeklyRainThreshold) {
      const rainDeficit = weeklyRainThreshold - currentWeather.rain;
      addAlert(
        `Dry conditions (only ${currentWeather.rain}mm rainfall). ${
          crop.name
        } typically needs ${crop.waterReq}.
        About ${rainDeficit}mm additional water needed this week.
        ${
          crop.name === "rice"
            ? "Maintain 2-4 inches of standing water."
            : "Schedule irrigation for early morning to reduce evaporation."
        }`,
        rainDeficit > 30 ? "urgent" : "warning"
      );
    } else if (currentWeather.rain > weeklyRainThreshold * 1.5) {
      addAlert(
        `Heavy rainfall (${
          currentWeather.rain
        }mm). Ensure proper drainage to prevent waterlogging.
        ${
          crop.name === "rice"
            ? "Monitor water depth carefully."
            : "Check for signs of soil erosion and nutrient leaching."
        }`,
        "warning"
      );
    }

    // Wind check
    if (currentWeather.wind > 20) {
      addAlert(
        `High winds (${currentWeather.wind}km/h). Strong winds can damage ${
          crop.name
        } plants.
        ${
          crop.name === "corn"
            ? "Consider staking tall plants for support."
            : "Monitor for wind-borne pests and diseases."
        }`,
        currentWeather.wind > 30 ? "urgent" : "warning"
      );
    }

    // Humidity check
    if (currentWeather.humidity > 80) {
      addAlert(
        `High humidity (${currentWeather.humidity}%). This increases risk of fungal diseases in ${crop.name}.
        Monitor for signs of mildew or rust and consider preventive fungicide if needed.`,
        "warning"
      );
    } else if (currentWeather.humidity < 40) {
      addAlert(
        `Low humidity (${currentWeather.humidity}%). ${crop.name} may experience water stress.
        Increase irrigation frequency and consider mulching to retain soil moisture.`,
        "info"
      );
    }

    // Add planting season advice
    addAlert(
      `Best planting time for ${crop.name}: ${crop.plantingSeason}. 
      ${getPlantingTips(crop.name)}`,
      "info"
    );
  }

  // Generate timeline actions with detailed schedule
  function generateTimeline(crop) {
    actionTimeline.innerHTML = "";

    // Get current date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Format date helper
    const formatDate = (date) =>
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    // Fertilizer recommendation with explanation
    addTimelineItem(
      formatDate(tomorrow),
      `Apply ${getFertilizerType(crop.name)}. 
      ${crop.actions.fertilize} 
      Recommended amount: ${getFertilizerAmount(crop.name)} per acre.`,
      "fa-solid fa-flask"
    );

    // Watering recommendation
    const nextWaterDay =
      currentWeather.rain < (crop.name === "rice" ? 50 : 30) ? 2 : 5;
    const waterDate = new Date(today);
    waterDate.setDate(today.getDate() + nextWaterDay);

    addTimelineItem(
      formatDate(waterDate),
      `${
        currentWeather.rain < 30 ? "Critical" : "Scheduled"
      } irrigation needed. 
      Apply ${crop.waterAmount} of water ${getWateringTime(crop.name)}. 
      ${crop.actions.water}`,
      "fa-solid fa-tint"
    );

    // Pest monitoring
    const pestDate = new Date(today);
    pestDate.setDate(today.getDate() + 3);

    addTimelineItem(
      formatDate(pestDate),
      `Start weekly pest monitoring. Common ${crop.name} pests: ${crop.pests}. 
      Check undersides of leaves and look for ${getPestSigns(crop.name)}.`,
      "fa-solid fa-bug"
    );

    // Growth stage specific advice
    addTimelineItem(
      "Current stage",
      `${crop.name} is in ${crop.growthStage} stage. 
      ${getGrowthStageAdvice(crop.name, crop.growthStage)}`,
      "fa-solid fa-seedling"
    );
  }

  // Helper: Add alert card
  function addAlert(message, type) {
    const icon =
      type === "urgent"
        ? "fa-exclamation-triangle"
        : type === "warning"
        ? "fa-exclamation-circle"
        : "fa-info-circle";

    const alert = document.createElement("div");
    alert.className = `alert-card alert-${type}`;
    alert.innerHTML = `
      <i class="fas ${icon}"></i>
      <div>${message}</div>
    `;
    alertCards.appendChild(alert);
  }

  // Helper: Add timeline item
  function addTimelineItem(date, action, icon) {
    const item = document.createElement("div");
    item.className = "timeline-item";
    item.innerHTML = `
      <div class="timeline-date">${date}</div>
      <div class="timeline-action">
        <i class="fas ${icon}"></i>
        <span>${action}</span>
      </div>
    `;
    actionTimeline.appendChild(item);
  }

  // Helper: Get planting season tips
  function getPlantingTips(crop) {
    const tips = {
      rice: "Prepare paddy fields with proper leveling and water management.",
      wheat:
        "Ensure seedbed is well-prepared with proper moisture for germination.",
      corn: "Plant in rows with proper spacing for optimal growth and pollination.",
      tomato:
        "Start seeds indoors 6-8 weeks before transplanting after last frost.",
      potato: "Plant seed potatoes with eyes up, 12 inches apart in trenches.",
    };
    return tips[crop] || "Prepare soil with proper nutrients before planting.";
  }

  // Helper: Get fertilizer type
  function getFertilizerType(crop) {
    const types = {
      rice: "nitrogen-rich fertilizer (Urea)",
      wheat: "balanced NPK fertilizer (15-15-15)",
      corn: "nitrogen fertilizer (CAN)",
      tomato: "calcium-rich fertilizer to prevent blossom end rot",
      potato: "potassium-rich fertilizer for tuber development",
    };
    return types[crop] || "appropriate fertilizer";
  }

  // Helper: Get fertilizer amount
  function getFertilizerAmount(crop) {
    const amounts = {
      rice: "50-60kg nitrogen per acre",
      wheat: "40-50kg nitrogen + 25kg phosphorus per acre",
      corn: "80-100kg nitrogen per acre",
      tomato: "3-4 pounds of 5-10-10 fertilizer per 100 sq ft",
      potato: "1-2 pounds of 10-20-20 fertilizer per 100 sq ft",
    };
    return amounts[crop] || "recommended amount";
  }

  // Helper: Get watering time
  function getWateringTime(crop) {
    return crop === "rice"
      ? "to maintain standing water level"
      : "in the early morning";
  }

  // Helper: Get pest signs
  function getPestSigns(crop) {
    const signs = {
      rice: "yellowing leaves or bore holes in stems",
      wheat: "yellow streaks or powdery residues on leaves",
      corn: "chewed leaves or bore holes in stalks",
      tomato: "curled leaves, holes in fruits, or whiteflies",
      potato: "holes in leaves, yellowing, or tuber damage",
    };
    return signs[crop] || "unusual spots or damage on plants";
  }

  // Helper: Get growth stage advice
  function getGrowthStageAdvice(crop, stage) {
    if (stage === "tillering" && crop === "rice") {
      return "This is a critical stage for yield determination. Maintain optimal water level and apply nitrogen fertilizer.";
    } else if (stage === "vegetative") {
      return "Focus on weed control and ensure adequate nutrients for strong plant development.";
    } else if (stage === "flowering" || stage === "fruiting") {
      return "Protect plants from stress during this sensitive stage. Monitor for pests and diseases.";
    } else if (stage === "tuber formation") {
      return "Maintain consistent soil moisture and apply potassium-rich fertilizer for optimal tuber development.";
    }
    return "Monitor crop growth and adjust management practices as needed.";
  }
});
