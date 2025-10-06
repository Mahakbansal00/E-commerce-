import { generateQuizFromText } from "../../lib/llm";
import fs from 'fs';
import path from 'path';
const pdfParse = require('pdf-parse');

export default async function handler(req, res) {
  try {
    const { pdf } = req.body;
    let text = '';

    if (pdf) {
      // Extract text from the specified PDF
      const filePath = path.join(process.cwd(), 'public', pdf);
      if (fs.existsSync(filePath)) {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        text = data.text;
      } else {
        return res.status(404).json({ error: "PDF not found" });
      }
    } else {
      // For "All uploaded PDFs", use sample text for now
      text = `
Motion in a straight line: The motion of a body is said to be rectilinear if its path is a straight line.
If the body covers equal displacements in equal intervals of time, the motion is uniform.
Velocity is the rate of change of displacement.
`;
    }

    const quiz = await generateQuizFromText(text);
    res.status(200).json({ quiz });
  } catch (error) {
    console.error("Error in quiz API:", error);
    res.status(500).json({ error: "Quiz generation failed" });
  }
}
