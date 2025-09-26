import React, { useState, useCallback, useMemo } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { HoneypotManagement } from './components/honeypots/HoneypotManagement';
import { ThreatIntel } from './components/threatintel/ThreatIntel';
import { Alerts } from './components/alerts/Alerts';
import { Settings } from './components/settings/Settings';
import { ThreatHunting } from './components/threathunting/ThreatHunting';
import { ThreatGraph } from './components/threatgraph/ThreatGraph';
import { ThreatFeed } from './components/threatfeed/ThreatFeed';
import { AICoPilot } from './components/aichat/AICoPilot';
import { Login } from './components/auth/Login';
import { AuditLog } from './components/auditlog/AuditLog';
import { View, AlertSeverity, User, UserRole, InteractionLog, Alert, Activity, Attack, Metric, ActiveHoneypot } from './types';
import { HoneypotIcon, ShieldCheckIcon, BarChartSquareIcon, BellIcon, CogIcon, BeakerIcon, NodeGraphIcon, BookOpenIcon, FireIcon } from './components/icons';
import { generateDerivedData, MASTER_INTERACTION_LOGS } from './data/mockData';

// Define access control lists for views
const VIEW_PERMISSIONS: Record<View, UserRole[]> = {
    [View.Dashboard]: [UserRole.Administrator, UserRole.SecurityEngineer, UserRole.SecurityAnalyst],
    [View.Honeypots]: [UserRole.Administrator, UserRole.SecurityEngineer, UserRole.SecurityAnalyst],
    [View.ThreatIntel]: [UserRole.Administrator, UserRole.SecurityEngineer, UserRole.SecurityAnalyst],
    [View.ThreatGraph]: [UserRole.Administrator, UserRole.SecurityEngineer, UserRole.SecurityAnalyst],
    [View.ThreatHunting]: [UserRole.Administrator, UserRole.SecurityEngineer, UserRole.SecurityAnalyst],
    [View.Alerts]: [UserRole.Administrator, UserRole.SecurityEngineer, UserRole.SecurityAnalyst],
    [View.ThreatFeed]: [UserRole.Administrator, UserRole.SecurityEngineer, UserRole.SecurityAnalyst],
    [View.Settings]: [UserRole.Administrator, UserRole.SecurityEngineer],
    [View.AuditLog]: [UserRole.Administrator],
};


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [initialInteractionId, setInitialInteractionId] = useState<string | null>(null);
  const [initialAlertsFilter, setInitialAlertsFilter] = useState<{ severity: AlertSeverity[] } | null>(null);
  const [initialThreatHuntQuery, setInitialThreatHuntQuery] = useState<string | null>(null);
  const [initialThreatIntelFilter, setInitialThreatIntelFilter] = useState<{ honeypotName: string } | null>(null);

  // Lifted state for dynamic updates
  const [interactions, setInteractions] = useState<InteractionLog[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [activeHoneypots, setActiveHoneypots] = useState<ActiveHoneypot[]>([]);
  
  useMemo(() => {
    const initialData = generateDerivedData(MASTER_INTERACTION_LOGS);
    setInteractions(initialData.interactions);
    setAlerts(initialData.alerts);
    setActivities(initialData.activities);
    setAttacks(initialData.attacks);
    setMetrics(initialData.metrics);
    setActiveHoneypots(initialData.activeHoneypots);
  }, []);

  const handleAddNewInteraction = (newInteraction: InteractionLog) => {
    const updatedInteractions = [newInteraction, ...interactions];
    setInteractions(updatedInteractions);
    
    // Re-derive all data from the new, complete interaction list
    const derivedData = generateDerivedData(updatedInteractions);
    setAlerts(derivedData.alerts);
    setActivities(derivedData.activities);
    setAttacks(derivedData.attacks);
    setMetrics(derivedData.metrics);
    setActiveHoneypots(derivedData.activeHoneypots);
    
    // Navigate to the Threat Intel view to see the new log
    setInitialInteractionId(newInteraction.id);
    setCurrentView(View.ThreatIntel);
  };


  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView(View.Dashboard);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(View.Dashboard);
  };


  const handleViewChange = (view: View, payload?: any) => {
    // Clear initial states when navigating away
    setInitialInteractionId(null);
    setInitialAlertsFilter(null);
    setInitialThreatHuntQuery(null);
    setInitialThreatIntelFilter(null);

    // Check permission before changing view
    if (currentUser && VIEW_PERMISSIONS[view]?.includes(currentUser.role)) {
        if (payload) {
            if (view === View.Alerts && payload.severity) setInitialAlertsFilter(payload);
            if (view === View.ThreatHunting && payload.query) setInitialThreatHuntQuery(payload.query);
            if (view === View.ThreatIntel && payload.honeypotName) setInitialThreatIntelFilter(payload);
            if (view === View.ThreatIntel && payload.interactionId) setInitialInteractionId(payload.interactionId);
        }
        setCurrentView(view);
    } else {
        console.warn(`User role ${currentUser?.role} does not have permission to access ${view}.`);
        // Optionally, show a notification to the user
    }
  };

  const handleNavigateToInteraction = (interactionId: string) => {
    setInitialInteractionId(interactionId);
    setCurrentView(View.ThreatIntel);
  };

  const renderContent = useCallback(() => {
    if (!currentUser) return null; // Should not happen if authenticated

    switch (currentView) {
      case View.Dashboard:
        return <Dashboard onNavigate={handleViewChange} metrics={metrics} attacks={attacks} activities={activities} />;
      case View.Honeypots:
        return <HoneypotManagement user={currentUser} onNavigate={handleViewChange} activeHoneypots={activeHoneypots} onAddNewInteraction={handleAddNewInteraction}/>;
      case View.ThreatIntel:
        return <ThreatIntel initialInteractionId={initialInteractionId} initialFilter={initialThreatIntelFilter} interactions={interactions} />;
      case View.ThreatGraph:
        return <ThreatGraph />;
      case View.ThreatHunting:
        return <ThreatHunting initialQuery={initialThreatHuntQuery} />;
      case View.Alerts:
        return <Alerts onViewInteraction={handleNavigateToInteraction} initialFilter={initialAlertsFilter} user={currentUser} alertsData={alerts} />;
      case View.ThreatFeed:
        return <ThreatFeed onNavigate={handleViewChange} />;
      case View.Settings:
        return <Settings />;
      case View.AuditLog:
        return <AuditLog />;
      default:
        return <Dashboard onNavigate={handleViewChange} metrics={metrics} attacks={attacks} activities={activities} />;
    }
  }, [currentView, currentUser, initialInteractionId, initialAlertsFilter, initialThreatHuntQuery, initialThreatIntelFilter, metrics, attacks, activities, interactions, alerts, activeHoneypots]);

  const getHeaderInfo = useCallback(() => {
    switch (currentView) {
      case View.Dashboard:
        return { title: 'Dashboard', subtitle: 'High-level overview of your honeypot network', icon: <BarChartSquareIcon className="w-6 h-6 text-cyan-400" /> };
      case View.Honeypots:
        return { title: 'Deploy Deception', subtitle: 'Create and manage your AI-powered honeypots', icon: <HoneypotIcon className="w-6 h-6 text-cyan-400" /> };
      case View.ThreatIntel:
        return { title: 'Interaction Analysis', subtitle: 'Deep dive into attacker TTPs', icon: <ShieldCheckIcon className="w-6 h-6 text-cyan-400" /> };
      case View.ThreatGraph:
        return { title: 'Visual Threat Graph', subtitle: 'Explore relationships between attackers and targets', icon: <NodeGraphIcon className="w-6 h-6 text-cyan-400" /> };
      case View.ThreatHunting:
        return { title: 'AI-Powered Threat Hunting', subtitle: 'Ask natural language questions to find hidden threats', icon: <BeakerIcon className="w-6 h-6 text-cyan-400" /> };
      case View.Alerts:
        return { title: 'Alerts', subtitle: 'Triage and manage security events', icon: <BellIcon className="w-6 h-6 text-cyan-400" /> };
      case View.ThreatFeed:
        return { title: 'Live Threat Feed', subtitle: 'Real-time stream of security events and intelligence', icon: <FireIcon className="w-6 h-6 text-cyan-400" /> };
      case View.Settings:
        return { title: 'Settings & Configuration', subtitle: 'Manage your profile, notifications, and integrations', icon: <CogIcon className="w-6 h-6 text-cyan-400" /> };
      case View.AuditLog:
        return { title: 'Audit Log', subtitle: 'Track all user actions and system events', icon: <BookOpenIcon className="w-6 h-6 text-cyan-400" /> };
      default:
        return { title: '', subtitle: '', icon: null };
    }
  }, [currentView]);

  const { title, subtitle, icon } = getHeaderInfo();

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const isFillView = currentView === View.ThreatGraph || currentView === View.ThreatIntel || currentView === View.ThreatFeed;
  const mainClasses = 'flex-1 p-6 lg:p-8 ' + (isFillView ? 'flex flex-col overflow-hidden' : 'overflow-y-auto');

  return (
    <div className="flex h-screen bg-gray-900 font-sans">
      <Sidebar user={currentUser} currentView={currentView} setCurrentView={handleViewChange} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} subtitle={subtitle} icon={icon} />
        <main className={mainClasses}>
          {renderContent()}
        </main>
      </div>
      <AICoPilot />
    </div>
  );
};

export default App;
