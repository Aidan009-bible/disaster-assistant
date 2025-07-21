// src/services/directAnswer.js
import axios from 'axios';

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const MODEL = "llama3-70b-8192";

const DISASTER_KNOWLEDGE = {
  // "earthquake": "Sudden ground shaking caused by fault movements.",
  "flood": "Water overflow submerging normally dry land.",
  // Add other disaster types as needed
};

export const getDisasterAnswer = async (question) => {
  // 1. Quick check against basic knowledge
  const lowerQuestion = question.toLowerCase();
  for (const [term, answer] of Object.entries(DISASTER_KNOWLEDGE)) {
    if (lowerQuestion.includes(term)) {
      return answer;
    }
  }

  // 2. Use AI if no quick answer and API key exists
  if (!GROQ_API_KEY) {
    return "I can answer questions about earthquakes, floods, and other disasters.";
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You're a disaster expert. Answer in 1-3 sentences. Be factual and concise."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.3,
        max_tokens: 150
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Direct answer error:', error);
    return "I can't answer that right now. Try asking about specific disasters.";
  }
};