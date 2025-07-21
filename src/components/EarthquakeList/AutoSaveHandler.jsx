import { useEffect, useState } from 'react';
import { saveQuakeToFirestore } from '../../services/storageService';

const AutoSaveHandler = ({ earthquakes, loading, error }) => {
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const autoSaveAll = async () => {
      if (earthquakes.length > 0 && !loading && !error) {
        try {
          const savePromises = earthquakes.map(quake => 
            saveQuakeToFirestore(quake, true)
          );
          
          await Promise.all(savePromises);
          setSaveStatus('All earthquakes saved automatically');
        } catch (err) {
          setSaveStatus(`Auto-save error: ${err.message}`);
        }
      }
    };

    autoSaveAll();
  }, [earthquakes, loading, error]);

  return saveStatus ? <div className="status-banner">{saveStatus}</div> : null;
};

export default AutoSaveHandler;