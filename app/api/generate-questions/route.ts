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
          content: `You are an expert educational content creator specializing in reading comprehension assessment. Generate high-quality questions that:

REQUIREMENTS:
1. Test genuine understanding through synthesis and analysis
2. Have SPECIFIC, ANSWERABLE questions (avoid overly broad or vague questions)
3. Include varying difficulty levels (easy, medium, hard)
4. Expect SHORT but SPECIFIC answers (2-8 words typically)
5. Have clear, concrete correct answers that can be found in the passage
6. Include detailed explanations referencing the passage
7. Avoid questions that are too general or philosophical

QUESTION QUALITY:
- Good: "What is the primary role of the queen bee?" (Answer: "to lay eggs")
- Bad: "What does the passage suggest about organization?" (Too vague)
- Good: "How do worker bees' duties change as they age?" (Specific progression)
- Bad: "What is the overall message?" (Too broad)

For each question provide:
- question: Clear, specific question text
- correctAnswer: Expected answer (SHORT and SPECIFIC)
- explanation: Detailed explanation referencing the passage
- difficulty: easy, medium, or hard
- relevantPassageExcerpt: Short passage excerpt containing the answer
- hint: A helpful hint that GUIDES the student to the right section WITHOUT revealing the answer (e.g., "Look at the section about the queen bee's main responsibilities" NOT "The queen lays eggs")

Generate exactly 6 questions with mixed difficulty. Return ONLY valid JSON.`
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
