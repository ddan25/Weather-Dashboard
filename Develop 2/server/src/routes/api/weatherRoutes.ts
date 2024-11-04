import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
  // TODO: GET weather data from city name
  // TODO: save city to search history
  router.post('/', async (req: Request, res: Response) => {
    try {
      // Extract the city name from the request body
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
      return res.json(weatherData); // Ensure to return here
    } catch (err) {
      // Log any errors that occur during the process
      console.error(err);

            // Respond with a 500 status code and the error message in JSON format
      return res.status(500).json({ error: 'An error occurred while retrieving weather data' });
    }
  });

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    // Call the getStates method of HistoryService to retrieve saved states
    const savedCities = await HistoryService.getCities();
    
    // Send the retrieved states as a JSON response
    res.json(savedCities);
  } catch (err) {
    // Log any errors that occur during the process
    console.log(err);
    
    // Respond with a 500 status code and the error message in JSON format
    res.status(500).json({ error: 'An error occurred while retrieving search history' });

  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
    try {
      // Check if the ID parameter is provided
      const { id } = req.params;
  
      if (!id) {
        // If not, respond with a 400 status code and an error message
        return res.status(400).json({ msg: 'City id is required' });
      }
  
      // Call the removeCity method of historyService to remove the specified city
      await HistoryService.removeCity(id);
      
      // Respond with a success message
      return res.json({ success: 'City successfully removed from search history' }); // Add return here
    } catch (err) {
      // Log any errors that occur during the process
      console.error(err);
      
      // Respond with a 500 status code and the error message in JSON format
      return res.status(500).json({ error: 'An error occurred while removing the city' }); // Add return here
    }
  });
  

export default router;
