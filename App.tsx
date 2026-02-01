
import React from 'react';
import { HashRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { AppProvider } from './store';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import KanbanView from './views/KanbanView';
import MyTasks from './views/MyTasks';
import ProjectsDirectory from './views/ProjectsDirectory';
import ProjectSettings from './views/ProjectSettings';
import WikiView from './views/WikiView';
import BacklogView from './views/BacklogView';
import ProjectHeader from './components/ProjectHeader';
import { useApp } from './store';

const ProjectPage: React.FC = () => {
  const { projectId } = useParams();
  const { projects } = useApp();
  const project = projects.find(p => p.id === projectId);

  if (!project) return <div className="p-8 text-slate-500">Project not found</div>;

  return (
    <div className="flex flex-col h-full">
      <ProjectHeader project={project} />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <Routes>
          <Route index element={<KanbanView projectId={project.id} />} />
          <Route path="backlog" element={<BacklogView projectId={project.id} />} />
          <Route path="list" element={<div className="p-8 text-slate-400">List View Coming Soon...</div>} />
          <Route path="calendar" element={<div className="p-8 text-slate-400">Calendar View Coming Soon...</div>} />
          <Route path="wiki" element={<WikiView />} />
          <Route path="settings" element={<ProjectSettings project={project} />} />
        </Routes>
      </div>
    </div>
  );
};

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-8 max-w-7xl mx-auto">
    <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
    <div className="mt-8 border-2 border-dashed border-slate-200 rounded-3xl h-[400px] flex items-center justify-center text-slate-400 flex-col gap-2">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
        <span className="text-2xl font-bold opacity-20">?</span>
      </div>
      <p className="font-medium">{title} section is being updated.</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsDirectory />} />
            <Route path="/projects/:projectId/*" element={<ProjectPage />} />
            <Route path="/my-tasks" element={<MyTasks />} />
            <Route path="/inbox" element={<PlaceholderPage title="Inbox" />} />
            <Route path="/team" element={<PlaceholderPage title="Team Directory" />} />
            <Route path="/wiki" element={<WikiView />} />
            <Route path="/time" element={<PlaceholderPage title="Timesheets" />} />
            <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
            <Route path="/settings" element={<PlaceholderPage title="Workspace Settings" />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
