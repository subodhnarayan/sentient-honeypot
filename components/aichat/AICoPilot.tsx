import React, { useState } from 'react';
import { ChatWindow } from './ChatWindow';
import { SparklesIcon, XMarkIcon } from '../icons';

export const AICoPilot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-lg text-white flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-400/50"
          aria-label={isOpen ? "Close AI Co-Pilot" : "Open AI Co-Pilot"}
        >
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 scale-0' : 'rotate-0 scale-100'}`}>
            <SparklesIcon className="w-8 h-8" />
          </div>
           <div className={`absolute transition-transform duration-300 ${isOpen ? 'rotate-0 scale-100' : '-rotate-180 scale-0'}`}>
            <XMarkIcon className="w-8 h-8" />
          </div>
        </button>
      </div>
      
      {isOpen && <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
};