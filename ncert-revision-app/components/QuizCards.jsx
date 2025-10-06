import React from 'react';

export default function QuizCards() {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="bg-teal-900 rounded-lg p-6 text-cream-50 flex flex-col items-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 21.75a11.952 11.952 0 01-6.825-3.693 12.083 12.083 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7.5" />
        </svg>
        <h2 className="text-2xl font-bold mb-2 text-cream-50">Create a quiz</h2>
        <p className="mb-4 text-cream-50">Play for free with 300 participants</p>
        <button className="bg-green-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-green-700 border-2 border-black">
          Quiz editor
        </button>
      </div>
      <div className="bg-teal-900 rounded-lg p-6 text-cream-50 flex flex-col items-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 21.75a11.952 11.952 0 01-6.825-3.693 12.083 12.083 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7.5" />
        </svg>
        <h2 className="text-2xl font-bold mb-2 text-cream-50">A.I.</h2>
        <p className="mb-4 text-cream-50">Generate a quiz from any subject or pdf</p>
        <button className="bg-sky-400 text-black font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-sky-500 border-2 border-black">
          Quiz generator
        </button>
      </div>
    </div>
  );
}
