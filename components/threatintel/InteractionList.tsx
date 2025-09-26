import React from 'react';
import { InteractionLog, AlertSeverity } from '../../types';
import { IconRenderer } from '../icons';
import { ChevronRightIcon } from '../icons';

interface InteractionListProps {
  interactions: InteractionLog[];
  selectedId: string | null;
  onSelect: (interaction: InteractionLog) => void;
}

const severityClasses: Record<AlertSeverity, { bg: string; text: string; border: string }> = {
    [AlertSeverity.Low]: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-l-4 border-green-500' },
    [AlertSeverity.Medium]: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-l-4 border-amber-500' },
    [AlertSeverity.High]: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-l-4 border-red-500' },
    [AlertSeverity.Critical]: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400', border: 'border-l-4 border-fuchsia-500' },
};

const formatTimestamp = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
}

export const InteractionList: React.FC<InteractionListProps> = ({ interactions, selectedId, onSelect }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-bold text-white">Captured Interactions</h3>
        <p className="text-sm text-gray-400">Showing {interactions.length} most recent events</p>
        {/* TODO: Add filtering options here */}
      </div>
      <div className="flex-grow overflow-y-auto">
        <ul className="divide-y divide-gray-700">
          {interactions.map((interaction) => {
            const classes = severityClasses[interaction.severity];
            const isSelected = selectedId === interaction.id;
            return (
              <li key={interaction.id}>
                <button
                  onClick={() => onSelect(interaction)}
                  className={`w-full text-left p-4 transition-colors duration-200 ${isSelected ? 'bg-cyan-500/10' : 'hover:bg-gray-700/50'}`}
                >
                  <div className={`pl-3 ${classes.border}`}>
                    <div className="flex justify-between items-center">
                        <p className={`text-sm font-bold ${classes.text}`}>{interaction.interactionType}</p>
                        <span className="text-xs text-gray-500">{formatTimestamp(interaction.timestamp)}</span>
                    </div>
                    <p className="font-semibold text-white mt-1">{interaction.honeypotName}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                        <p>
                            IP: <span className="font-mono">{interaction.attackerIp}</span>
                        </p>
                        <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
