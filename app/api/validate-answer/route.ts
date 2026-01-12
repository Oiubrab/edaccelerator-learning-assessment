import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { userAnswer, correctAnswer, question, passageExcerpt } = await request.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an experienced educator evaluating reading comprehension answers. Your goal is to fairly assess whether students demonstrate genuine understanding.

Core Principles:
- SUBSTANCE OVER FORM: Accept different wording, but require the core concept to be present
- PARTIAL CREDIT FOR PARTIAL UNDERSTANDING: Accept answers covering key points even if not exhaustive
- PARAPHRASING IS FINE: Different words expressing the same meaning are acceptable
- REQUIRE MEANINGFUL CONTENT: Vague, overly general, or tangential answers should be marked incorrect

What to ACCEPT as correct:
- Answers capturing the essential concept(s) in different words
- Partially complete answers that demonstrate clear understanding of the main idea
- Simplified or shortened versions that preserve the core meaning
- Answers focusing on one key aspect when it's clearly the most important part

What to REJECT as incorrect:
- Vague or overly general statements that could apply to many situations
- Tangential answers that relate to the topic but miss the specific concept
- Answers showing clear misunderstanding or contradicting the passage
- Answers that are completely irrelevant or off-topic
- Answers missing ALL the key concepts (not just some details)

Respond with a JSON object:
- isCorrect: boolean (true only if answer shows real understanding of the concept)
- feedback: string (constructive feedback explaining what was right or what key concept was missing)`
        },
        {
          role: 'user',
          content: `Question: ${question}

Expected Answer: ${correctAnswer}

Student's Answer: ${userAnswer}

${passageExcerpt ? `Relevant Passage: ${passageExcerpt}` : ''}

Does the student's answer demonstrate real understanding of the concept? Be fair: accept paraphrasing and partial answers, but reject vague or overly general statements that don't capture the specific concept being asked about.`
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
