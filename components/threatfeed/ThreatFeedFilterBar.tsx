import React from 'react';
import { AlertSeverity, ThreatEvent } from '../../types';

interface ThreatFeedFilterBarProps {
    typeFilter: 'all' | ThreatEvent['type'];
    setTypeFilter: (type: 'all' | ThreatEvent['type']) => void;
    severityFilter: 'all' | AlertSeverity;
    setSeverityFilter: (severity: 'all' | AlertSeverity) => void;
}

const TYPE_OPTIONS: { value: 'all' | ThreatEvent['type']; label: string }[] = [
    { value: 'all', label: 'All Event Types' },
    { value: 'alert', label: 'Alert' },
    { value: 'emerging_threat', label: 'Emerging Threat' },
    { value: 'ttp_sighting', label: 'TTP Sighting' },
];

const SEVERITY_OPTIONS: { value: 'all' | AlertSeverity; label: string }[] = [
    { value: 'all', label: 'All Severities' },
    ...Object.values(AlertSeverity).map(s => ({ value: s, label: s }))
];

export const ThreatFeedFilterBar: React.FC<ThreatFeedFilterBarProps> = ({
    typeFilter,
    setTypeFilter,
    severityFilter,
    setSeverityFilter
}) => {
    return (
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700 flex items-center justify-end gap-4 flex-shrink-0">
             <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as 'all' | ThreatEvent['type'])}
                className="bg-gray-700 border border-gray-600 rounded-md pl-3 pr-8 py-2 text-white text-sm focus:ring-cyan-500 focus:border-cyan-500 transition"
            >
                {TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
             <select
                value={severityFilter}
                onChange={e => setSeverityFilter(e.target.value as 'all' | AlertSeverity)}
                className="bg-gray-700 border border-gray-600 rounded-md pl-3 pr-8 py-2 text-white text-sm focus:ring-cyan-500 focus:border-cyan-500 transition"
            >
                {SEVERITY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    );
};
