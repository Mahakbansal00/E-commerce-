
import OpenAI from 'openai';

export async function generateQuizFromText(text, pagesMetadata) {
  const uniqueId = Date.now() + Math.random().toString(36).substr(2, 9); // Generate unique ID

  // Check if OpenAI API key is available
  if (!process.env.OPENAI_API_KEY) {
    console.log("No OpenAI API key found, using fallback quiz.");
    return {
      quiz_id: 'demo-quiz-1',
      source_pdf: pagesMetadata?.pdf || 'sample.pdf',
      questions: [
        {
          id: 'q-1',
          type: 'MCQ',
          question: 'What is the S.I. unit of force?',
          options: ['Newton', 'Pascal', 'Joule', 'Watt'],
          answer: 'Newton',
          explanation: 'Force is measured in Newtons. (see source)',
          source_pages: [1]
        },
        {
          id: 'q-2',
          type: 'SAQ',
          question: 'Define inertia in one sentence.',
          answer: 'Inertia is the tendency of a body to resist change in its state of motion.',
          explanation: 'Basic definition from the textbook.',
          source_pages: [2]
        },
        {
          id: 'q-3',
          type: 'MCQ',
          question: 'What is the acceleration due to gravity on Earth?',
          options: ['9.8 m/s²', '10 m/s²', '8.9 m/s²', '11 m/s²'],
          answer: '9.8 m/s²',
          explanation: 'The standard value is approximately 9.8 m/s².',
          source_pages: [3]
        },
        {
          id: 'q-4',
          type: 'SAQ',
          question: 'State Newton\'s first law of motion.',
          answer: 'An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.',
          explanation: 'This is the law of inertia.',
          source_pages: [4]
        },
        {
          id: 'q-5',
          type: 'MCQ',
          question: 'What is the formula for force?',
          options: ['F = ma', 'F = mv', 'F = mgh', 'F = pV'],
          answer: 'F = ma',
          explanation: 'Force equals mass times acceleration.',
          source_pages: [5]
        },
        {
          id: 'q-6',
          type: 'LAQ',
          question: 'Explain the difference between mass and weight.',
          answer: 'Mass is the amount of matter in an object and is constant, while weight is the force exerted on an object due to gravity and varies with location.',
          explanation: 'Mass is a scalar quantity, weight is a vector.',
          source_pages: [6]
        },
        {
          id: 'q-7',
          type: 'MCQ',
          question: 'What is the unit of momentum?',
          options: ['kg m/s', 'N s', 'J s', 'kg m²/s'],
          answer: 'kg m/s',
          explanation: 'Momentum is mass times velocity.',
          source_pages: [7]
        },
        {
          id: 'q-8',
          type: 'SAQ',
          question: 'Define work in physics.',
          answer: 'Work is done when a force causes displacement.',
          explanation: 'Work = force × displacement × cosθ.',
          source_pages: [8]
        },
        {
          id: 'q-9',
          type: 'MCQ',
          question: 'What is the S.I. unit of energy?',
          options: ['Joule', 'Watt', 'Newton', 'Pascal'],
          answer: 'Joule',
          explanation: 'Energy is measured in Joules.',
          source_pages: [9]
        },
        {
          id: 'q-10',
          type: 'LAQ',
          question: 'Describe the principle of conservation of energy.',
          answer: 'Energy cannot be created or destroyed, only transformed from one form to another.',
          explanation: 'This is a fundamental law in physics.',
          source_pages: [10]
        }
      ]
    };
  }

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Construct prompt to generate at least 10 quiz questions from the text
  const prompt = `
You are an expert quiz generator. Generate at least 10 quiz questions based on the following text from a PDF.
Include a mix of question types: multiple choice (MCQ), short answer (SAQ), and long answer (LAQ).
Ensure questions are varied and unique for this generation session (ID: ${uniqueId}). Generate completely different questions each time, even if the text is the same. Avoid repeating any previous questions.
Return the output as a JSON object with the following structure:
{
  "quiz_id": "${uniqueId}",
  "source_pdf": "${pagesMetadata?.pdf || 'sample.pdf'}",
  "questions": [
    {
      "id": "q-1",
      "type": "MCQ",
      "question": "Question text?",
      "options": ["option1", "option2", "option3", "option4"],
      "answer": "correct option",
      "explanation": "Explanation for the answer.",
      "source_pages": [1, 2]
    },
    ...
  ]
}

Text:
"""${text}"""
`;

  try {
    console.log("Calling OpenAI API for quiz generation...");
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0].message.content;
    console.log("OpenAI response:", responseText);

    // Parse JSON from response
    const quiz = JSON.parse(responseText);
    console.log("Parsed quiz:", quiz);
    return quiz;
  } catch (error) {
    console.error("Error generating quiz from OpenAI:", error);
    // Fallback to static example if error occurs
    return {
      quiz_id: 'demo-quiz-1',
      source_pdf: pagesMetadata?.pdf || 'sample.pdf',
      questions: [
        {
          id: 'q-1',
          type: 'MCQ',
          question: 'What is the S.I. unit of force?',
          options: ['Newton', 'Pascal', 'Joule', 'Watt'],
          answer: 'Newton',
          explanation: 'Force is measured in Newtons. (see source)',
          source_pages: [1]
        },
        {
          id: 'q-2',
          type: 'SAQ',
          question: 'Define inertia in one sentence.',
          answer: 'Inertia is the tendency of a body to resist change in its state of motion.',
          explanation: 'Basic definition from the textbook.',
          source_pages: [2]
        },
        {
          id: 'q-3',
          type: 'MCQ',
          question: 'What is the acceleration due to gravity on Earth?',
          options: ['9.8 m/s²', '10 m/s²', '8.9 m/s²', '11 m/s²'],
          answer: '9.8 m/s²',
          explanation: 'The standard value is approximately 9.8 m/s².',
          source_pages: [3]
        },
        {
          id: 'q-4',
          type: 'SAQ',
          question: 'State Newton\'s first law of motion.',
          answer: 'An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.',
          explanation: 'This is the law of inertia.',
          source_pages: [4]
        },
        {
          id: 'q-5',
          type: 'MCQ',
          question: 'What is the formula for force?',
          options: ['F = ma', 'F = mv', 'F = mgh', 'F = pV'],
          answer: 'F = ma',
          explanation: 'Force equals mass times acceleration.',
          source_pages: [5]
        },
        {
          id: 'q-6',
          type: 'LAQ',
          question: 'Explain the difference between mass and weight.',
          answer: 'Mass is the amount of matter in an object and is constant, while weight is the force exerted on an object due to gravity and varies with location.',
          explanation: 'Mass is a scalar quantity, weight is a vector.',
          source_pages: [6]
        },
        {
          id: 'q-7',
          type: 'MCQ',
          question: 'What is the unit of momentum?',
          options: ['kg m/s', 'N s', 'J s', 'kg m²/s'],
          answer: 'kg m/s',
          explanation: 'Momentum is mass times velocity.',
          source_pages: [7]
        },
        {
          id: 'q-8',
          type: 'SAQ',
          question: 'Define work in physics.',
          answer: 'Work is done when a force causes displacement.',
          explanation: 'Work = force × displacement × cosθ.',
          source_pages: [8]
        },
        {
          id: 'q-9',
          type: 'MCQ',
          question: 'What is the S.I. unit of energy?',
          options: ['Joule', 'Watt', 'Newton', 'Pascal'],
          answer: 'Joule',
          explanation: 'Energy is measured in Joules.',
          source_pages: [9]
        },
        {
          id: 'q-10',
          type: 'LAQ',
          question: 'Describe the principle of conservation of energy.',
          answer: 'Energy cannot be created or destroyed, only transformed from one form to another.',
          explanation: 'This is a fundamental law in physics.',
          source_pages: [10]
        }
      ]
    };
  }
}

export async function ragAnswer(query, topChunks) {
  // Placeholder RAG: return a canned response
  return {
    answer: "This is a placeholder RAG answer. Replace with actual retrieval + LLM call. Top chunks: " + (topChunks?.length || 0)
  }
}
