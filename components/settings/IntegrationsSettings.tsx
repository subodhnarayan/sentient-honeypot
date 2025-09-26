import React, { useState } from 'react';
import { Integration } from '../../types';
import { ArrowRightOnRectangleIcon } from '../icons';

const SlackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 122.8 122.8" {...props}><path d="M25.8,75.1c0,5.3-4.3,9.6-9.6,9.6s-9.6-4.3-9.6-9.6s4.3-9.6,9.6-9.6h9.6V75.1z" fill="#e01e5a"/><path d="M35.4,75.1c5.3,0,9.6-4.3,9.6-9.6s-4.3-9.6-9.6-9.6s-9.6,4.3-9.6,9.6V75.1H35.4z" fill="#e01e5a"/><path d="M47.9,25.8c-5.3,0-9.6,4.3-9.6,9.6s4.3,9.6,9.6,9.6s9.6-4.3,9.6-9.6v-9.6H47.9z" fill="#36c5f0"/><path d="M47.9,35.4c0,5.3,4.3,9.6,9.6,9.6s9.6-4.3,9.6-9.6s-4.3-9.6-9.6-9.6H47.9V35.4z" fill="#36c5f0"/><path d="M97,47.9c0-5.3,4.3-9.6,9.6-9.6s9.6,4.3,9.6,9.6s-4.3,9.6-9.6,9.6h-9.6V47.9z" fill="#2eb67d"/><path d="M87.4,47.9c-5.3,0-9.6,4.3-9.6,9.6s4.3,9.6,9.6,9.6s9.6-4.3,9.6-9.6V47.9H87.4z" fill="#2eb67d"/><path d="M75.1,97c5.3,0,9.6-4.3,9.6-9.6s-4.3-9.6-9.6-9.6s-9.6,4.3-9.6,9.6v9.6H75.1z" fill="#ecb22e"/><path d="M75.1,87.4c0-5.3-4.3-9.6-9.6-9.6s-9.6,4.3-9.6,9.6s4.3,9.6,9.6,9.6H75.1V87.4z" fill="#ecb22e"/></svg>
);

const SplunkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
        <path d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5V16.5Z" fill="white"/>
    </svg>
);


const INITIAL_INTEGRATIONS: Integration[] = [
    {
        id: 'slack',
        name: 'Slack',
        description: 'Send high-severity alerts directly to a Slack channel.',
        icon: <SlackIcon className="w-8 h-8"/>,
        connected: true,
    },
    {
        id: 'splunk',
        name: 'Splunk',
        description: 'Forward all interaction logs to your Splunk instance for correlation.',
        icon: <SplunkIcon className="w-8 h-8 text-black"/>,
        connected: false,
    },
    {
        id: 'webhook',
        name: 'Generic Webhook',
        description: 'Send alert data to any custom endpoint for processing.',
        icon: <ArrowRightOnRectangleIcon className="w-8 h-8 text-gray-400"/>,
        connected: false,
    }
];

const IntegrationCard: React.FC<{ integration: Integration; onToggle: () => void; }> = ({ integration, onToggle }) => (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
            <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${integration.id === 'splunk' ? 'bg-white' : 'bg-gray-700'}`}>
                {integration.icon}
            </div>
            <div className="ml-4">
                <h4 className="font-bold text-white">{integration.name}</h4>
                <p className="text-sm text-gray-400">{integration.description}</p>
            </div>
        </div>
        <button
            onClick={onToggle}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                integration.connected
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    : 'bg-cyan-600 text-white hover:bg-cyan-500'
            }`}
        >
            {integration.connected ? 'Disconnect' : 'Connect'}
        </button>
    </div>
);

export const IntegrationsSettings: React.FC = () => {
    const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);

    const handleToggleConnection = (id: Integration['id']) => {
        setIntegrations(current =>
            current.map(int =>
                int.id === id ? { ...int, connected: !int.connected } : int
            )
        );
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
             <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-bold text-white">Third-Party Integrations</h3>
                <p className="mt-1 text-sm text-gray-400">Connect SentientPots to your existing security and communication tools.</p>
            </div>
            <div className="p-6 space-y-4">
                {integrations.map(integration => (
                    <IntegrationCard 
                        key={integration.id}
                        integration={integration}
                        onToggle={() => handleToggleConnection(integration.id)}
                    />
                ))}
            </div>
        </div>
    );
};