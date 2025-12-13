import React from 'react';

const TypingIndicator: React.FC = () => (
  <div className="flex gap-1 p-2 bg-gray-100 rounded-2xl rounded-tl-none w-16 items-center justify-center animate-fade-in">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
  </div>
);

export default TypingIndicator;