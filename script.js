const searchForm = document.getElementById("search-form");
const inputLocation = document.getElementById("city-input");
const searchButton = document.getElementById("search-btn");
const choicesContainer = document.getElementById("choices");
const choicesList = document.getElementById("choices-list");
const loadingState = document.getElementById("loading");
const errorState = document.getElementById("error");
const successState = document.getElementById("result");
const cityName = document.getElementById("city-name");
const countryName = document.getElementById("country");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

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

    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${API_KEY}`;

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

    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if(!response.ok){
        throw new Error("Failed to fetch current weather");
    }

    const data = await response.json();
    
    return data;
}