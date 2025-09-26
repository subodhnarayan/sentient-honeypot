import React from 'react';
import { BeakerIcon } from '../icons';

interface InitialStateProps {
    onPromptClick: (prompt: string) => void;
}

const EXAMPLE_PROMPTS = [
    "Are there any connections from unusual countries targeting the SSH honeypots?",
    "Show me all sessions where the attacker tried to access /etc/passwd.",
    "Find any attempts to use 'wget' or 'curl' to download external files."
];

export const InitialState: React.FC<InitialStateProps> = ({ onPromptClick }) => {
    return (
        <div className="text-center py-16 px-6 bg-gray-800 rounded-lg border border-dashed border-gray-700">
            <BeakerIcon className="w-16 h-16 mx-auto text-gray-600" />
            <h2 className="mt-4 text-2xl font-bold text-white">Start Your Hunt</h2>
            <p className="mt-2 text-lg text-gray-400">
                Use natural language to search for threats and patterns across all honeypot interactions.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
                <p className="text-sm text-gray-500 mb-3">Some ideas to get you started:</p>
                <div className="space-y-3">
                    {EXAMPLE_PROMPTS.map(prompt => (
                        <button 
                            key={prompt}
                            onClick={() => onPromptClick(prompt)}
                            className="w-full text-center text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-3 rounded-md transition-colors text-sm"
                        >
                           "{prompt}"
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
