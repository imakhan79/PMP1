
import React, { useState } from 'react';
import { useApp } from '../store';
import { Plus, Search, LayoutGrid, List as ListIcon, Star, MoreVertical, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreateProjectModal from '../components/CreateProjectModal';

const ProjectsDirectory: React.FC = () => {
  const { projects, tasks } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500">Overview of all active and archived projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Find a project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const projectTasks = tasks.filter(t => t.projectId === project.id);
          const doneTasks = projectTasks.filter(t => t.status === 'DONE').length;
          const progress = projectTasks.length > 0 ? (doneTasks / projectTasks.length) * 100 : 0;

          return (
            <Link 
              key={project.id} 
              to={`/projects/${project.id}`}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl">
                  {project.key}
                </div>
                <button className="text-slate-300 group-hover:text-yellow-400 transition-colors">
                  <Star className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="font-bold text-slate-900 text-lg mb-1">{project.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-6 h-10">{project.description || 'No description provided.'}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full transition-all duration-1000" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 4).map((m, i) => (
                      <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m}`} className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-slate-100" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{projectTasks.length} tasks</span>
                </div>
              </div>
            </Link>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-20 bg-white border border-slate-200 border-dashed rounded-2xl flex flex-col items-center">
            <Briefcase className="w-12 h-12 text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No projects found</h3>
            <p className="text-slate-500">Try adjusting your search or create a new project.</p>
          </div>
        )}
      </div>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ProjectsDirectory;
