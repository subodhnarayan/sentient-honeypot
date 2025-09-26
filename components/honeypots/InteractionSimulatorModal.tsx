import React, { useState, useEffect, useRef } from 'react';
import { ActiveHoneypot, InteractionLog, InteractionStep, AlertSeverity } from '../../types';
import { GoogleGenAI, Chat } from '@google/genai';
import { XMarkIcon, PaperAirplaneIcon, CommandLineIcon, SpinnerIcon } from '../icons';

interface InteractionSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  honeypot: ActiveHoneypot;
  onSessionComplete: (newLog: InteractionLog) => void;
}

export const InteractionSimulatorModal: React.FC<InteractionSimulatorModalProps> = ({
  isOpen,
  onClose,
  honeypot,
  onSessionComplete,
}) => {
  const [sessionSteps, setSessionSteps] = useState<InteractionStep[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const sessionStartTime = useRef<Date | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: honeypot.systemInstruction,
        },
      });
      setChat(chatSession);
      setSessionSteps([]);
      sessionStartTime.current = new Date();
      
      // Send an initial empty message to get a greeting
      const getGreeting = async () => {
        const stream = await chatSession.sendMessageStream({ message: "Connection established." });
        let greeting = '';
        for await (const chunk of stream) {
            greeting += chunk.text;
        }
        setSessionSteps([{ type: 'output', content: greeting, timestamp: new Date().toISOString() }]);
        setIsLoading(false);
      }
      getGreeting();

    }
  }, [isOpen, honeypot]);

  useEffect(() => {
    terminalBodyRef.current?.scrollTo(0, terminalBodyRef.current.scrollHeight);
  }, [sessionSteps, isLoading]);

  const handleSend = async () => {
    const messageText = input.trim();
    if (!messageText || isLoading || !chat) return;

    const userStep: InteractionStep = { type: 'input', content: messageText, timestamp: new Date().toISOString() };
    setSessionSteps(prev => [...prev, userStep]);
    setInput('');
    setIsLoading(true);

    try {
        const stream = await chat.sendMessageStream({ message: messageText });
        const aiStepPlaceholder: InteractionStep = { type: 'output', content: '', timestamp: new Date().toISOString() };
        setSessionSteps(prev => [...prev, aiStepPlaceholder]);

        let accumulatedText = '';
        for await (const chunk of stream) {
            accumulatedText += chunk.text;
            setSessionSteps(prev => {
                const newSteps = [...prev];
                const lastStep = newSteps[newSteps.length - 1];
                if (lastStep.type === 'output') {
                    lastStep.content = accumulatedText;
                }
                return newSteps;
            });
        }
    } catch (error) {
        console.error("Error communicating with Gemini:", error);
        const errorStep: InteractionStep = { type: 'output', content: 'Error: Could not get response.', timestamp: new Date().toISOString() };
        setSessionSteps(prev => [...prev, errorStep]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleEndSession = () => {
    if (!sessionStartTime.current) return;
    
    const duration = Math.round((new Date().getTime() - sessionStartTime.current.getTime()) / 1000);
    const commands = sessionSteps.filter(s => s.type === 'input').map(s => s.content);

    const newLog: InteractionLog = {
        id: `INT-SIM-${Date.now()}`,
        honeypotName: honeypot.name,
        honeypotType: honeypot.type,
        attackerIp: '127.0.0.1',
        countryCode: 'SIM',
        location: { lat: 45.4215, lng: -75.6972 }, // Simulated location
        // FIX: Changed to a valid InteractionType enum value. The summary clarifies it's a simulation.
        interactionType: 'SSH Session',
        severity: AlertSeverity.High, // For demo purposes
        timestamp: new Date().toISOString(),
        duration,
        aiSummary: 'This was a user-driven simulated interaction for demonstration purposes.',
        ttps: [],
        extractedIntelligence: {
            usernames: [],
            passwords: [],
            commands,
            files: [],
        },
        steps: sessionSteps,
        isEmergingThreat: false,
    };
    onSessionComplete(newLog);
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
        onClick={onClose}
    >
      <div 
        className="bg-black rounded-lg shadow-2xl border-2 border-cyan-500/50 w-full max-w-3xl h-[70vh] transform transition-all flex flex-col font-mono"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-3 bg-gray-800/50 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center">
            <CommandLineIcon className="w-5 h-5 text-cyan-400 mr-3" />
            <div>
                <h2 className="text-base font-bold text-white">Honeypot Interaction Simulator</h2>
                <p className="text-xs text-gray-400">Target: {honeypot.name} ({honeypot.ipAddress})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        <main ref={terminalBodyRef} className="flex-1 p-4 overflow-y-auto text-sm">
            {sessionSteps.map((step, index) => (
                 <div key={index} className="whitespace-pre-wrap">
                    {step.type === 'input' ? (
                        <div className="flex items-start">
                            <span className="text-cyan-400 mr-2 flex-shrink-0">&gt;</span>
                            <span className="text-white">{step.content}</span>
                        </div>
                    ) : (
                        <p className="text-gray-300 mb-2">{step.content}</p>
                    )}
                 </div>
            ))}
             {isLoading && sessionSteps[sessionSteps.length -1]?.type === 'input' && (
                <div className="flex items-center space-x-1.5 h-5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
             )}
        </main>

        <footer className="p-3 border-t border-gray-700 flex-shrink-0 flex items-center gap-4">
            <div className="relative flex-grow">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400">&gt;</span>
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter command..."
                    className="w-full bg-gray-900 border border-gray-600 rounded-md pl-8 pr-12 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                    disabled={isLoading}
                    autoFocus
                />
            </div>
            <button
                onClick={handleEndSession}
                className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition disabled:opacity-50"
            >
                End Session & Log
            </button>
        </footer>
      </div>
    </div>
  );
};