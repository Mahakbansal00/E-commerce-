
import React, { useState, useEffect } from 'react'
import PdfViewer from '../components/PdfViewer'
import Header from '../components/Header'
import CategoryNav from '../components/CategoryNav'
import QuizCards from '../components/QuizCards'
import SourceSelector from '../components/SourceSelector'
import QuizPanel from '../components/QuizPanel'
import ChatPanel from '../components/ChatPanel'
import Dashboard from '../components/Dashboard'

export default function Home() {
  const [selectedPdf, setSelectedPdf] = useState(null)
  const [uploadedPdfs, setUploadedPdfs] = useState([])

  useEffect(() => {
    setSelectedPdf('/pdfs/sample_ncert_class11_physics.pdf')
    const stored = localStorage.getItem('uploadedPdfs')
    if (stored) {
      setUploadedPdfs(JSON.parse(stored))
    }
  }, [])

  return (
    <div className="min-h-screen bg-cream-50 p-4">
      <Header />
      <CategoryNav />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <SourceSelector selected={selectedPdf} onSelect={setSelectedPdf} />
          <Dashboard />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <PdfViewer file={selectedPdf} uploadedPdfs={uploadedPdfs} />
          </div>
          <div className="bg-white p-4 rounded shadow">
            <QuizPanel pdf={selectedPdf} uploadedPdfs={uploadedPdfs} />
          </div>
          <div className="bg-white p-4 rounded shadow">
            <ChatPanel pdf={selectedPdf} />
          </div>
        </div>
      </div>
    </div>
  )
}
