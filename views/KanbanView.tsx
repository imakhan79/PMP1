
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store';
import { Task, TaskPriority, IssueType, WorkflowStatus, UserRole } from '../types';
import { 
  MoreVertical, Plus, Clock, MessageSquare, 
  Calendar, Users, Layers, AlertCircle,
  Tag, 
  Bug,
  FileText,
  Bookmark,
  Zap,
  ArrowRight,
  Maximize2,
  Edit2,
  Target,
  Trash2,
  Settings,
  Lock,
  ArrowLeftRight,
  ChevronRight,
  ShieldCheck,
  Unlock
} from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import TaskDetailsModal from '../components/TaskDetailsModal';
import CreateTaskModal from '../components/CreateTaskModal';

type SwimlaneType = 'ASSIGNEE' | 'EPIC' | 'PRIORITY' | 'NONE';

const IssueTypeIcon: React.FC<{ type: IssueType }> = ({ type }) => {
  switch (type) {
    case 'BUG': return <Bug className="w-4 h-4 text-rose-500" />;
    case 'STORY': return <Bookmark className="w-4 h-4 text-emerald-500 fill-emerald-500" />;
    case 'EPIC': return <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />;
    default: return <FileText className="w-4 h-4 text-blue-500" />;
  }
};

const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const colors = {
    LOW: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    MEDIUM: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    HIGH: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    URGENT: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  };
  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${colors[priority]}`}>
      {priority}
    </span>
  );
};

const DueDateChip: React.FC<{ date: string; status: string }> = ({ date, status }) => {
  const dueDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const isDone = status === 'done';
  const isOverdue = !isDone && dueDate < today;
  
  const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isDueSoon = !isDone && !isOverdue && diffDays <= 2;

  let colorClass = 'text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800';
  if (isOverdue) colorClass = 'text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50';
  else if (isDueSoon) colorClass = 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50';
  else if (isDone) colorClass = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50';

  return (
    <div className={`flex items-center gap-1.5 text-[9px] font-bold px-2 py-0.5 rounded-md border shadow-sm transition-colors ${colorClass}`}>
      <Calendar className="w-2.5 h-2.5" />
      {dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase()}
      {isOverdue && <span className="ml-0.5 text-[8px] font-black tracking-tighter">OVERDUE</span>}
    </div>
  );
};

const TaskCard: React.FC<{ task: Task; workflow: WorkflowStatus[]; onClick: () => void; onMove: (statusId: string) => void }> = ({ task, workflow, onClick, onMove }) => {
  const { users, tasks, currentUser } = useApp();
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const moveMenuRef = useRef<HTMLDivElement>(null);
  
  const assignee = users.find(u => u.id === task.assigneeId);
  const epic = task.epicId ? tasks.find(t => t.id === task.epicId) : null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moveMenuRef.current && !moveMenuRef.current.contains(e.target as Node)) {
        setShowMoveMenu(false);
      }
    };
    if (showMoveMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoveMenu]);

  const isPrivileged = currentUser.role === 'ADMIN' || currentUser.role === 'OWNER';

  return (
    <motion.div 
      layout
      whileHover={{ 
        y: -3, 
        scale: 1.015,
        transition: { duration: 0.2, ease: [0.33, 1, 0.68, 1] }
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-pointer group relative overflow-visible"
    >
      <div onClick={onClick} className="absolute inset-0 z-0" />

      {/* Quick Move Overlay Button */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button 
          onClick={(e) => { e.stopPropagation(); setShowMoveMenu(!showMoveMenu); }}
          className={`p-1.5 rounded-lg transition-all ${showMoveMenu ? 'bg-[var(--primary)] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600'}`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
        </button>
        
        <AnimatePresence>
          {showMoveMenu && (
            <motion.div 
              ref={moveMenuRef}
              initial={{ opacity: 0, scale: 0.95, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 10 }}
              className="absolute top-0 right-full mr-2 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl z-20 overflow-hidden"
            >
              <div className="p-2 space-y-1">
                <p className="px-3 py-1 text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-[var(--border)] mb-1">Move to State</p>
                {workflow.filter(w => w.id !== task.status).map(w => {
                  const isRestricted = !isPrivileged && w.allowedRoles && !w.allowedRoles.includes(currentUser.role);
                  return (
                    <button
                      key={w.id}
                      disabled={isRestricted}
                      onClick={(e) => { e.stopPropagation(); onMove(w.id); setShowMoveMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                        isRestricted 
                        ? 'opacity-40 cursor-not-allowed text-slate-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-[var(--primary)]'
                      }`}
                    >
                      {w.label}
                      {isRestricted && <Lock className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Content */}
      <div className="relative z-0 pointer-events-none">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <IssueTypeIcon type={task.type} />
            <span className="text-[10px] font-black text-slate-400 tracking-tight">
              {task.number}
            </span>
          </div>
          <PriorityBadge priority={task.priority} />
        </div>

        <h3 className="text-sm font-bold text-[var(--text)] mb-3 line-clamp-2 leading-relaxed tracking-tight group-hover:text-[var(--primary)] transition-colors">
          {task.title}
        </h3>

        {epic && (
          <div className="mb-3">
            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-lg font-bold uppercase tracking-tight inline-flex items-center gap-1">
              <Layers className="w-2.5 h-2.5" />
              {epic.title}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {task.labels.map(label => (
            <span key={label} className="text-[9px] bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-md font-bold uppercase">
              {label}
            </span>
          ))}
          {task.dueDate && <DueDateChip date={task.dueDate} status={task.status} />}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] mt-auto group-hover:border-[var(--primary)]/20 transition-colors">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">4</span>
            </div>
            {task.estimate && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                <span className="text-[10px] font-black">{task.estimate}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
             {assignee && (
              <img src={assignee.avatar} className="w-7 h-7 rounded-xl border border-white dark:border-slate-800 shadow-sm" alt={assignee.name} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const KanbanView: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { tasks, projects, users, updateTask, deleteTask, currentUser, updateProject } = useApp();
  const [swimlaneType, setSwimlaneType] = useState<SwimlaneType>('NONE');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeColumnMenu, setActiveColumnMenu] = useState<string | null>(null);
  const [addTaskStatus, setAddTaskStatus] = useState<string | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveColumnMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const project = projects.find(p => p.id === projectId);
  if (!project) return null;

  const projectTasks = tasks.filter(t => t.projectId === projectId);
  const epics = projectTasks.filter(t => t.type === 'EPIC');

  const isPrivileged = currentUser.role === 'ADMIN' || currentUser.role === 'OWNER';

  const getSwimlanes = () => {
    switch (swimlaneType) {
      case 'ASSIGNEE': return users.filter(u => project.members.includes(u.id)).map(u => ({ id: u.id, label: u.name }));
      case 'EPIC': return epics.map(e => ({ id: e.id, label: e.title }));
      case 'PRIORITY': return (['URGENT', 'HIGH', 'MEDIUM', 'LOW'] as TaskPriority[]).map(p => ({ id: p, label: p }));
      default: return [{ id: 'all', label: 'Board' }];
    }
  };

  const handleMoveTask = (taskId: string, targetStatusId: string) => {
    const targetStatus = project.workflow.find(w => w.id === targetStatusId);
    if (!isPrivileged && targetStatus?.allowedRoles && !targetStatus.allowedRoles.includes(currentUser.role)) {
      alert(`Unauthorized: Only users with roles [${targetStatus.allowedRoles.join(', ')}] can move tasks into the "${targetStatus.label}" state.`);
      return;
    }
    updateTask(taskId, { status: targetStatusId });
  };

  const handleArchiveAll = (statusId: string) => {
    const tasksToArchive = projectTasks.filter(t => t.status === statusId);
    if (tasksToArchive.length === 0) return;
    
    if (confirm(`Archive ${tasksToArchive.length} tasks in this column?`)) {
      tasksToArchive.forEach(t => deleteTask(t.id));
      setActiveColumnMenu(null);
    }
  };

  const handleSetWipLimit = (statusId: string) => {
    const currentLimit = project.workflow.find(w => w.id === statusId)?.wipLimit;
    const newLimitStr = prompt(`Set WIP Limit for this column (current: ${currentLimit || 'none'}):`, currentLimit?.toString() || '');
    
    if (newLimitStr === null) return;
    
    const newLimit = parseInt(newLimitStr, 10);
    const updatedWorkflow = project.workflow.map(w => 
      w.id === statusId ? { ...w, wipLimit: isNaN(newLimit) ? undefined : newLimit } : w
    );
    
    updateProject(project.id, { workflow: updatedWorkflow });
    setActiveColumnMenu(null);
  };

  const handleRenameColumn = (statusId: string) => {
    const column = project.workflow.find(w => w.id === statusId);
    const newLabel = prompt(`Rename column "${column?.label}":`, column?.label);
    
    if (newLabel && newLabel !== column?.label) {
      const updatedWorkflow = project.workflow.map(w => 
        w.id === statusId ? { ...w, label: newLabel } : w
      );
      updateProject(project.id, { workflow: updatedWorkflow });
    }
    setActiveColumnMenu(null);
  };

  const handleTogglePermissions = (statusId: string) => {
    if (!isPrivileged) {
      alert('Only Admins or Owners can modify column permissions.');
      return;
    }

    const column = project.workflow.find(w => w.id === statusId);
    const isCurrentlyRestricted = !!column?.allowedRoles?.length;
    
    let nextAllowedRoles: UserRole[] | undefined = undefined;
    
    if (!isCurrentlyRestricted) {
      if (confirm(`Restrict "${column?.label}" moves to Admins and Owners only?`)) {
        nextAllowedRoles = ['ADMIN', 'OWNER'];
      } else {
        return;
      }
    } else {
      if (confirm(`Remove move restrictions from "${column?.label}"? All roles will be able to move tasks here.`)) {
        nextAllowedRoles = undefined;
      } else {
        return;
      }
    }

    const updatedWorkflow = project.workflow.map(w => 
      w.id === statusId ? { ...w, allowedRoles: nextAllowedRoles } : w
    );
    updateProject(project.id, { workflow: updatedWorkflow });
    setActiveColumnMenu(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/30 dark:bg-slate-900/10">
      {/* Board Controls */}
      <div className="px-8 py-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Swimlanes</span>
            <select 
              value={swimlaneType} 
              onChange={(e) => setSwimlaneType(e.target.value as SwimlaneType)}
              className="text-xs font-bold bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer"
            >
              <option value="NONE">Default</option>
              <option value="ASSIGNEE">Assignee</option>
              <option value="EPIC">Epic</option>
              <option value="PRIORITY">Priority</option>
            </select>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Project Sync Active</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-[10px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Automate
          </button>
        </div>
      </div>

      {/* Board Columns */}
      <div className="flex-1 overflow-x-auto custom-scrollbar flex p-6 gap-8">
        {project.workflow.map(col => (
          <div key={col.id} className="w-80 shrink-0 flex flex-col group/column relative">
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest truncate">{col.label}</span>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black shrink-0 ${
                  col.wipLimit && projectTasks.filter(t => t.status === col.id).length > col.wipLimit
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {projectTasks.filter(t => t.status === col.id).length}
                  {col.wipLimit ? ` / ${col.wipLimit}` : ''}
                </span>
                {col.allowedRoles && col.allowedRoles.length > 0 && (
                  <div className="group/lock relative">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/lock:opacity-100 transition-opacity pointer-events-none z-50">
                       <div className="bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded whitespace-nowrap uppercase tracking-widest">
                         Restricted to {col.allowedRoles.join(', ')}
                       </div>
                    </div>
                  </div>
                )}
                {col.wipLimit && projectTasks.filter(t => t.status === col.id).length > col.wipLimit && (
                  <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover/column:opacity-100 transition-opacity shrink-0">
                <button 
                  onClick={() => setAddTaskStatus(col.id)}
                  className="p-1.5 text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--primary)] transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setActiveColumnMenu(activeColumnMenu === col.id ? null : col.id)}
                    className={`p-1.5 rounded-xl transition-all ${activeColumnMenu === col.id ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600'}`}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  <AnimatePresence>
                    {activeColumnMenu === col.id && (
                      <motion.div 
                        ref={menuRef}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-2 w-52 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-2 space-y-1">
                          <button 
                            onClick={() => { setAddTaskStatus(col.id); setActiveColumnMenu(null); }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors text-left group"
                          >
                            <Plus className="w-4 h-4 text-slate-400 group-hover:text-[var(--primary)]" /> Add Task
                          </button>
                          <button 
                            onClick={() => handleRenameColumn(col.id)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors text-left group"
                          >
                            <Edit2 className="w-4 h-4 text-slate-400 group-hover:text-[var(--primary)]" /> Edit Name
                          </button>
                          <button 
                            onClick={() => handleSetWipLimit(col.id)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors text-left group"
                          >
                            <Target className="w-4 h-4 text-slate-400 group-hover:text-[var(--primary)]" /> Set WIP Limit
                          </button>
                          <button 
                            onClick={() => handleTogglePermissions(col.id)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors text-left group"
                          >
                            {col.allowedRoles && col.allowedRoles.length > 0 ? (
                              <><Unlock className="w-4 h-4 text-amber-500 group-hover:text-amber-600" /> Unlock Moves</>
                            ) : (
                              <><Lock className="w-4 h-4 text-slate-400 group-hover:text-amber-500" /> Restrict Moves</>
                            )}
                          </button>
                          <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2 my-1" />
                          <button 
                            onClick={() => handleArchiveAll(col.id)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors text-left group"
                          >
                            <Trash2 className="w-4 h-4 text-rose-400 group-hover:text-rose-600" /> Archive All
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-10 pb-12">
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
                  <div key={lane.id} className="space-y-4">
                    {swimlaneType !== 'NONE' && (
                      <div className="flex items-center gap-3 mb-2 px-1">
                        <div className="h-px bg-[var(--border)] flex-1" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{lane.label}</span>
                        <div className="h-px bg-[var(--border)] flex-1" />
                      </div>
                    )}
                    <div className="space-y-4">
                      {laneTasks.map(task => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          workflow={project.workflow}
                          onMove={(statusId) => handleMoveTask(task.id, statusId)}
                          onClick={() => setSelectedTaskId(task.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              {projectTasks.filter(t => t.status === col.id).length === 0 && swimlaneType === 'NONE' && (
                <div className="py-12 border-2 border-dashed border-[var(--border)] rounded-[32px] flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                  <Plus className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Drop tasks here</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Details Modal */}
      <AnimatePresence>
        {selectedTaskId && (
          <TaskDetailsModal 
            taskId={selectedTaskId} 
            onClose={() => setSelectedTaskId(null)} 
          />
        )}
      </AnimatePresence>

      {/* Add Task Modal with Status Injection */}
      <AnimatePresence>
        {addTaskStatus && (
          <CreateTaskModal 
            isOpen={true} 
            onClose={() => setAddTaskStatus(null)} 
            initialStatus={addTaskStatus}
            initialProjectId={project.id}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default KanbanView;
