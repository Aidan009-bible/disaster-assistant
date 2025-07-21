import { useState, useEffect } from 'react';
import { fetchEarthquakes } from '../services/earthquakeApi';

export const useEarthquakes = (limit = 20) => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchEarthquakes(limit);
        setEarthquakes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [limit]);

  return { earthquakes, loading, error };
};