const searchForm = document.getElementById("search-form");
const inputLocation = document.getElementById("city-input");
const searchButton = document.getElementById("search-btn");
const choicesContainer = document.getElementById("choices");
const choicesList = document.getElementById("choices-list");
const loadingState = document.getElementById("loading");
const errorState = document.getElementById("error");
const errorMessage = document.getElementById("error-message");
const successState = document.getElementById("result");
const cityName = document.getElementById("city-name");
const countryName = document.getElementById("country");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const timeElement = document.getElementById("time");

const statesMap = new Map([
    ["success", successState],
    ["loading", loadingState],
    ["error", errorState],
    ["choices", choicesContainer]
]);

function showState(state){
    
    statesMap.forEach((element, key) => {
        element.hidden = true;
    });

    if (!statesMap.has(state)) {
        throw new Error("Invalid state");
    }
    statesMap.get(state).hidden = false;
}

async function getCoordinates(location){

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${API_KEY}`;

    const response = await fetch(url);

    if(!response.ok){
        throw new Error("Failed to fetch coordinates");
    }

    const data = await response.json();

    if(data.length === 0){
        throw new Error("No coordinates found for the given location");
    }

    return data;
}

async function getCurrentWeather(lat, lon){

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if(!response.ok){
        throw new Error("Failed to fetch current weather");
    }

    const data = await response.json();

    return data;
}

async function loadWeather(location){
    
    try{
        showState("loading");
        const coordinates = await getCoordinates(location);
        if(coordinates.length > 1){
            showState("choices");
            choicesList.innerHTML = "";
            coordinates.forEach((location) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${location.name}, ${location.country}, ${location.lat}°, ${location.lon}°`;
                listItem.addEventListener("click", async () => {
                    showState("loading");
                    try{
                     let weather = await getCurrentWeather(location.lat, location.lon);
                     displayWeather(weather);
                    }
                    catch(err){
                     showState("error");
                     errorMessage.textContent = err.message;
                    }
                })
                choicesList.appendChild(listItem);
            })
        }
        else if (coordinates.length === 1){
            let weather = await getCurrentWeather(coordinates[0].lat, coordinates[0].lon);
            displayWeather(weather);
        }
    }
    catch(err){
        showState("error");
        errorMessage.textContent = err.message;
    }
}

function displayWeather(weatherData){
    showState("success");
    cityName.textContent = weatherData.name;
    countryName.textContent = weatherData.sys.country;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
    temperature.textContent = `${weatherData.main.temp} °C`;
    description.textContent = weatherData.weather[0].description;

    const localTimestamp = (weatherData.dt + weatherData.timezone) * 1000;
    const localTime = new Date(localTimestamp);
    const hours = String(localTime.getUTCHours()).padStart(2, "0");
    const minutes = String(localTime.getUTCMinutes()).padStart(2, "0");
    timeElement.textContent = `Last checked at: ${hours}:${minutes}`;
}

function handleInput(inputValue){
    if(inputValue.trim() === ""){
        showState("error");
        errorMessage.textContent = "Please enter a location";
        return;
    }
    loadWeather(inputValue);
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleInput(inputLocation.value);
});