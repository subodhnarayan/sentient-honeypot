import React from 'react';
import { ChatMessage as ChatMessageType, MessageAuthor } from '../../types';
import { CubeIcon, HoneypotIcon } from '../icons';

interface ChatMessageProps {
  message: ChatMessageType;
  onPromptClick?: (prompt: string) => void;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);


export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onPromptClick }) => {
  const isAI = message.author === MessageAuthor.AI;
  const isTyping = isAI && message.content === '';
  
  const alignment = isAI ? 'justify-start' : 'justify-end';
  const bubbleColor = isAI ? 'bg-gray-700' : 'bg-cyan-500/10 text-cyan-50';
  const bubbleRounding = isAI ? 'rounded-r-lg rounded-bl-lg' : 'rounded-l-lg rounded-br-lg';
  
  return (
    <div className={`flex items-end gap-2 ${alignment}`}>
      {isAI && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
            <HoneypotIcon className="w-5 h-5 text-cyan-400" />
        </div>
      )}
      
      <div className={`max-w-[80%] px-4 py-3 rounded-t-lg ${bubbleColor} ${bubbleRounding}`}>
        {isTyping ? (
            <TypingIndicator />
        ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}

        {message.examplePrompts && (
            <div className="mt-3 pt-3 border-t border-gray-600/50 space-y-2">
                {message.examplePrompts.map(prompt => (
                    <button 
                        key={prompt}
                        onClick={() => onPromptClick?.(prompt)}
                        className="w-full text-left text-sm text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-2 rounded-md transition-colors"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        )}
      </div>

       {!isAI && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="font-bold text-sm">U</span>
        </div>
      )}
    </div>
  );
};
