import React, { useState, useEffect } from 'react';
import { HoneypotTemplate, ActiveHoneypot } from '../../types';
import { XMarkIcon, SpinnerIcon } from '../icons';

interface CreateHoneypotModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: HoneypotTemplate;
  onDeploySuccess: (newHoneypot: Omit<ActiveHoneypot, 'id' | 'systemInstruction'>) => void;
}

export const CreateHoneypotModal: React.FC<CreateHoneypotModalProps> = ({
  isOpen,
  onClose,
  template,
  onDeploySuccess,
}) => {
  const [honeypotName, setHoneypotName] = useState('');
  const [systemInstruction, setSystemInstruction] = useState(template.defaultSystemInstruction);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      if (isOpen) {
        setHoneypotName(`${template.name.replace(/\s/g, '-')}-${Math.floor(Math.random() * 1000)}`);
        setSystemInstruction(template.defaultSystemInstruction);
        setIsLoading(false);
      }
  }, [isOpen, template]);


  if (!isOpen) return null;

  const handleDeploy = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        onDeploySuccess({
            name: honeypotName,
            type: template.name,
            status: 'online',
            ipAddress: `172.18.0.${Math.floor(Math.random() * 254) + 1}`,
            interactions: 0,
            createdAt: 'Just now',
        });
    }, 1500);
  };

  return (
    <div 
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 w-full max-w-2xl transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">Deploy New Honeypot</h2>
            <p className="text-sm text-gray-400">Based on template: <span className="font-semibold text-cyan-400">{template.name}</span></p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
            <div>
                <label htmlFor="honeypot-name" className="block text-sm font-medium text-gray-300 mb-2">
                    Honeypot Name
                </label>
                <input
                    type="text"
                    id="honeypot-name"
                    value={honeypotName}
                    onChange={e => setHoneypotName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                    placeholder="e.g., prod-web-server-01"
                />
            </div>
            <div>
                <label htmlFor="ai-persona" className="block text-sm font-medium text-gray-300 mb-2">
                    AI Persona (System Instruction)
                </label>
                <textarea
                    id="ai-persona"
                    rows={8}
                    value={systemInstruction}
                    onChange={e => setSystemInstruction(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white text-sm font-mono focus:ring-cyan-500 focus:border-cyan-500 transition"
                    />
            </div>
        </div>

        <div className="flex items-center justify-end p-6 bg-gray-800/50 border-t border-gray-700 rounded-b-lg space-x-4">
            <button
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition disabled:opacity-50"
            >
                Cancel
            </button>
            <button
                onClick={handleDeploy}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <SpinnerIcon className="w-4 h-4 mr-2" />
                        Deploying...
                    </>
                ) : 'Deploy Honeypot'}
            </button>
        </div>
      </div>
    </div>
  );
};