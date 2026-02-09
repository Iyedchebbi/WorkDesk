
import React from 'react';
import { FolderKanban, Users, CheckSquare, FileText, Plus, ArrowUpRight, Zap, TrendingUp } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Project, Task, Client, Invoice, UserProfile } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  projects: Project[];
  tasks: Task[];
  clients: Client[];
  invoices: Invoice[];
  user: UserProfile;
  onQuickAction: (type: 'project' | 'client' | 'task' | 'invoice') => void;
}

const data = [
  { name: 'Jan', earnings: 4200 },
  { name: 'Feb', earnings: 3800 },
  { name: 'Mar', earnings: 5100 },
  { name: 'Apr', earnings: 4800 },
  { name: 'May', earnings: 6200 },
];

export const Dashboard: React.FC<DashboardProps> = ({ projects, tasks, clients, invoices, user, onQuickAction }) => {
  const activeProjects = projects.filter(p => p.status === 'Active');
  const pendingTasks = tasks.filter(t => t.status === 'To Do');
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFC]">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-[#94A3B8] mt-1">Here's what's happening with your workspace today.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onQuickAction('project')}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#22D3EE] text-[#020617] font-bold rounded-xl hover:bg-cyan-300 transition-all hover:scale-105 shadow-lg shadow-[#22D3EE20]"
          >
            <Plus size={18} /> New Project
          </button>
        </div>
      </header>

      {/* Credit Pulse Notification */}
      {user.credits <= 1 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500 animate-pulse">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#F8FAFC]">Running low on credits!</p>
              <p className="text-xs text-[#94A3B8]">You have {user.credits} credits remaining. Upgrade now to avoid interruption.</p>
            </div>
          </div>
          <button onClick={() => onQuickAction('invoice')} className="text-xs font-bold text-amber-500 uppercase tracking-widest hover:underline">
            Upgrade Plan
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Projects" value={projects.length} icon={<FolderKanban size={20} />} trend={{ value: '+12%', positive: true }} />
        <StatCard label="Total Clients" value={clients.length} icon={<Users size={20} />} trend={{ value: '+2', positive: true }} />
        <StatCard label="Pending Tasks" value={pendingTasks.length} icon={<CheckSquare size={20} />} />
        <StatCard label="Total Earnings" value={`$${totalRevenue.toLocaleString()}`} icon={<FileText size={20} />} trend={{ value: '+24%', positive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl border border-[#1E293B] bg-[#0F172A] shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
                Performance Analytics <TrendingUp size={18} className="text-[#22D3EE]" />
              </h2>
              <select className="bg-[#020617] border border-[#1E293B] text-xs text-[#94A3B8] rounded-lg px-2 py-1 outline-none">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} opacity={0.5} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', color: '#F8FAFC' }}
                    itemStyle={{ color: '#22D3EE', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="earnings" stroke="#22D3EE" fillOpacity={1} fill="url(#colorEarnings)" strokeWidth={3} dot={{ r: 4, fill: '#22D3EE', strokeWidth: 2, stroke: '#0F172A' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-[#1E293B] bg-[#0F172A]">
            <h2 className="text-lg font-bold text-[#F8FAFC] mb-6">Recent Work</h2>
            <div className="space-y-3">
              {activeProjects.slice(0, 3).map(proj => (
                <div key={proj.id} className="flex items-center justify-between p-4 rounded-xl bg-[#020617] border border-[#1E293B] hover:border-[#22D3EE]/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center text-[#22D3EE] group-hover:bg-[#22D3EE] group-hover:text-[#020617] transition-all">
                      <FolderKanban size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-[#F8FAFC] text-sm">{proj.name}</p>
                      <p className="text-[10px] text-[#475569] uppercase font-bold tracking-widest">Deadline: {proj.deadline}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#F8FAFC]">${proj.budget.toLocaleString()}</p>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Active</span>
                  </div>
                </div>
              ))}
              {activeProjects.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm text-[#475569] italic font-medium">No recent project activity.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="p-6 rounded-xl border border-[#1E293B] bg-gradient-to-br from-[#0F172A] to-[#020617] shadow-xl">
            <h2 className="text-lg font-bold text-[#F8FAFC] mb-6">Account Status</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#1E293B]/30 border border-[#1E2938]">
                <p className="text-[10px] text-[#94A3B8] font-black uppercase tracking-[0.2em] mb-1">Current Plan</p>
                <p className="text-xl font-black text-white">{user.planType === 'free' ? 'Starter' : user.planType === 'pro' ? 'Professional' : 'Agency'}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#1E293B]/30 border border-[#1E2938]">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] text-[#94A3B8] font-black uppercase tracking-[0.2em]">Credits</p>
                  <span className="text-xs font-bold text-[#22D3EE]">{user.credits} left</span>
                </div>
                <div className="w-full h-2 bg-[#020617] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#22D3EE] to-blue-500 transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (user.credits / (user.planType === 'free' ? 3 : user.planType === 'pro' ? 10 : 50)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <button 
              onClick={() => (window as any).location.hash = '#/settings'}
              className="w-full mt-6 py-3 bg-[#1E293B] hover:bg-[#2D3748] text-[#F8FAFC] text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-[#1E2938]"
            >
              Upgrade Dashboard
            </button>
          </div>

          <div className="p-6 rounded-xl border border-[#1E293B] bg-[#0F172A]">
            <h2 className="text-lg font-bold text-[#F8FAFC] mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'New Task', icon: CheckSquare, type: 'task' },
                { label: 'Invoice', icon: FileText, type: 'invoice' },
                { label: 'Add Client', icon: Users, type: 'client' },
                { label: 'Project', icon: FolderKanban, type: 'project' }
              ].map(action => (
                <button 
                  key={action.label}
                  onClick={() => onQuickAction(action.type as any)} 
                  className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-[#020617] border border-[#1E293B] hover:border-[#22D3EE] transition-all text-[#475569] hover:text-[#22D3EE] group"
                >
                  <action.icon size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
