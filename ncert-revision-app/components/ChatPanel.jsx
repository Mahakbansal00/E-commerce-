
import React, { useState } from 'react'

export default function ChatPanel({ pdf }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! Ask me anything about the selected PDF. This chat uses a RAG placeholder.' }
  ])
  const [input, setInput] = useState('')

  const send = async () => {
    if(!input) return
    setMessages(prev=> [...prev, { role: 'user', text: input }])
    setInput('')
    const res = await fetch('/api/ragQuery', {
      method: 'POST',
      headers: {'content-type':'application/json'},
      body: JSON.stringify({ pdf, query: input })
    })
    const j = await res.json()
    setMessages(prev=> [...prev, { role: 'assistant', text: j.answer }])
  }

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {messages.map((m,i)=> (
          <div key={i} className={`p-2 rounded ${m.role==='assistant'?'bg-gray-100':'bg-indigo-50 self-end'}`}>
            <div className="text-sm">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 border rounded p-2" placeholder="Ask about the PDF..." />
        <button onClick={send} className="px-3 py-2 bg-indigo-600 text-white rounded">Send</button>
      </div>
    </div>
  )
}
