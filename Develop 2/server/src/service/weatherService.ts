import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object

// TODO: Define a class for the Weather object

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
    const data = await response.json();
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const {lat, lon} = locationData;
    return {lat, lon};
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const params = new URLSearchParams({
      city: this.city,
      key: this.key
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
  private async fetchAndDestructureLocationData() {
    
  }
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
