import React from 'react';
import { Influencer } from '../../types';
import { Button } from '../UI';
import { CheckCircle } from '../Icons';

interface InfluencerCardProps {
  influencer: Influencer;
  onViewDetails: (inf: Influencer) => void;
  onHire: (inf: Influencer) => void;
}

export const InfluencerCard: React.FC<InfluencerCardProps> = React.memo(({ influencer, onViewDetails, onHire }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-3">
            <div className="relative">
              <img src={influencer.avatarUrl} alt={influencer.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-50 group-hover:border-brand-blue/30 transition-colors" />
              {influencer.verified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-brand-blue" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-brand-dark group-hover:text-brand-blue transition-colors">
                {influencer.name}
              </h3>
              <p className="text-sm text-gray-400">{influencer.handle}</p>
              <div className="flex gap-1 mt-1">
                <span className="text-[9px] bg-brand-blue/5 text-brand-blue px-2 py-0.5 rounded-full font-bold uppercase">{influencer.niche}</span>
                <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase">{influencer.platform}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6 py-4 border-y border-gray-50">
          <div className="text-center">
            <span className="block font-bold text-brand-dark text-sm">{influencer.followers >= 1000 ? `${(influencer.followers/1000).toFixed(1)}k` : influencer.followers}</span>
            <span className="text-[9px] uppercase text-gray-400 font-bold">Seguidores</span>
          </div>
          <div className="text-center border-l border-gray-100">
            <span className="block font-bold text-brand-dark text-sm">{influencer.engagementRate}%</span>
            <span className="text-[9px] uppercase text-gray-400 font-bold">Engajamento</span>
          </div>
          <div className="text-center border-l border-gray-100">
            <span className="block font-bold text-green-600 text-sm">R$ {influencer.pricePerPost}</span>
            <span className="text-[9px] uppercase text-gray-400 font-bold">Story</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => onViewDetails(influencer)} variant="outline" size="sm" fullWidth className="!text-[11px] !py-2">Ver Detalhes</Button>
          <Button onClick={() => onHire(influencer)} variant="primary" size="sm" fullWidth className="!text-[11px] !py-2 !bg-brand-neon hover:!bg-brand-blue">Contratar</Button>
        </div>
      </div>
    </div>
  );
});
