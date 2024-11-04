import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

class City {
    name: string;
    id: string;

    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }
}

class HistoryService {
    private filePath: string;

    constructor() {
        const __filename = new URL(import.meta.url).pathname; // Get the current file path
        const __dirname = path.dirname(__filename); // Derive the directory name
        this.filePath = path.join(__dirname, '..', 'searchHistory.json');
        this.initialize(); // Ensure the file is initialized
    }

    private initialize() {
        const dirPath = path.dirname(this.filePath); // Get the directory path
        // Check if the directory exists; if not, create it
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true }); // Create the directory and any necessary parent directories
        }
        // Check if the file exists; if not, create it with an empty array
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf-8');
        }
    }

    private async read(): Promise<City[]> {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data) as City[];
        } catch (error) {
            console.error('Error reading search history:', error);
            return [];
        }
    }

    private async write(cities: City[]): Promise<void> {
        fs.writeFileSync(this.filePath, JSON.stringify(cities, null, 2), 'utf-8');
    }

    async getCities() {
        return await this.read().then((cities) => {
          let parsedCities: City[];
    
          // If states isn't an array or can't be turned into one, send back a new empty array
          try {
            parsedCities = cities.map((city) => ({ ...city }));
          } catch (err) {
            parsedCities = [];
          }
    
          return parsedCities;
        });
      }

      async addCity(city: string) {
        if (!city) {
          throw new Error('city cannot be blank');
        }
    
        // Add a unique id to the state using uuid package
        const newCity: City = { name: city, id: uuidv4() };
    
        // Get all cities, add the new city, write all the updated cities, return the newCity
        return await this.getCities()
          .then((cities) => {
            if (cities.find((index) => index.name === city)) {
              return cities;
            }
            return [...cities, newCity];
          })
          .then((updatedCities) => this.write(updatedCities))
          .then(() => newCity);
      }

      async removeCity(id: string) {
        return await this.getCities()
          .then((cities) => cities.filter((city) => city.id !== id))
          .then((filteredCities) => this.write(filteredCities));
      }
    }

export default new HistoryService();
