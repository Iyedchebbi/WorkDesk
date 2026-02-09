
import React from 'react';
import { Invoice } from '../types';
import { FilePlus, DollarSign, Clock, CheckCircle2, Edit3, Trash2 } from 'lucide-react';

interface InvoicesProps {
  invoices: Invoice[];
  onAdd: () => void;
  onEdit: (inv: Invoice) => void;
  onDelete: (id: string) => void;
}

export const Invoices: React.FC<InvoicesProps> = ({ invoices, onAdd, onEdit, onDelete }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Invoices</h1>
          <p className="text-[#94A3B8]">Track payments and billing for all your work.</p>
        </div>
        <button 
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#22D3EE] text-[#020617] font-semibold rounded-lg hover:bg-cyan-300 transition-colors"
        >
          <FilePlus size={18} /> Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-[#1E293B] bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
          <p className="text-sm text-[#94A3B8] mb-1">Total Outstanding</p>
          <h3 className="text-3xl font-bold text-[#F8FAFC]">
            ${invoices.filter(i => i.status === 'Unpaid').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
          </h3>
        </div>
        <div className="p-6 rounded-xl border border-[#1E293B] bg-[#0F172A]">
          <p className="text-sm text-[#94A3B8] mb-1">Paid this month</p>
          <h3 className="text-3xl font-bold text-emerald-400">
            ${invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
          </h3>
        </div>
        <div className="p-6 rounded-xl border border-[#1E293B] bg-[#0F172A]">
          <p className="text-sm text-[#94A3B8] mb-1">Average Invoice</p>
          <h3 className="text-3xl font-bold text-[#22D3EE]">
            ${Math.round(invoices.reduce((sum, i) => sum + i.amount, 0) / (invoices.length || 1)).toLocaleString()}
          </h3>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-[#1E293B] bg-[#0F172A] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1E293B] text-[#94A3B8] text-sm uppercase">
                <th className="px-4 py-3 font-semibold">Invoice Title</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {invoices.map((inv) => (
                <tr key={inv.id} className="group hover:bg-[#020617] transition-colors">
                  <td className="px-4 py-5">
                    <p className="font-semibold text-[#F8FAFC]">{inv.title}</p>
                    <p className="text-[10px] text-[#475569] font-bold uppercase tracking-widest mt-0.5">ID: {inv.id.slice(0, 8)}</p>
                  </td>
                  <td className="px-4 py-5 font-bold text-[#F8FAFC]">${inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-5 text-[#94A3B8]">{inv.date}</td>
                  <td className="px-4 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      inv.status === 'Paid' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {inv.status === 'Paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(inv)}
                        className="p-2 text-[#94A3B8] hover:text-[#22D3EE] hover:bg-[#1E293B] rounded-lg transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(inv.id)}
                        className="p-2 text-[#94A3B8] hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[#94A3B8] italic">
                    No invoices yet.
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
