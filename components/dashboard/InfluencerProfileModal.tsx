import React from 'react';
import { Modal, Card, Button } from '../UI';
import { Influencer } from '../../types';
import { 
  User, 
  TrendingUp, 
  Users, 
  Target, 
  Star, 
  CheckCircle, 
  Instagram, 
  Image as ImageIcon,
  Zap,
  Globe,
  MapPin,
  MessageSquare
} from '../Icons';

interface InfluencerProfileModalProps {
  selectedInfluencer: Influencer | null;
  onClose: () => void;
  activeProfileTab: 'overview' | 'metrics' | 'audience' | 'portfolio' | 'services';
  setActiveProfileTab: (tab: 'overview' | 'metrics' | 'audience' | 'portfolio' | 'services') => void;
  onHire: () => void;
}

export const InfluencerProfileModal: React.FC<InfluencerProfileModalProps> = ({
  selectedInfluencer,
  onClose,
  activeProfileTab,
  setActiveProfileTab,
  onHire
}) => {
  if (!selectedInfluencer) return null;

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: <User className="w-4 h-4" /> },
    { id: 'metrics', label: 'Métricas', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'audience', label: 'Público', icon: <Users className="w-4 h-4" /> },
    { id: 'portfolio', label: 'Portfólio', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'services', label: 'Serviços', icon: <Zap className="w-4 h-4" /> },
  ] as const;

  return (
    <Modal isOpen={!!selectedInfluencer} onClose={onClose} title="Perfil do Influenciador" maxWidth="max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Info */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <img 
                src={selectedInfluencer.avatarUrl} 
                alt={selectedInfluencer.name} 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto" 
              />
              {selectedInfluencer.verified && (
                <div className="absolute bottom-1 right-1 bg-brand-blue text-white rounded-full p-1 border-2 border-white">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold mt-4 text-brand-dark">{selectedInfluencer.name}</h2>
            <p className="text-gray-400 font-medium">{selectedInfluencer.handle}</p>
            <div className="flex justify-center gap-2 mt-3">
              <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                {selectedInfluencer.niche}
              </span>
              <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                {selectedInfluencer.platform}
              </span>
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 font-medium">
                {selectedInfluencer.location?.city}, {selectedInfluencer.location?.state}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 font-medium">Brasil</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-gray-600 font-bold">{selectedInfluencer.rating} / 5.0</span>
            </div>
          </div>

          <div className="mt-8">
            <Button onClick={onHire} fullWidth size="lg" className="!bg-brand-neon hover:!bg-brand-blue shadow-lg shadow-brand-neon/20">
              Contratar Agora
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-100 mb-6 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveProfileTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                  activeProfileTab === tab.id 
                    ? 'border-brand-blue text-brand-blue' 
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeProfileTab === 'overview' && (
              <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
                <div>
                  <h3 className="font-bold text-brand-dark mb-2">Bio</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedInfluencer.bio || 'Este influenciador ainda não adicionou uma biografia.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="!bg-gray-50 !border-0 p-4">
                    <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Preço Story</span>
                    <span className="text-xl font-bold text-brand-dark">R$ {selectedInfluencer.pricePerPost}</span>
                  </Card>
                  <Card className="!bg-gray-50 !border-0 p-4">
                    <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Preço Reels</span>
                    <span className="text-xl font-bold text-brand-dark">R$ {selectedInfluencer.pricePerReel}</span>
                  </Card>
                </div>

                <div className="bg-brand-blue/5 p-4 rounded-xl border border-brand-blue/10">
                   <div className="flex items-start gap-3">
                      <div className="p-2 bg-brand-blue rounded-lg text-white">
                         <Target className="w-5 h-5" />
                      </div>
                      <div>
                         <h4 className="font-bold text-brand-blue text-sm">Estratégia de Conteúdo</h4>
                         <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {selectedInfluencer.contentStyle || 'Focado em autenticidade e conexão real com a audiência, garantindo alta conversão para marcas parceiras.'}
                         </p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeProfileTab === 'metrics' && (
              <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <span className="block text-2xl font-bold text-brand-dark">
                      {selectedInfluencer.followers >= 1000 ? `${(selectedInfluencer.followers/1000).toFixed(1)}k` : selectedInfluencer.followers}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Seguidores</span>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <span className="block text-2xl font-bold text-brand-dark">{selectedInfluencer.engagementRate}%</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Engajamento</span>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <span className="block text-2xl font-bold text-brand-dark">{selectedInfluencer.metrics?.avgViews || '0'}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Média Views</span>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <span className="block text-2xl font-bold text-brand-dark">{selectedInfluencer.metrics?.avgLikes || '0'}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Média Likes</span>
                  </div>
                </div>

                <div className="p-6 border border-gray-100 rounded-2xl">
                   <h4 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                      <Instagram className="w-5 h-5 text-pink-500" /> Histórico de Performance
                   </h4>
                   <div className="h-48 flex items-end justify-between gap-2 px-2">
                      {[45, 65, 55, 85, 75, 95, 80].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                           <div 
                              className="w-full bg-brand-blue/20 hover:bg-brand-blue/40 transition-colors rounded-t-md" 
                              style={{ height: `${h}%` }}
                           />
                           <span className="text-[10px] text-gray-400 font-bold uppercase">{['S','T','Q','Q','S','S','D'][i]}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {activeProfileTab === 'audience' && (
              <div className="animate-in fade-in slide-in-from-right-4 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-sm text-gray-400 uppercase mb-4">Gênero</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm font-bold mb-1">
                          <span className="text-gray-600">Feminino</span>
                          <span className="text-pink-500">{selectedInfluencer.audienceData?.genderSplit?.female || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-pink-500 h-full" 
                            style={{ width: `${selectedInfluencer.audienceData?.genderSplit?.female || 0}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-bold mb-1">
                          <span className="text-gray-600">Masculino</span>
                          <span className="text-blue-500">{selectedInfluencer.audienceData?.genderSplit?.male || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full" 
                            style={{ width: `${selectedInfluencer.audienceData?.genderSplit?.male || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-gray-400 uppercase mb-4">Principais Cidades</h4>
                    <div className="space-y-3">
                      {(selectedInfluencer.audienceData?.location || 'São Paulo, Rio de Janeiro, Belo Horizonte').split(',').map((city, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 font-medium">{city.trim()}</span>
                          <span className="font-bold text-brand-dark">{[42, 28, 15, 10, 5][i] || 5}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-sm text-gray-400 uppercase mb-4">Faixa Etária Predominante</h4>
                  <div className="flex items-center justify-between gap-4">
                     {['13-17', '18-24', '25-34', '35-44', '45+'].map((age, i) => (
                        <div key={age} className="flex-1 text-center">
                           <div className="text-xs font-bold text-gray-600 mb-2">{age}</div>
                           <div className="w-full bg-gray-100 h-16 rounded-lg relative overflow-hidden">
                              <div 
                                 className="absolute bottom-0 left-0 w-full bg-brand-blue/30" 
                                 style={{ height: `${[10, 35, 40, 10, 5][i]}%` }}
                              />
                           </div>
                           <div className="text-[10px] font-bold text-brand-blue mt-1">{[10, 35, 40, 10, 5][i]}%</div>
                        </div>
                     ))}
                  </div>
                </div>
              </div>
            )}

            {activeProfileTab === 'portfolio' && (
              <div className="animate-in fade-in slide-in-from-right-4">
                {selectedInfluencer.portfolio && selectedInfluencer.portfolio.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedInfluencer.portfolio.map((url, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                        <img src={url} alt={`Portfolio ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-medium">Nenhum item no portfólio ainda.</p>
                  </div>
                )}
              </div>
            )}

            {activeProfileTab === 'services' && (
              <div className="animate-in fade-in slide-in-from-right-4 space-y-4">
                {(selectedInfluencer.services && selectedInfluencer.services.length > 0) ? (
                   selectedInfluencer.services.map((service, i) => (
                      <Card key={i} className="!bg-white !shadow-sm !border-gray-100 p-4 hover:border-brand-blue/30 transition-colors">
                         <div className="flex justify-between items-center">
                            <div>
                               <h4 className="font-bold text-brand-dark">{service.format} - {service.platform}</h4>
                               <p className="text-xs text-gray-500 mt-1">{service.description || 'Entrega padrão conforme briefing.'}</p>
                            </div>
                            <div className="text-right">
                               <span className="block font-bold text-brand-blue text-lg">R$ {service.price}</span>
                               {service.negotiable && (
                                  <span className="text-[9px] font-bold text-green-600 uppercase">Negociável</span>
                               )}
                            </div>
                         </div>
                      </Card>
                   ))
                ) : (
                   <div className="space-y-4">
                      <Card className="!bg-white !shadow-sm !border-gray-100 p-4">
                         <div className="flex justify-between items-center">
                            <div>
                               <h4 className="font-bold text-brand-dark">1 Story no Instagram</h4>
                               <p className="text-xs text-gray-500 mt-1">Sequência de 1 story com link e menção.</p>
                            </div>
                            <div className="text-right">
                               <span className="block font-bold text-brand-blue text-lg">R$ {selectedInfluencer.pricePerPost}</span>
                            </div>
                         </div>
                      </Card>
                      <Card className="!bg-white !shadow-sm !border-gray-100 p-4">
                         <div className="flex justify-between items-center">
                            <div>
                               <h4 className="font-bold text-brand-dark">1 Reels no Instagram</h4>
                               <p className="text-xs text-gray-500 mt-1">Vídeo criativo de até 60s postado no feed e stories.</p>
                            </div>
                            <div className="text-right">
                               <span className="block font-bold text-brand-blue text-lg">R$ {selectedInfluencer.pricePerReel}</span>
                            </div>
                         </div>
                      </Card>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
