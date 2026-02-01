
import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, Hash, AlignLeft, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { useApp } from '../store';
import { TaskPriority, TaskStatus } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStatus?: string;
  initialProjectId?: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, initialStatus, initialProjectId }) => {
  const { projects, addTask, currentUser } = useApp();
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(initialProjectId || projects[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [status, setStatus] = useState<TaskStatus>(initialStatus || 'todo');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  // Sync state if initial props change while open or when opening
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
  };

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
        className="bg-[var(--surface)] w-full max-w-2xl rounded-[40px] shadow-2xl flex flex-col overflow-hidden z-10 border border-[var(--border)]"
        role="dialog"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--border)] bg-slate-50/30 dark:bg-slate-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--primary)] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <h2 className="text-xl font-black tracking-tight">New Mission</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-10 custom-scrollbar">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Identification</label>
            <input
              autoFocus
              type="text"
              placeholder="Give this task a compelling title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-black text-[var(--text)] placeholder:text-slate-100 dark:placeholder:text-slate-900 border-none p-0 focus:ring-0 outline-none tracking-tight leading-tight"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <Hash className="w-3.5 h-3.5" /> Context
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl px-5 py-3 text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all appearance-none cursor-pointer"
                required
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <Flag className="w-3.5 h-3.5" /> Criticality
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl px-5 py-3 text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="LOW">Low priority</option>
                <option value="MEDIUM">Standard</option>
                <option value="HIGH">High priority</option>
                <option value="URGENT">Urgent mission</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <Calendar className="w-3.5 h-3.5" /> Target Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl px-5 py-3 text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Initial State
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl px-5 py-3 text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all appearance-none cursor-pointer"
              >
                {projects.find(p => p.id === projectId)?.workflow.map(w => (
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
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              <AlignLeft className="w-3.5 h-3.5" /> Mission Brief
            </label>
            <textarea
              placeholder="Expand on the requirements and scope of this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-3xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all resize-none leading-relaxed"
            />
          </div>
        </form>

        <div className="px-10 py-6 bg-slate-50 dark:bg-slate-950/40 border-t border-[var(--border)] flex items-center justify-between gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saved automatically</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title}
              className="px-10 py-3 bg-[var(--primary)] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-[var(--primary)]/25 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:shadow-none transition-all"
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
