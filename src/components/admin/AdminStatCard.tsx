import React from 'react';
import { motion } from 'motion/react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
  alert?: boolean;
  onClick?: () => void;
  isActive?: boolean;
  icon?: any;
  microcopy?: string;
}

export function AdminStatCard({ title, value, unit, highlight, alert, onClick, isActive, icon: Icon, microcopy }: AdminStatCardProps) {
  return (
    <button 
      onClick={onClick}
      disabled={!onClick}
      className={`relative w-full text-left p-6 rounded-3xl border transition-all duration-300 group ${onClick ? 'cursor-pointer' : 'cursor-default'} ${
        isActive 
          ? 'bg-[#1C1A17] border-[#1C1A17] shadow-xl shadow-[#1C1A17]/10 scale-[1.02]' 
          : 'bg-white border-gray-100 hover:border-[#F6F1EB] hover:bg-gray-50/50 shadow-sm'
      } ${alert && !isActive ? 'border-l-4 border-l-amber-500' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white/60' : 'text-gray-400'}`}>
          {title}
        </p>
        {Icon && (
          <div className={`${isActive ? 'text-[#B06A32]' : 'text-gray-200 group-hover:text-[#B06A32] transition-colors'}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <p className={`text-3xl font-black ${
          isActive 
            ? 'text-white' 
            : highlight ? 'text-[#B06A32]' : 'text-[#1C1A17]'
        }`}>
          {value}{unit && <span className={`text-sm font-medium ml-1 ${isActive ? 'text-white/40' : 'text-gray-400'}`}>{unit}</span>}
        </p>
      </div>

      {microcopy && (
        <p className={`text-[9px] font-bold uppercase tracking-wider mt-2 ${isActive ? 'text-white/30' : 'text-gray-300 group-hover:text-gray-400 transition-colors'}`}>
          {microcopy}
        </p>
      )}
      
      {isActive && (
        <motion.div 
          layoutId="card-active-indicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#B06A32]"
        />
      )}
    </button>
  );
}
