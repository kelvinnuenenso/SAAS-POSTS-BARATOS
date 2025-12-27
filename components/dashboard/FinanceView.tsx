import React from 'react';
import { Card, Button } from '../UI';
import { User, Order } from '../../types';

interface FinanceViewProps {
  currentUser: User | null;
  totalSpent: number;
  activeCampaigns: number;
  myOrders: Order[];
}

export const FinanceView: React.FC<FinanceViewProps> = React.memo(({
  currentUser,
  totalSpent,
  activeCampaigns,
  myOrders
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="!bg-brand-blue !text-white !border-none">
          <p className="text-blue-100 text-sm font-medium mb-1">Saldo Disponível</p>
          <h3 className="text-3xl font-bold">R$ {currentUser?.balance.toFixed(2)}</h3>
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="secondary" className="!bg-white/20 !text-white !border-none hover:!bg-white/30">Adicionar Saldo</Button>
          </div>
        </Card>
        <Card className="!bg-white !shadow-sm !border-gray-200">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Investido</p>
          <h3 className="text-3xl font-bold text-brand-dark">R$ {totalSpent.toFixed(2)}</h3>
          <p className="text-xs text-green-500 font-bold mt-2">+{myOrders.length} campanhas realizadas</p>
        </Card>
        <Card className="!bg-white !shadow-sm !border-gray-200">
          <p className="text-gray-500 text-sm font-medium mb-1">Campanhas Ativas</p>
          <h3 className="text-3xl font-bold text-brand-dark">{activeCampaigns}</h3>
          <p className="text-xs text-gray-400 mt-2">Aguardando entrega ou aprovação</p>
        </Card>
      </div>

      <Card className="!bg-white !shadow-sm !border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-brand-dark">Histórico de Transações</h3>
          <Button variant="outline" size="sm">Exportar PDF</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 font-bold text-gray-500">Data</th>
                <th className="pb-4 font-bold text-gray-500">Descrição</th>
                <th className="pb-4 font-bold text-gray-500">Status</th>
                <th className="pb-4 font-bold text-gray-500 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">Nenhuma transação encontrada.</td>
                </tr>
              ) : (
                myOrders.map(order => (
                  <tr key={order.id}>
                    <td className="py-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4">
                      <p className="font-medium text-brand-dark">Pagamento de Campanha</p>
                      <p className="text-[10px] text-gray-400">Pedido #{order.id}</p>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700">Concluído</span>
                    </td>
                    <td className="py-4 text-right font-bold text-red-500">- R$ {order.amount.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
});
