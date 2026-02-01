
import React from 'react';
import { LayoutGrid, List, Calendar, Info, Star, MoreHorizontal, Settings, Layers, ChevronRight } from 'lucide-react';
import { Project } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    <div className="bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-20">
      <div className="px-6 lg:px-8 pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-12 h-12 shrink-0 bg-[var(--primary)] text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-[var(--primary)]/20"
            >
              {project.key}
            </motion.div>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Projects</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
                <button className="text-slate-300 hover:text-amber-400 transition-colors">
                  <Star className="w-4 h-4" />
                </button>
              </div>
              <h1 className="text-2xl font-black text-[var(--text)] truncate tracking-tight">{project.name}</h1>
            </div>
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-4">
            <div className="flex -space-x-3 hover:space-x-1 transition-all">
              {project.members.slice(0, 4).map((mId, i) => (
                <motion.img 
                  key={i} 
                  whileHover={{ y: -4, zIndex: 10 }}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mId}`} 
                  className="w-9 h-9 rounded-xl border-2 border-[var(--surface)] shadow-sm cursor-pointer" 
                  alt="member" 
                />
              ))}
              {project.members.length > 4 && (
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-[var(--surface)] flex items-center justify-center text-slate-500 text-[10px] font-black shadow-sm">
                  +{project.members.length - 4}
                </div>
              )}
            </div>
            <div className="h-8 w-px bg-[var(--border)] mx-1" />
            <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-all">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto custom-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
          {tabs.map((tab) => {
            const isActive = path === tab.href;
            return (
              <Link
                key={tab.label}
                to={tab.href}
                className={`group relative flex items-center gap-2.5 pb-4 pt-1 px-4 text-sm font-bold whitespace-nowrap transition-colors ${isActive ? 'text-[var(--primary)]' : 'text-slate-500 hover:text-[var(--text)]'}`}
              >
                <tab.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[var(--primary)]' : 'text-slate-400'}`} />
                {tab.label}
                {isActive && (
                  <motion.div 
                    layoutId="header-tabs"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--primary)] rounded-t-full shadow-[0_-4px_10px_rgba(var(--primary-rgb),0.3)]"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
