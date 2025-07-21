import { useEffect } from 'react';
import { saveQuakeToFirestore, checkIfQuakeExists } from '../services/storageService';

const useAutoSave = (earthquakes, loading, error) => {
  useEffect(() => {
    const saveNewQuakes = async () => {
      if (earthquakes.length > 0 && !loading && !error) {
        for (const quake of earthquakes) {
          try {
            const exists = await checkIfQuakeExists(quake.id);
            if (!exists) {
              await saveQuakeToFirestore(quake, true);
              console.log(`Saved new quake: ${quake.id}`);
            }
          } catch (err) {
            console.error(`Error saving quake ${quake.id}:`, err);
          }
        }
      }
    };

    saveNewQuakes();
  }, [earthquakes, loading, error]);
};

export default useAutoSave;