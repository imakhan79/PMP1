
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
  ChevronDown
} from 'lucide-react';

const StatusIcon: React.FC<{ status: TaskStatus; onClick?: () => void }> = ({ status, onClick }) => {
  const icons = {
    BACKLOG: <Circle className="w-5 h-5 text-slate-300" />,
    TODO: <Circle className="w-5 h-5 text-slate-400" />,
    IN_PROGRESS: <Clock className="w-5 h-5 text-indigo-500" />,
    REVIEW: <AlertCircle className="w-5 h-5 text-amber-500" />,
    DONE: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  };
  return <button onClick={onClick} className="hover:scale-110 transition-transform">{icons[status]}</button>;
};

const PriorityTag: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const styles = {
    LOW: 'text-slate-500 bg-slate-100',
    MEDIUM: 'text-blue-600 bg-blue-50',
    HIGH: 'text-orange-600 bg-orange-50',
    URGENT: 'text-red-600 bg-red-50',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight ${styles[priority]}`}>
      {priority}
    </span>
  );
};

const MyTasks: React.FC = () => {
  const { tasks, currentUser, projects, updateTask } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ACTIVE' | 'DONE' | 'ALL'>('ACTIVE');

  const myTasks = useMemo(() => {
    return tasks.filter(t => {
      const isMine = t.assigneeId === currentUser.id;
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = 
        filterStatus === 'ALL' ? true :
        filterStatus === 'DONE' ? t.status === 'DONE' :
        t.status !== 'DONE';
      return isMine && matchesSearch && matchesStatus;
    });
  }, [tasks, currentUser.id, search, filterStatus]);

  const handleToggleStatus = (task: Task) => {
    const statusOrder: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = currentIndex === -1 || currentIndex === statusOrder.length - 1 
      ? statusOrder[0] 
      : statusOrder[currentIndex + 1];
    updateTask(task.id, { status: nextStatus });
  };

  const isOverdue = (date?: string) => {
    if (!date) return false;
    return new Date(date) < new Date() && new Date(date).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
          <p className="text-sm text-slate-500">Manage your personal workload across all projects.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {(['ACTIVE', 'DONE', 'ALL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 -mb-[2px] ${
              filterStatus === tab 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
            <span className="ml-2 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
              {tasks.filter(t => {
                const isMine = t.assigneeId === currentUser.id;
                if (tab === 'ALL') return isMine;
                if (tab === 'DONE') return isMine && t.status === 'DONE';
                return isMine && t.status !== 'DONE';
              }).length}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {myTasks.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {myTasks.map((task) => {
              const project = projects.find(p => p.id === task.projectId);
              return (
                <div key={task.id} className="group flex flex-col md:flex-row md:items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <StatusIcon status={task.status} onClick={() => handleToggleStatus(task)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{project?.key}-{task.number}</span>
                        <PriorityTag priority={task.priority} />
                      </div>
                      <h3 className={`text-sm font-medium truncate ${task.status === 'DONE' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {task.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pl-9 md:pl-0">
                    {task.dueDate && (
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue(task.dueDate) ? 'text-rose-500' : 'text-slate-500'}`}>
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    )}
                    
                    <div className="hidden lg:flex items-center gap-2">
                      {task.labels.map(l => (
                        <span key={l} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                          {l}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24 hidden md:block">
                        <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Project</div>
                        <div className="text-xs font-semibold text-slate-600 truncate">{project?.name}</div>
                      </div>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-slate-200" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
            <p className="text-slate-500 max-w-xs mt-1">
              You don't have any {filterStatus.toLowerCase()} tasks assigned to you matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
