import React from 'react';
import { InteractionStep } from '../../types';

interface SessionReplayProps {
    steps: InteractionStep[];
}

export const SessionReplay: React.FC<SessionReplayProps> = ({ steps }) => {
    return (
        <div className="bg-gray-900 p-4 rounded-md font-mono text-xs text-gray-300 max-h-96 overflow-y-auto">
            {steps.map((step, index) => {
                if (step.type === 'input') {
                    return (
                        <div key={index} className="flex items-start">
                            <span className="text-cyan-400 mr-2 flex-shrink-0">&gt;</span>
                            <pre className="whitespace-pre-wrap flex-1">{step.content}</pre>
                        </div>
                    );
                }
                return (
                     <div key={index} className="mt-1 mb-3">
                        <pre className="whitespace-pre-wrap text-gray-400">{step.content}</pre>
                    </div>
                );
            })}
        </div>
    );
};
