import React, { useState } from 'react';
import { UserSettings } from '../../types';
import { UserCircleIcon, KeyIcon } from '../icons';

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

const InputField: React.FC<{ label: string; id: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; icon?: React.ReactNode }> = ({ label, id, type, value, onChange, icon }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <div className="relative">
            {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                className={`w-full bg-gray-900 border border-gray-600 rounded-md py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 transition ${icon ? 'pl-10' : 'px-3'}`}
            />
        </div>
    </div>
);


export const ProfileSettings: React.FC = () => {
    const [userSettings, setUserSettings] = useState<UserSettings>({
        name: 'Alex Johnson',
        email: 'alex.j@sentientpots.io',
    });

    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserSettings({ ...userSettings, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-8">
            <SettingsCard
                title="Personal Information"
                description="Update your name and email address."
                footer={
                    <button className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition">
                        Save Changes
                    </button>
                }
            >
                <InputField
                    label="Full Name"
                    id="name"
                    type="text"
                    value={userSettings.name}
                    onChange={handleUserChange}
                />
                 <InputField
                    label="Email Address"
                    id="email"
                    type="email"
                    value={userSettings.email}
                    onChange={handleUserChange}
                />
            </SettingsCard>
            
            <SettingsCard
                title="Change Password"
                description="Choose a new password for your account."
                footer={
                    <button className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition">
                        Update Password
                    </button>
                }
            >
                <InputField
                    label="Current Password"
                    id="current"
                    type="password"
                    value={password.current}
                    onChange={handlePasswordChange}
                    icon={<KeyIcon className="w-5 h-5 text-gray-400" />}
                />
                <InputField
                    label="New Password"
                    id="new"
                    type="password"
                    value={password.new}
                    onChange={handlePasswordChange}
                    icon={<KeyIcon className="w-5 h-5 text-gray-400" />}
                />
                <InputField
                    label="Confirm New Password"
                    id="confirm"
                    type="password"
                    value={password.confirm}
                    onChange={handlePasswordChange}
                    icon={<KeyIcon className="w-5 h-5 text-gray-400" />}
                />
            </SettingsCard>
        </div>
    );
};