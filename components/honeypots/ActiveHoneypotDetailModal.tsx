import React, { useState } from 'react';
import { ActiveHoneypot, View, InteractionLog } from '../../types';
import { InteractionSimulatorModal } from './InteractionSimulatorModal';
import { XMarkIcon, IconRenderer, EyeIcon, PowerIcon, TrashIcon, CommandLineIcon } from '../icons';

interface ActiveHoneypotDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  honeypot: ActiveHoneypot;
  onNavigate: (view: View, payload?: any) => void;
  onAddNewInteraction: (newLog: InteractionLog) => void;
}

const statusClasses: Record<ActiveHoneypot['status'], { bg: string; text: string }> = {
    online: { bg: 'bg-green-500/10', text: 'text-green-400' },
    offline: { bg: 'bg-gray-500/10', text: 'text-gray-400' },
    warning: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
};

const DetailItem: React.FC<{ label: string; value: string | number; mono?: boolean }> = ({ label, value, mono = false }) => (
    <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className={`text-white ${mono ? 'font-mono' : 'font-semibold'}`}>{value}</p>
    </div>
);

export const ActiveHoneypotDetailModal: React.FC<ActiveHoneypotDetailModalProps> = ({
  isOpen,
  onClose,
  honeypot,
  onNavigate,
  onAddNewInteraction,
}) => {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  
  if (!isOpen) return null;

  const handleViewLogs = () => {
    onNavigate(View.ThreatIntel, { honeypotName: honeypot.name });
    onClose();
  };
  
  const handleSessionComplete = (newLog: InteractionLog) => {
    onAddNewInteraction(newLog);
    setIsSimulatorOpen(false);
    onClose(); // Close the detail modal as well
  }

  return (
    <>
    <div 
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 w-full max-w-2xl transform transition-all flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center">
            <IconRenderer iconId={honeypot.type.includes('Web Server') ? 'Server' : honeypot.type.includes('SSH') ? 'Terminal' : honeypot.type.includes('Database') ? 'Database' : 'Folder'} className="w-8 h-8 mr-4" />
            <div>
                <h2 className="text-xl font-bold text-white">{honeypot.name}</h2>
                <div className="flex items-center mt-1">
                    <p className="text-sm text-gray-400">{honeypot.type}</p>
                    <span className="mx-2 text-gray-600">&bull;</span>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${statusClasses[honeypot.status].bg} ${statusClasses[honeypot.status].text}`}>
                        {honeypot.status}
                    </span>
                </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-900/50 p-4 rounded-lg">
                <DetailItem label="IP Address" value={honeypot.ipAddress} mono />
                <DetailItem label="Interactions" value={honeypot.interactions.toLocaleString()} />
                <DetailItem label="Deployed" value={honeypot.createdAt} />
            </div>

            <div>
                <h4 className="text-base font-bold text-white mb-2">AI Persona (System Instruction)</h4>
                <div className="bg-gray-900 p-3 rounded-md max-h-48 overflow-y-auto">
                    <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{honeypot.systemInstruction || 'No custom instruction provided.'}</p>
                </div>
            </div>

            <div>
                <h4 className="text-base font-bold text-white mb-2">Management Actions</h4>
                <div className="space-y-3">
                     <button
                        onClick={() => setIsSimulatorOpen(true)}
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 hover:text-white transition-colors"
                    >
                        <CommandLineIcon className="w-4 h-4 mr-2" />
                        Simulate Direct Interaction
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                            onClick={handleViewLogs}
                            className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition-colors"
                        >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            View Logs
                        </button>
                        <button
                            className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold bg-amber-500/10 text-amber-400 rounded-md hover:bg-amber-500/20 transition-colors"
                        >
                            <PowerIcon className="w-4 h-4 mr-2" />
                            Take Offline
                        </button>
                        <button
                            className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 transition-colors"
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
    <InteractionSimulatorModal 
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        honeypot={honeypot}
        onSessionComplete={handleSessionComplete}
    />
    </>
  );
};
