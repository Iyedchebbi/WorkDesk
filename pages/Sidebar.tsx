
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { NavLink, useNavigate } = ReactRouterDOM as any;
import { LayoutDashboard, FolderKanban, Users, CheckSquare, FileText, Settings, Briefcase, LogOut, Zap } from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  onLogout: () => void;
  user: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout, user }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Invoices', path: '/invoices', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/home');
  };

  const planLabel = user.planType === 'free' ? 'Free Plan' : user.planType === 'pro' ? 'Professional' : 'Agency';

  return (
    <aside className="w-64 h-full bg-[#0F172A] border-r border-[#1E2938] flex flex-col hidden md:flex">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-[#22D3EE] to-[#3B82F6] p-2 rounded-lg shadow-lg shadow-[#22D3EE20]">
            <Briefcase size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#F8FAFC] to-[#22D3EE] bg-clip-text text-transparent">
            WorkDesk
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-[#22D3EE]/10 text-[#22D3EE] border-l-4 border-[#22D3EE]' 
                  : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1E2938] space-y-4">
        {/* Profile and Plan Section */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-[#020617] border border-[#1E2938]">
          <div className="w-10 h-10 rounded-full border border-[#22D3EE]/20 bg-[#1E2938] flex items-center justify-center overflow-hidden flex-shrink-0">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=22D3EE&color=020617`} 
              className="w-full h-full object-cover" 
              alt="Avatar" 
            />
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold text-[#F8FAFC] truncate" title={user.name}>
              {user.name}
            </p>
            <p className="text-[10px] uppercase tracking-wider font-black text-[#22D3EE] truncate mt-0.5">
              {planLabel}
            </p>
            <p className="text-[10px] font-bold text-[#475569] mt-0.5 flex items-center gap-1">
              <Zap size={10} className="text-amber-400" /> {user.credits} Credits Remaining
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 text-[#475569] hover:text-rose-400 hover:bg-rose-400/5 rounded-lg transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </aside>
  );
};
