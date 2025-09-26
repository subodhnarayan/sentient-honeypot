import React from 'react';
import { ThreatEvent, AlertSeverity } from '../../types';
import { BellAlertIcon, BugAntIcon, ShieldCheckIcon } from '../icons';

interface ThreatFeedEventCardProps {
    event: ThreatEvent;
    onViewDetails: (relatedId?: string) => void;
}

const EVENT_CONFIG: Record<ThreatEvent['type'], { icon: React.ReactNode, color: string }> = {
    alert: { icon: <BellAlertIcon className="w-5 h-5" />, color: 'border-red-500' },
    emerging_threat: { icon: <BugAntIcon className="w-5 h-5" />, color: 'border-fuchsia-500' },
    ttp_sighting: { icon: <ShieldCheckIcon className="w-5 h-5" />, color: 'border-amber-500' },
};

const severityClasses: Record<AlertSeverity, { bg: string; text: string; }> = {
  [AlertSeverity.Low]: { bg: 'bg-green-500/10', text: 'text-green-400' },
  [AlertSeverity.Medium]: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  [AlertSeverity.High]: { bg: 'bg-red-500/10', text: 'text-red-500' },
  [AlertSeverity.Critical]: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400' },
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

export const ThreatFeedEventCard: React.FC<ThreatFeedEventCardProps> = ({ event, onViewDetails }) => {
    const config = EVENT_CONFIG[event.type];
    const severity = severityClasses[event.severity];

    return (
        <div className="relative">
            <div className={`absolute -left-10 top-1 w-6 h-6 rounded-full bg-gray-800 border-2 ${config.color} flex items-center justify-center text-white`}>
                {config.icon}
            </div>
            <div className={`bg-gray-800 p-4 rounded-lg border border-gray-700 ml-4 border-l-4 ${config.color}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-white">{event.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{event.summary}</p>
                    </div>
                     <div className="text-right ml-2 flex-shrink-0">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${severity.bg} ${severity.text}`}>
                            {event.severity}
                        </span>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700/50">
                     <p className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</p>
                     {event.relatedId && (
                         <button 
                            onClick={() => onViewDetails(event.relatedId)}
                            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                         >
                            View Details &rarr;
                         </button>
                     )}
                </div>
            </div>
        </div>
    );
};
