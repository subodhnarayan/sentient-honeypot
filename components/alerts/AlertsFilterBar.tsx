
import React from 'react';
import { AlertSeverity, AlertStatus } from '../../types';
import { MagnifyingGlassIcon } from '../icons';

interface AlertsFilterBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    severityFilter: AlertSeverity | 'all';
    setSeverityFilter: (severity: AlertSeverity | 'all') => void;
    statusFilter: AlertStatus | 'all';
    setStatusFilter: (status: AlertStatus | 'all') => void;
    activeProgrammaticFilter: AlertSeverity[] | null;
}

const FilterSelect: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
    <div>
        <label htmlFor={label} className="sr-only">{label}</label>
        <select
            id={label}
            name={label}
            value={value}
            onChange={onChange}
            className="bg-gray-700 border border-gray-600 rounded-md pl-3 pr-8 py-2 text-white text-sm focus:ring-cyan-500 focus:border-cyan-500 transition"
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);


export const AlertsFilterBar: React.FC<AlertsFilterBarProps> = ({
    searchTerm,
    setSearchTerm,
    severityFilter,
    setSeverityFilter,
    statusFilter,
    setStatusFilter,
    activeProgrammaticFilter
}) => {
    const severityOptions = [
        { value: 'all', label: 'All Severities' },
        ...Object.values(AlertSeverity).map(s => ({ value: s, label: s }))
    ];

    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        ...Object.values(AlertStatus).map(s => ({ value: s, label: s }))
    ];

    return (
        <div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-1/3">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title, IP, or honeypot..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md pl-10 pr-4 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <FilterSelect 
                        label="Severity"
                        value={severityFilter}
                        onChange={e => setSeverityFilter(e.target.value as AlertSeverity | 'all')}
                        options={severityOptions}
                    />
                    <FilterSelect 
                        label="Status"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as AlertStatus | 'all')}
                        options={statusOptions}
                    />
                </div>
            </div>
             {activeProgrammaticFilter && (
                <div className="text-center text-xs text-gray-400 mt-2 px-2 py-1 bg-gray-800 rounded-md border border-gray-700">
                    <span className="font-semibold">Note:</span> Showing alerts with severity <span className="font-bold text-cyan-400">{activeProgrammaticFilter.join(' & ')}</span> from the dashboard. Changing filters above will clear this view.
                </div>
            )}
        </div>
    );
};
