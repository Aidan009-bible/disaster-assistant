import axios from 'axios';

export const fetchEarthquakes = async (limit = 20) => {
  try {
    const response = await axios.get(
      `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`
    );
    return response.data.features.slice(0, limit);
  } catch (error) {
    console.error('Error fetching earthquake data:', error);
    return [];
  }
};