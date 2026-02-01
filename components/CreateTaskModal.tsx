
import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, Hash, AlignLeft, CheckCircle2, ChevronRight, Zap, Target, Layers } from 'lucide-react';
import { useApp } from '../store';
import { TaskPriority, TaskStatus } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStatus?: string;
  initialProjectId?: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, initialStatus, initialProjectId }) => {
  const { projects, addTask, currentUser } = useApp();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(initialProjectId || projects[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [status, setStatus] = useState<TaskStatus>(initialStatus || 'todo');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialStatus) setStatus(initialStatus);
      if (initialProjectId) setProjectId(initialProjectId);
    }
  }, [isOpen, initialStatus, initialProjectId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectId) return;

    addTask({
      title,
      projectId,
      priority,
      status,
      dueDate,
      description,
      type: 'TASK',
      reporterId: currentUser.id,
      assigneeId: currentUser.id,
      labels: [],
    });
    
    setTitle('');
    setDescription('');
    onClose();
    navigate(`/projects/${projectId}`);
  };

  const currentProject = projects.find(p => p.id === projectId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[var(--surface)] w-full max-w-3xl rounded-[48px] shadow-3xl flex flex-col overflow-hidden z-10 border border-[var(--border)]"
        role="dialog"
      >
        <div className="flex items-center justify-between px-10 py-8 border-b border-[var(--border)] bg-slate-50/30 dark:bg-slate-950/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-[var(--primary)]/30">
              <Zap className="w-7 h-7 fill-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[var(--text)]">Launch Mission</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Define a new work package</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 lg:p-12 space-y-12 custom-scrollbar">
          {/* Section 1: Core Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[10px] font-black text-[var(--primary)] uppercase tracking-widest ml-1">
              <Target className="w-4 h-4" /> Identification
            </div>
            <input
              autoFocus
              type="text"
              placeholder="What needs to be achieved?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl font-black text-[var(--text)] placeholder:text-slate-200 dark:placeholder:text-slate-800 border-none p-0 focus:ring-0 outline-none tracking-tight leading-tight bg-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Project Context */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <Hash className="w-4 h-4 text-indigo-500" /> Context
              </label>
              <div className="relative group">
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all appearance-none cursor-pointer shadow-inner pr-12 group-hover:border-[var(--primary)]/50"
                  required
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>
              </div>
            </div>

            {/* Criticality */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <Flag className="w-4 h-4 text-rose-500" /> Criticality
              </label>
              <div className="relative group">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all appearance-none cursor-pointer shadow-inner pr-12 group-hover:border-[var(--primary)]/50"
                >
                  <option value="LOW">Low priority</option>
                  <option value="MEDIUM">Standard</option>
                  <option value="HIGH">High priority</option>
                  <option value="URGENT">Urgent mission</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <Calendar className="w-4 h-4 text-amber-500" /> Target Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all cursor-pointer shadow-inner hover:border-[var(--primary)]/50"
              />
            </div>

            {/* Workflow State */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Initial State
              </label>
              <div className="relative group">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all appearance-none cursor-pointer shadow-inner pr-12 group-hover:border-[var(--primary)]/50"
                >
                  {currentProject?.workflow.map(w => (
                    <option key={w.id} value={w.id}>{w.label}</option>
                  )) || (
                    <>
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </>
                  )}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <AlignLeft className="w-4 h-4 text-[var(--primary)]" /> Mission Brief
            </label>
            <textarea
              placeholder="Expand on the requirements, scope, and technical details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-[32px] px-8 py-6 text-sm font-medium focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all resize-none leading-relaxed shadow-inner hover:border-[var(--primary)]/50"
            />
          </div>
        </form>

        <div className="px-12 py-8 bg-slate-50 dark:bg-slate-950/40 border-t border-[var(--border)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Ready</p>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title}
              className="px-12 py-4 bg-gradient-to-br from-[var(--primary)] to-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-[var(--primary)]/30 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              Launch Task
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateTaskModal;
