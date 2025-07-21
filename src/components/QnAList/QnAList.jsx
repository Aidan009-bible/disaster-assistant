import React, { useState } from 'react';
import { saveQuestionToFirestore } from '../../services/firebase';
import './QnAList.css';

const QnAList = ({ questions, loading, error }) => {
  const [savingStates, setSavingStates] = useState({});
  const [saveResults, setSaveResults] = useState({});

  const handleSaveQuestion = async (qnaItem, index) => {
    setSavingStates(prev => ({ ...prev, [index]: true }));
    setSaveResults(prev => ({ ...prev, [index]: null }));

    try {
      const docId = await saveQuestionToFirestore(qnaItem);
      setSaveResults(prev => ({
        ...prev,
        [index]: { success: true, message: `Saved with ID: ${docId}` }
      }));
    } catch (err) {
      setSaveResults(prev => ({
        ...prev,
        [index]: { success: false, message: err.message }
      }));
    } finally {
      setSavingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleSaveAll = async () => {
    const results = {};
    for (let i = 0; i < questions.length; i++) {
      try {
        setSavingStates(prev => ({ ...prev, [i]: true }));
        const docId = await saveQuestionToFirestore(questions[i]);
        results[i] = { success: true, message: `Saved with ID: ${docId}` };
      } catch (err) {
        results[i] = { success: false, message: err.message };
      } finally {
        setSavingStates(prev => ({ ...prev, [i]: false }));
      }
    }
    setSaveResults(results);
  };

  if (loading) return <div className="loading">Loading Q&A data...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="qna-container">
      <div className="qna-header">
        <h2>Earthquake Knowledge Base</h2>
        <button 
          onClick={handleSaveAll}
          disabled={Object.values(savingStates).some(state => state)}
          className="save-all-btn"
        >
          {Object.values(savingStates).some(state => state) ? 'Saving...' : 'Save All to Database'}
        </button>
      </div>

      <div className="qna-list">
        {questions.map((qna, index) => (
          <div key={index} className="qna-card">
            <div className="qna-content">
              <h3>Q: {qna.question}</h3>
              <p className="answer">A: {qna.answer}</p>
              {qna.keywords && (
                <div className="keywords">
                  Keywords: {qna.keywords.join(', ')}
                </div>
              )}
            </div>
            <div className="qna-actions">
              <button
                onClick={() => handleSaveQuestion(qna, index)}
                disabled={savingStates[index]}
                className={saveResults[index]?.success ? 'saved' : ''}
              >
                {savingStates[index] ? 'Saving...' : 
                 saveResults[index]?.success ? '✓ Saved' : 'Save to DB'}
              </button>
              {saveResults[index] && (
                <span className={`status ${saveResults[index].success ? 'success' : 'error'}`}>
                  {saveResults[index].message}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QnAList;