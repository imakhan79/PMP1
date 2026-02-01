
import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { Task, TaskStatus, TaskPriority } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar,
  ChevronRight,
  Hash,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StatusIcon: React.FC<{ status: TaskStatus; onClick?: () => void }> = ({ status, onClick }) => {
  const s = status.toUpperCase();
  const icons: Record<string, React.ReactNode> = {
    BACKLOG: <Circle className="w-5 h-5 text-slate-300" />,
    TODO: <Circle className="w-5 h-5 text-slate-400" />,
    IN_PROGRESS: <Clock className="w-5 h-5 text-[var(--primary)]" />,
    REVIEW: <AlertCircle className="w-5 h-5 text-amber-500" />,
    DONE: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  };
  return <button onClick={(e) => { e.stopPropagation(); onClick?.(); }} className="hover:scale-125 transition-transform active:scale-95">{icons[s] || icons.TODO}</button>;
};

const PriorityTag: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const styles = {
    LOW: 'text-slate-500 bg-slate-100 dark:bg-slate-800',
    MEDIUM: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    HIGH: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
    URGENT: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20',
  };
  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${styles[priority]}`}>
      {priority}
    </span>
  );
};

const MyTasks: React.FC = () => {
  const { tasks, currentUser, projects, updateTask } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ACTIVE' | 'DONE' | 'ALL'>('ACTIVE');

  const myTasks = useMemo(() => {
    if (!currentUser) return [];
    return tasks.filter(t => {
      const isMine = t.assigneeId === currentUser.id;
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = 
        filterStatus === 'ALL' ? true :
        filterStatus === 'DONE' ? t.status.toLowerCase() === 'done' :
        t.status.toLowerCase() !== 'done';
      return isMine && matchesSearch && matchesStatus;
    });
  }, [tasks, currentUser, search, filterStatus]);

  const handleToggleStatus = (task: Task) => {
    const statusOrder = ['todo', 'in_progress', 'review', 'done'];
    const current = task.status.toLowerCase();
    const currentIndex = statusOrder.indexOf(current);
    const nextStatus = currentIndex === -1 || currentIndex === statusOrder.length - 1 
      ? statusOrder[0] 
      : statusOrder[currentIndex + 1];
    updateTask(task.id, { status: nextStatus });
  };

  const handleTaskClick = (task: Task) => {
    navigate(`/projects/${task.projectId}`);
  };

  if (!currentUser) return null;

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-10 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-black rounded-full uppercase tracking-widest">Personal Queue</div>
             <div className="w-1 h-1 rounded-full bg-slate-300" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sorted by priority</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--text)]">My Work</h1>
          <p className="text-slate-500 font-medium">Focus on what matters most. Your daily mission starts here.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl text-slate-400 hover:text-[var(--primary)] transition-all shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Modern Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl w-fit">
        {(['ACTIVE', 'DONE', 'ALL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`relative px-6 py-2 text-xs font-black uppercase tracking-widest transition-all rounded-xl ${
              filterStatus === tab 
                ? 'text-[var(--primary)] shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {tab}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${filterStatus === tab ? 'bg-[var(--primary)]/10' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                {tasks.filter(t => {
                  const isMine = t.assigneeId === currentUser.id;
                  if (tab === 'ALL') return isMine;
                  if (tab === 'DONE') return isMine && t.status.toLowerCase() === 'done';
                  return isMine && t.status.toLowerCase() !== 'done';
                }).length}
              </span>
            </span>
            {filterStatus === tab && (
              <motion.div 
                layoutId="mytasks-tabs"
                className="absolute inset-0 bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm"
              />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {myTasks.length > 0 ? (
            myTasks.map((task) => {
              const project = projects.find(p => p.id === task.projectId);
              return (
                <motion.div 
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => handleTaskClick(task)}
                  className="group bg-[var(--surface)] p-5 rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-black/40 transition-all flex flex-col md:flex-row md:items-center gap-6 cursor-pointer"
                >
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <StatusIcon status={task.status} onClick={() => handleToggleStatus(task)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Hash className="w-3 h-3" />
                          {project?.key}-{task.number}
                        </div>
                        <PriorityTag priority={task.priority} />
                      </div>
                      <h3 className={`text-base font-black tracking-tight truncate ${task.status.toLowerCase() === 'done' ? 'text-slate-400 line-through' : 'text-[var(--text)]'}`}>
                        {task.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 pl-10 md:pl-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50 dark:border-slate-800">
                    {task.dueDate && (
                      <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${new Date(task.dueDate) < new Date() && task.status.toLowerCase() !== 'done' ? 'text-rose-500' : 'text-slate-400'}`}>
                        <Calendar className="w-4 h-4" />
                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    )}
                    
                    <div className="hidden lg:flex items-center gap-2">
                      <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-2">
                        <Layout className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest truncate max-w-[100px]">{project?.name}</span>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); }}
                      className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--primary)] transition-all"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-[40px] flex items-center justify-center shadow-inner relative overflow-hidden">
                <CheckCircle2 className="w-10 h-10 text-[var(--primary)] opacity-20" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/20 to-transparent"
                />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">Mission Accomplished</h3>
                <p className="text-slate-500 font-medium max-w-xs mt-2">
                  No {filterStatus.toLowerCase()} tasks found in your queue. Take a well-deserved breather.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyTasks;
