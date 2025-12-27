import React from 'react';
import { Card, Badge } from '../UI';
import { DollarSign, TrendingUp } from '../Icons';
import { Order, User as BusinessUser } from '../../types';

interface DashboardViewProps {
  availableBalance: number;
  activeOrdersCount: number;
  myOrders: Order[];
  getBusinessById: (id: string) => BusinessUser | undefined;
  onOpenBusinessProfile: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = React.memo(({ 
  availableBalance, 
  activeOrdersCount, 
  myOrders, 
  getBusinessById, 
  onOpenBusinessProfile 
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="!bg-white !shadow-sm !border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <DollarSign />
            </div>
            <div>
              <p className="text-sm text-gray-500">Saldo Disponível</p>
              <h3 className="text-2xl font-bold text-brand-dark">R$ {availableBalance.toFixed(2)}</h3>
            </div>
          </div>
        </Card>
        <Card className="!bg-white !shadow-sm !border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-brand-blue">
              <TrendingUp />
            </div>
            <div>
              <p className="text-sm text-gray-500">Em Andamento</p>
              <h3 className="text-2xl font-bold text-brand-dark">{activeOrdersCount}</h3>
            </div>
          </div>
        </Card>
      </div>
      <h2 className="text-xl font-bold text-brand-dark mb-4">Pedidos Recentes</h2>
      <Card className="!bg-white !shadow-sm !border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-bold text-gray-500">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Serviço</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myOrders.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center">Nenhum pedido encontrado.</td></tr>
              ) : (
                myOrders.map(o => {
                   const company = getBusinessById(o.businessId);
                   return (
                    <tr key={o.id}>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">#{o.id}</td>
                      <td className="px-6 py-4">
                         <button onClick={() => onOpenBusinessProfile(o.businessId)} className="font-bold text-brand-blue hover:underline">
                           {company ? company.name : 'Empresa'}
                         </button>
                      </td>
                      <td className="px-6 py-4 font-bold">{o.serviceType}</td>
                      <td className="px-6 py-4 text-green-600 font-bold">R$ {o.amount}</td>
                      <td className="px-6 py-4"><Badge status={o.status} /></td>
                    </tr>
                   )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
});
