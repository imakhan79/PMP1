
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { useApp } from '../store';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  ChevronRight,
  Target,
  Users as UsersIcon,
  ArrowUpRight,
  Zap,
  Activity
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const StatCard: React.FC<{ label: string; value: string | number; trend: string; icon: any; color: string; bgColor: string; delay: number }> = ({ label, value, trend, icon: Icon, color, bgColor, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    whileHover={{ 
      y: -8, 
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      scale: 1.02
    }}
    className="bg-[var(--surface)] p-6 rounded-[32px] border border-[var(--border)] shadow-sm transition-all group relative overflow-hidden"
  >
    {/* Subtle Glow Effect */}
    <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[40px] opacity-10 group-hover:opacity-25 transition-opacity ${color.replace('text', 'bg')}`} />
    
    <div className="flex items-center justify-between mb-6 relative">
      <div className={`p-4 rounded-2xl ${bgColor} shadow-inner transition-transform group-hover:rotate-12`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black tracking-tight text-[var(--text)]">{value}</p>
      </div>
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800 relative">
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${color} animate-pulse`} />
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{trend}</span>
      </div>
      <div className={`p-1 rounded-lg ${bgColor} opacity-0 group-hover:opacity-100 transition-all`}>
        <ArrowUpRight className={`w-4 h-4 ${color}`} />
      </div>
    </div>
  </motion.div>
);

const Dashboard: React.FC = () => {
  const { tasks, projects, users, workspace } = useApp();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    
    return {
      completed: tasks.filter(t => t.status === 'done').length,
      active: tasks.filter(t => t.status !== 'done').length,
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < today && t.status !== 'done').length,
      velocity: 14.5
    };
  }, [tasks]);

  const taskDistributionData = useMemo(() => [
    { name: 'BACKLOG', value: tasks.filter(t => t.status === 'backlog').length, color: '#94a3b8' },
    { name: 'TODO', value: tasks.filter(t => t.status === 'todo').length, color: 'var(--primary)' },
    { name: 'IN PROGRESS', value: tasks.filter(t => t.status === 'in_progress').length, color: '#3b82f6' },
    { name: 'DONE', value: tasks.filter(t => t.status === 'done').length, color: '#10b981' },
  ], [tasks]);

  const workloadData = useMemo(() => users.map(u => ({
    name: u.name.split(' ')[0],
    tasks: tasks.filter(t => t.assigneeId === u.id && t.status !== 'done').length,
    completed: tasks.filter(t => t.assigneeId === u.id && t.status === 'done').length,
  })).slice(0, 5), [tasks, users]);

  const projectHealth = useMemo(() => projects.map(p => {
    const pTasks = tasks.filter(t => t.projectId === p.id);
    const completed = pTasks.filter(t => t.status === 'done').length;
    const progress = pTasks.length > 0 ? (completed / pTasks.length) * 100 : 0;
    return { ...p, progress, taskCount: pTasks.length };
  }), [projects, tasks]);

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 pb-32 overflow-x-hidden">
      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: 'auto' }}
               className="px-3 py-1 bg-[var(--primary)] text-white text-[10px] font-black rounded-full uppercase tracking-widest overflow-hidden shadow-lg shadow-[var(--primary)]/20"
             >
               Workspace pulse
             </motion.div>
             <div className="w-1 h-1 rounded-full bg-slate-300" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Updates</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-[var(--text)]">Control Center</h1>
          <p className="text-slate-500 font-medium max-w-lg">Advanced insights for the next-generation enterprise roadmap.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 shadow-sm hover:shadow-md transition-all">
            <Calendar className="w-4 h-4 text-slate-400" />
            Full History
          </button>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          delay={0.1}
          label="Velocity" 
          value={stats.velocity} 
          trend="+8.2% WEEKLY" 
          icon={TrendingUp} 
          color="text-indigo-600" 
          bgColor="bg-indigo-50 dark:bg-indigo-900/20" 
        />
        <StatCard 
          delay={0.2}
          label="Active Flow" 
          value={stats.active} 
          trend="TASKS IN FLIGHT" 
          icon={Activity} 
          color="text-amber-600" 
          bgColor="bg-amber-50 dark:bg-amber-900/20" 
        />
        <StatCard 
          delay={0.3}
          label="Risk: Overdue" 
          value={stats.overdue} 
          trend="URGENT ATTENTION" 
          icon={AlertCircle} 
          color="text-rose-600" 
          bgColor="bg-rose-50 dark:bg-rose-900/20" 
        />
        <StatCard 
          delay={0.4}
          label="Delivered" 
          value={stats.completed} 
          trend="COMPLETED ITEMS" 
          icon={CheckCircle2} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50 dark:bg-emerald-900/20" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Health Table */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-[var(--surface)] rounded-[40px] border border-[var(--border)] shadow-sm overflow-hidden flex flex-col group"
        >
          <div className="p-8 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:rotate-6 transition-transform">
                <Target className="w-6 h-6 text-slate-500" />
              </div>
              <h2 className="text-2xl font-black text-[var(--text)] tracking-tight">Active Workstreams</h2>
            </div>
            <Link to="/projects" className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest hover:underline p-2 bg-[var(--primary)]/5 rounded-lg">Directory</Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/20">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Key</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Name</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Roadmap Progress</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {projectHealth.slice(0, 5).map((project, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (idx * 0.1) }}
                    key={project.id} 
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group/row"
                  >
                    <td className="px-8 py-5">
                      <span className="text-xs font-black text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-transparent group-hover/row:border-[var(--primary)] transition-all">{project.key}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-[var(--text)] group-hover/row:text-[var(--primary)] transition-colors">{project.name}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden max-w-[140px] shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="bg-gradient-to-r from-[var(--primary)] to-indigo-500 h-full rounded-full shadow-lg" 
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-600 dark:text-slate-400">{Math.round(project.progress)}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 text-slate-400 group-hover/row:text-[var(--primary)] transition-colors">
                        <span className="text-xs font-bold">{project.taskCount}</span>
                        <ChevronRight className="w-4 h-4 group-hover/row:translate-x-1 transition-transform" />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Task Distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-[var(--surface)] p-8 rounded-[40px] border border-[var(--border)] shadow-sm flex flex-col group"
        >
          <h2 className="text-2xl font-black text-[var(--text)] tracking-tight mb-8">Capacity Allocation</h2>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={taskDistributionData} 
                  innerRadius={80} 
                  outerRadius={105} 
                  paddingAngle={10} 
                  dataKey="value"
                  animationDuration={1500}
                >
                  {taskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 'bold' }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-[var(--text)]">{tasks.length}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Items</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {taskDistributionData.map((stat) => (
              <div key={stat.name} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-[var(--border)] transition-all">
                <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: stat.color }} />
                <span className="text-[10px] font-black text-slate-500 truncate uppercase tracking-widest">{stat.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Workload */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[var(--surface)] p-10 rounded-[48px] border border-[var(--border)] shadow-sm"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--primary)]/10 rounded-2xl">
                <UsersIcon className="w-7 h-7 text-[var(--primary)]" />
              </div>
              <h2 className="text-2xl font-black text-[var(--text)] tracking-tight">Team Saturation</h2>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <div className="w-3 h-3 bg-[var(--primary)] rounded-md shadow-sm" />
                <span className="text-slate-500">Active</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <div className="w-3 h-3 bg-emerald-400 rounded-md shadow-sm" />
                <span className="text-slate-500">Done</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'var(--primary)', opacity: 0.05 }}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', background: 'var(--surface)' }}
                />
                <Bar dataKey="tasks" fill="var(--primary)" radius={[8, 8, 0, 0]} barSize={40} />
                <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Task Velocity */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-[var(--surface)] p-10 rounded-[48px] border border-[var(--border)] shadow-sm"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-amber-500/10 rounded-2xl">
              <Zap className="w-7 h-7 text-amber-500" />
            </div>
            <h2 className="text-2xl font-black text-[var(--text)] tracking-tight">Delivery Velocity</h2>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={[
                  { day: 'MON', count: 4 }, { day: 'TUE', count: 7 }, 
                  { day: 'WED', count: 5 }, { day: 'THU', count: 12 }, 
                  { day: 'FRI', count: 18 }, { day: 'SAT', count: 4 }, 
                  { day: 'SUN', count: 2 }
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', background: 'var(--surface)', fontWeight: 'bold' }} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--primary)" 
                  strokeWidth={5}
                  fillOpacity={1} 
                  fill="url(#colorVelocity)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl flex items-center justify-between border border-[var(--border)] shadow-inner">
            <div className="flex items-center gap-4">
              <img src={users[1]?.avatar} className="w-10 h-10 rounded-xl shadow-md border-2 border-white dark:border-slate-800" />
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Top Performer</div>
                <div className="text-sm font-black text-[var(--text)]">{users[1]?.name || 'Jane Dev'}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Throughput</div>
              <div className="text-sm font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg">+24% AVG</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
