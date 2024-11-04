import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
  // TODO: GET weather data from city name
  // TODO: save city to search history
  router.post('/', async (req: Request, res: Response) => {
    try {
      // Extract the city name from the request body, not params
      const cityName = req.body.city; // Assuming city name is sent in the request body
  
      if (!cityName) {
        return res.status(400).json({ error: 'City name is required' });
      }
  
      // Fetch weather data for the city
      const weatherData = await WeatherService.getWeatherForCity(cityName);
      
      // Sanitize the city name
      const sanitizedCityName = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
      
      // Add the sanitized city name to the search history
      await HistoryService.addCity(sanitizedCityName);
      
      // Send the weather data as a JSON response
      res.json(weatherData);
    } catch (err) {
      // Log any errors that occur during the process
      console.error(err);
      
      // Respond with a 500 status code and the error message in JSON format
      res.status(500).json({ error: 'An error occurred while retrieving weather data' });
    }
  });

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    // Call the getStates method of HistoryService to retrieve saved states
    const savedStates = await HistoryService.getCities();
    
    // Send the retrieved states as a JSON response
    res.json(savedStates);
  } catch (err) {
    // Log any errors that occur during the process
    console.log(err);
    
    // Respond with a 500 status code and the error message in JSON format
    res.status(500).json(err);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    // Check if the ID parameter is provided
    if (!req.params.id) {
      // If not, respond with a 400 status code and an error message
      return res.status(400).json({ msg: 'State id is required' });
    }

    // Call the removeState method of historyService to remove the specified state
    await HistoryService.removeCity(req.params.id);
    
    // Respond with a success message
    res.json({ success: 'State successfully removed from search history' });
  } catch (err) {
    // Log any errors that occur during the process
    console.log(err);
    
    // Respond with a 500 status code and the error message in JSON format
    res.status(500).json(err);
  }
});

export default router;
