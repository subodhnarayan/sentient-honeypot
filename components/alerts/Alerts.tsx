import React, { useState, useMemo, useEffect } from 'react';
import { Alert, AlertSeverity, AlertStatus, User } from '../../types';
import { AlertsFilterBar } from './AlertsFilterBar';
import { AlertsTable } from './AlertsTable';

interface AlertsProps {
    onViewInteraction: (interactionId: string) => void;
    initialFilter?: { severity?: AlertSeverity[] } | null;
    user: User;
    alertsData: Alert[];
}

export const Alerts: React.FC<AlertsProps> = ({ onViewInteraction, initialFilter, user, alertsData }) => {
    const [alerts, setAlerts] = useState<Alert[]>(alertsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
    const [activeProgrammaticFilter, setActiveProgrammaticFilter] = useState<AlertSeverity[] | null>(null);

    useEffect(() => {
        setAlerts(alertsData);
    }, [alertsData]);

    useEffect(() => {
        if (initialFilter?.severity) {
            setActiveProgrammaticFilter(initialFilter.severity);
            // Reset UI dropdown to 'all' to avoid confusion, the programmatic filter text will explain the state
            setSeverityFilter('all'); 
        } else {
             setActiveProgrammaticFilter(null);
        }
    }, [initialFilter]);


    const handleUpdateAlertStatus = (alertId: string, newStatus: AlertStatus) => {
        setAlerts(prevAlerts =>
            prevAlerts.map(alert =>
                alert.id === alertId ? { ...alert, status: newStatus } : alert
            )
        );
    };

    const handleSeverityChange = (severity: AlertSeverity | 'all') => {
        setSeverityFilter(severity);
        // User interaction with the dropdown should always clear the programmatic filter
        setActiveProgrammaticFilter(null);
    };

    const filteredAlerts = useMemo(() => {
        return alerts.filter(alert => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                alert.title.toLowerCase().includes(searchLower) ||
                alert.honeypotName.toLowerCase().includes(searchLower) ||
                alert.attackerIp.includes(searchLower);
            
            const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;

            // Priority to programmatic filter if it exists
            if (activeProgrammaticFilter) {
                return matchesSearch && matchesStatus && activeProgrammaticFilter.includes(alert.severity);
            }
            
            // Otherwise, use the UI dropdown filter
            const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;

            return matchesSearch && matchesSeverity && matchesStatus;
        });
    }, [alerts, searchTerm, severityFilter, statusFilter, activeProgrammaticFilter]);
    
    return (
        <div className="space-y-6">
            <AlertsFilterBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                severityFilter={severityFilter}
                setSeverityFilter={handleSeverityChange}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                activeProgrammaticFilter={activeProgrammaticFilter}
            />
            <AlertsTable 
                alerts={filteredAlerts} 
                onUpdateStatus={handleUpdateAlertStatus} 
                onViewInteraction={onViewInteraction} 
                user={user}
            />
        </div>
    );
};
