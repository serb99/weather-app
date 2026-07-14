# Weather App

A vanilla JavaScript weather app built to practice asynchronous programming — `fetch`, `async`/`await`, and manual error handling — without any frameworks or libraries.

## Features

- Search by city name, using the OpenWeatherMap Geocoding API to resolve a location to coordinates.
- Current weather conditions (temperature in °C, description, icon) via the OpenWeatherMap Current Weather API.
- Disambiguation for duplicate city names. If a search matches multiple places (e.g. several villages sharing the same name), the app displays each match with its country and coordinates so the user can pick the correct one, instead of silently guessing.
- Dedicated UI states for loading, success, error, and disambiguation — each a separate container, switched via a single `showState()` function backed by a state → element map.
