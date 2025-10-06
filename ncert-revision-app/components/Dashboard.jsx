
import React, { useEffect, useState } from 'react'

export default function Dashboard() {
  const [attempts, setAttempts] = useState([])

  useEffect(() => {
    let storedAttempts = []
    try {
      storedAttempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]')
      if (!Array.isArray(storedAttempts)) {
        storedAttempts = []
      }
    } catch (e) {
      storedAttempts = []
    }
    setAttempts(storedAttempts)
  }, [])

  // Calculate average score and identify strengths & weaknesses (simplified)
  const averageScore = attempts.length > 0 ? (attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length) : 0
  const strengthsWeaknesses = attempts.length === 0 ? 'No data' : `Average score: ${averageScore.toFixed(2)}`

  return (
    <div>
      <h4 className="font-medium mb-2">Tiny Dashboard</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Recent attempts</div>
          <div className="mt-2">{attempts.length === 0 ? 'No attempts yet. Try a quiz.' : `You have made ${attempts.length} attempts.`}</div>
        </div>
        <div className="p-3 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Strengths & Weaknesses</div>
          <div className="mt-2">{strengthsWeaknesses}</div>
        </div>
      </div>
    </div>
  )
}
