import React from 'react';
import { Badge, Button } from '../UI';
import { MessageSquare } from '../Icons';
import { Order, Influencer, Message, User } from '../../types';

interface MessagesViewProps {
  myOrders: Order[];
  influencers: Influencer[];
  messages: Message[];
  activeOrderId: string | null;
  setActiveOrderId: (id: string) => void;
  currentUser: User | null;
  messageInput: string;
  setMessageInput: (val: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = React.memo(({
  myOrders,
  influencers,
  messages,
  activeOrderId,
  setActiveOrderId,
  currentUser,
  messageInput,
  setMessageInput,
  handleSendMessage
}) => {
  const activeOrder = myOrders.find(o => o.id === activeOrderId);
  const activeInfluencer = influencers.find(i => i.id === activeOrder?.influencerId);

  return (
    <div className="flex h-[calc(100vh-180px)] gap-6">
      {/* Order List / Chat List */}
      <div className="w-1/3 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-sm text-gray-700 uppercase">Conversas por Pedido</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {myOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Nenhum pedido ativo para conversar.</div>
          ) : (
            myOrders.map(order => {
              const inf = influencers.find(i => i.id === order.influencerId);
              const lastMsg = messages.filter(m => m.orderId === order.id).slice(-1)[0];
              return (
                <button
                  key={order.id}
                  onClick={() => setActiveOrderId(order.id)}
                  className={`w-full p-4 border-b border-gray-50 flex gap-3 text-left transition-colors ${activeOrderId === order.id ? 'bg-blue-50 border-l-4 border-l-brand-blue' : 'hover:bg-gray-50'}`}
                >
                  <img src={inf?.avatarUrl} className="w-10 h-10 rounded-full object-cover shrink-0" alt={inf?.name} />
                  <div className="overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-sm truncate">{inf?.name}</h4>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">#{order.id.slice(-4)}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{lastMsg ? lastMsg.text : 'Nenhuma mensagem ainda...'}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Active Chat */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
        {activeOrderId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img 
                  src={activeInfluencer?.avatarUrl} 
                  className="w-8 h-8 rounded-full object-cover" 
                  alt={activeInfluencer?.name}
                />
                <div>
                  <h3 className="font-bold text-sm">{activeInfluencer?.name}</h3>
                  <p className="text-[10px] text-gray-500">{activeOrder?.serviceType}</p>
                </div>
              </div>
              <Badge status={activeOrder?.status || 'PENDING'} />
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.filter(m => m.orderId === activeOrderId).map(msg => {
                const isMe = msg.senderId === currentUser?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe ? 'bg-brand-blue text-white rounded-tr-none' : 'bg-white text-gray-700 shadow-sm rounded-tl-none'}`}>
                      {msg.text}
                      <span className={`block text-[9px] mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex gap-2">
              <input 
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <Button type="submit" variant="primary" size="sm">Enviar</Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p>Selecione um pedido para iniciar a conversa.</p>
          </div>
        )}
      </div>
    </div>
  );
});
