import React from 'react';
import { Modal, Card, Button } from '../UI';
import { Influencer } from '../../types';
import { ShoppingBag, AlertCircle, ShieldCheck, Zap } from '../Icons';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInfluencer: Influencer | null;
  serviceType: 'Story' | 'Reels';
  setServiceType: (type: 'Story' | 'Reels') => void;
  briefing: string;
  setBriefing: (text: string) => void;
  onConfirm: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedInfluencer,
  serviceType,
  setServiceType,
  briefing,
  setBriefing,
  onConfirm
}) => {
  if (!selectedInfluencer) return null;

  const price = serviceType === 'Story' ? selectedInfluencer.pricePerPost : selectedInfluencer.pricePerReel;
  const platformFee = Math.round(price * 0.1); // 10% fee example
  const total = price + platformFee;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Finalizar Contratação" maxWidth="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-blue" /> Escolha o Serviço
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setServiceType('Story')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  serviceType === 'Story' 
                    ? 'border-brand-blue bg-brand-blue/5' 
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-brand-dark">Instagram Story</span>
                  <span className="font-bold text-brand-blue text-sm">R$ {selectedInfluencer.pricePerPost}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">1 postagem de 15s com link/menção.</p>
              </button>
              <button
                onClick={() => setServiceType('Reels')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  serviceType === 'Reels' 
                    ? 'border-brand-blue bg-brand-blue/5' 
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-brand-dark">Instagram Reels</span>
                  <span className="font-bold text-brand-blue text-sm">R$ {selectedInfluencer.pricePerReel}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Vídeo criativo no feed e stories.</p>
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-brand-blue" /> Briefing do Pedido
            </h3>
            <textarea
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
              placeholder="Descreva o que o influenciador deve falar, links, hashtags e prazos..."
              className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-blue resize-none"
            />
          </section>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-blue" /> Resumo do Pedido
            </h3>
            
            <div className="flex items-center gap-3 mb-6 p-3 bg-white rounded-xl shadow-sm">
              <img src={selectedInfluencer.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-bold text-brand-dark">{selectedInfluencer.name}</p>
                <p className="text-xs text-gray-400">{selectedInfluencer.handle}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Serviço: {serviceType}</span>
                <span className="font-bold text-brand-dark">R$ {price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Taxa da Plataforma</span>
                <span className="font-bold text-brand-dark">R$ {platformFee.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-brand-dark">Total</span>
                <span className="text-brand-blue">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg border border-green-100 mb-6">
              <div className="flex gap-2 text-green-700">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <p className="text-[10px] leading-relaxed">
                  <strong>Pagamento Protegido:</strong> O valor ficará retido pela plataforma e só será liberado ao influenciador após você aprovar a entrega.
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={onConfirm} 
            fullWidth 
            size="lg" 
            disabled={!briefing.trim()}
            className="!bg-brand-black !text-white shadow-xl hover:brightness-110 disabled:opacity-50"
          >
            Confirmar e Pagar
          </Button>
          <p className="text-[10px] text-center text-gray-400 mt-4">
            Ao confirmar, você concorda com nossos Termos de Uso e Políticas de Cancelamento.
          </p>
        </div>
      </div>
    </Modal>
  );
};
