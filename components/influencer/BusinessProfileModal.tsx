import React from 'react';
import { Modal } from '../UI';
import { Building, Lock } from '../Icons';
import { User as BusinessUser } from '../../types';

interface BusinessProfileModalProps {
  selectedBusiness: BusinessUser | null;
  onClose: () => void;
}

export const BusinessProfileModal: React.FC<BusinessProfileModalProps> = React.memo(({ 
  selectedBusiness, 
  onClose 
}) => {
  return (
    <Modal isOpen={!!selectedBusiness} onClose={onClose} title="Perfil da Empresa">
      {selectedBusiness && selectedBusiness.companyProfile && (
        <div className="space-y-6">
           <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"><Building className="w-8 h-8 text-gray-400"/></div>
              <div><h2 className="text-xl font-bold">{selectedBusiness.name}</h2><p className="text-sm text-gray-500">{selectedBusiness.companyProfile.sector}</p></div>
           </div>
           <p className="text-gray-600 bg-gray-50 p-4 rounded-lg text-sm">{selectedBusiness.companyProfile.description}</p>
           
           <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="font-bold text-brand-dark mb-2 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" /> Privacidade de Contato
              </h4>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-800 leading-relaxed italic">
                  "Os dados de contato direto desta empresa são protegidos. Estes dados não estão visíveis no sistema aos usuários, apenas para a plataforma <strong>POSTS BARATOS</strong>. 
                  Utilize o chat do pedido para se comunicar com a marca."
                </p>
              </div>
           </div>
        </div>
      )}
    </Modal>
  );
});
