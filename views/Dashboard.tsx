
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
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const StatCard: React.FC<{ label: string; value: string | number; trend: string; icon: any; color: string; bgColor: string }> = ({ label, value, trend, icon: Icon, color, bgColor }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-[var(--surface)] p-6 rounded-[32px] border border-[var(--border)] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all group"
  >
    <div className="flex items-center justify-between mb-6">
      <div className={`p-4 rounded-2xl ${bgColor} shadow-sm`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black tracking-tight text-[var(--text)]">{value}</p>
      </div>
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${color} animate-pulse`} />
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{trend}</span>
      </div>
      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--primary)] transition-colors" />
    </div>
  </motion.div>
);

const Dashboard: React.FC = () => {
  const { tasks, projects, users, workspace } = useApp();

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
  })), [tasks, users]);

  const projectHealth = useMemo(() => projects.map(p => {
    const pTasks = tasks.filter(t => t.projectId === p.id);
    const completed = pTasks.filter(t => t.status === 'done').length;
    const progress = pTasks.length > 0 ? (completed / pTasks.length) * 100 : 0;
    return { ...p, progress, taskCount: pTasks.length };
  }), [projects, tasks]);

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-black rounded-full uppercase tracking-widest">Workspace pulse</div>
             <div className="w-1 h-1 rounded-full bg-slate-300" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Refreshed just now</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--text)]">Control Center</h1>
          <p className="text-slate-500 font-medium max-w-lg">Everything you need to stay on top of the engineering roadmap and team performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 shadow-sm hover:shadow-md transition-all">
            <Calendar className="w-4 h-4 text-slate-400" />
            Full History
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          label="Velocity" 
          value={stats.velocity} 
          trend="+8.2% WEEKLY" 
          icon={TrendingUp} 
          color="text-indigo-600" 
          bgColor="bg-indigo-50 dark:bg-indigo-900/20" 
        />
        <StatCard 
          label="Active Flow" 
          value={stats.active} 
          trend="TASKS IN FLIGHT" 
          icon={Activity} 
          color="text-amber-600" 
          bgColor="bg-amber-50 dark:bg-amber-900/20" 
        />
        <StatCard 
          label="Risk: Overdue" 
          value={stats.overdue} 
          trend="URGENT ATTENTION" 
          icon={AlertCircle} 
          color="text-rose-600" 
          bgColor="bg-rose-50 dark:bg-rose-900/20" 
        />
        <StatCard 
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
        <div className="lg:col-span-2 bg-[var(--surface)] rounded-[40px] border border-[var(--border)] shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <Target className="w-5 h-5 text-slate-500" />
              </div>
              <h2 className="text-xl font-black text-[var(--text)] tracking-tight">Active Projects</h2>
            </div>
            <Link to="/projects" className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest hover:underline">Full Directory</Link>
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
                {projectHealth.slice(0, 5).map(project => (
                  <tr key={project.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group">
                    <td className="px-8 py-5">
                      <span className="text-xs font-black text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">{project.key}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-[var(--text)]">{project.name}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden max-w-[140px]">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            className="bg-[var(--primary)] h-full rounded-full shadow-sm" 
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-600 dark:text-slate-400">{Math.round(project.progress)}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 text-slate-400">
                        <span className="text-xs font-bold">{project.taskCount}</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-[var(--surface)] p-8 rounded-[40px] border border-[var(--border)] shadow-sm flex flex-col">
          <h2 className="text-xl font-black text-[var(--text)] tracking-tight mb-8">Capacity Allocation</h2>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={taskDistributionData} 
                  innerRadius={70} 
                  outerRadius={95} 
                  paddingAngle={8} 
                  dataKey="value"
                  animationDuration={1500}
                >
                  {taskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', background: 'var(--surface)', color: 'var(--text)' }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-[var(--text)]">{tasks.length}</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Items</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {taskDistributionData.map((stat) => (
              <div key={stat.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
                <span className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-widest">{stat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Workload */}
        <div className="bg-[var(--surface)] p-8 rounded-[40px] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <UsersIcon className="w-6 h-6 text-[var(--primary)]" />
              <h2 className="text-xl font-black text-[var(--text)] tracking-tight">Team Saturation</h2>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[var(--primary)] rounded-md" />
                <span className="text-slate-500">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-md" />
                <span className="text-slate-500">Done</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'var(--primary)', opacity: 0.05 }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', background: 'var(--surface)' }}
                />
                <Bar dataKey="tasks" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={32} />
                <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Velocity */}
        <div className="bg-[var(--surface)] p-8 rounded-[40px] border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <Zap className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-black text-[var(--text)] tracking-tight">Delivery Velocity</h2>
          </div>
          <div className="h-[300px]">
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
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', background: 'var(--surface)' }} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--primary)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorVelocity)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl flex items-center justify-between border border-[var(--border)]">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Top Performer</div>
              <div className="text-sm font-black text-[var(--text)]">{users[1]?.name || 'Jane Dev'}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Throughput</div>
              <div className="text-sm font-black text-emerald-500">+24% AVG</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
