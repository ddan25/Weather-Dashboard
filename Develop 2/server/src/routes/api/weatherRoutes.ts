import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
  // TODO: GET weather data from city name
  // TODO: save city to search history
  router.post('/', async (req, res) => {
    const { city } = req.body; // Assuming city name is sent in the request body

    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        // Get weather data from city name
        const weatherData = await WeatherService.getWeatherForCity(city);
        
        // Save city to search history
        await HistoryService.addCity(city);
        
        // Respond with the weather data
        res.status(200).json(weatherData);
    } catch (error) {
        console.error('Error retrieving weather data:', error);
        res.status(500).json({ error: 'Error retrieving weather data' });
    }
});


// TODO: GET search history
router.get('/history', async (req, res) => {
  try {
      const cities = await HistoryService.getCities();
      res.status(200).json(cities);
  } catch (error) {
      console.error('Error retrieving search history:', error);
      res.status(500).json({ error: 'Error retrieving search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {});

export default router;
