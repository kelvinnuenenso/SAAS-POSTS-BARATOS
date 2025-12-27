import React from 'react';
import { UserRole } from '../../types';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: any) => void;
  menuItems: Array<{ id: string, label: string, icon: React.ReactNode }>;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({ activeView, setActiveView, menuItems, onLogout }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
      <div className="p-6 border-b border-gray-100">
        <span className="font-bold text-xl text-brand-black">Posts<span className="text-brand-blue">Baratos</span></span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeView === item.id 
                ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
          Sair
        </button>
      </div>
    </aside>
  );
});
