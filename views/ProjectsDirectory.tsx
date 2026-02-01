
import React, { useState } from 'react';
import { useApp } from '../store';
import { Plus, Search, Star, MoreVertical, Briefcase, ChevronRight, Users, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreateProjectModal from '../components/CreateProjectModal';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectsDirectory: React.FC = () => {
  const { projects, tasks } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-black rounded-full uppercase tracking-widest">Workspace Core</div>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--text)]">Project Hub</h1>
          <p className="text-slate-500 font-medium max-w-lg">All active workstreams and team roadmaps organized in one premium space.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg shadow-[var(--primary)]/25 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </header>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Jump to project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => {
            const projectTasks = tasks.filter(t => t.projectId === project.id);
            const doneTasks = projectTasks.filter(t => t.status === 'done').length;
            const progress = projectTasks.length > 0 ? (doneTasks / projectTasks.length) * 100 : 0;

            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  to={`/projects/${project.id}`}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-[40px] p-8 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all group block relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-[var(--primary)] transition-colors" />
                  </div>
                  
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-3xl flex items-center justify-center font-black text-2xl shadow-inner group-hover:scale-110 transition-transform">
                      {project.key}
                    </div>
                    <button className="text-slate-300 hover:text-amber-400 transition-colors z-10">
                      <Star className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <h3 className="font-black text-[var(--text)] text-2xl mb-2 tracking-tight group-hover:text-[var(--primary)] transition-colors">{project.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-10 h-10 font-medium">{project.description || 'This workstream is currently being defined by the project lead.'}</p>
                  
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Roadmap Progress</span>
                      </div>
                      <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="bg-[var(--primary)] h-full rounded-full shadow-lg shadow-[var(--primary)]/20" 
                      />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex -space-x-3">
                        {project.members.slice(0, 4).map((m, i) => (
                          <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m}`} className="w-9 h-9 rounded-xl border-2 border-[var(--surface)] shadow-sm" />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{projectTasks.length} Items</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-32 bg-[var(--surface)] border-2 border-[var(--border)] border-dashed rounded-[40px] flex flex-col items-center text-center px-6">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-[40px] flex items-center justify-center mb-8">
              <Briefcase className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">Project not found</h3>
            <p className="text-slate-500 font-medium max-w-sm mt-2">No results match your search. Perhaps it's time to start a new workstream?</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-8 text-[10px] font-black text-[var(--primary)] uppercase tracking-widest hover:underline"
            >
              Create first project
            </button>
          </div>
        )}
      </div>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ProjectsDirectory;
