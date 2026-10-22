// Fixed, reviewable answers for the public prototype. Do not put provider keys
// in REACT_APP_* variables: Create React App embeds them in browser bundles.
const LOCAL_QNA = [
  {
    question: 'What should I do during an earthquake?',
    answer: 'Drop, Cover, and Hold On. Protect your head and neck until shaking stops.',
    keywords: ['earthquake', 'safety', 'during']
  },
  {
    question: 'What should I do after an earthquake?',
    answer: 'Expect aftershocks. Check for injuries and stay out of damaged buildings.',
    keywords: ['earthquake', 'aftershocks', 'after']
  },
  {
    question: 'How can I prepare for an earthquake?',
    answer: 'Secure heavy objects and practice Drop, Cover, and Hold On.',
    keywords: ['earthquake', 'prepare', 'before']
  }
];

export const getDefaultQnA = () => LOCAL_QNA;
export const generateQnAPairs = async (userQuestion = null) => {
  if (!userQuestion) return LOCAL_QNA;
  const words = userQuestion.toLowerCase();
  return LOCAL_QNA.filter(item => item.keywords.some(word => words.includes(word)));
};
export const searchQnA = async question => generateQnAPairs(question);
