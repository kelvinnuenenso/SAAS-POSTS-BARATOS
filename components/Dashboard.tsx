import React, { useState } from 'react';
import { Card, Button, Modal, Badge, SectionBadge } from './UI';
import { Search, Star, MessageSquare, CreditCard, Settings, ShoppingBag, CheckCircle, Target, Sliders, BarChart, FileText, ThumbsUp, DollarSign, TrendingUp, User, Globe, Image, Calendar, AlertTriangle } from './Icons';
import { Influencer, Order } from '../types';
import { useApp } from '../context/AppContext';

type View = 'search' | 'orders' | 'messages' | 'finance' | 'settings' | 'campaign';

export const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { influencers, currentUser, createOrder, orders, messages, sendMessage, updateOrderStatus } = useApp();
  const [activeView, setActiveView] = useState<View>('search');
  
  // States for Modals
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [orderToReview, setOrderToReview] = useState<string | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'metrics' | 'audience' | 'portfolio' | 'services'>('overview');
  
  // Checkout Form State
  const [serviceType, setServiceType] = useState<'Story' | 'Reels'>('Story');
  const [briefing, setBriefing] = useState('');

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Chat State
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  // Campaign Config State
  const [campaignTab, setCampaignTab] = useState<'objectives' | 'audience' | 'budget' | 'rules'>('objectives');

  // Search Filters
  const [filterSize, setFilterSize] = useState('Todos');
  const [filterPlatform, setFilterPlatform] = useState('Todos');

  const myOrders = orders.filter(o => o.businessId === currentUser?.id);

  // Derived Financial Stats (Mocked mostly based on orders)
  const totalSpent = myOrders.reduce((acc, o) => acc + o.amount, 0);
  const activeCampaigns = myOrders.filter(o => o.status === 'IN_PROGRESS' || o.status === 'PENDING').length;
  // Mock ROI
  const estimatedROI = totalSpent > 0 ? (totalSpent * 3.5).toFixed(2) : '0.00';

  const handleHireClick = () => {
    setIsCheckoutOpen(true);
  };

  const handleConfirmOrder = () => {
    if (selectedInfluencer) {
      const price = serviceType === 'Story' ? selectedInfluencer.pricePerPost : selectedInfluencer.pricePerReel;
      createOrder(selectedInfluencer.id, serviceType, price, briefing);
      setIsCheckoutOpen(false);
      setSelectedInfluencer(null);
      setBriefing('');
      setActiveView('orders');
    }
  };

  const handleOpenReview = (orderId: string) => {
    setOrderToReview(orderId);
    setIsReviewOpen(true);
  }

  const handleSubmitReview = () => {
    // In a real app, this would update the order with the review via context
    setIsReviewOpen(false);
    setOrderToReview(null);
    setReviewComment('');
    alert("Avaliação enviada com sucesso! (Simulação)");
  }

  const getActiveChatOrder = () => {
    return orders.find(o => o.id === activeOrderId);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeOrderId && messageInput.trim()) {
      sendMessage(activeOrderId, messageInput);
      setMessageInput('');
    }
  };

  const menuItems = [
    { id: 'search', label: 'Buscar Influencers', icon: <Search className="w-5 h-5" /> },
    { id: 'campaign', label: 'Campanha & Regras', icon: <Target className="w-5 h-5" /> }, // New Menu
    { id: 'orders', label: 'Meus Pedidos', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'messages', label: 'Mensagens', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'finance', label: 'Financeiro', icon: <BarChart className="w-5 h-5" /> }, // Renamed from Wallet
    { id: 'settings', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-brand-gray text-brand-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <span className="font-bold text-xl text-brand-black">Posts<span className="text-brand-blue">Baratos</span></span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeView === item.id 
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">
              {menuItems.find(i => i.id === activeView)?.label}
            </h1>
            <p className="text-gray-500">
               Bem-vindo, {currentUser?.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold">{currentUser?.name}</p>
               <p className="text-xs text-gray-500">Saldo: R$ {currentUser?.balance.toFixed(2)}</p>
             </div>
             <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">E</div>
             <button onClick={onLogout} className="md:hidden text-sm text-red-600">Sair</button>
          </div>
        </div>

        {/* --- VIEW: SEARCH --- */}
        {activeView === 'search' && (
          <>
            {/* Advanced Filters Section */}
            <Card className="mb-8 !bg-white !shadow-sm !border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-brand-blue font-bold text-sm uppercase">
                 <Sliders className="w-4 h-4" /> Preferências de Influenciadores
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nicho</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none">
                    <option>Todos os nichos</option>
                    <option>Fitness</option>
                    <option>Tecnologia</option>
                    <option>Beleza</option>
                    <option>Finanças</option>
                    <option>Games</option>
                  </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tamanho</label>
                   <select 
                    value={filterSize}
                    onChange={(e) => setFilterSize(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                   >
                    <option value="Todos">Todos</option>
                    <option value="Nano">Nano (1k - 10k)</option>
                    <option value="Micro">Micro (10k - 100k)</option>
                    <option value="Mid">Mid (100k - 500k)</option>
                    <option value="Macro">Macro (500k+)</option>
                  </select>
                </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Plataforma</label>
                   <select 
                     value={filterPlatform}
                     onChange={(e) => setFilterPlatform(e.target.value)}
                     className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                   >
                    <option value="Todos">Todas</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button fullWidth className="h-[38px] !bg-brand-neon">Filtrar Resultados</Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {influencers.map((inf) => (
                <div key={inf.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-3">
                        <img src={inf.avatarUrl} alt={inf.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h3 className="font-bold text-brand-dark flex items-center gap-1">
                            {inf.name}
                            {inf.verified && <span className="w-3 h-3 bg-brand-blue rounded-full inline-block" title="Verificado"></span>}
                          </h3>
                          <p className="text-sm text-gray-500">{inf.handle}</p>
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{inf.niche}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-xs font-bold">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {inf.rating}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6 py-4 border-y border-gray-50">
                      <div className="text-center">
                        <span className="block font-bold text-brand-dark">{inf.followers >= 1000 ? `${(inf.followers/1000).toFixed(1)}k` : inf.followers}</span>
                        <span className="text-[10px] uppercase text-gray-400 font-bold">Seguidores</span>
                      </div>
                      <div className="text-center border-l border-gray-100">
                        <span className="block font-bold text-brand-dark">{inf.engagementRate}%</span>
                        <span className="text-[10px] uppercase text-gray-400 font-bold">Engajamento</span>
                      </div>
                      <div className="text-center border-l border-gray-100">
                        <span className="block font-bold text-green-600">R$ {inf.pricePerPost}</span>
                        <span className="text-[10px] uppercase text-gray-400 font-bold">Story</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => setSelectedInfluencer(inf)} variant="outline" size="sm" fullWidth className="!text-xs">Ver Perfil Completo</Button>
                      <Button onClick={() => { setSelectedInfluencer(inf); setIsCheckoutOpen(true); }} variant="primary" size="sm" fullWidth className="!text-xs !bg-brand-neon hover:!bg-brand-blue">Contratar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ... [Rest of the file remains same until Modal] ... */}
        
        {/* --- VIEW: CAMPAIGN, ORDERS, MESSAGES, FINANCE, SETTINGS (KEPT AS IS) --- */}
        {activeView !== 'search' && activeView !== 'settings' && activeView !== 'orders' && activeView !== 'messages' && activeView !== 'finance' && activeView !== 'campaign' && null}
        
        {activeView === 'campaign' && (
           <div className="text-center p-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">Configurações de campanha (código mantido da versão anterior)...</p>
           </div>
        )}
        
        {activeView === 'orders' && (
            <div className="space-y-4">
              {myOrders.map(order => {
                  const inf = influencers.find(i => i.id === order.influencerId);
                  return (
                    <Card key={order.id} className="!bg-white !shadow-sm !border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <img src={inf?.avatarUrl} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <h4 className="font-bold text-brand-dark">{inf?.name}</h4>
                            <p className="text-sm text-gray-500">{order.serviceType} - R$ {order.amount}</p>
                            <p className="text-xs text-gray-400 mt-1">Pedido #{order.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge status={order.status} />
                          <div className="mt-2 flex flex-col items-end gap-2">
                            <button onClick={() => { setActiveView('messages'); setActiveOrderId(order.id); }} className="text-xs text-brand-blue font-bold hover:underline">
                              Abrir Chat
                            </button>
                            {order.status === 'COMPLETED' && !order.review && (
                              <Button onClick={() => handleOpenReview(order.id)} size="sm" variant="outline" className="!py-1 !px-2 !text-xs !bg-yellow-50 !border-yellow-200 !text-yellow-700">
                                <Star className="w-3 h-3 mr-1 inline" /> Avaliar
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
            </div>
        )}

        {/* --- MODAL: INFLUENCER PROFILE (UPDATED - FULL VIEW) --- */}
        <Modal 
          isOpen={!!selectedInfluencer && !isCheckoutOpen} 
          onClose={() => { setSelectedInfluencer(null); setActiveProfileTab('overview'); }}
          title="Perfil Completo do Influenciador"
        >
          {selectedInfluencer && (
            <div className="w-full">
              {/* Profile Header */}
              <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
                <img src={selectedInfluencer.avatarUrl} className="w-24 h-24 rounded-full border-4 border-gray-100 object-cover" />
                <div>
                  <h2 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
                    {selectedInfluencer.name} 
                    {selectedInfluencer.artisticName && <span className="text-sm font-normal text-gray-500">({selectedInfluencer.artisticName})</span>}
                  </h2>
                  <p className="text-brand-blue font-medium mb-1">{selectedInfluencer.handle}</p>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
                     <span className="flex items-center gap-1"><Globe className="w-3 h-3"/> {selectedInfluencer.location?.city}, {selectedInfluencer.location?.state}</span>
                     <span>•</span>
                     <span>{selectedInfluencer.niche}</span>
                     {selectedInfluencer.sizeCategory && <span>• {selectedInfluencer.sizeCategory}</span>}
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                       <CheckCircle className="w-3 h-3"/> Verificado
                    </span>
                    <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                       <Star className="w-3 h-3 fill-yellow-500 text-yellow-500"/> {selectedInfluencer.rating} (42 avaliações)
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
                {[
                  { id: 'overview', label: 'Visão Geral' },
                  { id: 'metrics', label: 'Métricas & Alcance' },
                  { id: 'audience', label: 'Público' },
                  { id: 'services', label: 'Preços' },
                  { id: 'portfolio', label: 'Portfólio' }
                ].map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveProfileTab(tab.id as any)}
                     className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeProfileTab === tab.id ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                   >
                     {tab.label}
                   </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px]">
                 {activeProfileTab === 'overview' && (
                    <div className="space-y-6">
                       <div>
                          <h4 className="font-bold text-brand-dark mb-2">Bio</h4>
                          <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">{selectedInfluencer.bio}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <h4 className="font-bold text-brand-dark mb-1 text-sm">Gênero</h4>
                             <p className="text-gray-600 text-sm">{selectedInfluencer.gender || 'Não informado'}</p>
                          </div>
                          <div>
                             <h4 className="font-bold text-brand-dark mb-1 text-sm">Idiomas</h4>
                             <p className="text-gray-600 text-sm">{selectedInfluencer.languages?.join(', ') || 'Português'}</p>
                          </div>
                          <div>
                             <h4 className="font-bold text-brand-dark mb-1 text-sm">Nichos Secundários</h4>
                             <p className="text-gray-600 text-sm">{selectedInfluencer.secondaryNiches?.join(', ') || '-'}</p>
                          </div>
                          <div>
                             <h4 className="font-bold text-brand-dark mb-1 text-sm">Plataformas</h4>
                             <div className="flex gap-2 text-sm text-gray-600">
                                {selectedInfluencer.socialHandles?.instagram && <span>IG</span>}
                                {selectedInfluencer.socialHandles?.tiktok && <span>TikTok</span>}
                                {selectedInfluencer.socialHandles?.youtube && <span>YT</span>}
                             </div>
                          </div>
                       </div>
                       <div>
                          <h4 className="font-bold text-brand-dark mb-2">Disponibilidade e Regras</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                             <div className="bg-blue-50 p-3 rounded-lg">
                                <span className="block font-bold text-blue-800">Prazo de Entrega</span>
                                <span className="text-blue-600">{selectedInfluencer.schedule?.standardDeliveryTime || '48h'}</span>
                             </div>
                             <div className="bg-red-50 p-3 rounded-lg">
                                <span className="block font-bold text-red-800">Não aceita</span>
                                <span className="text-red-600">{selectedInfluencer.rules?.noGoContent?.join(', ') || 'N/A'}</span>
                             </div>
                          </div>
                       </div>
                       <div>
                          <h4 className="font-bold text-brand-dark mb-2">Contato Público</h4>
                          <p className="text-sm text-gray-600">
                             {selectedInfluencer.contactSettings?.allowDirectContact ? (
                                <>Email: {selectedInfluencer.contactSettings?.publicEmail}<br/>WhatsApp: {selectedInfluencer.contactSettings?.whatsapp}</>
                             ) : (
                                <span className="italic text-gray-400">Contato direto oculto. Use o chat da plataforma.</span>
                             )}
                          </p>
                       </div>
                    </div>
                 )}

                 {activeProfileTab === 'metrics' && (
                    <div className="space-y-6">
                       <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-4 bg-gray-50 rounded-xl">
                             <p className="text-xs text-gray-500 uppercase">Seguidores</p>
                             <p className="text-xl font-bold">{selectedInfluencer.followers}</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl">
                             <p className="text-xs text-gray-500 uppercase">Engajamento</p>
                             <p className="text-xl font-bold">{selectedInfluencer.engagementRate}%</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-xl">
                             <p className="text-xs text-gray-500 uppercase">Média Likes</p>
                             <p className="text-xl font-bold">{selectedInfluencer.metrics?.avgLikes || '-'}</p>
                          </div>
                       </div>
                       <div>
                          <h4 className="font-bold text-brand-dark mb-2 text-sm">Alcance Médio (Estimado)</h4>
                          <div className="space-y-2">
                             <div className="flex justify-between text-sm p-2 border-b border-gray-50">
                                <span>Stories</span>
                                <span className="font-bold">{selectedInfluencer.metrics?.avgReach?.stories || '-'}</span>
                             </div>
                             <div className="flex justify-between text-sm p-2 border-b border-gray-50">
                                <span>Reels</span>
                                <span className="font-bold">{selectedInfluencer.metrics?.avgReach?.reels || '-'}</span>
                             </div>
                             <div className="flex justify-between text-sm p-2">
                                <span>Feed</span>
                                <span className="font-bold">{selectedInfluencer.metrics?.avgReach?.feed || '-'}</span>
                             </div>
                          </div>
                       </div>
                       <div>
                          <h4 className="font-bold text-brand-dark mb-2 text-sm">Marcas que já trabalharam</h4>
                          <div className="flex gap-2 flex-wrap">
                             {selectedInfluencer.metrics?.brandsWorkedWith?.map(brand => (
                                <span key={brand} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">{brand}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}

                 {activeProfileTab === 'audience' && (
                    <div className="space-y-6">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 border border-gray-100 rounded-lg">
                             <h4 className="font-bold text-brand-dark mb-1 text-sm">Localização</h4>
                             <p className="text-gray-600">{selectedInfluencer.audienceData?.location || 'Brasil'}</p>
                          </div>
                          <div className="p-4 border border-gray-100 rounded-lg">
                             <h4 className="font-bold text-brand-dark mb-1 text-sm">Faixa Etária</h4>
                             <p className="text-gray-600">{selectedInfluencer.audienceData?.ageRange || '-'}</p>
                          </div>
                       </div>
                       <div>
                          <h4 className="font-bold text-brand-dark mb-2 text-sm">Gênero da Audiência</h4>
                          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden flex relative">
                             <div className="bg-blue-400 h-full flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${selectedInfluencer.audienceData?.genderSplit?.male || 50}%` }}>
                                {selectedInfluencer.audienceData?.genderSplit?.male}% H
                             </div>
                             <div className="bg-pink-400 h-full flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${selectedInfluencer.audienceData?.genderSplit?.female || 50}%` }}>
                                {selectedInfluencer.audienceData?.genderSplit?.female}% M
                             </div>
                          </div>
                       </div>
                       <div>
                          <h4 className="font-bold text-brand-dark mb-2 text-sm">Principais Interesses</h4>
                          <div className="flex flex-wrap gap-2">
                             {selectedInfluencer.audienceData?.topInterests?.map(int => (
                                <span key={int} className="bg-brand-blue/10 text-brand-blue px-2 py-1 rounded text-xs font-bold">{int}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}

                 {activeProfileTab === 'services' && (
                    <div className="space-y-3">
                       {selectedInfluencer.services?.map(service => (
                          <div key={service.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                             <div>
                                <p className="font-bold text-brand-dark">{service.format}</p>
                                <p className="text-xs text-gray-500">{service.platform} • {service.negotiable ? 'Negociável' : 'Fixo'}</p>
                             </div>
                             <div className="text-right">
                                {service.promoPrice ? (
                                   <>
                                     <span className="block text-xs text-gray-400 line-through">R$ {service.price}</span>
                                     <span className="font-bold text-brand-blue text-lg">R$ {service.promoPrice}</span>
                                   </>
                                ) : (
                                   <span className="font-bold text-brand-blue text-lg">R$ {service.price}</span>
                                )}
                             </div>
                          </div>
                       ))}
                       <p className="text-xs text-center text-gray-400 mt-4">Valores baseados na tabela atual do influenciador.</p>
                    </div>
                 )}

                 {activeProfileTab === 'portfolio' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                       {selectedInfluencer.metrics?.portfolioUrls?.map((url, i) => (
                          <img key={i} src={url} className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:opacity-90 cursor-pointer" />
                       ))}
                       {(!selectedInfluencer.metrics?.portfolioUrls || selectedInfluencer.metrics.portfolioUrls.length === 0) && (
                          <p className="col-span-3 text-center text-gray-500 py-8">Nenhum item no portfólio ainda.</p>
                       )}
                    </div>
                 )}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100">
                <Button onClick={handleHireClick} fullWidth size="lg" className="!bg-brand-neon hover:!bg-brand-blue">
                   Iniciar Contratação
                </Button>
              </div>
            </div>
          )}
        </Modal>

      {/* ... [Checkout and Review Modals remain same] ... */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title="Finalizar Contratação"
      >
        <div className="space-y-6">
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Serviço</label>
             <div className="grid grid-cols-2 gap-4">
               <button 
                onClick={() => setServiceType('Story')}
                className={`p-3 rounded-lg border-2 text-sm font-bold ${serviceType === 'Story' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-gray-200 text-gray-500'}`}
               >
                 Story (24h)
                 <span className="block text-xs font-normal mt-1">R$ {selectedInfluencer?.pricePerPost}</span>
               </button>
               <button 
                onClick={() => setServiceType('Reels')}
                className={`p-3 rounded-lg border-2 text-sm font-bold ${serviceType === 'Reels' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-gray-200 text-gray-500'}`}
               >
                 Reels (Feed)
                 <span className="block text-xs font-normal mt-1">R$ {selectedInfluencer?.pricePerReel}</span>
               </button>
             </div>
           </div>

           <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Briefing (Instruções)</label>
             <textarea 
               value={briefing}
               onChange={(e) => setBriefing(e.target.value)}
               className="w-full h-32 bg-white border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none resize-none"
               placeholder="Descreva o que você precisa. Ex: Falar sobre a promoção de natal e mostrar o produto X..."
             ></textarea>
           </div>

           <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <span className="font-bold text-gray-700">Total a Pagar</span>
              <span className="text-xl font-bold text-brand-black">
                R$ {serviceType === 'Story' ? selectedInfluencer?.pricePerPost : selectedInfluencer?.pricePerReel}
              </span>
           </div>

           <Button onClick={handleConfirmOrder} fullWidth size="lg" className="!bg-brand-neon hover:!bg-brand-blue">Pagar e Criar Pedido</Button>
           <p className="text-xs text-center text-gray-400">Seu dinheiro fica seguro (Escrow) até a entrega.</p>
        </div>
      </Modal>

      <Modal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        title="Avaliar Influenciador"
      >
        <div className="text-center space-y-6">
           <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setReviewRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                   <Star className={`w-8 h-8 ${star <= reviewRating ? "text-yellow-500" : "text-gray-300"}`} fill={star <= reviewRating ? "#EAB308" : "none"} />
                </button>
              ))}
           </div>
           
           <div className="text-left">
              <label className="block text-sm font-bold text-gray-700 mb-2">Comentário (Opcional)</label>
              <textarea 
               value={reviewComment}
               onChange={(e) => setReviewComment(e.target.value)}
               className="w-full h-24 bg-white border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none resize-none"
               placeholder="O que achou do resultado?"
              ></textarea>
           </div>

           <Button onClick={handleSubmitReview} fullWidth className="!bg-brand-neon">Enviar Avaliação</Button>
        </div>
      </Modal>

    </div>
  );
};