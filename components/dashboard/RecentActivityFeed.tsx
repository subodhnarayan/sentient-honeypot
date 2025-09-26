
import React from 'react';
import { Activity, AlertSeverity } from '../../types';

interface RecentActivityFeedProps {
  activities: Activity[];
}

const severityClasses: Record<AlertSeverity, { bg: string; text: string; border: string }> = {
  [AlertSeverity.Low]: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  [AlertSeverity.Medium]: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  [AlertSeverity.High]: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' },
  [AlertSeverity.Critical]: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400', border: 'border-fuchsia-500/30' },
};

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-4 px-2">Recent Activity</h3>
      <div className="flex-grow overflow-y-auto pr-2">
        <ul className="space-y-3">
          {activities.map((activity) => {
            const classes = severityClasses[activity.severity];
            return (
              <li key={activity.id} className={`${classes.bg} p-3 rounded-lg border ${classes.border} transition-all hover:bg-gray-700`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{activity.type}</p>
                    <p className="text-xs text-gray-400">
                      IP: <span className="font-mono">{activity.attackerIp}</span> | Target: {activity.honeypot}
                    </p>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${classes.bg} ${classes.text}`}>
                      {activity.severity}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
