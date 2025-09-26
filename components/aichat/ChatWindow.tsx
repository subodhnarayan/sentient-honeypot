import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType, MessageAuthor } from '../../types';
import { ChatMessage } from './ChatMessage';
import { XMarkIcon, PaperAirplaneIcon, SparklesIcon } from '../icons';
import { GoogleGenAI, Chat } from '@google/genai';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MESSAGE: ChatMessageType = {
    id: 'init',
    author: MessageAuthor.AI,
    content: "Hello! I'm your AI Analyst Co-Pilot. I can help you sift through data. What would you like to know?",
    examplePrompts: [
        "Show me critical alerts from the last 24 hours",
        "Summarize the attack from 198.51.100.210",
        "Are there any new threat patterns?"
    ]
};


export const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<ChatMessageType[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (isOpen) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const chatSession = ai.chats.create({
              model: 'gemini-2.5-flash',
              config: {
                systemInstruction: 'You are a world-class cybersecurity analyst AI. Your name is Co-Pilot. You are embedded in a security application called SentientPots. You can answer questions about alerts, attacker IPs, and threat patterns based on the data provided. Be helpful, concise, and professional. The user is a security analyst.',
              },
            });
            setChat(chatSession);
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    const handleSend = async (prompt?: string) => {
        const messageText = (prompt || input).trim();
        if (!messageText || !chat) return;

        const userMessage: ChatMessageType = {
            id: Date.now().toString(),
            author: MessageAuthor.User,
            content: messageText,
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        
        const aiResponseId = (Date.now() + 1).toString();
        const aiResponseShell: ChatMessageType = {
            id: aiResponseId,
            author: MessageAuthor.AI,
            content: ''
        };
        setMessages(prev => [...prev, aiResponseShell]);

        try {
            const stream = await chat.sendMessageStream({ message: messageText });
            let accumulatedText = '';
            for await (const chunk of stream) {
                accumulatedText += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === aiResponseId ? { ...msg, content: accumulatedText } : msg
                ));
            }
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            const errorResponse: ChatMessageType = {
                id: (Date.now() + 2).toString(),
                author: MessageAuthor.AI,
                content: "I'm sorry, I encountered an error connecting to my services. Please try again later."
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    }

  return (
    <div 
      className={`fixed bottom-24 right-6 w-[400px] h-[600px] bg-gray-800/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700 flex flex-col z-50
                 transition-all duration-300 ease-in-out
                 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
    >
      <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center">
            <SparklesIcon className="w-6 h-6 text-cyan-400" />
            <h3 className="text-lg font-bold text-white ml-2">AI Analyst Co-Pilot</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
        </button>
      </header>
      
      <main className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onPromptClick={handleSend} />
        ))}
        {isTyping && messages[messages.length - 1]?.content === '' && <ChatMessage message={{ id: 'typing', author: MessageAuthor.AI, content: ''}} />}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t border-gray-700 flex-shrink-0">
        <div className="relative">
            <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about alerts, IPs, TTPs..."
                className="w-full bg-gray-900 border border-gray-600 rounded-full pl-4 pr-12 py-2.5 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                disabled={isTyping}
            />
            <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center transition-colors hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                <PaperAirplaneIcon className="w-5 h-5" />
            </button>
        </div>
      </footer>
    </div>
  );
};