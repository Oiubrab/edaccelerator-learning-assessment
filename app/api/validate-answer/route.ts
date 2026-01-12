import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { userAnswer, correctAnswer, question, passageExcerpt } = await request.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an experienced reading comprehension evaluator. Assess whether the student's answer demonstrates understanding of the key concepts.

Evaluation Guidelines:

ACCEPT answers that:
- Identify the core concept even if simplified (e.g., "to lay eggs" is correct for "the queen bee lays eggs to ensure colony survival")
- Paraphrase accurately using different words
- Cover the main point even if missing secondary details
- Are concise but conceptually correct

REJECT answers that:
- Are incomplete phrases or sentence fragments with no meaning (e.g., "because they are")
- Are too vague to show any specific understanding (e.g., "they do things")
- Contradict the passage
- Are completely off-topic
- Show clear misunderstanding

Key Principle: If a student provides a SHORT but ACCURATE answer that captures the main concept, mark it CORRECT. Only reject if it's too vague to show understanding or is factually wrong.

Return JSON:
{
  "isCorrect": boolean,
  "feedback": "brief explanation"
}`
        },
        {
          role: 'user',
          content: `Question: ${question}

Correct Answer: ${correctAnswer}

Student Answer: ${userAnswer}

${passageExcerpt ? `Passage Context: ${passageExcerpt}` : ''}

Evaluate: Does this answer demonstrate understanding? Remember: concise correct answers should be accepted, but vague/incomplete fragments should be rejected.`
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    const result = JSON.parse(content);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error validating answer:', error);
    // Fallback to simple validation if AI fails
    return NextResponse.json({ 
      isCorrect: false, 
      feedback: 'Unable to validate answer. Please try again.' 
    });
  }
}
