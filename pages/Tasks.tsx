
import React from 'react';
import { Task, Project } from '../types';
import { Plus, CheckCircle2, Circle, Clock, Trash2, FolderKanban, Edit3 } from 'lucide-react';

interface TasksProps {
  tasks: Task[];
  projects: Project[];
  onAdd: () => void;
  onEdit: (t: Task) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const Tasks: React.FC<TasksProps> = ({ tasks, projects, onAdd, onEdit, onToggleStatus, onDelete }) => {
  const getProjectName = (projectId: string) => {
    if (projectId === 'none') return 'General Task';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Task Board</h1>
          <p className="text-[#94A3B8]">Organize your daily workflows and deliverables.</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#22D3EE] text-[#020617] font-semibold rounded-lg hover:bg-cyan-300 transition-colors shadow-lg shadow-[#22D3EE20]"
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {['To Do', 'Done'].map((status) => (
          <div key={status} className="space-y-4">
            <h2 className="text-sm font-bold tracking-widest uppercase text-[#94A3B8] flex items-center gap-3">
              {status === 'To Do' ? <Clock size={16} className="text-[#22D3EE]" /> : <CheckCircle2 size={16} className="text-emerald-400" />}
              {status}
              <span className="ml-2 px-2 py-0.5 bg-[#1E293B] text-[#F8FAFC] text-[10px] rounded-full">
                {tasks.filter(t => t.status === status).length}
              </span>
            </h2>
            
            <div className="space-y-3">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className="group p-4 rounded-xl border border-[#1E293B] bg-[#0F172A] hover:border-[#22D3EE]/30 transition-all flex items-start gap-3">
                  <button 
                    onClick={() => onToggleStatus(task.id)}
                    className={`mt-0.5 transition-colors ${task.status === 'Done' ? 'text-emerald-400' : 'text-[#94A3B8] hover:text-[#22D3EE]'}`}
                  >
                    {task.status === 'Done' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </button>
                  <div className="flex-1 overflow-hidden">
                    <p className={`font-medium truncate ${task.status === 'Done' ? 'text-[#475569] line-through' : 'text-[#F8FAFC]'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#22D3EE] bg-[#22D3EE]/10 px-1.5 py-0.5 rounded border border-[#22D3EE]/20 max-w-[150px] truncate">
                        <FolderKanban size={10} />
                        {getProjectName(task.projectId)}
                      </div>
                      <span className="text-[10px] text-[#475569] font-medium">Due {task.dueDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => onEdit(task)}
                      className="p-1.5 text-[#94A3B8] hover:text-[#22D3EE] hover:bg-[#1E293B] rounded-lg transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(task.id)}
                      className="p-1.5 text-[#94A3B8] hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="py-8 text-center border border-dashed border-[#1E293B] rounded-xl text-[#475569] text-sm">
                  No tasks here.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
