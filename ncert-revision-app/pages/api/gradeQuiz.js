
export default async function handler(req, res) {
  if(req.method !== 'POST') return res.status(405).end()
  const { quiz, answers } = req.body
  let score = 0
  let total = quiz.questions.length
  const correctAnswers = {}
  quiz.questions.forEach(q => {
    correctAnswers[q.id] = q.answer
    if (answers[q.id] && answers[q.id].toLowerCase().trim() === q.answer.toLowerCase().trim()) {
      score += 1
    }
  })
  const message = score === total ? 'Perfect!' : score > total / 2 ? 'Good job!' : 'Keep practicing!'
  res.json({ ok: true, score, total, message, attemptId: 'attempt-demo-' + Date.now(), correctAnswers })
}
