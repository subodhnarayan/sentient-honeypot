import React from 'react';
import { Alert, AlertSeverity, AlertStatus, User, UserRole } from '../../types';
import { ClockIcon, CheckCircleIcon, ArrowUturnLeftIcon, ArrowPathIcon } from '../icons';

interface AlertsTableProps {
  alerts: Alert[];
  onUpdateStatus: (alertId: string, newStatus: AlertStatus) => void;
  onViewInteraction: (interactionId: string) => void;
  user: User;
}

const severityClasses: Record<AlertSeverity, { bg: string; text: string; }> = {
  [AlertSeverity.Low]: { bg: 'bg-green-500/10', text: 'text-green-400' },
  [AlertSeverity.Medium]: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  [AlertSeverity.High]: { bg: 'bg-red-500/10', text: 'text-red-500' },
  [AlertSeverity.Critical]: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400' },
};

const statusClasses: Record<AlertStatus, { bg: string; text: string; }> = {
    [AlertStatus.New]: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
    [AlertStatus.InProgress]: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
    [AlertStatus.Resolved]: { bg: 'bg-gray-500/10', text: 'text-gray-400' },
};

const formatTimestamp = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

export const AlertsTable: React.FC<AlertsTableProps> = ({ alerts, onUpdateStatus, onViewInteraction, user }) => {
  const isReadOnly = user.role === UserRole.SecurityAnalyst;
  const readOnlyTitle = "Action unavailable for Analyst role";
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Alert</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Target</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Attacker IP</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {alerts.map((alert) => (
                        <tr key={alert.id} className="hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${severityClasses[alert.severity].bg} ${severityClasses[alert.severity].text}`}>
                                    {alert.severity}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{alert.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{alert.honeypotName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{alert.attackerIp}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatTimestamp(alert.timestamp)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${statusClasses[alert.status].bg} ${statusClasses[alert.status].text}`}>
                                    {alert.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                               {alert.status === AlertStatus.New && (
                                   <button disabled={isReadOnly} onClick={() => onUpdateStatus(alert.id, AlertStatus.InProgress)} className="text-yellow-400 hover:text-yellow-300 p-1 rounded-md hover:bg-yellow-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-yellow-400" title={isReadOnly ? readOnlyTitle : "Acknowledge & Investigate"}>
                                        <ClockIcon className="w-5 h-5"/>
                                   </button>
                               )}
                               {alert.status === AlertStatus.InProgress && (
                                   <>
                                       <button disabled={isReadOnly} onClick={() => onUpdateStatus(alert.id, AlertStatus.Resolved)} className="text-green-400 hover:text-green-300 p-1 rounded-md hover:bg-green-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-green-400" title={isReadOnly ? readOnlyTitle : "Mark as Resolved"}>
                                            <CheckCircleIcon className="w-5 h-5"/>
                                       </button>
                                       <button disabled={isReadOnly} onClick={() => onUpdateStatus(alert.id, AlertStatus.New)} className="text-gray-400 hover:text-gray-300 p-1 rounded-md hover:bg-gray-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-400" title={isReadOnly ? readOnlyTitle : "Revert to New"}>
                                            <ArrowUturnLeftIcon className="w-5 h-5"/>
                                       </button>
                                   </>
                               )}
                                {alert.status === AlertStatus.Resolved && (
                                    <button disabled={isReadOnly} onClick={() => onUpdateStatus(alert.id, AlertStatus.InProgress)} className="text-cyan-400 hover:text-cyan-300 p-1 rounded-md hover:bg-cyan-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-cyan-400" title={isReadOnly ? readOnlyTitle : "Re-open Investigation"}>
                                        <ArrowPathIcon className="w-5 h-5"/>
                                    </button>
                                )}
                                <button onClick={() => onViewInteraction(alert.interactionId)} className="text-cyan-400 hover:text-cyan-300" title="View Interaction Details">
                                    Details
                                </button>
                            </td>
                        </tr>
                    ))}
                     {alerts.length === 0 && (
                        <tr>
                            <td colSpan={7} className="text-center py-10 text-gray-500">
                                No alerts match the current filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};