export const normalizeAnswer = (answer: string): string => {
  return answer.toLowerCase().trim().replace(/[.,!?;:]/g, '');
};

export const checkAnswer = (userAns: string, correctAns: string): boolean => {
  const normalized = normalizeAnswer(userAns);
  const normalizedCorrect = normalizeAnswer(correctAns);
  
  // Check for exact match
  if (normalized === normalizedCorrect) return true;
  
  // Check if user answer contains the key terms
  const correctWords = normalizedCorrect.split(/\s+/);
  const matchingWords = correctWords.filter(word => 
    word.length > 3 && normalized.includes(word)
  );
  
  // If most key words are present, consider it correct
  return matchingWords.length >= Math.ceil(correctWords.length * 0.7);
};
