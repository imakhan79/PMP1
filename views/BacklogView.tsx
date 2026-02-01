
import React, { useState } from 'react';
import { useApp } from '../store';
import { Task, IssueType, TaskPriority } from '../types';
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
  Play
} from 'lucide-react';

const IssueTypeIcon: React.FC<{ type: IssueType }> = ({ type }) => {
  switch (type) {
    case 'BUG': return <Bug className="w-3.5 h-3.5 text-rose-500" />;
    case 'STORY': return <Bookmark className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />;
    case 'EPIC': return <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />;
    default: return <FileText className="w-3.5 h-3.5 text-blue-500" />;
  }
};

const PriorityIcon: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const colors = {
    URGENT: 'text-rose-600',
    HIGH: 'text-orange-500',
    MEDIUM: 'text-blue-500',
    LOW: 'text-slate-400'
  };
  return <div className={`w-3.5 h-3.5 flex items-center justify-center font-bold text-[10px] ${colors[priority]}`}>
    {priority === 'URGENT' ? '!!' : priority === 'HIGH' ? '!' : '•'}
  </div>
};

const BacklogItem: React.FC<{ task: Task }> = ({ task }) => {
  const { users } = useApp();
  const assignee = users.find(u => u.id === task.assigneeId);

  return (
    <div className="group flex items-center gap-3 p-2 bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
      <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      <IssueTypeIcon type={task.type} />
      <span className="text-[10px] font-bold text-slate-400 w-16">MAR-{task.number}</span>
      <p className="text-sm font-medium text-slate-900 flex-1 truncate">{task.title}</p>
      
      <div className="flex items-center gap-4 px-4">
        {task.estimate && (
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-[10px] font-bold text-slate-600">{task.estimate}</span>
          </div>
        )}
        <PriorityIcon priority={task.priority} />
        <div className="w-6">
          {assignee ? (
            <img src={assignee.avatar} className="w-6 h-6 rounded-full grayscale group-hover:grayscale-0 transition-all" title={assignee.name} />
          ) : (
            <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-300">
              <Plus className="w-2.5 h-2.5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BacklogView: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { tasks, sprints, users } = useApp();
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  const activeSprint = sprints.find(s => s.projectId === projectId && s.status === 'ACTIVE');
  const backlogTasks = projectTasks.filter(t => !t.sprintId);
  const sprintTasks = projectTasks.filter(t => t.sprintId === activeSprint?.id);

  const calculateCapacity = (sprintId: string) => {
    const sTasks = projectTasks.filter(t => t.sprintId === sprintId);
    return sTasks.reduce((acc, t) => acc + (t.estimate || 0), 0);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Active Sprint Section */}
      {activeSprint && (
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChevronDown className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900">{activeSprint.name}</h2>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{new Date(activeSprint.startDate).toLocaleDateString()} - {new Date(activeSprint.endDate).toLocaleDateString()}</span>
              <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Active</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '45%' }} />
                </div>
                <span className="text-[10px] font-bold text-slate-600">{calculateCapacity(activeSprint.id)} pts</span>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                Complete Sprint
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {sprintTasks.map(task => <BacklogItem key={task.id} task={task} />)}
            {sprintTasks.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-sm italic">Drag issues here to plan the sprint</div>
            )}
          </div>
        </section>
      )}

      {/* Backlog Section */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChevronDown className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900">Backlog</h2>
            <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded font-bold">{backlogTasks.length} issues</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Create Issue
            </button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {backlogTasks.map(task => <BacklogItem key={task.id} task={task} />)}
        </div>
      </section>

      {/* Floating Speed Dial / Quick Actions */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3">
        <button className="w-12 h-12 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
          <Play className="w-5 h-5 fill-white" />
        </button>
      </div>
    </div>
  );
};

export default BacklogView;
