
import React, { useState } from 'react';
import { useApp } from '../store';
import { Task, TaskPriority, TaskStatus } from '../types';
import { 
  Plus, Search, Filter, MoreHorizontal, Calendar, 
  Hash, Layout, User, ChevronRight, Bookmark, Bug, FileText, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const styles = {
    LOW: 'text-slate-500 bg-slate-100',
    MEDIUM: 'text-blue-600 bg-blue-50',
    HIGH: 'text-orange-600 bg-orange-50',
    URGENT: 'text-rose-600 bg-rose-50',
  };
  return <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${styles[priority]}`}>{priority}</span>;
};

const ListView: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { tasks, projects, users, updateTask } = useApp();
  const [search, setSearch] = useState('');
  
  const project = projects.find(p => p.id === projectId);
  const projectTasks = tasks.filter(t => t.projectId === projectId && t.title.toLowerCase().includes(search.toLowerCase()));

  if (!project) return null;

  return (
    <div className="p-8 lg:p-12 space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search items..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all shadow-inner" 
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[var(--primary)] transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-[var(--surface)] rounded-[40px] border border-[var(--border)] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-900/20 border-b border-[var(--border)]">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Key</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignee</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            <AnimatePresence>
              {projectTasks.map((task, idx) => {
                const assignee = users.find(u => u.id === task.assigneeId);
                return (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    key={task.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 group cursor-pointer transition-colors"
                  >
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">{project.key}-{task.number}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        {task.type === 'BUG' && <Bug className="w-4 h-4 text-rose-500" />}
                        {task.type === 'STORY' && <Bookmark className="w-4 h-4 text-emerald-500" />}
                        {task.type === 'TASK' && <FileText className="w-4 h-4 text-blue-500" />}
                        <span className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{task.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <select 
                        value={task.status} 
                        onChange={(e) => updateTask(task.id, { status: e.target.value })}
                        className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer text-slate-600 hover:text-[var(--primary)]"
                      >
                        {project.workflow.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
                      </select>
                    </td>
                    <td className="px-8 py-5">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-8 py-5">
                      {assignee ? (
                        <div className="flex items-center gap-2">
                          <img src={assignee.avatar} className="w-6 h-6 rounded-lg shadow-sm" />
                          <span className="text-xs font-bold text-slate-600">{assignee.name}</span>
                        </div>
                      ) : <span className="text-xs text-slate-300">Unassigned</span>}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Set Date'}</span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
        {projectTasks.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;
