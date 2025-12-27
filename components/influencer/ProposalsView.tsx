import React from 'react';
import { Card, Button, Badge } from '../UI';
import { Order, User as BusinessUser } from '../../types';

interface ProposalsViewProps {
  pendingOrders: Order[];
  getBusinessById: (id: string) => BusinessUser | undefined;
  onOpenBusinessProfile: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export const ProposalsView: React.FC<ProposalsViewProps> = React.memo(({ 
  pendingOrders, 
  getBusinessById, 
  onOpenBusinessProfile, 
  onUpdateStatus 
}) => {
  return (
    <div className="space-y-4">
      {pendingOrders.length === 0 ? (
         <Card className="!bg-white !border-gray-200 text-center py-12">
            <p className="text-gray-500">Nenhuma proposta pendente no momento.</p>
         </Card>
      ) : (
         pendingOrders.map(order => {
            const company = getBusinessById(order.businessId);
            return (
             <Card key={order.id} className="!bg-white !shadow-sm !border-gray-200">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="font-bold text-lg text-brand-dark mb-1">Nova Proposta: {order.serviceType}</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        De: <button onClick={() => onOpenBusinessProfile(order.businessId)} className="font-bold text-brand-blue hover:underline">{company ? company.name : 'Empresa Oculta'}</button>
                      </p>
                      <p className="text-green-600 font-bold text-xl mb-4">R$ {order.amount}</p>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mb-4">
                         <p className="font-bold mb-1">Briefing da Empresa:</p>
                         <p>{order.briefing || 'Sem instruções adicionais.'}</p>
                      </div>
                      <div className="flex gap-2">
                         <Button onClick={() => onUpdateStatus(order.id, 'IN_PROGRESS')} size="sm">Aceitar Proposta</Button>
                         <Button onClick={() => onUpdateStatus(order.id, 'REJECTED')} variant="ghost" size="sm" className="!text-red-500 hover:!bg-red-50">Recusar</Button>
                      </div>
                   </div>
                   <Badge status={order.status} />
                </div>
             </Card>
            )
         })
      )}
    </div>
  );
});
