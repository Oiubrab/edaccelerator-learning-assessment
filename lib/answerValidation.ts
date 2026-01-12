export const normalizeAnswer = (answer: string): string => {
  return answer.toLowerCase().trim().replace(/[.,!?;:]/g, '');
};

export const checkAnswer = (userAns: string, correctAns: string): boolean => {
  const normalized = normalizeAnswer(userAns);
  const normalizedCorrect = normalizeAnswer(correctAns);
  
  // Check for exact match
  if (normalized === normalizedCorrect) return true;
  
  // Check if user answer contains the key terms
  const correctWords = normalizedCorrect.split(/\s+/).filter(word => word.length > 2);
  const matchingWords = correctWords.filter(word => 
    normalized.includes(word)
  );
  
  // More lenient matching - if 60% of key words are present, consider it correct
  // Also accept if the answer contains at least 2 key terms for short answers
  if (correctWords.length <= 2) {
    return matchingWords.length >= 1;
  }
  return matchingWords.length >= Math.ceil(correctWords.length * 0.6);
};
