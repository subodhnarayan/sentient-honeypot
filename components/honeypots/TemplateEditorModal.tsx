import React, { useState, useEffect } from 'react';
import { HoneypotTemplate } from '../../types';
import { XMarkIcon, TrashIcon, ICON_MAP, IconRenderer } from '../icons';

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: HoneypotTemplate) => void;
  onDelete: (templateId: string) => void;
  template: HoneypotTemplate | null;
}

export const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  template,
}) => {
  const [formData, setFormData] = useState<Omit<HoneypotTemplate, 'id' | 'isCustom'>>({
    name: '',
    description: '',
    iconId: 'Server',
    tags: [],
    defaultSystemInstruction: '',
  });

  const isEditing = template !== null;

  useEffect(() => {
    if (isOpen) {
      if (template) {
        setFormData({
            name: template.name,
            description: template.description,
            iconId: template.iconId,
            tags: template.tags,
            defaultSystemInstruction: template.defaultSystemInstruction,
        });
      } else {
        // Reset for new template
        setFormData({
            name: '',
            description: '',
            iconId: 'Server',
            tags: [],
            defaultSystemInstruction: '',
        });
      }
    }
  }, [isOpen, template]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
      setFormData(prev => ({ ...prev, tags }));
  }

  const handleSave = () => {
    onSave({
        ...formData,
        id: template?.id || '', // ID is handled by parent
        isCustom: template?.isCustom || true,
    });
  };

  const handleDelete = () => {
      if (template && window.confirm(`Are you sure you want to delete the "${template.name}" template? This cannot be undone.`)) {
          onDelete(template.id);
      }
  }

  return (
    <div 
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 w-full max-w-2xl transform transition-all flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit' : 'Create'} Honeypot Template</h2>
            <p className="text-sm text-gray-400">{isEditing ? 'Modify the details of your custom template.' : 'Build a new template from scratch.'}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Template Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"/>
                </div>
                 <div>
                    <label htmlFor="iconId" className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                    <select id="iconId" name="iconId" value={formData.iconId} onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 transition appearance-none">
                        {Object.entries(ICON_MAP).map(([id, { name }]) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea id="description" name="description" rows={2} value={formData.description} onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:ring-cyan-500 focus:border-cyan-500 transition" />
            </div>
             <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
                <input type="text" id="tags" name="tags" value={formData.tags.join(', ')} onChange={handleTagsChange} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"/>
            </div>
            <div>
                <label htmlFor="defaultSystemInstruction" className="block text-sm font-medium text-gray-300 mb-2">AI Persona (System Instruction)</label>
                <textarea id="defaultSystemInstruction" name="defaultSystemInstruction" rows={8} value={formData.defaultSystemInstruction} onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white text-sm font-mono focus:ring-cyan-500 focus:border-cyan-500 transition" />
            </div>
        </div>

        <div className="flex items-center justify-between p-6 bg-gray-800/50 border-t border-gray-700 rounded-b-lg flex-shrink-0">
            <div>
                {isEditing && template.isCustom && (
                     <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 rounded-md hover:bg-red-500/20 transition flex items-center"
                    >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Delete Template
                    </button>
                )}
            </div>
            <div className="flex items-center space-x-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition flex items-center"
                >
                    Save Template
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};