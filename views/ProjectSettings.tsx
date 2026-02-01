
import React, { useState } from 'react';
import { useApp } from '../store';
import { Project } from '../types';
import { Save, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectSettings: React.FC<{ project: Project }> = ({ project }) => {
  const { updateProject, deleteProject } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(project.name);
  const [key, setKey] = useState(project.key);
  const [description, setDescription] = useState(project.description || '');
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    updateProject(project.id, { name, key, description });
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleDelete = () => {
    if (confirm('Are you sure? This will delete the project and all associated tasks forever.')) {
      deleteProject(project.id);
      navigate('/projects');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-20">
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">General Settings</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Project Key</label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2 text-emerald-600 transition-opacity">
                {showSaved && (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold">Settings saved successfully</span>
                  </>
                )}
              </div>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-red-100 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
          <p className="text-sm text-slate-500 mb-6">Once you delete a project, there is no going back. Please be certain.</p>
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <div className="text-xs text-red-800 font-medium">
              This action will permanently delete the project <span className="font-bold underline">{project.name}</span> and all its associated tasks, sprints, and wiki pages.
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
