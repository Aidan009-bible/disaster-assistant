import { useState, useEffect } from 'react';
import { generateQnAPairs } from '../services/qaApi';

export const useQnA = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await generateQnAPairs();
        setQuestions(data);
      } catch (err) {
        setError(err);
        console.error("Failed to load Q&A data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { questions, loading, error };
};