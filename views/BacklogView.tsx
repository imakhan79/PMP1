
import React, { useState } from 'react';
import { useApp } from '../store';
// Fix: Use TaskType instead of non-existent IssueType
import { Task, TaskType, TaskPriority } from '../types';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  MoreHorizontal, 
  GripVertical,
  Zap,
  Bookmark,
  Bug,
  FileText,
  Clock,
  Play,
  Target,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix: Use TaskType instead of non-existent IssueType
const IssueTypeIcon: React.FC<{ type: TaskType }> = ({ type }) => {
  switch (type) {
    case 'BUG': return <Bug className="w-4 h-4 text-rose-500" />;
    case 'STORY': return <Bookmark className="w-4 h-4 text-emerald-500 fill-emerald-500" />;
    case 'EPIC': return <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />;
    default: return <FileText className="w-4 h-4 text-blue-500" />;
  }
};

const PriorityIcon: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const colors = {
    URGENT: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20',
    HIGH: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
    MEDIUM: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    LOW: 'text-slate-400 bg-slate-100 dark:bg-slate-800'
  };
  return (
    <div className={`w-6 h-6 flex items-center justify-center rounded-md font-black text-[10px] ${colors[priority]}`}>
      {priority.charAt(0)}
    </div>
  );
};

const BacklogItem: React.FC<{ task: Task; projectKey: string }> = ({ task, projectKey }) => {
  const { users } = useApp();
  const assignee = users.find(u => u.id === task.assigneeId);

  return (
    <motion.div 
      whileHover={{ scale: 1.005, x: 4 }}
      className="group flex items-center gap-4 p-3 bg-[var(--surface)] border-b border-[var(--border)] hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all cursor-pointer"
    >
      <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      <IssueTypeIcon type={task.type} />
      <span className="text-[10px] font-black text-slate-400 w-16 uppercase tracking-widest">{projectKey}-{task.number}</span>
      <p className="text-sm font-bold text-[var(--text)] flex-1 truncate tracking-tight">{task.title}</p>
      
      <div className="flex items-center gap-5 px-4">
        {task.estimate && (
          <div className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-[var(--border)] shadow-sm">
            <span className="text-[10px] font-black text-slate-600 dark:text-slate-400">{task.estimate}</span>
          </div>
        )}
        <PriorityIcon priority={task.priority} />
        <div className="w-7 h-7">
          {assignee ? (
            <img src={assignee.avatar} className="w-7 h-7 rounded-xl shadow-sm border border-white dark:border-slate-800" title={assignee.name} />
          ) : (
            <div className="w-7 h-7 rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300">
              <Plus className="w-3 h-3" />
            </div>
          )}
        </div>
        <button className="p-1.5 rounded-lg text-slate-300 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const BacklogView: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { tasks, sprints, projects } = useApp();
  const project = projects.find(p => p.id === projectId);
  if (!project) return null;

  const projectTasks = tasks.filter(t => t.projectId === projectId);
  const activeSprint = sprints.find(s => s.projectId === projectId && s.status === 'ACTIVE');
  const backlogTasks = projectTasks.filter(t => !t.sprintId);
  const sprintTasks = projectTasks.filter(t => t.sprintId === activeSprint?.id);

  const calculateCapacity = (sprintId: string) => {
    const sTasks = projectTasks.filter(t => t.sprintId === sprintId);
    return sTasks.reduce((acc, t) => acc + (t.estimate || 0), 0);
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-black rounded-full uppercase tracking-widest">Planning Mode</div>
             <div className="w-1 h-1 rounded-full bg-slate-300" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Drag to prioritize</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--text)]">Work Backlog</h1>
          <p className="text-slate-500 font-medium">Map out your roadmap, estimate items, and plan upcoming sprints.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 shadow-sm hover:shadow-md transition-all">
            <Target className="w-4 h-4 text-slate-400" />
            Sprint Settings
          </button>
        </div>
      </header>

      {/* Active Sprint Section */}
      {activeSprint && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--surface)] rounded-[32px] border border-[var(--border)] overflow-hidden shadow-sm"
        >
          <div className="bg-slate-50/50 dark:bg-slate-900/30 p-6 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-[var(--primary)] text-white rounded-xl shadow-lg shadow-[var(--primary)]/20">
                <Play className="w-4 h-4 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-black text-[var(--text)] tracking-tight">{activeSprint.name}</h2>
                  <span className="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest">Active</span>
                </div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">
                  {new Date(activeSprint.startDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} — {new Date(activeSprint.endDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity</span>
                  <span className="text-sm font-black text-[var(--text)]">{calculateCapacity(activeSprint.id)} pts</span>
                </div>
                <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    className="h-full bg-emerald-500 shadow-sm" 
                  />
                </div>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-[var(--border)] px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                Finish Sprint
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {sprintTasks.map(task => <BacklogItem key={task.id} task={task} projectKey={project.key} />)}
            {sprintTasks.length === 0 && (
              <div className="p-16 text-center text-slate-400 space-y-2">
                <p className="text-sm font-bold">This sprint is currently empty</p>
                <p className="text-xs">Drag and drop tasks from the backlog to begin planning.</p>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Backlog Section */}
      <section className="bg-[var(--surface)] rounded-[32px] border border-[var(--border)] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-slate-50/20">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[var(--text)] tracking-tight">Master Backlog</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{backlogTasks.length} unassigned items</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-[10px] font-black text-[var(--primary)] bg-[var(--primary)]/5 px-5 py-2.5 rounded-xl hover:bg-[var(--primary)]/10 transition-all">
              <Plus className="w-4 h-4" /> Create Task
            </button>
          </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <AnimatePresence>
            {backlogTasks.map((task, idx) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
              >
                <BacklogItem task={task} projectKey={project.key} />
              </motion.div>
            ))}
          </AnimatePresence>
          {backlogTasks.length === 0 && (
            <div className="p-24 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-[32px] flex items-center justify-center">
                <Zap className="w-8 h-8 text-[var(--primary)] opacity-10" />
              </div>
              <h3 className="text-xl font-black tracking-tight">Inbox Zero</h3>
              <p className="text-sm text-slate-500 font-medium max-w-xs">The backlog is completely empty. Time to capture some new requirements.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Action Overlay */}
      <div className="fixed bottom-12 right-12 z-40">
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-[var(--primary)] text-white rounded-2xl shadow-2xl flex items-center justify-center group"
        >
          <Zap className="w-6 h-6 fill-white group-hover:scale-125 transition-transform" />
        </motion.button>
      </div>
    </div>
  );
};

export default BacklogView;
