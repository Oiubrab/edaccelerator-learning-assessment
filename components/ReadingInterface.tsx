'use client';

import { useState, useEffect, useRef } from 'react';
import { Question, UserAnswer } from '@/lib/types';
import { passageChunks } from '@/lib/data';

interface ReadingInterfaceProps {
  questions: Question[];
}

export default function ReadingInterface({ questions }: ReadingInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedChunk, setSelectedChunk] = useState<string | null>(null);
  const [readingMode, setReadingMode] = useState<'guided' | 'full'>('guided');
  
  const answerInputRef = useRef<HTMLInputElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  useEffect(() => {
    if (answerInputRef.current && !showFeedback) {
      answerInputRef.current.focus();
    }
  }, [currentQuestionIndex, showFeedback]);

  useEffect(() => {
    if (showFeedback && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showFeedback]);

  const normalizeAnswer = (answer: string): string => {
    return answer.toLowerCase().trim().replace(/[.,!?;:]/g, '');
  };

  const checkAnswer = (userAns: string, correctAns: string): boolean => {
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

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;

    const isCorrect = checkAnswer(userAnswer, currentQuestion.correctAnswer);
    
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      userAnswer: userAnswer.trim(),
      isCorrect,
      timestamp: Date.now()
    };

    setAnswers([...answers, newAnswer]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setUserAnswer('');
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setAnswers([]);
    setShowFeedback(false);
    setIsComplete(false);
    setSelectedChunk(null);
  };

  const scrollToChunk = (chunkId: string) => {
    setSelectedChunk(chunkId);
    const element = document.getElementById(`chunk-${chunkId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (isComplete) {
    const score = answers.filter(a => a.isCorrect).length;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
              percentage >= 80 ? 'bg-green-100' : percentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <span className={`text-4xl font-bold ${
                percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {percentage}%
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {percentage >= 80 ? '🎉 Excellent Work!' : percentage >= 60 ? '👍 Good Effort!' : '💪 Keep Practicing!'}
            </h2>
            <p className="text-xl text-gray-600">
              You got {score} out of {questions.length} questions correct
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Your Results:</h3>
            {questions.map((q, index) => {
              const answer = answers.find(a => a.questionId === q.id);
              return (
                <div key={q.id} className="bg-gray-50 rounded-lg p-4 text-left">
                  <div className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      answer?.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {answer?.isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-1">{q.question}</p>
                      <p className="text-sm text-gray-600">
                        Your answer: <span className="font-medium">{answer?.userAnswer}</span>
                      </p>
                      {!answer?.isCorrect && (
                        <p className="text-sm text-green-600 mt-1">
                          Correct answer: <span className="font-medium">{q.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleRestart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Reading Passage Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">The Secret Life of Honeybees</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setReadingMode('guided')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  readingMode === 'guided' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Sections
              </button>
              <button
                onClick={() => setReadingMode('full')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  readingMode === 'full' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Full
              </button>
            </div>
          </div>

          {readingMode === 'guided' ? (
            <div className="space-y-4">
              {passageChunks.map((chunk) => (
                <div
                  key={chunk.id}
                  id={`chunk-${chunk.id}`}
                  className={`p-4 rounded-lg transition-all cursor-pointer ${
                    selectedChunk === chunk.id 
                      ? 'bg-blue-50 border-2 border-blue-400 shadow-md' 
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                  onClick={() => scrollToChunk(chunk.id)}
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{chunk.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{chunk.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="prose prose-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {passageChunks.map(chunk => chunk.content).join('\n\n')}
              </p>
            </div>
          )}
        </div>

        {/* Questions Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                currentQuestion.difficulty === 'easy' 
                  ? 'bg-green-100 text-green-700'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentQuestion.question}
            </h2>

            {!showFeedback ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type your answer:
                  </label>
                  <input
                    ref={answerInputRef}
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                    placeholder="Enter your answer here..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Submit Answer
                </button>
              </div>
            ) : (
              <div ref={feedbackRef} className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  currentAnswer?.isCorrect 
                    ? 'bg-green-50 border-2 border-green-300' 
                    : 'bg-red-50 border-2 border-red-300'
                }`}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`flex-shrink-0 text-2xl ${
                      currentAnswer?.isCorrect ? '✅' : '❌'
                    }`}>
                      {currentAnswer?.isCorrect ? '✅' : '❌'}
                    </span>
                    <div>
                      <p className="font-semibold text-lg">
                        {currentAnswer?.isCorrect ? 'Correct!' : 'Not quite right'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Your answer: <span className="font-medium">{currentAnswer?.userAnswer}</span>
                      </p>
                      {!currentAnswer?.isCorrect && (
                        <p className="text-sm text-gray-600 mt-1">
                          Expected: <span className="font-medium text-green-700">{currentQuestion.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <p className="font-semibold text-gray-800 mb-2">💡 Explanation:</p>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {currentQuestion.explanation}
                    </p>
                    
                    {currentQuestion.relevantPassageExcerpt && (
                      <div className="bg-white bg-opacity-50 p-3 rounded border border-gray-300">
                        <p className="text-xs font-semibold text-gray-600 mb-1">📖 From the passage:</p>
                        <p className="text-sm italic text-gray-700">
                          "{currentQuestion.relevantPassageExcerpt}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'See Results'}
                </button>
              </div>
            )}
          </div>

          {/* Quick Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-3">📍 Quick navigation to passage sections:</p>
            <div className="flex flex-wrap gap-2">
              {passageChunks.map((chunk) => (
                <button
                  key={chunk.id}
                  onClick={() => scrollToChunk(chunk.id)}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full transition-colors"
                >
                  {chunk.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
