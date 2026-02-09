
import React from 'react';
import { COLORS } from '../constants';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend }) => {
  return (
    <div className="p-6 rounded-xl border border-[#1E293B] bg-[#0F172A] shadow-lg hover:shadow-[#22D3EE15] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-[#94A3B8]">{label}</span>
        <div className="p-2 rounded-lg bg-[#020617] text-[#22D3EE] border border-[#1E293B]">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#F8FAFC]">{value}</h3>
          {trend && (
            <p className={`text-xs mt-1 ${trend.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
