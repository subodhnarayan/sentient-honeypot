import React from 'react';
import { HoneypotTemplate } from '../../types';
import { PlusIcon, PencilIcon, IconRenderer } from '../icons';

interface HoneypotTemplateCardProps {
  template: HoneypotTemplate;
  onDeploy: () => void;
  onEdit: () => void;
  isReadOnly?: boolean;
}

export const HoneypotTemplateCard: React.FC<HoneypotTemplateCardProps> = ({ template, onDeploy, onEdit, isReadOnly }) => {
  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg border border-gray-700 flex flex-col transition-all duration-300 ${isReadOnly ? '' : 'hover:border-cyan-400 hover:shadow-glow-cyan'} group relative`}>
      <button 
        onClick={onEdit}
        disabled={isReadOnly}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-700/50 text-gray-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-gray-600 hover:text-white disabled:hidden"
        aria-label="Edit template"
      >
        <PencilIcon className="w-4 h-4" />
      </button>

      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between">
            <IconRenderer iconId={template.iconId} className="w-8 h-8" />
            <div className="flex flex-wrap gap-2 justify-end ml-4">
                {template.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full">{tag}</span>
                ))}
            </div>
        </div>
        <h3 className="text-lg font-bold text-white mt-4">{template.name}</h3>
        <p className="text-sm text-gray-400 mt-2 h-16">{template.description}</p>
      </div>
      <div className="bg-gray-800/50 p-4 border-t border-gray-700 rounded-b-lg">
        <button
          onClick={onDeploy}
          disabled={isReadOnly}
          title={isReadOnly ? "Analysts do not have permission to deploy honeypots" : "Deploy this template"}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-semibold bg-cyan-500/10 text-cyan-400 rounded-md hover:bg-cyan-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-500/10"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Deploy
        </button>
      </div>
    </div>
  );
};