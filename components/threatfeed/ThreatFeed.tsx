import React, { useState, useMemo } from 'react';
import { ThreatEvent, AlertSeverity, View } from '../../types';
import { generateThreatFeed } from '../../data/mockData';
import { ThreatFeedFilterBar } from './ThreatFeedFilterBar';
import { ThreatFeedEventCard } from './ThreatFeedEventCard';
import { FireIcon } from '../icons';

const allEvents = generateThreatFeed();

interface ThreatFeedProps {
    onNavigate: (view: View, payload?: any) => void;
}

export const ThreatFeed: React.FC<ThreatFeedProps> = ({ onNavigate }) => {
    const [typeFilter, setTypeFilter] = useState<'all' | ThreatEvent['type']>('all');
    const [severityFilter, setSeverityFilter] = useState<'all' | AlertSeverity>('all');

    const filteredEvents = useMemo(() => {
        return allEvents.filter(event => {
            const matchesType = typeFilter === 'all' || event.type === typeFilter;
            const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
            return matchesType && matchesSeverity;
        });
    }, [typeFilter, severityFilter]);

    const handleViewDetails = (relatedId?: string) => {
        if (relatedId) {
            onNavigate(View.ThreatIntel, { interactionId: relatedId });
        }
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            <ThreatFeedFilterBar
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                severityFilter={severityFilter}
                setSeverityFilter={setSeverityFilter}
            />
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="relative pl-8">
                    {/* Timeline bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-700"></div>

                    {filteredEvents.length > 0 ? (
                        <div className="space-y-6">
                            {filteredEvents.map(event => (
                                <ThreatFeedEventCard key={event.id} event={event} onViewDetails={handleViewDetails} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                             <FireIcon className="w-16 h-16 mx-auto text-gray-600" />
                             <h3 className="mt-4 text-xl font-bold text-gray-400">No Events Found</h3>
                             <p className="mt-1 text-gray-500">Try adjusting your filters or check back later for new events.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
