import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, addDoc, serverTimestamp,
  query, where, getDocs, orderBy, doc
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Add this import

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID

};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize auth service
export const extractKeywords = (text) => {
  // Remove punctuation and split
  const words = text.toLowerCase()
    // The punctuation class is kept broad for the prototype keyword matcher.
    // eslint-disable-next-line no-useless-escape
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, '')
    .split(/\s+/);

  const commonWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'what', 'how', 'why', 'when',
    'can', 'you', 'me', 'i', 'for', 'in', 'of', 'to', 'with'
  ]);

  // Extract phrases and important words
  const keywords = new Set();

  // Add 2-word phrases (e.g. "predict earthquakes")
  for (let i = 0; i < words.length - 1; i++) {
    const phrase = `${words[i]} ${words[i+1]}`;
    if (phrase.length > 6 && !commonWords.has(words[i]) && !commonWords.has(words[i+1])) {
      keywords.add(phrase);
    }
  }

  // Add important single words
  words.forEach(word => {
    if (word.length > 3 && !commonWords.has(word)) {
      keywords.add(word);
    }
  });

  return Array.from(keywords).slice(0, 8);
};
// Helper functions for Q&A storage
const checkIfQuestionExists = async (questionText) => {
  const q = query(
    collection(db, "knowledge_base"),
    where("question", "==", questionText)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

const saveQuestionToFirestore = async (qnaItem) => {
  const exists = await checkIfQuestionExists(qnaItem.question);
  if (exists) {
    throw new Error("Question already exists in database");
  }

  const docRef = await addDoc(collection(db, "knowledge_base"), {
    ...qnaItem,
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });
  
  return docRef.id;
};

// Earthquake-related functions
const checkIfEarthquakeExists = async (usgsId) => {
  const q = query(
    collection(db, "earthquakes"),
    where("usgsId", "==", usgsId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

const saveEarthquakeToFirestore = async (earthquakeData) => {
  const exists = await checkIfEarthquakeExists(earthquakeData.usgsId);
  if (exists) {
    throw new Error("Earthquake already exists in database");
  }

  const docRef = await addDoc(collection(db, "earthquakes"), earthquakeData);
  return docRef.id;
};




export { 
  db,
  auth, 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  //setDoc,
  //getDoc,
  saveQuestionToFirestore,
  checkIfQuestionExists,
  saveEarthquakeToFirestore,
  checkIfEarthquakeExists
};
