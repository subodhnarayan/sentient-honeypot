import React, { useState } from 'react';
import { NotificationPreferences, AlertSeverity } from '../../types';

const SettingsCard: React.FC<{ title: string; description: string; children: React.ReactNode; footer?: React.ReactNode }> = ({ title, description, children, footer }) => (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
        <div className="p-6 space-y-4">
            {children}
        </div>
        {footer && (
            <div className="bg-gray-800/50 px-6 py-3 border-t border-gray-700 rounded-b-lg text-right">
                {footer}
            </div>
        )}
    </div>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
        type="button"
        className={`${
            enabled ? 'bg-cyan-600' : 'bg-gray-600'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
    >
        <span
            aria-hidden="true"
            className={`${
                enabled ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);


export const NotificationSettings: React.FC = () => {
    const [prefs, setPrefs] = useState<NotificationPreferences>({
        channels: {
            email: {
                enabled: true,
                address: 'alex.j@sentientpots.io',
            },
            sms: {
                enabled: false,
                phoneNumber: '+15551234567',
            },
        },
        severityThreshold: AlertSeverity.High,
    });

    const handleToggle = (channel: 'email' | 'sms') => {
        setPrefs(p => ({
            ...p,
            channels: {
                ...p.channels,
                [channel]: { ...p.channels[channel], enabled: !p.channels[channel].enabled }
            }
        }));
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'emailAddress') {
            setPrefs(p => ({ ...p, channels: { ...p.channels, email: { ...p.channels.email, address: value } } }));
        } else if (name === 'phoneNumber') {
            setPrefs(p => ({ ...p, channels: { ...p.channels, sms: { ...p.channels.sms, phoneNumber: value } } }));
        } else if (name === 'severityThreshold') {
            setPrefs(p => ({...p, severityThreshold: value as AlertSeverity }));
        }
    };

    return (
        <SettingsCard
            title="Notification Preferences"
            description="Control how and when you receive alerts from your honeypots."
            footer={
                <button className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition">
                    Save Notifications
                </button>
            }
        >
            <div className="space-y-6">
                {/* Email Channel */}
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-white">Email Notifications</h4>
                        <p className="text-sm text-gray-400">Receive alerts directly in your inbox.</p>
                    </div>
                    <ToggleSwitch enabled={prefs.channels.email.enabled} onChange={() => handleToggle('email')} />
                </div>
                {prefs.channels.email.enabled && (
                    <div className="pl-4">
                        <label htmlFor="emailAddress" className="sr-only">Email Address</label>
                        <input type="email" name="emailAddress" id="emailAddress" value={prefs.channels.email.address} onChange={handleInputChange} className="w-full md:w-2/3 bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"/>
                    </div>
                )}
                
                 {/* SMS Channel */}
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-white">SMS Notifications</h4>
                        <p className="text-sm text-gray-400">Get critical alerts via text message.</p>
                    </div>
                    <ToggleSwitch enabled={prefs.channels.sms.enabled} onChange={() => handleToggle('sms')} />
                </div>
                {prefs.channels.sms.enabled && (
                    <div className="pl-4">
                        <label htmlFor="phoneNumber" className="sr-only">Phone Number</label>
                        <input type="tel" name="phoneNumber" id="phoneNumber" value={prefs.channels.sms.phoneNumber} onChange={handleInputChange} className="w-full md:w-2/3 bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"/>
                    </div>
                )}

                <div className="border-t border-gray-700 pt-6">
                    <label htmlFor="severityThreshold" className="block text-sm font-medium text-gray-300 mb-2">Minimum Severity Threshold</label>
                    <p className="text-sm text-gray-400 mb-2">Only receive notifications for alerts at or above this level.</p>
                    <select
                        id="severityThreshold"
                        name="severityThreshold"
                        value={prefs.severityThreshold}
                        onChange={handleInputChange}
                        className="w-full md:w-2/3 bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                    >
                        {Object.values(AlertSeverity).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
        </SettingsCard>
    );
};