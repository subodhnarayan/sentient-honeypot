import React, { useState, useMemo, useEffect } from 'react';
import { InteractionLog } from '../../types';
import { InteractionList } from './InteractionList';
import { InteractionAnalysisDetail } from './InteractionAnalysisDetail';
import { ShieldCheckIcon, InformationCircleIcon } from '../icons';

interface ThreatIntelProps {
    initialInteractionId: string | null;
    initialFilter?: { honeypotName: string } | null;
    interactions: InteractionLog[];
}

export const ThreatIntel: React.FC<ThreatIntelProps> = ({ initialInteractionId, initialFilter, interactions }) => {

    const filteredInteractions = useMemo(() => {
        if (initialFilter?.honeypotName) {
            return interactions.filter(i => i.honeypotName === initialFilter.honeypotName);
        }
        return interactions;
    }, [interactions, initialFilter]);

    const [selectedInteraction, setSelectedInteraction] = useState<InteractionLog | null>(() => {
        if (initialInteractionId) {
            return filteredInteractions.find(i => i.id === initialInteractionId) || filteredInteractions[0] || null;
        }
        return filteredInteractions[0] || null;
    });

    // This effect ensures that if the user navigates again via an alert, the view updates.
    useEffect(() => {
        if (initialInteractionId) {
            const newlySelected = filteredInteractions.find(i => i.id === initialInteractionId);
            if (newlySelected && newlySelected.id !== selectedInteraction?.id) {
                setSelectedInteraction(newlySelected);
            }
        }
    }, [initialInteractionId, filteredInteractions, selectedInteraction]);
    
    // Effect to reset selection if filter changes or interactions list is updated
    useEffect(() => {
        const currentSelectionStillExists = filteredInteractions.some(i => i.id === selectedInteraction?.id);
        if (!currentSelectionStillExists) {
            setSelectedInteraction(filteredInteractions[0] || null);
        }
    }, [filteredInteractions, selectedInteraction]);

    return (
        <div className="flex flex-1 flex-col space-y-4">
             {initialFilter?.honeypotName && (
                <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-400 flex items-start flex-shrink-0">
                    <InformationCircleIcon className="w-5 h-5 mr-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>
                        Showing interactions for honeypot: <span className="font-bold text-white">{initialFilter.honeypotName}</span>. Navigate away to clear this filter.
                    </span>
                </div>
            )}
            <div className="flex flex-grow h-full space-x-6 overflow-hidden">
                <div className="w-1/3 h-full">
                    <InteractionList 
                        interactions={filteredInteractions}
                        selectedId={selectedInteraction?.id || null}
                        onSelect={setSelectedInteraction}
                    />
                </div>
                <div className="w-2/3 h-full">
                    {selectedInteraction ? (
                        <InteractionAnalysisDetail key={selectedInteraction.id} interaction={selectedInteraction} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full bg-gray-800 rounded-lg border border-gray-700">
                            <ShieldCheckIcon className="w-16 h-16 text-gray-600" />
                            <h3 className="mt-4 text-xl font-bold text-gray-400">
                                {filteredInteractions.length === 0 ? 'No Interactions Found' : 'Select an Interaction'}
                            </h3>
                            <p className="mt-1 text-gray-500">
                                {filteredInteractions.length === 0 ? 'This honeypot has not recorded any interactions yet.' : 'Choose an interaction from the list to see the detailed analysis.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
