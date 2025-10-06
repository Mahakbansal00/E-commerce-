import React from 'react'

export default function PdfViewer({ file, uploadedPdfs }) {
  if(!file) return <div className="p-6 text-gray-500">No PDF selected. Place PDFs in <code>/public/pdfs/</code> and select one.</div>
  if(file === 'all-uploaded') {
    if (!uploadedPdfs || uploadedPdfs.length === 0) {
      return <div className="p-6 text-gray-500">No uploaded PDFs found.</div>
    }
    return (
      <div>
        <h4 className="mb-2 font-medium">PDF Viewer - All Uploaded PDFs</h4>
        <div className="border rounded p-2 h-[70vh] overflow-auto space-y-4">
          {uploadedPdfs.map(pdf => (
            <iframe key={pdf.path} src={pdf.path} className="w-full h-96" title={`pdf-viewer-${pdf.name}`} allow="fullscreen" />
          ))}
        </div>
      </div>
    )
  }
  return (
    <div>
      <h4 className="mb-2 font-medium">PDF Viewer</h4>
      <div className="border rounded p-2 h-[70vh] overflow-auto">
        <iframe src={file} className="w-full h-full" title="pdf-viewer" allow="fullscreen" />
      </div>
    </div>
  )
}
