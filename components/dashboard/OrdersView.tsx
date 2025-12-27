import React from 'react';
import { Card, Badge, Button } from '../UI';
import { ShoppingBag, Search, Image, Calendar, MessageSquare } from '../Icons';
import { Order, Influencer } from '../../types';

interface OrdersViewProps {
  myOrders: Order[];
  influencers: Influencer[];
  setActiveOrderId: (id: string) => void;
  setActiveView: (view: any) => void;
  updateOrderStatus: (id: string, status: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = React.memo(({
  myOrders,
  influencers,
  setActiveOrderId,
  setActiveView,
  updateOrderStatus
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-brand-blue">Todos</button>
            <button className="px-4 py-2 bg-gray-50 text-gray-500 rounded-lg text-sm font-medium hover:bg-white hover:border hover:border-gray-200">Em Aberto</button>
            <button className="px-4 py-2 bg-gray-50 text-gray-500 rounded-lg text-sm font-medium hover:bg-white hover:border hover:border-gray-200">Concluídos</button>
         </div>
         <div className="relative">
           <span className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search className="w-4 h-4" /></span>
           <input type="text" placeholder="Buscar pedido..." className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-blue" />
         </div>
      </div>

      <div className="space-y-4">
        {myOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
             <ShoppingBag className="w-12 h-12 mx-auto text-gray-200 mb-4" />
             <h3 className="text-lg font-bold text-brand-dark">Nenhum pedido ainda</h3>
             <p className="text-gray-500 mb-6">Comece buscando influenciadores para sua marca.</p>
             <Button onClick={() => setActiveView('search')} variant="primary" size="sm">Explorar Influenciadores</Button>
          </div>
        ) : (
          myOrders.map(order => {
            const inf = influencers.find(i => i.id === order.influencerId);
            return (
              <Card key={order.id} className="!bg-white !shadow-sm !border-gray-200 hover:border-brand-blue/30 transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                    <img src={inf?.avatarUrl} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt={inf?.name} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-brand-dark text-lg">{inf?.name}</h4>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">#{order.id.slice(-6)}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                         <span className="flex items-center gap-1"><Image className="w-3.5 h-3.5" /> {order.serviceType}</span>
                         <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                         <span className="font-bold text-brand-blue">R$ {order.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-3">
                    <Badge status={order.status} />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setActiveOrderId(order.id); setActiveView('messages'); }}
                        className="px-4 py-2 text-xs font-bold text-brand-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Chat
                      </button>
                      {order.status === 'DELIVERED' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                          className="px-4 py-2 text-xs font-bold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                        >
                          Aprovar Entrega
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {order.briefing && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                     <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Briefing enviado:</p>
                     <p className="text-xs text-gray-600 line-clamp-2 italic">"{order.briefing}"</p>
                  </div>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  );
});
