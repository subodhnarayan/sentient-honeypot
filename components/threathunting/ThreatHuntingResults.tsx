import React from 'react';
import { InteractionLog, AlertSeverity } from '../../types';
import { SparklesIcon } from '../icons';

interface ThreatHuntingResultsProps {
    results: InteractionLog[] | null;
    summary: string | null;
    isLoading: boolean;
}

const severityClasses: Record<AlertSeverity, { bg: string; text: string; }> = {
    [AlertSeverity.Low]: { bg: 'bg-green-500/10', text: 'text-green-400' },
    [AlertSeverity.Medium]: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
    [AlertSeverity.High]: { bg: 'bg-red-500/10', text: 'text-red-500' },
    [AlertSeverity.Critical]: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400' },
};

const ResultItem: React.FC<{ log: InteractionLog }> = ({ log }) => (
    <li className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-semibold text-white">{log.interactionType} on <span className="text-cyan-400">{log.honeypotName}</span></p>
                <p className="text-sm text-gray-400 mt-1">
                    Attacker IP: <span className="font-mono">{log.attackerIp}</span> ({log.countryCode})
                </p>
            </div>
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${severityClasses[log.severity].bg} ${severityClasses[log.severity].text}`}>
                {log.severity}
            </span>
        </div>
        {log.extractedIntelligence.commands.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-700/50">
                <p className="text-xs text-gray-500 font-mono truncate">
                    Commands: {log.extractedIntelligence.commands.join(', ')}
                </p>
            </div>
        )}
    </li>
);

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-6 animate-pulse">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
             <div className="h-5 bg-gray-700 rounded w-1/5 mb-4"></div>
            <div className="space-y-4">
                <div className="h-16 bg-gray-700/50 rounded-lg"></div>
                <div className="h-16 bg-gray-700/50 rounded-lg"></div>
            </div>
        </div>
    </div>
);


export const ThreatHuntingResults: React.FC<ThreatHuntingResultsProps> = ({ results, summary, isLoading }) => {
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!results) return null;

    return (
        <div className="space-y-6">
            {summary && (
                <div className="bg-gray-800 p-4 rounded-lg border border-cyan-500/30 shadow-glow-cyan">
                    <div className="flex items-center mb-2">
                        <SparklesIcon className="w-5 h-5 text-cyan-400 mr-2" />
                        <h3 className="text-lg font-bold text-white">AI Summary</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{summary}</p>
                </div>
            )}
            
            {results.length > 0 && (
                 <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4">Matching Interactions ({results.length})</h3>
                    <ul className="space-y-4">
                        {results.map(log => <ResultItem key={log.id} log={log} />)}
                    </ul>
                 </div>
            )}
        </div>
    );
};
