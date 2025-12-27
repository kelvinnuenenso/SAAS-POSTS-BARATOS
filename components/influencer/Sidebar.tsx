import React from 'react';
import { LayoutGrid, FileText, MessageSquare, Camera, CreditCard, User as UserIcon, Menu } from '../Icons';

type View = 'dashboard' | 'proposals' | 'posts' | 'wallet' | 'profile' | 'messages';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  pendingOrdersCount: number;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({ 
  activeView, 
  setActiveView, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  pendingOrdersCount,
  onLogout 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'proposals', label: 'Propostas', icon: <FileText className="w-5 h-5" /> },
    { id: 'messages', label: 'Mensagens', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'posts', label: 'Meus Posts', icon: <Camera className="w-5 h-5" /> },
    { id: 'wallet', label: 'Carteira', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'profile', label: 'Meu Perfil', icon: <UserIcon className="w-5 h-5" /> },
  ];

  return (
    <>
      <aside className={`fixed md:sticky top-0 left-0 w-64 bg-white border-r border-gray-200 h-screen z-40 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <span className="font-bold text-xl text-brand-black">Posts<span className="text-brand-blue">Baratos</span></span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id as View); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeView === item.id 
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
              {item.id === 'proposals' && pendingOrdersCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingOrdersCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 mt-auto">
          <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
            Sair
          </button>
        </div>
      </aside>
    </>
  );
});
