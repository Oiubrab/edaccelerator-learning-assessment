# EdAccelerator Reading Comprehension Interface

An AI-powered reading comprehension platform built with Next.js 14, TypeScript, and OpenAI. This application addresses specific user feedback to transform the traditional multiple-choice format into a more engaging and effective learning experience.

**Live Demo**: [Deployed on Vercel](#)

## Overview

This interface was developed in response to documented user pain points with existing reading comprehension tools. The solution replaces passive multiple-choice testing with active learning through typed responses, contextual feedback, and adaptive reading formats.

## User Feedback Analysis and Implementation

The following user pain points were addressed through specific implementation choices:

### 1. "It's annoying seeing the entire passage all at once..."
**Implementation**: Chunked reading view with configurable display modes
- Toggle between sectioned view and full-text view
- Instant navigation to specific sections
- Visual separation and descriptive section titles

### 2. "Multiple choice is too easy, I can just guess the answer..."
**Implementation**: Short-answer text input with intelligent validation
- Typed responses required
- Flexible answer matching accepts reasonable variations
- Eliminates process of elimination strategies
- Requires demonstration of comprehension

### 3. "I finish the questions and immediately forget what I read..."
**Implementation**: Integrated side-by-side layout
- Passage and questions visible simultaneously on desktop
- Quick navigation to relevant passage sections
- Maintains engagement with source text throughout assessment
- Contextual passage excerpts in feedback

### 4. "When I get an answer wrong, I don't really learn why..."
**Implementation**: Comprehensive feedback system with educational focus
- Detailed explanations provided for all responses
- Side-by-side comparison of submitted and correct answers
- Specific passage excerpts supporting correct answers
- Emphasis on understanding rather than correctness

### 5. "It feels like a test, not like learning..."
**Implementation**: Learning-focused UX design
- Approachable color scheme (blues and purples vs. institutional grays)
- Constructive messaging throughout
- Framed as "challenge" rather than "test" or "quiz"
- Immediate formative feedback vs. summative scoring
- Progress indicators emphasize advancement

### 6. "Sometimes I want to go back and re-read a specific part..."
**Implementation**: Multiple navigation features enable efficient passage reference:
- Quick navigation buttons for each section positioned below questions
- Clickable section headers in the passage view
- Smooth scrolling to specific sections with visual feedback
- Highlighted sections when selected for context awareness
- Toggle between chunked and full views without losing position

### 7. "My younger brother... same interface doesn't work for both of us"
**Implementation**: Flexible, self-paced interface accommodating different reading speeds:
- Chunked view breaks text into manageable sections
- Full view provides complete context for faster readers
- User-controlled navigation and pacing
- Clear section titles aid comprehension across skill levels
- No time constraints or artificial pacing

## AI Question Generation Approach

### Strategy: On-Demand Generation
The application uses on-demand question generation rather than pre-computed questions:

- **Freshness**: Each session generates unique questions from the passage
- **Extensibility**: Architecture supports future adaptive difficulty based on performance
- **Quality**: Leverages latest GPT-4o model capabilities
- **Flexibility**: Question parameters (count, type, difficulty) easily adjustable

### Question Generation Implementation

The GPT-4o system prompt is engineered to produce high-quality comprehension questions:
- Tests genuine understanding rather than simple recall
- Requires synthesis of information across passage sections
- Generates varied difficulty levels (easy, medium, hard)
- Includes detailed explanations with specific passage references
- Focuses on learning outcomes rather than pure assessment

### Question Features
- Short-answer format eliminates guessing
- Mixed difficulty maintains engagement
- Comprehensive explanations facilitate learning from errors
- Passage excerpts in feedback provide source context
- Flexible answer matching accepts reasonable variations

## Technical Implementation

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o
- **Deployment**: Vercel

### Key Features

#### 1. Intelligent Answer Checking
```typescript
// Flexible answer matching that accepts reasonable variations
// while ensuring actual comprehension
const checkAnswer = (userAns: string, correctAns: string): boolean => {
  const normalized = normalizeAnswer(userAns);
  const normalizedCorrect = normalizeAnswer(correctAns);
  
  // Exact match OR key terms present
  return normalized === normalizedCorrect || 
         matchingKeyTerms >= threshold;
}
```

#### 2. Responsive Layout
- **Desktop**: Side-by-side passage and questions
- **Mobile**: Vertically stacked with optimized spacing
- **Sticky passage** on desktop for easy reference
- **Smooth scrolling** and section highlighting

#### 3. Progress Tracking
- Real-time answer tracking
- Visual progress bar
- Final score with detailed breakdown
- Performance feedback based on score

#### 4. Learning-First Feedback
- Immediate feedback after each answer
- Rich explanations with context
- Visual distinction between correct/incorrect
- Constructive messaging focused on improvement

## Project Structure

```
edaccelerator-learning-assessment/
├── app/
│   ├── api/
│   │   └── generate-questions/
│   │       └── route.ts          # OpenAI API integration
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page with loading states
├── components/
│   └── ReadingInterface.tsx      # Main interactive component
├── lib/
│   ├── data.ts                   # Passage data and chunks
│   └── types.ts                  # TypeScript interfaces
└── .env.local                    # API keys (not committed)
```

## Setup & Deployment

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/edaccelerator-learning-assessment.git
cd edaccelerator-learning-assessment
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
OPENAI_API_KEY=your-openai-api-key-here
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Deploying to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add `OPENAI_API_KEY` in Environment Variables
   - Deploy

## Design Decisions

### Color Scheme
- **Blue**: Primary color for trust, learning, and calmness
- **Purple accents**: Creativity and engagement
- **Green**: Success and correct answers
- **Red/Orange**: Gentle error indication (not harsh)
- **Warm gradients**: Welcoming, not clinical

### Typography & Spacing
- **Large, readable text**: Prioritizes comprehension
- **Ample whitespace**: Reduces cognitive load
- **Clear hierarchy**: Section titles, questions, and body text distinct
- **Comfortable line height**: Improved reading experience

### Interaction Design
- Smooth animations provide polish without distraction
- Clear focus states for accessibility and usability
- Constructive messaging promotes growth mindset
- Self-paced interaction without time pressure

## Potential Success Metrics

If deployed in production, effectiveness could be measured through:
- Time spent reviewing explanations (indicates active learning)
- Performance improvement across multiple attempts
- User feedback on experience quality (learning vs. testing perception)
- Navigation pattern analysis (frequency of passage reference)

## Future Enhancements

Given additional development time, the following features could be implemented:
1. Adaptive difficulty based on real-time performance analysis
2. Expanded passage library with diverse topics and complexity levels
3. User authentication and progress tracking across sessions
4. Enhanced accessibility (screen reader optimization, high contrast mode)
5. Contextual hint system that guides without revealing answers
6. Integrated vocabulary support with definitions
7. Annotation capabilities for student notes and highlights
8. Collaborative features for peer learning

## Development Time

- Planning and Architecture: 1 hour
- Core Implementation: 3 hours
- AI Integration and Testing: 1 hour
- UI Polish and Responsive Design: 1.5 hours
- Documentation: 0.5 hours
- **Total**: Approximately 7 hours

## License

This project was created as part of a technical assessment for EdAccelerator.
