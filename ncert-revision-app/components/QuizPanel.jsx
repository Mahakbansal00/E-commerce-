import React, { useState } from 'react';

export default function QuizPanel({ pdf }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generateQuiz', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ pdf }),
      });
      const data = await res.json();
      if (data.quiz) {
        setQuiz(data.quiz);
        setAnswers({});
        setSubmittedResult(null);
      } else {
        alert("Failed to generate quiz: No data returned.");
      }
    } catch (err) {
      console.error("Error generating quiz:", err);
      alert("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!quiz) return;
    try {
      const res = await fetch('/api/gradeQuiz', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ quiz, answers }),
      });
      const result = await res.json();
      if (result.score != null) {
        setSubmittedResult(result);

        // Store attempt in localStorage
        const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
        attempts.push({
          quizId: quiz.quiz_id,
          score: result.score,
          total: quiz.questions.length,
          date: new Date().toISOString(),
        });
        localStorage.setItem('quizAttempts', JSON.stringify(attempts));
      } else {
        alert("Failed to submit quiz: Invalid response.");
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Failed to submit quiz");
    }
  };

  const getButtonClass = (q, opt) => {
    if (!submittedResult) {
      return answers[q.id] === opt ? 'bg-indigo-200' : '';
    }

    const correct = submittedResult.correctAnswers?.[q.id];
    if (opt === correct) return 'bg-green-500 text-white';
    if (answers[q.id] === opt && opt !== correct) return 'bg-red-500 text-white';
    return '';
  };

  return (
    <div>
      <div className="flex gap-2">
        <button
          onClick={generate}
          disabled={loading}
          className="px-3 py-1 bg-indigo-600 text-white rounded"
        >
          {loading ? 'Generating...' : 'Generate Quiz'}
        </button>
        <button
          onClick={() => { setAnswers({}); setSubmittedResult(null); }}
          disabled={!quiz}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Clear Answers
        </button>
      </div>

      <div className="mt-4">
        {!quiz && <p className="text-sm text-gray-500">Click "Generate Quiz" to create questions from the selected PDF.</p>}

        {quiz && quiz.questions.length === 0 && <p>No questions generated.</p>}

        {quiz && quiz.questions.length > 0 && (
          <div>
            {quiz.questions.map(q => (
              <div key={q.id} className="p-3 border rounded mb-2 bg-white">
                <div className="font-medium">{q.question}</div>

                {q.type === 'MCQ' && q.options && q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => !submittedResult && setAnswers({ ...answers, [q.id]: opt })}
                    className={`block w-full text-left p-2 rounded mt-1 hover:bg-gray-50 ${getButtonClass(q, opt)}`}
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </button>
                ))}

                {q.type !== 'MCQ' && (
                  <textarea
                    className={`w-full border rounded p-2 mt-2 ${submittedResult ? 'bg-gray-100' : ''}`}
                    value={answers[q.id] || ''}
                    onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                    readOnly={!!submittedResult}
                  />
                )}

                {q.source_pages && <div className="text-xs text-gray-500 mt-2">Source pages: {q.source_pages.join(', ')}</div>}
              </div>
            ))}

            <div className="flex gap-2 mt-4">
              <button
                onClick={submit}
                disabled={!quiz || submittedResult}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Submit
              </button>
            </div>

            {submittedResult && (
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <p><strong>Score:</strong> {submittedResult.score} / {quiz.questions.length}</p>
                {submittedResult.message && <p>{submittedResult.message}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
