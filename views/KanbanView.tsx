
import React, { useState } from 'react';
import { useApp } from '../store';
import { Task, TaskPriority, IssueType } from '../types';
import { 
  MoreVertical, Plus, Clock, MessageSquare, 
  Calendar, Users, Layers, AlertCircle,
  Tag, 
  Bug,
  FileText,
  Bookmark,
  Zap
} from 'lucide-react';

type SwimlaneType = 'ASSIGNEE' | 'EPIC' | 'PRIORITY' | 'NONE';

const IssueTypeIcon: React.FC<{ type: IssueType }> = ({ type }) => {
  switch (type) {
    case 'BUG': return <Bug className="w-3.5 h-3.5 text-rose-500" />;
    case 'STORY': return <Bookmark className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />;
    case 'EPIC': return <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />;
    default: return <FileText className="w-3.5 h-3.5 text-blue-500" />;
  }
};

const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const colors = {
    LOW: 'bg-slate-100 text-slate-600',
    MEDIUM: 'bg-blue-100 text-blue-600',
    HIGH: 'bg-orange-100 text-orange-600',
    URGENT: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${colors[priority]}`}>
      {priority}
    </span>
  );
};

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const { users, tasks } = useApp();
  const assignee = users.find(u => u.id === task.assigneeId);
  const epic = task.epicId ? tasks.find(t => t.id === task.epicId) : null;

  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <IssueTypeIcon type={task.type} />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            MAR-{task.number}
          </span>
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      <h3 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2 leading-snug">
        {task.title}
      </h3>

      {epic && (
        <div className="mb-2">
          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
            {epic.title}
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {task.labels.map(label => (
          <span key={label} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
            {label}
          </span>
        ))}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
            <Calendar className="w-2.5 h-2.5" />
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span className="text-[10px]">2</span>
          </div>
          {task.estimate && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
              <span className="text-[9px] font-bold">{task.estimate}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
           {assignee && (
            <img src={assignee.avatar} className="w-6 h-6 rounded-full border border-white ring-1 ring-slate-100" alt={assignee.name} />
          )}
        </div>
      </div>
    </div>
  );
};

const KanbanView: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { tasks, projects, users } = useApp();
  const [swimlaneType, setSwimlaneType] = useState<SwimlaneType>('NONE');
  
  const project = projects.find(p => p.id === projectId);
  if (!project) return null;

  const projectTasks = tasks.filter(t => t.projectId === projectId);
  const epics = projectTasks.filter(t => t.type === 'EPIC');

  const getSwimlanes = () => {
    switch (swimlaneType) {
      case 'ASSIGNEE': return users.filter(u => project.members.includes(u.id)).map(u => ({ id: u.id, label: u.name }));
      case 'EPIC': return epics.map(e => ({ id: e.id, label: e.title }));
      case 'PRIORITY': return (['URGENT', 'HIGH', 'MEDIUM', 'LOW'] as TaskPriority[]).map(p => ({ id: p, label: p }));
      default: return [{ id: 'all', label: 'All Tasks' }];
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Board Controls */}
      <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Group by:</span>
            <select 
              value={swimlaneType} 
              onChange={(e) => setSwimlaneType(e.target.value as SwimlaneType)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="NONE">None</option>
              <option value="ASSIGNEE">Assignee</option>
              <option value="EPIC">Epic</option>
              <option value="PRIORITY">Priority</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
            <Zap className="w-3.5 h-3.5" /> Automations
          </button>
        </div>
      </div>

      {/* Board Columns */}
      <div className="flex-1 overflow-x-auto custom-scrollbar flex p-4 lg:p-6 gap-6">
        {project.workflow.map(col => (
          <div key={col.id} className="w-72 shrink-0 flex flex-col">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-widest">{col.label}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  col.wipLimit && projectTasks.filter(t => t.status === col.id).length > col.wipLimit
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-slate-200 text-slate-600'
                }`}>
                  {projectTasks.filter(t => t.status === col.id).length}
                  {col.wipLimit ? ` / ${col.wipLimit}` : ''}
                </span>
                {col.wipLimit && projectTasks.filter(t => t.status === col.id).length > col.wipLimit && (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                )}
              </div>
              <button className="p-1 hover:bg-slate-200 rounded text-slate-400">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Swimlanes Rendering */}
            <div className="flex-1 space-y-8 pb-4">
              {getSwimlanes().map(lane => {
                const laneTasks = projectTasks.filter(t => {
                  const statusMatch = t.status === col.id;
                  if (swimlaneType === 'NONE') return statusMatch;
                  if (swimlaneType === 'ASSIGNEE') return statusMatch && t.assigneeId === lane.id;
                  if (swimlaneType === 'EPIC') return statusMatch && t.epicId === lane.id;
                  if (swimlaneType === 'PRIORITY') return statusMatch && t.priority === lane.id;
                  return false;
                });

                if (laneTasks.length === 0 && swimlaneType !== 'NONE') return null;

                return (
                  <div key={lane.id} className="space-y-3">
                    {swimlaneType !== 'NONE' && (
                      <div className="flex items-center gap-2 mb-2 border-b border-slate-200 pb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{lane.label}</span>
                      </div>
                    )}
                    <div className="space-y-3">
                      {laneTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanView;
