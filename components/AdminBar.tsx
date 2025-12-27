import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { ShieldCheck, Users, LayoutGrid, Eye } from './Icons';
import { ViewState } from '../App';

interface AdminBarProps {
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
}

export const AdminBar: React.FC<AdminBarProps> = ({ onNavigate, currentView }) => {
  const { currentUser } = useApp();

  if (currentUser?.role !== UserRole.ADMIN) return null;

  return (
    <div className="bg-brand-yellow text-brand-black py-2 px-4 flex items-center justify-between sticky top-0 z-[100] shadow-md border-b border-brand-black/10">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5" />
        <span className="text-xs font-black uppercase tracking-tighter">Painel Admin</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('admin-dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${currentView === 'admin-dashboard' ? 'bg-brand-black text-brand-yellow' : 'hover:bg-brand-black/10'}`}
        >
          <Users className="w-3.5 h-3.5" /> CRM de Usuários
        </button>
        
        <button 
          onClick={() => onNavigate('business-dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${currentView === 'business-dashboard' ? 'bg-brand-black text-brand-yellow' : 'hover:bg-brand-black/10'}`}
        >
          <LayoutGrid className="w-3.5 h-3.5" /> Visão Empresa
        </button>

        <button 
          onClick={() => onNavigate('influencer-dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${currentView === 'influencer-dashboard' ? 'bg-brand-black text-brand-yellow' : 'hover:bg-brand-black/10'}`}
        >
          <Eye className="w-3.5 h-3.5" /> Visão Influencer
        </button>
      </div>

      <div className="hidden md:block">
        <p className="text-[10px] font-medium text-brand-black/60 italic tracking-tight">Modo Administrador Ativo</p>
      </div>
    </div>
  );
};
