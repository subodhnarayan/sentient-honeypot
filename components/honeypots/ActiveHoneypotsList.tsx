import React from 'react';
import { ActiveHoneypot } from '../../types';

interface ActiveHoneypotsListProps {
  honeypots: ActiveHoneypot[];
  onHoneypotSelect: (honeypot: ActiveHoneypot) => void;
}

const statusClasses: Record<ActiveHoneypot['status'], { bg: string; text: string }> = {
    online: { bg: 'bg-green-500', text: 'text-green-500' },
    offline: { bg: 'bg-gray-500', text: 'text-gray-500' },
    warning: { bg: 'bg-amber-500', text: 'text-amber-500' },
};

export const ActiveHoneypotsList: React.FC<ActiveHoneypotsListProps> = ({ honeypots, onHoneypotSelect }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">IP Address</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Interactions</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {honeypots.map((honeypot) => (
                        <tr key={honeypot.id} onClick={() => onHoneypotSelect(honeypot)} className="hover:bg-gray-700/50 transition-colors cursor-pointer">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className={`h-2.5 w-2.5 rounded-full ${statusClasses[honeypot.status].bg} mr-2`}></div>
                                    <span className="capitalize text-sm text-white">{honeypot.status}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{honeypot.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{honeypot.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{honeypot.ipAddress}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400 font-semibold">{honeypot.interactions.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{honeypot.createdAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};