import React from 'react';
import { MetricCard } from './MetricCard';
import { GlobalAttackMap } from './GlobalAttackMap';
import { RecentActivityFeed } from './RecentActivityFeed';
import { ShieldCheckIcon, SignalIcon, BellAlertIcon, BugAntIcon } from '../icons';
import { View, AlertSeverity, Metric, Attack, Activity } from '../../types';

interface DashboardProps {
  onNavigate: (view: View, payload?: any) => void;
  metrics: Metric[];
  attacks: Attack[];
  activities: Activity[];
}

const ICONS = [
    <SignalIcon key="1" className="w-6 h-6 text-cyan-400"/>,
    <ShieldCheckIcon key="2" className="w-6 h-6 text-amber-400"/>,
    <BellAlertIcon key="3" className="w-6 h-6 text-red-500"/>,
    <BugAntIcon key="4" className="w-6 h-6 text-fuchsia-500"/>
];

const METRIC_CONFIG: Record<string, { view: View; payload?: any }> = {
    'Active Honeypots': { view: View.Honeypots },
    'Total Interactions': { view: View.ThreatIntel },
    'High-Severity Alerts': { 
        view: View.Alerts, 
        payload: { severity: [AlertSeverity.High, AlertSeverity.Critical] } 
    },
    'Emerging Threats': {
        view: View.ThreatHunting,
        payload: { query: 'show_emerging_threats' }
    },
};

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, metrics, attacks, activities }) => {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {metrics.map((metric, index) => (
          <MetricCard 
            key={metric.label} 
            metric={metric} 
            icon={ICONS[index]} 
            onClick={() => {
                const config = METRIC_CONFIG[metric.label];
                if (config) {
                    onNavigate(config.view, config.payload);
                }
            }}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <GlobalAttackMap attacks={attacks} />
        </div>
        <div>
          <RecentActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
};
