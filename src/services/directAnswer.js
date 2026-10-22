import { searchQnA } from './qaApi';

export const getDisasterAnswer = async question => {
  const matches = await searchQnA(question);
  return matches[0]?.answer || 'This prototype has limited prepared answers. For urgent help, follow local emergency authorities.';
};
