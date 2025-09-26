import React, { useState } from 'react';
import { MagnifyingGlassIcon, SpinnerIcon } from '../icons';

interface ThreatHuntingSearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

const EXAMPLE_PROMPTS = [
    "Any SSH sessions from Iran?",
    "Show me interactions that used 'wget'",
    "Find all web login attempts",
];

export const ThreatHuntingSearchBar: React.FC<ThreatHuntingSearchBarProps> = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        if (query.trim() && !isLoading) {
            onSearch(query);
        }
    };

    const handlePromptClick = (prompt: string) => {
        setQuery(prompt);
        onSearch(prompt);
    }
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Ask a question about your honeypot data..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md pl-4 pr-16 py-3 text-white text-lg focus:ring-cyan-500 focus:border-cyan-500 transition placeholder:text-gray-500"
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading || !query.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-10 rounded-md bg-cyan-600 text-white flex items-center justify-center transition-colors hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? <SpinnerIcon className="w-5 h-5" /> : <MagnifyingGlassIcon className="w-5 h-5" />}
                </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-400">Try:</span>
                {EXAMPLE_PROMPTS.map(prompt => (
                    <button 
                        key={prompt}
                        onClick={() => handlePromptClick(prompt)}
                        disabled={isLoading}
                        className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 hover:text-white transition-colors disabled:opacity-50"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>
    );
};
