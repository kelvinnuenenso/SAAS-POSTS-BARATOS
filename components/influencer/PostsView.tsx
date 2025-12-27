import React from 'react';
import { Card, Button, Badge } from '../UI';
import { Camera, ArrowUpRight, MessageSquare } from '../Icons';
import { Order, User as BusinessUser } from '../../types';

interface PostsViewProps {
  activeOrders: Order[];
  getBusinessById: (id: string) => BusinessUser | undefined;
  deliveryLink: string;
  setDeliveryLink: (link: string) => void;
  onDeliver: (orderId: string) => void;
  onOpenBusinessProfile: (id: string) => void;
  onOpenChat: (orderId: string) => void;
}

export const PostsView: React.FC<PostsViewProps> = React.memo(({ 
  activeOrders, 
  getBusinessById, 
  deliveryLink, 
  setDeliveryLink, 
  onDeliver, 
  onOpenBusinessProfile, 
  onOpenChat 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeOrders.length === 0 ? (
          <Card className="md:col-span-2 !bg-white !border-gray-200 text-center py-12">
            <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum post em andamento no momento.</p>
          </Card>
        ) : (
          activeOrders.map(order => {
            const company = getBusinessById(order.businessId);
            return (
              <Card key={order.id} className="!bg-white !shadow-sm !border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge status={order.status} />
                    <h3 className="font-bold text-lg mt-2">{order.serviceType}</h3>
                    <p className="text-sm text-gray-500">Para: <button onClick={() => onOpenBusinessProfile(order.businessId)} className="font-bold text-brand-blue hover:underline">{company?.name || 'Empresa'}</button></p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-bold">R$ {order.amount}</p>
                    <p className="text-[10px] text-gray-400">ID: #{order.id}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Instruções:</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{order.briefing || 'Nenhum briefing fornecido.'}</p>
                </div>

                <div className="space-y-4">
                   <div className="flex gap-2">
                      <Button onClick={() => onOpenChat(order.id)} variant="ghost" size="sm" fullWidth className="!bg-gray-100 !text-gray-600">
                         <MessageSquare className="w-4 h-4 mr-2"/> Chat do Pedido
                      </Button>
                   </div>
                   
                   <div className="h-px bg-gray-100 my-4"></div>
                   
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Link da Entrega (Instagram/TikTok)</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="https://www.instagram.com/p/..." 
                          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-blue transition-colors"
                          value={deliveryLink}
                          onChange={(e) => setDeliveryLink(e.target.value)}
                        />
                        <Button onClick={() => onDeliver(order.id)} size="sm" className="!bg-brand-black !text-brand-yellow">
                           <ArrowUpRight className="w-4 h-4 mr-2"/> Entregar
                        </Button>
                      </div>
                   </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  );
});
