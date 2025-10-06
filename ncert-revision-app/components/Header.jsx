import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import LoginModal from './LoginModal';

export default function Header() {
  const { data: session } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <header className="bg-rose-300 rounded-lg p-4 flex items-center justify-between max-w-7xl mx-auto mb-4">
      <div className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>
        <span className="text-pink-400">Q</span>
        <span className="text-yellow-400">U</span>
        <span className="text-green-300">I</span>
        <span className="text-cyan-300">Z</span>
        <span className="text-black">.com</span>
      </div>
      <div className="flex items-center space-x-4">
        {/* Removed search icon as per request */}
        {/* <button aria-label="Search" className="p-2 rounded-full hover:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
          </svg>
        </button> */}
        {!session ? (
          <button
            onClick={openLogin}
            className="bg-lime-300 text-black font-semibold px-4 py-2 rounded-full hover:bg-lime-400 border-2 border-black"
          >
            Sign in
          </button>
        ) : (
          <>
            <span className="font-semibold text-black">Hello, {session.user.name || session.user.email}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-red-600 border-2 border-black"
            >
              Sign out
            </button>
          </>
        )}
      </div>
      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
    </header>
  );
}
