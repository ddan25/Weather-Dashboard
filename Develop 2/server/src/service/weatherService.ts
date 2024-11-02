import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
    lat: number;
    lon: number;
}

// Define a class for the Location object
class Location {
    cityName: string;
    coordinates: Coordinates;

    constructor(cityName: string, coordinates: Coordinates) {
        this.cityName = cityName;
        this.coordinates = coordinates;
    }
}

// Define a class for the Weather object
class Weather {
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;

    constructor(
        temperature: number,
        description: string,
        humidity: number,
        windSpeed: number
    ) {
        this.temperature = temperature;
        this.description = description;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
    }
}

// Complete the WeatherService class
class WeatherService {
    // Define the baseURL, API key, and city name properties
    baseURL: string;
    apiKey: string;

    constructor() {
        this.baseURL = process.env.BASE_URL || 'https://api.openweathermap.org/data/2.5';
        this.apiKey = process.env.API_KEY || '';
    }

    // Create fetchLocationData method
    private async fetchLocationData(query: string): Promise<Location> {
        const requestUrl = this.buildGeocodeQuery(query);
        const response = await fetch(requestUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const coordinates = this.destructureLocationData(data[0].coord);
        return new Location(query, coordinates);
    }

    // Create destructureLocationData method
    private destructureLocationData(locationData: Coordinates): Coordinates {
        const { lat, lon } = locationData;
        return { lat, lon };
    }

    // Create buildGeocodeQuery method
    private buildGeocodeQuery(query: string): string {
        const params = new URLSearchParams({
            q: query,
            appid: this.apiKey
        });
        return `${this.baseURL}/weather?${params.toString()}`;
    }

    // Create buildWeatherQuery method
    private buildWeatherQuery(coordinates: Coordinates): string {
        const { lat, lon } = coordinates;
        return `${this.baseURL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    }

    // Create fetchAndDestructureLocationData method
    private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
        const locationData = await this.fetchLocationData(query);
        return locationData.coordinates;
    }

    // Create fetchWeatherData method
    private async fetchWeatherData(coordinates: Coordinates): Promise<Weather> {
        const requestUrl = this.buildWeatherQuery(coordinates);
        const response = await fetch(requestUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return this.parseCurrentWeather(data);
    }

    // Build parseCurrentWeather method
    private parseCurrentWeather(response: any): Weather {
        const { main, weather, wind } = response;
        return new Weather(
            main.temp,
            weather[0].description,
            main.humidity,
            wind.speed
        );
    }

    // Create fetchForecastData method (You need to implement this method)
    private async fetchForecastData(coordinates: Coordinates): Promise<any[]> {
        const requestUrl = `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
        const response = await fetch(requestUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.list; // Assuming the forecast data is in the 'list' property
    }

// Complete buildForecastArray method
private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
  // Create an array starting with currentWeather
  const forecastArray = [currentWeather];

  // Add the rest of the forecast data
  const additionalForecasts = weatherData.map(data => new Weather(
      data.main.temp,
      data.weather[0].description,
      data.main.humidity,
      data.wind.speed
  ));

  // Concatenate currentWeather with the additional forecasts
  return forecastArray.concat(additionalForecasts);
}

    // Complete getWeatherForCity method
    async getWeatherForCity(city: string): Promise<{ currentWeather: Weather; forecastArray: Weather[] }> {
        const coordinates = await this.fetchAndDestructureLocationData(city);
        const currentWeather = await this.fetchWeatherData(coordinates);
        const weatherData = await this.fetchForecastData(coordinates);
        const forecastArray = this.buildForecastArray(currentWeather, weatherData);
        return { currentWeather, forecastArray };
    }
}

export default new WeatherService();
