
import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Calendar, Flag, Hash, AlignLeft, CheckCircle2, 
  MessageSquare, User, Clock, Trash2, Send, 
  MoreVertical, Share2, Paperclip, Zap, Link as LinkIcon, 
  Plus, Search, ArrowRight, ShieldAlert, GitBranch,
  Lock, ChevronRight
} from 'lucide-react';
import { useApp } from '../store';
import { Task, TaskPriority, TaskStatus, User as UserType, IssueLink } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskDetailsModalProps {
  taskId: string | null;
  onClose: () => void;
  onSelectTask?: (id: string) => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ taskId, onClose, onSelectTask }) => {
  const { tasks, projects, users, updateTask, deleteTask, currentUser } = useApp();
  const task = tasks.find(t => t.id === taskId);
  const project = projects.find(p => p.id === task?.projectId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newComment, setNewComment] = useState('');
  const [depSearch, setDepSearch] = useState('');
  const [showDepSearch, setShowDepSearch] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  const searchResults = useMemo(() => {
    if (!depSearch || !task) return [];
    return tasks.filter(t => 
      t.id !== task.id && 
      t.projectId === task.projectId &&
      (t.title.toLowerCase().includes(depSearch.toLowerCase()) || 
       `${project?.key}-${t.number}`.toLowerCase().includes(depSearch.toLowerCase())) &&
      !task.links.some(link => link.targetTaskId === t.id)
    ).slice(0, 5);
  }, [depSearch, tasks, task, project]);

  if (!task || !project) return null;

  const handleUpdate = (updates: Partial<Task>) => {
    // Check permission for status update if it's changing
    if (updates.status && updates.status !== task.status) {
      const targetStatus = project.workflow.find(w => w.id === updates.status);
      if (targetStatus?.allowedRoles && !targetStatus.allowedRoles.includes(currentUser.role)) {
        alert(`Unauthorized: Your role (${currentUser.role}) does not have permission to move tasks to "${targetStatus.label}". Required: [${targetStatus.allowedRoles.join(', ')}]`);
        return;
      }
    }
    updateTask(task.id, updates);
  };

  const addDependency = (targetId: string, type: IssueLink['type']) => {
    const newLink: IssueLink = { type, targetTaskId: targetId };
    handleUpdate({ links: [...task.links, newLink] });
    
    // Attempt bi-directional link if possible in this simple store
    const inverseType = type === 'BLOCKS' ? 'BLOCKED_BY' : type === 'BLOCKED_BY' ? 'BLOCKS' : 'RELATES_TO';
    updateTask(targetId, { 
      links: [...(tasks.find(t => t.id === targetId)?.links || []), { type: inverseType, targetTaskId: task.id }] 
    });

    setDepSearch('');
    setShowDepSearch(false);
  };

  const removeDependency = (targetId: string) => {
    handleUpdate({ links: task.links.filter(l => l.targetTaskId !== targetId) });
    // Also remove the inverse link
    const targetTask = tasks.find(t => t.id === targetId);
    if (targetTask) {
      updateTask(targetId, {
        links: targetTask.links.filter(l => l.targetTaskId !== task.id)
      });
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  const assignee = users.find(u => u.id === task.assigneeId);
  const reporter = users.find(u => u.id === task.reporterId);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[var(--surface)] w-full max-w-5xl h-[85vh] rounded-[48px] shadow-3xl flex flex-col overflow-hidden z-10 border border-[var(--border)]"
      >
        {/* Modal Header */}
        <header className="px-8 py-5 border-b border-[var(--border)] flex items-center justify-between bg-slate-50/30 dark:bg-slate-950/20">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-[var(--border)] shadow-sm">
              <Zap className="w-3.5 h-3.5 text-[var(--primary)] fill-[var(--primary)]" />
              {project.key}-{task.number}
            </div>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[150px]">
              {project.name}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 text-slate-400 hover:text-[var(--primary)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all" onClick={handleDelete}>
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
            <button 
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-10 lg:p-12 space-y-12 custom-scrollbar border-r border-[var(--border)]">
            {/* Title & Description */}
            <section className="space-y-8">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => handleUpdate({ title })}
                className="w-full text-4xl font-black text-[var(--text)] placeholder:text-slate-100 dark:placeholder:text-slate-900 border-none p-0 focus:ring-0 outline-none tracking-tight leading-tight bg-transparent"
              />
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <AlignLeft className="w-4 h-4" /> 
                  Description
                </div>
                <textarea
                  placeholder="What's the context for this task?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => handleUpdate({ description })}
                  className="w-full min-h-[120px] bg-slate-50/50 dark:bg-slate-900/50 border border-[var(--border)] rounded-[32px] px-8 py-6 text-sm font-medium focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all resize-none leading-relaxed shadow-inner"
                />
              </div>
            </section>

            {/* Dependencies Section */}
            <section className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <GitBranch className="w-4 h-4" /> 
                  Relationships
                </div>
                <button 
                  onClick={() => setShowDepSearch(!showDepSearch)}
                  className="flex items-center gap-2 text-[10px] font-black text-[var(--primary)] uppercase tracking-widest bg-[var(--primary)]/10 px-3 py-1.5 rounded-xl hover:bg-[var(--primary)]/20 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Link Task
                </button>
              </div>

              {showDepSearch && (
                <div className="relative z-20">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Search task title or key..."
                      value={depSearch}
                      onChange={(e) => setDepSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-900 border border-[var(--border)] rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none shadow-inner"
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden overflow-y-auto max-h-64 z-50"
                    >
                      {searchResults.map(result => (
                        <div key={result.id} className="p-3 border-b border-[var(--border)] last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase">{project.key}-{result.number}</p>
                            <p className="text-sm font-bold truncate">{result.title}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => addDependency(result.id, 'BLOCKS')} className="px-3 py-1.5 bg-rose-100 text-rose-600 text-[9px] font-black uppercase rounded-lg hover:bg-rose-200">Blocks</button>
                            <button onClick={() => addDependency(result.id, 'BLOCKED_BY')} className="px-3 py-1.5 bg-amber-100 text-amber-600 text-[9px] font-black uppercase rounded-lg hover:bg-amber-200">Blocked By</button>
                            <button onClick={() => addDependency(result.id, 'RELATES_TO')} className="px-3 py-1.5 bg-blue-100 text-blue-600 text-[9px] font-black uppercase rounded-lg hover:bg-blue-200">Relates</button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {task.links.length > 0 ? task.links.map((link, idx) => {
                  const target = tasks.find(t => t.id === link.targetTaskId);
                  if (!target) return null;
                  return (
                    <div 
                      key={idx} 
                      onClick={() => onSelectTask?.(target.id)}
                      className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl hover:border-[var(--primary)] transition-all group cursor-pointer"
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${
                        link.type === 'BLOCKS' ? 'bg-rose-50 text-rose-500 dark:bg-rose-900/20' : 
                        link.type === 'BLOCKED_BY' ? 'bg-amber-50 text-amber-500 dark:bg-amber-900/20' : 
                        'bg-blue-50 text-blue-500 dark:bg-blue-900/20'
                      }`}>
                        {link.type === 'BLOCKS' && <ShieldAlert className="w-4 h-4" />}
                        {link.type === 'BLOCKED_BY' && <Clock className="w-4 h-4" />}
                        {link.type === 'RELATES_TO' && <GitBranch className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0 flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase shrink-0">{project.key}-{target.number}</span>
                        <p className="text-sm font-bold truncate text-slate-700 dark:text-slate-300">{target.title}</p>
                      </div>
                      <div className={`text-[10px] font-black uppercase tracking-widest shrink-0 ${target.status === 'done' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {target.status.replace('_', ' ')}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDependency(target.id);
                        }}
                        className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                }) : (
                  <div className="py-12 border-2 border-dashed border-[var(--border)] rounded-[32px] flex flex-col items-center justify-center text-slate-300">
                    <GitBranch className="w-10 h-10 mb-4 opacity-10" />
                    <p className="text-xs font-black uppercase tracking-widest opacity-40">No linked issues</p>
                  </div>
                )}
              </div>
            </section>

            {/* Comments Section */}
            <section className="space-y-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <MessageSquare className="w-4 h-4" /> 
                  Comments
                </div>
                <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest bg-[var(--primary)]/10 px-3 py-1 rounded-full">3 Messages</span>
              </div>

              <div className="space-y-6">
                {/* Mock Comments */}
                <div className="flex gap-4">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" className="w-9 h-9 rounded-xl shadow-sm mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black">Jane Dev</span>
                      <span className="text-[10px] font-bold text-slate-400">2h ago</span>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-900 px-5 py-3 rounded-2xl rounded-tl-none text-sm text-slate-700 dark:text-slate-300 font-medium">
                      Just finished the initial prototype for this component. Let me know what you think!
                    </div>
                  </div>
                </div>

                {/* Comment Input */}
                <div className="flex gap-4 pt-4">
                  <img src={currentUser.avatar} className="w-9 h-9 rounded-xl shadow-sm mt-1" />
                  <div className="flex-1 relative">
                    <textarea
                      placeholder="Share your thoughts..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-6 py-4 pr-16 text-sm font-medium focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all resize-none shadow-sm h-14"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[var(--primary)] text-white rounded-xl shadow-lg shadow-[var(--primary)]/20 hover:brightness-110 active:scale-95 transition-all">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar / Properties Area */}
          <aside className="w-80 bg-slate-50/50 dark:bg-slate-950/20 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {/* Status & Priority */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Workflow Stage</label>
                <div className="relative">
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdate({ status: e.target.value })}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all appearance-none cursor-pointer shadow-sm text-[var(--primary)] pr-10"
                  >
                    {project.workflow.map(w => {
                      const isRestricted = w.allowedRoles && !w.allowedRoles.includes(currentUser.role);
                      return (
                        <option key={w.id} value={w.id} disabled={isRestricted}>
                          {w.label} {isRestricted ? '(🔒 Locked)' : ''}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronRight className="w-4 h-4 rotate-90 text-slate-300" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission Priority</label>
                <select
                  value={task.priority}
                  onChange={(e) => handleUpdate({ priority: e.target.value as TaskPriority })}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all appearance-none cursor-pointer shadow-sm"
                >
                  <option value="LOW">Low priority</option>
                  <option value="MEDIUM">Standard</option>
                  <option value="HIGH">High priority</option>
                  <option value="URGENT">Urgent mission</option>
                </select>
              </div>
            </div>

            {/* People & Dates */}
            <div className="space-y-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Assignee</label>
                <div className="flex items-center gap-3 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm hover:border-[var(--primary)] transition-all cursor-pointer group">
                  <div className="relative">
                    <img src={assignee?.avatar} className="w-10 h-10 rounded-xl" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[var(--surface)] rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black truncate">{assignee?.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Active Member</p>
                  </div>
                  < MoreVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Due Date
                </label>
                <input
                  type="date"
                  value={task.dueDate}
                  onChange={(e) => handleUpdate({ dueDate: e.target.value })}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all cursor-pointer shadow-sm"
                />
              </div>
            </div>

            {/* Stats / Metadata */}
            <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-800">
               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <span>Created</span>
                 <span className="text-slate-600 dark:text-slate-400">{new Date(task.createdAt).toLocaleDateString()}</span>
               </div>
               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <span>Reporter</span>
                 <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                   <img src={reporter?.avatar} className="w-4 h-4 rounded-md" />
                   {reporter?.name}
                 </div>
               </div>
            </div>

            <div className="pt-10">
              <button className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-[32px] text-[10px] font-black uppercase tracking-widest shadow-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3">
                <Paperclip className="w-4 h-4" />
                Attach Asset
              </button>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetailsModal;
