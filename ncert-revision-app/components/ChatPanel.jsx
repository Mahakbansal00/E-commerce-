
import React, { useState } from 'react'
import { apiFetch } from '../lib/apiUtils'

export default function ChatPanel({ pdf }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! Ask me anything about the selected PDF. This chat uses a RAG placeholder.' }
  ])
  const [input, setInput] = useState('')

  const send = async () => {
    if(!input) return
    const userQuery = input
    setMessages(prev=> [...prev, { role: 'user', text: userQuery }])
    setInput('')
    
    try {
      const data = await apiFetch('/api/ragQuery', {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({ pdf, query: userQuery })
      })
      
      setMessages(prev=> [...prev, { role: 'assistant', text: data.answer || 'No response received.' }])
    } catch (err) {
      console.error("Error in RAG query:", err)
      setMessages(prev=> [...prev, { 
        role: 'assistant', 
        text: `Error: ${err.message}` 
      }])
    }
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
