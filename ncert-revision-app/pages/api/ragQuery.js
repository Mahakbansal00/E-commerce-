
import { ragAnswer } from '../../lib/llm'

export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end()
  const { pdf, query } = req.body
  // In a real app: embed query -> search vector DB -> pass top chunks to LLM for an answer with citations.
  const fakeTopChunks = [{ page: 12, text: 'Sample chunk text about motion.' }]
  const ans = await ragAnswer(query, fakeTopChunks)
  res.json({ answer: ans.answer, citations: fakeTopChunks })
}
