import React, { useState } from 'react';
import { CubeIcon, UserCircleIcon, KeyIcon, SpinnerIcon } from '../icons';
import { User, UserRole } from '../../types';

interface LoginProps {
    onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            let user: User | null = null;
            if (password === 'password') {
                if (username === 'admin') {
                    user = { name: 'admin', role: UserRole.Administrator };
                } else if (username === 'engineer') {
                    user = { name: 'engineer', role: UserRole.SecurityEngineer };
                } else if (username === 'analyst') {
                    user = { name: 'analyst', role: UserRole.SecurityAnalyst };
                }
            }

            if (user) {
                onLoginSuccess(user);
            } else {
                setError('Invalid credentials. Please try again.');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 shadow-glow-cyan">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <CubeIcon className="w-10 h-10 text-cyan-400" />
                        <h1 className="text-2xl font-bold ml-3 text-white">Sentient<span className="font-light text-gray-400">Pots</span></h1>
                    </div>
                    <h2 className="text-xl font-bold text-white">Mission Control Access</h2>
                    <p className="text-gray-400">Log in with: admin, engineer, or analyst (pw: password)</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="sr-only">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserCircleIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 pl-10 pr-3 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                                placeholder="Username (e.g., admin)"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <KeyIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 pl-10 pr-3 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                                placeholder="Password (password)"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    {error && (
                        <p className="text-sm text-red-400 text-center">{error}</p>
                    )}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <>
                                    <SpinnerIcon className="w-5 h-5 mr-2" />
                                    Authenticating...
                                </>
                            ) : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};