
import React from 'react';
import { Metric } from '../../types';
import { ArrowUpIcon, ArrowDownIcon } from '../icons';

interface MetricCardProps {
  metric: Metric;
  icon: React.ReactNode;
  onClick: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, icon, onClick }) => {
  const isIncrease = metric.changeType === 'increase';
  const changeColor = isIncrease ? 'text-green-400' : 'text-red-400';

  return (
    <button
      onClick={onClick}
      className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 transition-all duration-300 hover:border-cyan-400 hover:shadow-glow-cyan w-full text-left"
      aria-label={`View details for ${metric.label}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-400">{metric.label}</p>
          <p className="text-3xl font-bold text-white mt-1">{metric.value}</p>
        </div>
        <div className="p-3 bg-gray-700 rounded-full">
          {icon}
        </div>
      </div>
      {metric.change && (
        <div className={`flex items-center text-sm mt-4 ${changeColor}`}>
          {isIncrease ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
          <span>{metric.change} vs last period</span>
        </div>
      )}
    </button>
  );
};
