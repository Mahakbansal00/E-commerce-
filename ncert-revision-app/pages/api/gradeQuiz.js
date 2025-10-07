export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { quiz, answers } = req.body;
  if (!quiz || !quiz.questions) return res.status(400).json({ error: 'Invalid quiz data' });

  let score = 0;
  const total = quiz.questions.length;
  const correctAnswers = {};

  quiz.questions.forEach(q => {
    const correctAnswer = q.answer || '';
    correctAnswers[q.id] = correctAnswer;

    const userAnswer = answers[q.id] || '';
    if (userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
      score += 1;
    }
  });

  const message =
    score === total
      ? 'Perfect!'
      : score > total / 2
      ? 'Good job!'
      : 'Keep practicing!';

  res.json({
    ok: true,
    score,
    total,
    message,
    attemptId: 'attempt-demo-' + Date.now(),
    correctAnswers,
  });
}
