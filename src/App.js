import React from 'react';
import { useAuth } from './contexts/AuthContext'; // Add this import
import { auth } from './services/firebase'; // Add this import
import AuthForm from './components/AuthForm';
import { useEarthquakes } from './hooks/useEarthquakes';
import { useQnA } from './hooks/useQnA';
import EarthquakeList from './components/EarthquakeList/EarthquakeList';
import QnAList from './components/QnAList/QnAList';
import Chatbot from './components/Chatbot/Chatbot';
import './App.css'

function App() {
  const { currentUser } = useAuth();
  const { earthquakes, loading: eqLoading, error: eqError } = useEarthquakes(20);
  const { questions, loading: qaLoading, error: qaError } = useQnA();

  if (!currentUser) {
    return (
      <div className="auth-container">
        <h1>Earthquake Monitoring System</h1>
        <div className="auth-forms">
          <AuthForm isLogin={true} />
          <AuthForm isLogin={false} />
  </div>
      </div>
    );
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Earthquake Monitoring System</h1>
                <button onClick={() => auth.signOut()}>Logout</button>
      </header>

      <main className="App-content">
        <section className="earthquake-section">
          <h2>Recent Earthquake Data</h2>
          <EarthquakeList 
            earthquakes={earthquakes} 
            loading={eqLoading} 
            error={eqError} 
          />
        </section>

        <section className="knowledge-base-section">
          <h2>Earthquake Knowledge Base</h2>
          <QnAList 
            questions={questions} 
            loading={qaLoading} 
            error={qaError} 
          />
        </section>
      </main>
      <section className="chatbot-section">
        <h2>Disaster Assistant</h2>
        <Chatbot />
      </section>
      <footer className="App-footer">
        <p>Earthquake data: USGS. Prepared answers are informational and not emergency alerts.</p>
      </footer>
    </div>
  );
}

export default App;
