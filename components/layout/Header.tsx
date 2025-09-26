
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 lg:px-8 py-4">
      <div className="flex items-center">
        {icon && <div className="mr-4 p-2 bg-gray-700 rounded-lg">{icon}</div>}
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
      </div>
    </header>
  );
};
