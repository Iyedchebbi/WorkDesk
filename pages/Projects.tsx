
import React from 'react';
import { Project, Task } from '../types';
import { Trash2, Edit3, Plus, Search, DollarSign, CheckSquare } from 'lucide-react';

interface ProjectsProps {
  projects: Project[];
  tasks: Task[];
  onAdd: () => void;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ projects, tasks, onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Projects</h1>
          <p className="text-[#94A3B8]">Manage and track all your ongoing and completed projects.</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#22D3EE] text-[#020617] font-semibold rounded-lg hover:bg-cyan-300 transition-colors"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="p-6 rounded-xl border border-[#1E293B] bg-[#0F172A] shadow-xl">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full bg-[#020617] border border-[#1E293B] rounded-lg py-2 pl-10 pr-4 text-[#F8FAFC] focus:outline-none focus:border-[#22D3EE] transition-colors"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1E293B] text-[#94A3B8] text-sm uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold">Project Name</th>
                <th className="px-4 py-3 font-semibold">Budget</th>
                <th className="px-4 py-3 font-semibold">Tasks Progress</th>
                <th className="px-4 py-3 font-semibold">Deadline</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {projects.map((project) => {
                const projectTasks = tasks.filter(t => t.projectId === project.id);
                const completedCount = projectTasks.filter(t => t.status === 'Done').length;
                const totalCount = projectTasks.length;
                const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                return (
                  <tr key={project.id} className="group hover:bg-[#020617] transition-colors">
                    <td className="px-4 py-4 font-medium text-[#F8FAFC]">{project.name}</td>
                    <td className="px-4 py-4 text-[#F8FAFC]">
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-emerald-400" />
                        {project.budget?.toLocaleString() || 0}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5 min-w-[120px]">
                        <div className="flex justify-between items-center text-[10px] font-bold text-[#94A3B8]">
                          <span className="flex items-center gap-1"><CheckSquare size={10} /> {completedCount}/{totalCount}</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#22D3EE] h-full transition-all duration-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                            style={{ width: `${progressPercent}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#94A3B8] text-sm">{project.deadline}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                        project.status === 'Active' 
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit(project)}
                          className="p-2 text-[#94A3B8] hover:text-[#22D3EE] hover:bg-[#1E293B] rounded-lg transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(project.id)}
                          className="p-2 text-[#94A3B8] hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#94A3B8] italic">
                    No projects found. Create your first one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
