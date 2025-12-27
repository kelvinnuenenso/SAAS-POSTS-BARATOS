import React from 'react';
import { Modal, Button } from '../UI';
import { InfluencerService } from '../../types';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  newService: Partial<InfluencerService>;
  setNewService: (service: any) => void;
  onAddService: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = React.memo(({ 
  isOpen, 
  onClose, 
  newService, 
  setNewService, 
  onAddService 
}) => {
  const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1";
  const inputClass = "w-full bg-white border border-gray-300 hover:border-brand-blue focus:border-brand-blue rounded-lg px-3 py-2 text-sm transition-all outline-none text-brand-black";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Serviço">
       <div className="space-y-4">
          <div>
             <label className={labelClass}>Plataforma</label>
             <select className={inputClass} value={newService.platform} onChange={(e) => setNewService((prev: any) => ({...prev, platform: e.target.value as any}))}>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
             </select>
          </div>
          <div>
             <label className={labelClass}>Formato</label>
             <select className={inputClass} value={newService.format} onChange={(e) => setNewService((prev: any) => ({...prev, format: e.target.value as any}))}>
                <option value="Story">Story</option>
                <option value="Reels">Reels</option>
                <option value="Feed">Feed Post</option>
                <option value="TikTok Video">TikTok Video</option>
             </select>
          </div>
          <div>
             <label className={labelClass}>Preço (R$)</label>
             <input type="number" className={inputClass} value={newService.price || ''} onChange={(e) => setNewService((prev: any) => ({...prev, price: Number(e.target.value)}))} placeholder="0.00" />
          </div>
          <Button onClick={onAddService} fullWidth className="!bg-brand-black !text-brand-yellow">Salvar Serviço</Button>
       </div>
    </Modal>
  );
});
