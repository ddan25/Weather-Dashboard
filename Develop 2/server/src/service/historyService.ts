import fs from 'fs';
import path from 'path';

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

    async getCities(): Promise<City[]> {
        return this.read();
    }

    async addCity(cityName: string): Promise<void> {
        const cities = await this.read();
        const cityId = new Date().getTime().toString();
        const newCity = new City(cityName, cityId);
        cities.push(newCity);
        await this.write(cities);
    }

    async removeCity(id: string): Promise<void> {
        const cities = await this.read();
        const updatedCities = cities.filter(city => city.id !== id);
        await this.write(updatedCities);
    }
}

export default new HistoryService();
