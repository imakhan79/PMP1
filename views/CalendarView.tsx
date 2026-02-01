
import React from 'react';
import { useApp } from '../store';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Hash } from 'lucide-react';

const CalendarView: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { tasks, projects } = useApp();
  const project = projects.find(p => p.id === projectId);
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Basic mock calendar logic: Get 30 days starting from 1st of current month
  const daysInMonth = 31; 
  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const d = new Date(currentYear, currentMonth, i + 1);
    return {
      date: d,
      tasks: tasks.filter(t => t.projectId === projectId && t.dueDate && new Date(t.dueDate).toDateString() === d.toDateString())
    };
  });

  return (
    <div className="p-8 lg:p-12 space-y-12 pb-32">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-black tracking-tight">{today.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><ChevronLeft className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <button className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest bg-[var(--primary)]/5 px-4 py-2 rounded-xl">Today</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {days.map((day, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.01 }}
            key={idx} 
            className={`min-h-[160px] p-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] flex flex-col gap-3 group hover:border-[var(--primary)]/50 transition-all ${day.date.toDateString() === today.toDateString() ? 'ring-2 ring-[var(--primary)] shadow-xl shadow-[var(--primary)]/10' : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase tracking-widest ${day.date.toDateString() === today.toDateString() ? 'text-[var(--primary)]' : 'text-slate-400'}`}>
                {day.date.getDate()} {day.date.toLocaleString('default', { weekday: 'short' }).toUpperCase()}
              </span>
              {day.tasks.length > 0 && <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />}
            </div>
            
            <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto custom-scrollbar pr-1">
              {day.tasks.map(task => (
                <div key={task.id} className="p-2 bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-xl text-[9px] font-bold text-slate-700 dark:text-slate-300 truncate hover:bg-[var(--primary)] hover:text-white transition-all cursor-pointer">
                  <span className="opacity-50 mr-1">{project?.key}-{task.number}</span>
                  {task.title}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
