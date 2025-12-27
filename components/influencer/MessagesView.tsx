import React from 'react';
import { Card, Button } from '../UI';
import { MessageSquare, ShoppingBag, Send } from '../Icons';
import { Order, User as BusinessUser, Message } from '../../types';

interface MessagesViewProps {
  myOrders: Order[];
  getBusinessById: (id: string) => BusinessUser | undefined;
  messages: Message[];
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
  currentUser: BusinessUser | null;
  messageInput: string;
  setMessageInput: (input: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = React.memo(({ 
  myOrders, 
  getBusinessById, 
  messages, 
  activeOrderId, 
  setActiveOrderId, 
  currentUser, 
  messageInput, 
  setMessageInput, 
  onSendMessage 
}) => {
  const activeOrderMessages = messages.filter(m => m.orderId === activeOrderId);
  const ordersWithMessages = myOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'REJECTED');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Sidebar: Lista de Conversas */}
      <Card className="lg:col-span-1 !bg-white !border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
           <h3 className="font-bold flex items-center gap-2"><MessageSquare className="w-5 h-5"/> Conversas Ativas</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
           {ordersWithMessages.length === 0 ? (
             <div className="p-8 text-center text-gray-400 text-sm">Nenhuma conversa ativa.</div>
           ) : (
             ordersWithMessages.map(order => {
               const business = getBusinessById(order.businessId);
               return (
                 <button
                   key={order.id}
                   onClick={() => setActiveOrderId(order.id)}
                   className={`w-full p-4 text-left border-b border-gray-50 transition-colors hover:bg-gray-50 ${activeOrderId === order.id ? 'bg-blue-50 border-l-4 border-l-brand-blue' : ''}`}
                 >
                   <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm text-brand-dark">{business?.name || 'Empresa'}</span>
                      <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-mono">#{order.id.slice(0,6)}</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ShoppingBag className="w-3 h-3"/>
                      <span>{order.serviceType}</span>
                   </div>
                 </button>
               )
             })
           )}
        </div>
      </Card>

      {/* Chat Window */}
      <Card className="lg:col-span-2 !bg-white !border-gray-200 flex flex-col overflow-hidden">
        {activeOrderId ? (
          <>
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue font-bold">
                    {getBusinessById(myOrders.find(o => o.id === activeOrderId)?.businessId || '')?.name?.[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-dark">{getBusinessById(myOrders.find(o => o.id === activeOrderId)?.businessId || '')?.name}</h4>
                    <p className="text-[10px] text-gray-400">Pedido: {myOrders.find(o => o.id === activeOrderId)?.serviceType}</p>
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
               {activeOrderMessages.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                    <MessageSquare className="w-12 h-12 opacity-20"/>
                    <p className="text-sm italic">Inicie a conversa sobre este pedido.</p>
                 </div>
               ) : (
                 activeOrderMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                         msg.senderId === currentUser?.id 
                           ? 'bg-brand-blue text-white rounded-tr-none' 
                           : 'bg-white border border-gray-200 text-brand-dark rounded-tl-none shadow-sm'
                       }`}>
                          {msg.text}
                          <p className={`text-[9px] mt-1 opacity-60 ${msg.senderId === currentUser?.id ? 'text-right' : 'text-left'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                       </div>
                    </div>
                 ))
               )}
            </div>

            <form onSubmit={onSendMessage} className="p-4 border-t border-gray-100 bg-white">
               <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Escreva sua mensagem..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-brand-blue focus:bg-white transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                  >
                    <Send className="w-5 h-5" />
                  </button>
               </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <MessageSquare className="w-10 h-10 opacity-20"/>
             </div>
             <p className="font-medium">Selecione uma conversa para começar</p>
          </div>
        )}
      </Card>
    </div>
  );
});
