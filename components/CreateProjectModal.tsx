
import React, { useState } from 'react';
import { X, Hash, Info, User, Briefcase, Sparkles } from 'lucide-react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { addProject, currentUser, workspace } = useApp();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!key || key === name.slice(0, 3).toUpperCase()) {
      setKey(val.slice(0, 3).toUpperCase());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !key) return;

    addProject({
      name,
      key,
      description,
      workspaceId: workspace.id,
      status: 'ACTIVE',
      leadId: currentUser.id,
      members: [currentUser.id],
    });
    
    setName('');
    setKey('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-lg"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="bg-[var(--surface)] w-full max-w-xl rounded-[48px] shadow-3xl flex flex-col overflow-hidden z-10 border border-[var(--border)] relative"
      >
        <div className="flex items-center justify-between px-10 py-8 border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">New Project</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Initialize a new workstream</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Identity</label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Next-Gen Mobile Platform"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner"
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unique Project Key</label>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="relative">
              <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                maxLength={5}
                placeholder="KEY"
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl text-sm font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner"
                required
              />
            </div>
            <p className="text-[10px] text-slate-400 font-bold ml-1">This ID will prefix all tasks in the project.</p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vision & Scope</label>
            <textarea
              placeholder="Describe the high-level goals and requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-3xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none shadow-inner leading-relaxed"
            />
          </div>
        </form>

        <div className="px-10 py-8 bg-slate-50 dark:bg-slate-950/40 border-t border-[var(--border)] flex items-center justify-end gap-6">
          <button onClick={onClose} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors">Dismiss</button>
          <button
            onClick={handleSubmit}
            disabled={!name || !key}
            className="px-12 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
          >
            Launch Project
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateProjectModal;
