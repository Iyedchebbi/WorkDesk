
import React from 'react';
import { Client } from '../types';
import { UserPlus, Mail, Trash2, Edit3, Building2 } from 'lucide-react';

interface ClientsProps {
  clients: Client[];
  onAdd: () => void;
  onEdit: (c: Client) => void;
  onDelete: (id: string) => void;
}

export const Clients: React.FC<ClientsProps> = ({ clients, onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Clients</h1>
          <p className="text-[#94A3B8]">Your network of professional contacts and organizations.</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#22D3EE] text-[#020617] font-semibold rounded-lg hover:bg-cyan-300 transition-colors"
        >
          <UserPlus size={18} /> Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="p-6 rounded-xl border border-[#1E293B] bg-[#0F172A] hover:border-[#22D3EE]/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#22D3EE] to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                {client.name.charAt(0)}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onEdit(client)}
                  className="p-2 text-[#94A3B8] hover:text-[#22D3EE] hover:bg-[#1E293B] rounded-lg transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => onDelete(client.id)}
                  className="p-2 text-[#94A3B8] hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-1">{client.name}</h3>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[#94A3B8] text-sm">
                <Building2 size={14} className="text-[#22D3EE]" />
                {client.company}
              </div>
              <div className="flex items-center gap-2 text-[#94A3B8] text-sm">
                <Mail size={14} />
                {client.email}
              </div>
            </div>
            <button className="w-full mt-6 py-2 bg-[#1E293B] hover:bg-[#22D3EE]/10 hover:text-[#22D3EE] text-[#F8FAFC] text-sm font-medium rounded-lg transition-colors border border-transparent hover:border-[#22D3EE]/20">
              View Projects
            </button>
          </div>
        ))}
        {clients.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-[#1E293B] rounded-2xl text-[#94A3B8]">
            No clients added yet.
          </div>
        )}
      </div>
    </div>
  );
};
