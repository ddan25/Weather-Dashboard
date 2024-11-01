import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Location object
class Location {
  cityName: string;
  coordinates: Coordinates;

  constructor(cityName: string, coordinates: Coordinates) {
    this.cityName = cityName;
    this.coordinates = coordinates;
  }
}

// TODO: Define a class for the Weather object
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


// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string;
  apiKey: string;
  cityName: string;

  constructor(baseURL: string, apiKey: string, cityName: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.cityName = cityName;
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const requestUrl = 'https://api.openweathermap.org'
    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const coordinates = this.destructureLocationData(data);
    return new Location(query, coordinates);
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const {lat, lon} = locationData;
    return {lat, lon};
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    const params = new URLSearchParams({
      q: query,
      appid: this.apiKey
  });
  return `${this.baseURL}?${params.toString()}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const {lat, lon} = coordinates;
    return `${this.baseURL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
  }
  // make sure sure your recheck after you set your routes

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string) {
    const locationData = await this.fetchLocationData(query);
    return locationData.coordinates;
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const requestUrl = this.buildWeatherQuery(coordinates);
    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return this.parseCurrentWeather(data);
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { main, weather, wind } = response;
    return new Weather(
      main.temp,
      weather[0].description,
      main.humidity,
      wind.speed
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    return weatherData.map(data => new Weather(
      data.main.temp,
      data.weather[0].description,
      data.main.humidity,
      data.wind.speed
    ));
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const currentWeather = await this.fetchWeatherData(coordinates);
    const weatherData = await this.fetchForecastData(coordinates);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData);
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
