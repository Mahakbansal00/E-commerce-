import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, fileData } = req.body;

    if (!fileName || !fileData) {
      return res.status(400).json({ error: 'Missing fileName or fileData' });
    }

    // Decode base64 file data
    const buffer = Buffer.from(fileData, 'base64');

    // Save to public/pdfs directory
    const filePath = path.join(process.cwd(), 'public', 'pdfs', fileName);
    await writeFile(filePath, buffer);

    res.status(200).json({ message: 'File uploaded successfully', path: `/pdfs/${fileName}` });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Adjust as needed
    },
  },
};
