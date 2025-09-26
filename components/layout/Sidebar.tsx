import React from 'react';
import { View, User, UserRole } from '../../types';
import { BarChartSquareIcon, HoneypotIcon, ShieldCheckIcon, BellIcon, CogIcon, LogOutIcon, CubeIcon, BeakerIcon, NodeGraphIcon, BookOpenIcon, UserCircleIcon, FireIcon } from '../icons';

interface SidebarProps {
  user: User;
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  view: View;
  isActive: boolean;
  onClick: (view: View) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, view, isActive, onClick }) => {
  return (
    <button
      onClick={() => onClick(view)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out
        ${isActive
          ? 'bg-cyan-500/10 text-cyan-400 shadow-glow-cyan'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
    >
      <span className="mr-4">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ user, currentView, setCurrentView, onLogout }) => {
  const mainNavItems = [
    { icon: <BarChartSquareIcon className="w-5 h-5" />, label: 'Dashboard', view: View.Dashboard, roles: [UserRole.Administrator, UserRole.SecurityEngineer, UserRole.SecurityAnalyst] },
    { icon: <HoneypotIcon className="w-5 h-5" />, label: 'Deploy Deception', view: View.Honeypots, roles: [UserRole.Administrator, UserRole.SecurityEngineer, UserRole.SecurityAnalyst] },
    { icon: <ShieldCheckIcon className="w-5 h-5" />, label: 'Interaction Analysis', view: View.ThreatIntel, roles: [UserRole.Administrator, UserRole.SecurityEngineer, UserRole.SecurityAnalyst] },
    { icon: <NodeGraphIcon className="w-5 h-5" />, label: 'Threat Graph', view: View.ThreatGraph, roles: [UserRole.Administrator, UserRole.SecurityEngineer, UserRole.SecurityAnalyst] },
    { icon: <BeakerIcon className="w-5 h-5" />, label: 'Threat Hunting', view: View.ThreatHunting, roles: [UserRole.Administrator, UserRole.SecurityEngineer, UserRole.SecurityAnalyst] },
    { icon: <BellIcon className="w-5 h-5" />, label: 'Alerts', view: View.Alerts, roles: [UserRole.Administrator, UserRole.SecurityEngineer, UserRole.SecurityAnalyst] },
    { icon: <FireIcon className="w-5 h-5" />, label: 'Threat Feed', view: View.ThreatFeed, roles: [UserRole.Administrator, UserRole.SecurityEngineer, UserRole.SecurityAnalyst] },
  ];

  const secondaryNavItems = [
     { icon: <BookOpenIcon className="w-5 h-5" />, label: 'Audit Log', view: View.AuditLog, roles: [UserRole.Administrator] },
     { icon: <CogIcon className="w-5 h-5" />, label: 'Settings', view: View.Settings, roles: [UserRole.Administrator, UserRole.SecurityEngineer] },
  ];

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col p-4">
      <div className="flex items-center mb-10 px-2">
        <CubeIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-xl font-bold ml-3 text-white">Sentient<span className="font-light text-gray-400">Pots</span></h1>
      </div>
      <nav className="flex-1 flex flex-col space-y-2">
        {mainNavItems.filter(item => item.roles.includes(user.role)).map((item) => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.label}
            view={item.view}
            isActive={currentView === item.view}
            onClick={setCurrentView}
          />
        ))}
      </nav>
      <div className="mt-auto flex flex-col space-y-2 pt-4 border-t border-gray-700">
         {secondaryNavItems.filter(item => item.roles.includes(user.role)).map((item) => (
             <NavItem
                key={item.view}
                icon={item.icon}
                label={item.label}
                view={item.view}
                isActive={currentView === item.view}
                onClick={setCurrentView}
             />
         ))}
         <button onClick={onLogout} className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out">
            <LogOutIcon className="w-5 h-5 mr-4" />
            <span>Logout</span>
         </button>
         <div className="px-4 py-3 mt-2 bg-gray-900/50 rounded-lg">
            <div className="flex items-center">
                <UserCircleIcon className="w-8 h-8 text-gray-500" />
                <div className="ml-3">
                    <p className="text-sm font-semibold text-white capitalize">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.role}</p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};