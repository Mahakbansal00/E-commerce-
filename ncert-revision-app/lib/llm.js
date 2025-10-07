// lib/llm.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateQuizFromText(text) {
  if (!text || text.trim().length === 0) {
    throw new Error("No text provided for quiz generation");
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a quiz generation assistant." },
        {
          role: "user",
          content: `Generate 5 multiple choice questions based on the following text. Return the result as a JSON array of objects, where each object has: id (number starting from 1), type: 'MCQ', question (string), options (array of 4 strings), answer (the correct option string), source_pages (array of numbers, e.g., [1]). Ensure the response is valid JSON only.\n\nText: ${text}`,
        },
      ],
    });

    // Expect clean JSON in model response
    const quizText = completion.choices[0].message.content;

    // Try to parse valid JSON
    let questions;
    try {
      questions = JSON.parse(quizText);
    } catch {
      // Fallback: wrap into one question if not JSON
      questions = [
        {
          id: 1,
          type: "MCQ",
          question: quizText,
          options: ["Option A", "Option B", "Option C", "Option D"],
          answer: "Option A",
          source_pages: [1],
        },
      ];
    }

    return {
      quiz_id: Date.now(),
      questions,
    };
  } catch (err) {
    console.error("Error in generateQuizFromText:", err);
    throw err;
  }
}
