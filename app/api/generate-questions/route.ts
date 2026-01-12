import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { passage } from '@/lib/data';
import { Question } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert educational content creator specializing in reading comprehension assessment. Your task is to generate high-quality comprehension questions that:

1. Test genuine understanding, not just surface-level recall
2. Require students to synthesize information from multiple parts of the passage
3. Include varying difficulty levels (easy, medium, hard)
4. Use short-answer format (not multiple choice) to prevent guessing
5. Have clear, unambiguous correct answers
6. Include detailed explanations that help students learn from mistakes
7. Reference specific parts of the passage in explanations

Generate exactly 6 questions with a mix of difficulty levels. For each question, provide:
- question: The question text
- correctAnswer: The expected answer (can accept variations)
- explanation: A detailed explanation of why this is the answer, with reference to the passage
- difficulty: easy, medium, or hard
- relevantPassageExcerpt: A short excerpt from the passage that contains the answer

Return ONLY a valid JSON array of questions, no additional text.`
        },
        {
          role: 'user',
          content: `Generate 6 reading comprehension questions for this passage:

Title: ${passage.title}
Content: ${passage.content}

Return the response as a JSON array of question objects.`
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    const parsed = JSON.parse(content);
    const questions: Question[] = parsed.questions || Object.values(parsed)[0];
    
    // Add IDs to questions
    const questionsWithIds = questions.map((q, index) => ({
      ...q,
      id: `q${index + 1}`,
      type: 'short-answer' as const
    }));

    return NextResponse.json({ questions: questionsWithIds });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
