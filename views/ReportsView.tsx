
import React, { useMemo } from 'react';
import { useApp } from '../store';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, Zap, Target, Activity, FileText } from 'lucide-react';

const ReportsView: React.FC = () => {
  const { tasks, users, projects, timeEntries } = useApp();

  const workloadData = useMemo(() => users.map(u => ({
    name: u.name,
    logged: timeEntries.filter(te => te.userId === u.id).reduce((acc, te) => acc + te.duration, 0) / 60,
    tasks: tasks.filter(t => t.assigneeId === u.id && t.status !== 'done').length
  })), [users, timeEntries, tasks]);

  const completionTrend = [
    { week: 'W1', count: 5 }, { week: 'W2', count: 8 }, { week: 'W3', count: 12 }, { week: 'W4', count: 15 }, { week: 'W5', count: 24 }
  ];

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 pb-32">
      <header className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Intelligence Reports</h1>
        <p className="text-slate-500 font-medium">Data-driven insights into team velocity and project health.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Productivity Log */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--surface)] p-8 rounded-[40px] border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-[var(--primary)]/10 rounded-2xl text-[var(--primary)]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Efficiency Trend</h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={completionTrend}>
                <defs>
                  <linearGradient id="colorReport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" hide />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={4} fill="url(#colorReport)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Workload */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[var(--surface)] p-8 rounded-[40px] border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Team Saturation</h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fontStyle: 'bold' }} />
                <Tooltip />
                <Bar dataKey="logged" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-slate-900 text-white rounded-[40px] shadow-xl relative overflow-hidden group">
          <Activity className="absolute bottom-[-10%] right-[-10%] w-32 h-32 opacity-10 group-hover:scale-125 transition-transform" />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Throughput</p>
          <h3 className="text-4xl font-black">2.4<span className="text-xl opacity-50">x</span></h3>
          <p className="text-xs font-bold mt-4 text-emerald-400">+12% from last cycle</p>
        </div>
        <div className="p-8 bg-[var(--surface)] border border-[var(--border)] rounded-[40px] shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Cycle Time</p>
          <h3 className="text-4xl font-black">4.2d</h3>
          <p className="text-xs font-bold mt-4 text-slate-500">Avg time to Done</p>
        </div>
        <div className="p-8 bg-[var(--surface)] border border-[var(--border)] rounded-[40px] shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Logged</p>
          <h3 className="text-4xl font-black">164h</h3>
          <p className="text-xs font-bold mt-4 text-[var(--primary)]">Productive focus time</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
