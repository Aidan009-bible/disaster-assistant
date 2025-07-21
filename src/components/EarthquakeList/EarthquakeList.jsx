import React, { useState, useEffect, useCallback } from 'react';
import { db, collection, addDoc, serverTimestamp, query, where, getDocs } from '../../services/firebase';
import './EarthquakeList.css';

const EarthquakeList = ({ earthquakes, loading, error }) => {
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ success: null, message: '' });
  const [savedQuakes, setSavedQuakes] = useState({});

  // Memoized function to check if earthquake exists in Firestore
  const checkIfQuakeExists = useCallback(async (quakeId) => {
    const q = query(collection(db, "earthquakes"), where("usgsId", "==", quakeId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }, []);

  // Memoized function to save earthquake to Firestore
  const handleSaveToFirestore = useCallback(async (earthquake) => {
    if (!navigator.onLine) {
      setSaveStatus({ success: false, message: 'No internet connection!' });
      return;
    }

    // Early return if already saved or saving
    if (savedQuakes[earthquake.id] || saving) return;

    setSaving(true);
    setSaveStatus({ success: null, message: '' });

    try {
      const exists = await checkIfQuakeExists(earthquake.id);
      if (exists) {
        setSavedQuakes(prev => ({...prev, [earthquake.id]: true}));
        return;
      }

      const quakeData = {
        magnitude: earthquake.properties.mag,
        location: earthquake.properties.place,
        time: new Date(earthquake.properties.time).toISOString(),
        depth: earthquake.geometry.coordinates[2],
        coordinates: {
          latitude: earthquake.geometry.coordinates[1],
          longitude: earthquake.geometry.coordinates[0]
        },
        usgsId: earthquake.id,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "earthquakes"), quakeData);
      setSavedQuakes(prev => ({...prev, [earthquake.id]: true}));
      setSaveStatus({ success: true, message: 'Saved successfully!' });
    } catch (err) {
      console.error('Error saving data:', err);
      setSaveStatus({ 
        success: false, 
        message: `Error: ${err.code === 'permission-denied' ? 'Check your Firestore rules' : err.message}`
      });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus({ success: null, message: '' }), 3000);
    }
  }, [checkIfQuakeExists, savedQuakes, saving]);

  // Auto-save first 5 earthquakes on initial load
  useEffect(() => {
    const autoSave = async () => {
      if (earthquakes.length > 0 && !loading && !error && !savedQuakes.autoSaveCompleted) {
        try {
          setSaving(true);
          const quakesToSave = earthquakes.slice(0, 5)
            .filter(quake => !savedQuakes[quake.id]); // Only unsaved quakes
          
          await Promise.all(quakesToSave.map(quake => handleSaveToFirestore(quake)));
          setSavedQuakes(prev => ({...prev, autoSaveCompleted: true}));
        } catch (err) {
          console.error('Auto-save failed:', err);
        } finally {
          setSaving(false);
        }
      }
    };
    
    autoSave();
  }, [earthquakes, loading, error, handleSaveToFirestore, savedQuakes]);

  if (loading) return <div className="status-message">Loading earthquake data...</div>;
  if (error) return <div className="status-message error">Error: {error}</div>;

  return (
    <div className="earthquake-container">
      <h2>Recent Earthquakes (Last 24 Hours)</h2>
      
      {saveStatus.message && (
        <div className={`status-message ${saveStatus.success ? 'success' : 'error'}`}>
          {saveStatus.message}
        </div>
      )}

      <div className="earthquake-list">
        {earthquakes.map((eq) => (
          <div key={eq.id} className="earthquake-card">
            <h3>Magnitude: {eq.properties.mag}</h3>
            <p>Location: {eq.properties.place}</p>
            <p>Time: {new Date(eq.properties.time).toLocaleString()}</p>
            <p>Depth: {eq.geometry.coordinates[2]} km</p>
            <button 
              onClick={() => handleSaveToFirestore(eq)}
              className={`save-button ${savedQuakes[eq.id] ? 'saved' : ''}`}
              disabled={saving || savedQuakes[eq.id]}
            >
              {saving ? 'Saving...' : savedQuakes[eq.id] ? '✓ Saved' : 'Save to Firestore'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarthquakeList;