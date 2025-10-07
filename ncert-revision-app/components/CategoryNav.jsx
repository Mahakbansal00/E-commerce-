import React from 'react';

const categories = [
  { name: 'Start', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9-9 9-9-9z"/></svg>
  ) },
  { name: 'Art & Literature', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>
  ) },
  { name: 'Entertainment', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4 2 7-6-4-6 4 2-7-5.5-4h7l3-7z"/></svg>
  ) },
  { name: 'Geography', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
  ) },
  { name: 'History', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-900" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg>
  ) },
  { name: 'Languages', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l4 20H8l4-20z"/></svg>
  ) },
  { name: 'Science & Nature', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0110 10H2a10 10 0 0110-10z"/></svg>
  ) },
  { name: 'Sports', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
  ) },
];

export default function CategoryNav() {
  return (
    <nav className="max-w-7xl mx-auto flex justify-between border-b border-gray-300 pb-2 mb-4">
      {categories.map((cat) => (
        <div key={cat.name} className="flex flex-col items-center text-xs text-gray-600 cursor-pointer hover:text-black">
          <div className="mb-1">{cat.icon}</div>
          <div>{cat.name}</div>
        </div>
      ))}
    </nav>
  );
}
