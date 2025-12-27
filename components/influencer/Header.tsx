import React from 'react';
import { Button } from '../UI';
import { Influencer } from '../../types';

interface HeaderProps {
  activeViewLabel: string;
  currentUser: Influencer | null;
  hasChanges: boolean;
  onCancelProfile: () => void;
  onSaveProfile: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({ 
  activeViewLabel, 
  currentUser, 
  hasChanges, 
  onCancelProfile, 
  onSaveProfile 
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">
          {activeViewLabel}
        </h1>
        <p className="text-gray-500 text-sm">
           {activeViewLabel === 'Meu Perfil' ? 'Edite suas informações para atrair mais parceiros.' : activeViewLabel === 'Carteira' ? 'Gerencie seus ganhos e saques.' : `Bem vindo, ${currentUser?.name}`}
        </p>
      </div>
      
      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
         {activeViewLabel === 'Meu Perfil' && hasChanges && (
           <div className="flex gap-2">
              <Button onClick={onCancelProfile} variant="ghost" size="sm" className="!text-gray-500">Cancelar</Button>
              <Button onClick={onSaveProfile} size="sm" className="!bg-green-600 !text-white shadow-green-200 animate-pulse">
                  Salvar Alterações
              </Button>
           </div>
         )}
         
         <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-bold">{currentUser?.handle}</p>
              {currentUser?.verified && <p className="text-xs text-brand-blue font-bold">Verificado</p>}
            </div>
            <img src={currentUser?.avatarUrl || 'https://via.placeholder.com/100'} className="w-10 h-10 rounded-full border border-gray-200 object-cover" alt="Avatar" />
         </div>
      </div>
    </div>
  );
});
