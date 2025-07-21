import { useState, useEffect } from 'react';
import { saveQuakeToFirestore, checkIfQuakeExists } from '../../services/storageService';

const HybridSaveHandler = ({ earthquakes }) => {
  const [autoSaved, setAutoSaved] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Auto-save on first load
  useEffect(() => {
    const initialAutoSave = async () => {
      if (earthquakes.length > 0 && !autoSaved) {
        try {
          await saveQuakeToFirestore(earthquakes[0], true);
          setAutoSaved(true);
          setSaveStatus('Latest quake auto-saved');
        } catch (err) {
          setSaveStatus('Auto-save failed: ' + err.message);
        }
      }
    };
    
    initialAutoSave();
  }, [earthquakes]);

  const handleManualSave = async (quake) => {
    try {
      await saveQuakeToFirestore(quake, false);
      setSaveStatus('Manually saved quake');
    } catch (err) {
      setSaveStatus('Manual save failed: ' + err.message);
    }
  };

  return {
    handleManualSave,
    SaveStatusBanner: () => saveStatus ? (
      <div className="status-banner">{saveStatus}</div>
    ) : null
  };
};

export default HybridSaveHandler;