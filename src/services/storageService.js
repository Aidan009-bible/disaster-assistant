import { 
  db, 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  getDocs
} from './firebase';

// Shared save function
export const saveQuakeToFirestore = async (earthquake, autoSaved = false) => {
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
    createdAt: serverTimestamp(),
    autoSaved
  };
  
  return await addDoc(collection(db, "earthquakes"), quakeData);
};

export const saveQaToFirestore = async (qa) => {
  const qaData = {
    question: qa.question,
    answer: qa.answer,
    createdAt: serverTimestamp()
  };
  return await addDoc(collection(db, "disaster_qas"), qaData);
};

// Check if Q&A exists (by question text)
export const checkIfQaExists = async (question) => {
  const q = query(
    collection(db, "disaster_qas"),
    where("question", "==", question)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Deduplication check
export const checkIfQuakeExists = async (quakeId) => {
  const q = query(
    collection(db, "earthquakes"), 
    where("usgsId", "==", quakeId)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};