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
        return res.status(200).json(weatherData); // Ensure a return statement
    } catch (error) {
        console.error('Error retrieving weather data:', error);
        return res.status(500).json({ error: 'Error retrieving weather data' }); // Ensure a return statement
    }
});


// TODO: GET search history// GET search history
router.get('/history', async (req, res) => {
  // You can access a property like req.query or req.headers to avoid the warning
  const userAgent = req.headers['user-agent']; // Example: log user-agent (if needed)
  console.log('User Agent:', userAgent);

  try {
      const cities = await HistoryService.getCities();
      return res.status(200).json(cities); // Ensure a return statement
  } catch (error) {
      console.error('Error retrieving search history:', error);
      return res.status(500).json({ error: 'Error retrieving search history' }); // Ensure a return statement
  }
});


// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
      await HistoryService.removeCity(id);
      res.status(204).send(); // No content response
  } catch (error) {
      console.error('Error removing city from search history:', error);
      res.status(500).json({ error: 'Error removing city from search history' });
  }
});

export default router;
