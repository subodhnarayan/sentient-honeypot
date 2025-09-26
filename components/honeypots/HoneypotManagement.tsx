import React, { useState } from 'react';
import { HoneypotTemplateCard } from './HoneypotTemplateCard';
import { ActiveHoneypotsList } from './ActiveHoneypotsList';
import { CreateHoneypotModal } from './CreateHoneypotModal';
import { TemplateEditorModal } from './TemplateEditorModal';
import { ActiveHoneypotDetailModal } from './ActiveHoneypotDetailModal';
import { HoneypotTemplate, ActiveHoneypot, User, UserRole, View, InteractionLog } from '../../types';
import { PlusIcon } from '../icons';

const INITIAL_TEMPLATES: HoneypotTemplate[] = [
  {
    id: 'TPL001',
    name: 'Vulnerable Web Server',
    description: 'Simulates a WordPress site with a common vulnerability.',
    iconId: 'Server',
    tags: ['WordPress', 'PHP', 'Login'],
    defaultSystemInstruction: 'You are a vulnerable WordPress server running version 5.8. Your hostname is "web-prod-01". You should respond realistically to web scans and login attempts. Provide fake error messages that seem plausible but do not reveal real system information. If a user tries to access wp-login.php, present a fake login prompt.'
  },
  {
    id: 'TPL002',
    name: 'Unsecured SSH Port',
    description: 'Mimics an open SSH port on an Ubuntu server.',
    iconId: 'Terminal',
    tags: ['SSH', 'Ubuntu', 'Port 22'],
    defaultSystemInstruction: "You are a slightly misconfigured Linux server running Ubuntu 22.04. Your hostname is 'ubuntu-dev-srv'. Respond realistically to common Linux commands like ls, pwd, whoami. Be slightly helpful but not too perfect. Some commands might fail or produce odd results. You have a few fake user directories in /home like 'jdoe' and 'admin'."
  },
  {
    id: 'TPL003',
    name: 'Exposed Database',
    description: 'Acts like a publicly accessible MongoDB instance.',
    iconId: 'Database',
    tags: ['MongoDB', 'NoSQL', 'Database'],
    defaultSystemInstruction: "You are an exposed MongoDB database, version 4.4, without proper authentication. You contain several fake collections like 'users', 'products', and 'session_logs'. When queried, provide realistic but entirely fabricated document structures. The data should look like it belongs to a small e-commerce company."
  },
  {
    id: 'TPL004',
    name: 'Public AWS S3 Bucket',
    description: 'A simulated S3 bucket that appears to be misconfigured.',
    iconId: 'Folder',
    tags: ['AWS', 'S3', 'Cloud'],
    defaultSystemInstruction: "You are a publicly accessible AWS S3 bucket named 'company-public-assets'. You contain a mix of seemingly public files (images, css) and some files that should be private, like '2023_financials.pdf', 'employee_data.csv', and 'db_backups/'. Listing the bucket contents should be possible, but attempting to access the sensitive files should generate a plausible but fake access denied error."
  }
];

interface HoneypotManagementProps {
    user: User;
    onNavigate: (view: View, payload?: any) => void;
    activeHoneypots: ActiveHoneypot[];
    onAddNewInteraction: (newLog: InteractionLog) => void;
}

export const HoneypotManagement: React.FC<HoneypotManagementProps> = ({ user, onNavigate, activeHoneypots, onAddNewInteraction }) => {
    const [templates, setTemplates] = useState<HoneypotTemplate[]>(INITIAL_TEMPLATES);
    const [currentHoneypots, setCurrentHoneypots] = useState<ActiveHoneypot[]>(activeHoneypots);
    
    // State for deployment modal
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<HoneypotTemplate | null>(null);

    // State for template editor modal
    const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<HoneypotTemplate | null>(null);

    // State for detail modal
    const [detailModalHoneypot, setDetailModalHoneypot] = useState<ActiveHoneypot | null>(null);

    const isReadOnly = user.role === UserRole.SecurityAnalyst;


    const handleDeployClick = (template: HoneypotTemplate) => {
        setSelectedTemplate(template);
        setIsDeployModalOpen(true);
    };

    const handleCloseDeployModal = () => {
        setIsDeployModalOpen(false);
        setSelectedTemplate(null);
    };
    
    const handleDeploySuccess = (newHoneypot: Omit<ActiveHoneypot, 'id' | 'systemInstruction'>) => {
        const newEntry: ActiveHoneypot = {
            ...newHoneypot,
            id: `HP${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
            systemInstruction: selectedTemplate?.defaultSystemInstruction || '',
        };
        setCurrentHoneypots(prev => [newEntry, ...prev]);
        handleCloseDeployModal();
    };

    const handleOpenTemplateEditor = (template: HoneypotTemplate | null) => {
        setEditingTemplate(template);
        setIsTemplateEditorOpen(true);
    };

    const handleCloseTemplateEditor = () => {
        setEditingTemplate(null);
        setIsTemplateEditorOpen(false);
    };

    const handleSaveTemplate = (templateToSave: HoneypotTemplate) => {
        if (editingTemplate) { // Editing existing
            setTemplates(templates.map(t => t.id === templateToSave.id ? templateToSave : t));
        } else { // Creating new
            const newTemplate = { ...templateToSave, id: `TPL-CUSTOM-${Date.now()}`, isCustom: true };
            setTemplates(prev => [...prev, newTemplate]);
        }
        handleCloseTemplateEditor();
    };
    
    const handleDeleteTemplate = (templateId: string) => {
        setTemplates(templates.filter(t => t.id !== templateId));
        handleCloseTemplateEditor();
    }

    const handleHoneypotSelect = (honeypot: ActiveHoneypot) => {
        setDetailModalHoneypot(honeypot);
    };

    const handleCloseDetailModal = () => {
        setDetailModalHoneypot(null);
    };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-white">Honeypot Templates</h2>
                <p className="mt-1 text-gray-400">Deploy a new honeypot with a single click from a library of pre-configured templates.</p>
            </div>
            <button
                onClick={() => handleOpenTemplateEditor(null)}
                disabled={isReadOnly}
                title={isReadOnly ? "Analysts do not have permission to create templates" : "Create a new custom template"}
                className="flex items-center justify-center px-4 py-2 text-sm font-semibold bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <PlusIcon className="w-4 h-4 mr-2" />
                Create Template
            </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {templates.map(template => (
            <HoneypotTemplateCard 
                key={template.id} 
                template={template} 
                onDeploy={() => handleDeployClick(template)}
                onEdit={() => handleOpenTemplateEditor(template)}
                isReadOnly={isReadOnly}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white">Active Honeypots</h2>
        <p className="mt-1 text-gray-400">Monitor and manage all your currently deployed honeypots.</p>
        <div className="mt-6">
            <ActiveHoneypotsList honeypots={activeHoneypots} onHoneypotSelect={handleHoneypotSelect} />
        </div>
      </div>
      
      {selectedTemplate && (
        <CreateHoneypotModal 
            isOpen={isDeployModalOpen}
            onClose={handleCloseDeployModal}
            template={selectedTemplate}
            onDeploySuccess={handleDeploySuccess}
        />
      )}

      <TemplateEditorModal
        isOpen={isTemplateEditorOpen}
        onClose={handleCloseTemplateEditor}
        onSave={handleSaveTemplate}
        onDelete={handleDeleteTemplate}
        template={editingTemplate}
      />
      
      {detailModalHoneypot && (
        <ActiveHoneypotDetailModal
            isOpen={!!detailModalHoneypot}
            onClose={handleCloseDetailModal}
            honeypot={detailModalHoneypot}
            onNavigate={onNavigate}
            onAddNewInteraction={onAddNewInteraction}
        />
      )}
    </div>
  );
};
