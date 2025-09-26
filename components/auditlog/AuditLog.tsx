import React from 'react';
import { AuditLogEntry, UserRole } from '../../types';
import { generateAuditLog } from '../../data/mockData';

const auditLogs = generateAuditLog();

const roleClasses: Record<UserRole, { bg: string; text: string; }> = {
  [UserRole.Administrator]: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400' },
  [UserRole.SecurityEngineer]: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  [UserRole.SecurityAnalyst]: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
};

const formatTimestamp = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'long',
    });
};

export const AuditLog: React.FC = () => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {auditLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatTimestamp(log.timestamp)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{log.user}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${roleClasses[log.role].bg} ${roleClasses[log.role].text}`}>
                                        {log.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-cyan-400">{log.action}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};