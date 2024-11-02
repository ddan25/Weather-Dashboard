import fs from 'fs';
import path from 'path';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private filePath; string;

  constructor() {
    this.filePath = path.join(__dirname, '..', 'searchHistory.json');
  }
  private async read() {
    try{
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data) as City[];
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(cities, null, 2), 'utf-8');
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = this.read();
    const cityId = new Date().getTime().toString();
    const newCity = new City(cityName, cityId);
    cities.push(newCity);
    this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = this.read();
    const updatedCities = cities.filter(city => city.id!== id);
    this.write(updatedCities);
  }
}

export default new HistoryService();
