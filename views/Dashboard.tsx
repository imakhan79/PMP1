
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
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard: React.FC<{ label: string; value: string | number; description: string; icon: any; color: string; bgColor: string }> = ({ label, value, description, icon: Icon, color, bgColor }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2.5 rounded-xl ${bgColor}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <button className="text-slate-300 group-hover:text-slate-600 transition-colors">
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </div>
    <div className="space-y-1">
      <h3 className="text-slate-500 text-sm font-medium">{label}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{description}</span>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { tasks, projects, users } = useApp();

  // Memoized calculations for performance
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    
    return {
      completed: tasks.filter(t => t.status === 'DONE').length,
      active: tasks.filter(t => t.status !== 'DONE').length,
      highPriority: tasks.filter(t => (t.priority === 'HIGH' || t.priority === 'URGENT') && t.status !== 'DONE').length,
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < today && t.status !== 'DONE').length,
      dueSoon: tasks.filter(t => {
        if (!t.dueDate || t.status === 'DONE') return false;
        const due = new Date(t.dueDate);
        const diff = due.getTime() - today.getTime();
        return diff >= 0 && diff <= 48 * 60 * 60 * 1000; // 48 hours
      }).length
    };
  }, [tasks]);

  const taskDistributionData = useMemo(() => [
    { name: 'Backlog', value: tasks.filter(t => t.status === 'BACKLOG').length, color: '#94a3b8' },
    { name: 'To Do', value: tasks.filter(t => t.status === 'TODO').length, color: '#6366f1' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'IN_PROGRESS').length, color: '#3b82f6' },
    { name: 'Review', value: tasks.filter(t => t.status === 'REVIEW').length, color: '#f59e0b' },
    { name: 'Done', value: tasks.filter(t => t.status === 'DONE').length, color: '#10b981' },
  ], [tasks]);

  const workloadData = useMemo(() => users.map(u => ({
    name: u.name.split(' ')[0],
    tasks: tasks.filter(t => t.assigneeId === u.id && t.status !== 'DONE').length,
    completed: tasks.filter(t => t.assigneeId === u.id && t.status === 'DONE').length,
  })), [tasks, users]);

  const projectHealth = useMemo(() => projects.map(p => {
    const pTasks = tasks.filter(t => t.projectId === p.id);
    const completed = pTasks.filter(t => t.status === 'DONE').length;
    const progress = pTasks.length > 0 ? (completed / pTasks.length) * 100 : 0;
    return { ...p, progress, taskCount: pTasks.length };
  }), [projects, tasks]);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workspace Overview</h1>
          <p className="text-sm text-slate-500">Real-time pulse of your engineering and product teams.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Last 30 Days
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Completed Tasks" 
          value={stats.completed} 
          description="lifetime" 
          icon={CheckCircle2} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50" 
        />
        <StatCard 
          label="Active Load" 
          value={stats.active} 
          description="tasks in flight" 
          icon={Clock} 
          color="text-indigo-600" 
          bgColor="bg-indigo-50" 
        />
        <StatCard 
          label="Risk: Overdue" 
          value={stats.overdue} 
          description="immediate action" 
          icon={AlertCircle} 
          color="text-rose-600" 
          bgColor="bg-rose-50" 
        />
        <StatCard 
          label="Efficiency" 
          value="92%" 
          description="+4% vs last month" 
          icon={TrendingUp} 
          color="text-amber-600" 
          bgColor="bg-amber-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Progress Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              Project Health
            </h2>
            <Link to="/projects" className="text-xs font-bold text-indigo-600 hover:underline">View All Projects</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projectHealth.slice(0, 5).map(project => (
                  <tr key={project.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs">
                          {project.key}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{project.name}</div>
                          <div className="text-[10px] text-slate-500 uppercase font-medium">{project.status}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[120px]">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-600">{Math.round(project.progress)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-semibold text-slate-500">{project.taskCount} tasks</span>
                      <button className="ml-4 text-slate-300 group-hover:text-indigo-600">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task Status Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Task Distribution</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={taskDistributionData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                  animationDuration={1000}
                >
                  {taskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {taskDistributionData.map((stat) => (
              <div key={stat.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }} />
                <span className="text-[11px] font-medium text-slate-500 truncate">{stat.name}: <span className="font-bold text-slate-900">{stat.value}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Workload Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-indigo-500" />
              Team Workload
            </h2>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-indigo-600 rounded-sm" />
                <span className="text-slate-500">Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-emerald-400 rounded-sm" />
                <span className="text-slate-500">Done</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'none' }}
                />
                <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} name="Active Tasks" />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} name="Completed Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Performance Area Chart (Simulated) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Task Velocity</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={[
                  { day: 'Mon', count: 4 }, { day: 'Tue', count: 7 }, 
                  { day: 'Wed', count: 5 }, { day: 'Thu', count: 9 }, 
                  { day: 'Fri', count: 12 }, { day: 'Sat', count: 3 }, 
                  { day: 'Sun', count: 2 }
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorVelocity)" 
                  name="Tasks Resolved"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-slate-50 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Performer</div>
              <div className="text-sm font-bold text-slate-900">{users[1]?.name || 'Jane Dev'}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Output</div>
              <div className="text-sm font-bold text-emerald-600">+12% vs Avg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
