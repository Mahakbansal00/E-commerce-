import { generateQuizFromText } from "../../lib/llm";
import fs from 'fs';
import path from 'path';
const pdfParse = require('pdf-parse');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { pdf, pdfData } = req.body;
    let text = '';

    if (pdfData) {
      // Extract text from the uploaded PDF data
      try {
        const dataBuffer = Buffer.from(pdfData, 'base64');
        const data = await pdfParse(dataBuffer);
        text = data.text.replace(/\s+/g, ' ').trim().substring(0, 10000);

        if (!text) {
          return res.status(400).json({ error: "No text extracted from PDF" });
        }
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError);
        return res.status(500).json({ error: "Failed to parse PDF" });
      }
    } else if (pdf) {
      // Extract text from the specified PDF
      const filePath = path.join(process.cwd(), 'public', pdf);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "PDF not found" });
      }

      try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        text = data.text.replace(/\s+/g, ' ').trim().substring(0, 10000);

        if (!text) {
          return res.status(400).json({ error: "No text extracted from PDF" });
        }
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError);
        return res.status(500).json({ error: "Failed to parse PDF" });
      }
    } else {
      // Use a fallback sample text if no PDF is provided
      text = `Motion in a straight line: The motion of a body is said to be rectilinear if its path is a straight line.
      If the body covers equal displacements in equal intervals of time, the motion is uniform.
      Velocity is the rate of change of displacement.`;
    }

    // Generate quiz from extracted text
    const quiz = await generateQuizFromText(text);

    if (!quiz) {
      return res.status(500).json({ error: "No quiz generated from text" });
    }

    res.status(200).json({ quiz });
  } catch (error) {
    console.error("Error in quiz API:", error);
    res.status(500).json({ error: "Quiz generation failed" });
  }
}
