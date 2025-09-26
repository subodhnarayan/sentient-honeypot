import React from 'react';
import { NodeType } from '../../types';

const LEGEND_ITEMS: { type: NodeType, label: string, color: string }[] = [
    { type: 'ip', label: 'Attacker IP', color: 'bg-red-500' },
    { type: 'honeypot', label: 'Honeypot', color: 'bg-sky-400' },
    { type: 'ttp', label: 'MITRE TTP', color: 'bg-yellow-400' },
];

export const GraphLegend: React.FC = () => {
    return (
        <div className="absolute bottom-4 left-4 bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg border border-gray-700 shadow-lg z-10">
            <div className="flex items-center space-x-4">
                {LEGEND_ITEMS.map(item => (
                    <div key={item.type} className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${item.color}`}></span>
                        <span className="text-xs text-gray-300">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
