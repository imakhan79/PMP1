
import React from 'react';
import { LayoutGrid, List, Calendar, GanttChartSquare, Info, Star, MoreHorizontal, Settings, Layers } from 'lucide-react';
import { Project } from '../types';
import { Link, useLocation } from 'react-router-dom';

const ProjectHeader: React.FC<{ project: Project }> = ({ project }) => {
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { label: 'Kanban', icon: LayoutGrid, href: `/projects/${project.id}` },
    { label: 'Backlog', icon: Layers, href: `/projects/${project.id}/backlog` },
    { label: 'List', icon: List, href: `/projects/${project.id}/list` },
    { label: 'Calendar', icon: Calendar, href: `/projects/${project.id}/calendar` },
    { label: 'Wiki', icon: Info, href: `/projects/${project.id}/wiki` },
    { label: 'Settings', icon: Settings, href: `/projects/${project.id}/settings` },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="px-4 lg:px-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-bold text-lg">
              {project.key}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg lg:text-xl font-bold text-slate-900 truncate">{project.name}</h1>
                <button className="text-slate-400 hover:text-yellow-400 shrink-0">
                  <Star className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500 truncate">Workspace: Engineering Hub</p>
            </div>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-2">
            <div className="flex -space-x-2 mr-2">
              {project.members.slice(0, 3).map((mId, i) => (
                <img 
                  key={i} 
                  src={`https://i.pravatar.cc/150?u=${mId}`} 
                  className="w-7 h-7 lg:w-8 lg:h-8 rounded-full border-2 border-white ring-1 ring-slate-200" 
                  alt="member" 
                />
              ))}
              {project.members.length > 3 && (
                <button className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-slate-50 border-2 border-white ring-1 ring-slate-200 flex items-center justify-center text-slate-400 text-[10px] font-medium">
                  +{project.members.length - 3}
                </button>
              )}
            </div>
            <div className="h-6 w-px bg-slate-200 mx-1" />
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-4 lg:gap-6 overflow-x-auto custom-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
          {tabs.map((tab) => {
            const isActive = path === tab.href;
            return (
              <Link
                key={tab.label}
                to={tab.href}
                className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${isActive ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
