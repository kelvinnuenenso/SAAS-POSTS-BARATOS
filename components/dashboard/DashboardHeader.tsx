import React from 'react';
import { User } from '../../types';

interface DashboardHeaderProps {
  activeViewLabel: string;
  currentUser: User | null;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = React.memo(({ activeViewLabel, currentUser, onLogout }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">
          {activeViewLabel}
        </h1>
        <p className="text-gray-500">
           Bem-vindo, {currentUser?.name}
        </p>
      </div>
      <div className="flex items-center gap-4">
         <div className="text-right hidden sm:block">
           <p className="text-sm font-bold">{currentUser?.name}</p>
           <p className="text-xs text-gray-500">Saldo: R$ {currentUser?.balance.toFixed(2)}</p>
         </div>
         <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
           {currentUser?.name?.charAt(0) || 'U'}
         </div>
         <button onClick={onLogout} className="md:hidden text-sm text-red-600">Sair</button>
      </div>
    </div>
  );
});
