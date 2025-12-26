import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Modal, SectionBadge } from './UI';
import { TrendingUp, DollarSign, CheckCircle, ShieldCheck, LayoutGrid, FileText, Camera, CreditCard, User as UserIcon, MessageSquare, Star, Sliders, Calendar, Edit, PieChart, AlertTriangle, Image, Target, Building, Globe, Users, ShoppingBag, Zap, Menu, Search, Trash, Plus, ArrowUpRight, ArrowDownLeft, Download, Bell, Lock, Filter, RefreshCw, Clock, Repeat, ThumbsDown, Sparkles, Paperclip, ChevronDown, BarChart2, ThumbsUp } from './Icons';
import { useApp } from '../context/AppContext';
import { Influencer, User as BusinessUser, InfluencerService, Order } from '../types';

type View = 'dashboard' | 'proposals' | 'posts' | 'wallet' | 'profile' | 'messages' | 'reviews';
type ProfileTab = 'general' | 'metrics' | 'pricing' | 'audience' | 'style' | 'schedule' | 'rules';
type WalletTab = 'overview' | 'history' | 'withdraw' | 'settings';

interface Withdrawal {
  id: string;
  date: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  method: string;
}

interface ReviewExtended {
  id: string;
  clientName: string;
  clientAvatar?: string;
  rating: number;
  date: string;
  text: string;
  serviceType: string;
  tags: string[];
  isRecurring: boolean;
  clientId: string;
}

// Mock Reviews Data
const MOCK_REVIEWS: ReviewExtended[] = [
  { id: 'r1', clientName: 'Ana Boutique', clientAvatar: 'https://picsum.photos/50/50?r=1', rating: 5, date: '2023-10-15', text: 'Simplesmente incrível! A entrega foi super rápida e o conteúdo ficou muito natural. Minhas vendas aumentaram no mesmo dia.', serviceType: 'Story', tags: ['Rápido', 'Criativo', 'Conversão'], isRecurring: true, clientId: 'c1' },
  { id: 'r2', clientName: 'Tech Store', clientAvatar: 'https://picsum.photos/50/50?r=2', rating: 4, date: '2023-10-10', text: 'Muito bom o vídeo, qualidade de imagem excelente. Só atrasou um pouco na resposta do briefing, mas compensou no resultado.', serviceType: 'Reels', tags: ['Qualidade Visual'], isRecurring: false, clientId: 'c2' },
  { id: 'r3', clientName: 'Cafe & Co', clientAvatar: '', rating: 5, date: '2023-09-28', text: 'Adorei a forma como ela apresentou nosso produto. Super carismática!', serviceType: 'Story', tags: ['Carisma', 'Espontâneo'], isRecurring: true, clientId: 'c3' },
];

export const InfluencerDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { currentUser, orders, updateOrderStatus, messages, sendMessage, getBusinessById, updateUser } = useApp();
  const influencer = currentUser as Influencer; 
  
  // Navigation State
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTab>('general');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Profile Data State (Local state for editing)
  const [profileData, setProfileData] = useState<Influencer>(influencer);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Wallet State
  const [activeWalletTab, setActiveWalletTab] = useState<WalletTab>('overview');
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [newPixKey, setNewPixKey] = useState('');
  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [financialSettings, setFinancialSettings] = useState({
     notifyPayment: true,
     notifyWithdraw: true,
     cpfCnpj: influencer.paymentInfo?.document || '',
     fullName: influencer.name,
     taxAddress: '',
  });
  
  // Modals & Temp States
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessUser | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [newService, setNewService] = useState<Partial<InfluencerService>>({ negotiable: false, platform: 'Instagram', format: 'Story' });
  const [deliveryLink, setDeliveryLink] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  
  // Image Upload Refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const mediaKitInputRef = useRef<HTMLInputElement>(null);

  // Sync profileData with currentUser on load
  useEffect(() => {
    if (currentUser) {
      setProfileData(currentUser as Influencer);
    }
  }, [currentUser]);

  // Derived Stats
  const myOrders = orders.filter(o => o.influencerId === currentUser?.id);
  const pendingOrders = myOrders.filter(o => o.status === 'PENDING');
  const activeOrders = myOrders.filter(o => o.status === 'IN_PROGRESS');
  const completedOrders = myOrders.filter(o => o.status === 'COMPLETED');
  const totalEarnings = completedOrders.reduce((acc, curr) => acc + curr.amount, 0);

  // Financial Calculations
  const pendingIncome = activeOrders.reduce((acc, curr) => acc + curr.amount, 0) + 
                        myOrders.filter(o => o.status === 'DELIVERED').reduce((acc, curr) => acc + curr.amount, 0);
  const totalWithdrawn = withdrawals.filter(w => w.status !== 'REJECTED').reduce((acc, w) => acc + w.amount, 0);
  const availableBalance = totalEarnings - totalWithdrawn;

  // Transactions History (Unified)
  const transactions = [
     ...completedOrders.map(o => ({
        id: o.id,
        date: o.createdAt, 
        type: 'IN',
        amount: o.amount,
        status: 'COMPLETED',
        origin: getBusinessById(o.businessId)?.name || 'Empresa',
        details: `Pagamento Pedido #${o.id}`
     })),
     ...withdrawals.map(w => ({
        id: w.id,
        date: w.date,
        type: 'OUT',
        amount: w.amount,
        status: w.status,
        origin: 'PostsBaratos',
        details: `Saque via ${w.method}`
     }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Review Calculations
  const averageRating = MOCK_REVIEWS.reduce((acc, r) => acc + r.rating, 0) / MOCK_REVIEWS.length;
  
  // --- Handlers ---

  const handleDeliver = (orderId: string) => {
    if (deliveryLink) {
      updateOrderStatus(orderId, 'DELIVERED', deliveryLink);
      setDeliveryLink('');
      setActiveView('dashboard');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeOrderId && messageInput.trim()) {
      sendMessage(activeOrderId, messageInput);
      setMessageInput('');
    }
  };

  const openBusinessProfile = (businessId: string) => {
    const business = getBusinessById(businessId);
    if (business) setSelectedBusiness(business);
  };

  // --- Wallet Handlers ---

  const handleWithdrawRequest = () => {
     const amount = parseFloat(withdrawalAmount);
     if (isNaN(amount) || amount <= 0) {
        alert("Digite um valor válido.");
        return;
     }
     if (amount > availableBalance) {
        alert("Saldo insuficiente.");
        return;
     }
     if (!influencer.paymentInfo?.pixKey) {
        alert("Adicione uma chave PIX primeiro.");
        setActiveWalletTab('settings');
        return;
     }

     const newWithdrawal: Withdrawal = {
        id: `wd-${Date.now()}`,
        date: new Date().toISOString(),
        amount: amount,
        status: 'PENDING',
        method: 'PIX'
     };

     setWithdrawals(prev => [newWithdrawal, ...prev]);
     setWithdrawalAmount('');
     alert("Solicitação de saque enviada com sucesso! O processamento leva até 24h.");
  };

  const handleSaveFinancialSettings = () => {
     updateNestedField('paymentInfo', 'document', financialSettings.cpfCnpj);
     alert("Configurações salvas.");
  };

  // --- Profile Data Handlers ---

  const handleSaveProfile = () => {
    updateUser(profileData);
    setHasChanges(false);
    alert('Perfil atualizado com sucesso! Suas alterações já estão visíveis para as empresas.');
  };

  const handleCancelProfile = () => {
    setProfileData(influencer); // Revert to context data
    setHasChanges(false);
  };

  const updateField = (field: keyof Influencer, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const updateNestedField = (parent: keyof Influencer, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any || {}),
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'avatar' | 'portfolio' | 'mediaKit') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (target === 'avatar') updateField('avatarUrl', url);
      else if (target === 'portfolio') {
        const currentUrls = profileData.metrics?.portfolioUrls || [];
        updateNestedField('metrics', 'portfolioUrls', [...currentUrls, url]);
      } else if (target === 'mediaKit') {
         updateNestedField('metrics', 'mediaKitUrl', url);
         alert("Mídia Kit enviado com sucesso!");
      }
    }
  };

  const handleAddService = () => {
    if (newService.price && newService.format) {
      const service: InfluencerService = {
        id: `srv-${Date.now()}`,
        platform: newService.platform as any,
        format: newService.format as any,
        price: Number(newService.price),
        promoPrice: newService.promoPrice ? Number(newService.promoPrice) : undefined,
        negotiable: newService.negotiable || false
      };
      const currentServices = profileData.services || [];
      updateField('services', [...currentServices, service]);
      setIsServiceModalOpen(false);
      setNewService({ negotiable: false, platform: 'Instagram', format: 'Story' });
    }
  };

  const removeService = (id: string) => {
    const currentServices = profileData.services || [];
    updateField('services', currentServices.filter(s => s.id !== id));
  };

  const toggleArrayItem = (parent: keyof Influencer, field: string, item: string) => {
    // @ts-ignore
    const list = profileData[parent]?.[field] || [];
    if (list.includes(item)) updateNestedField(parent, field, list.filter((i: string) => i !== item));
    else updateNestedField(parent, field, [...list, item]);
  };

  // Helper Inputs styling
  const inputClass = "w-full bg-white border border-gray-300 hover:border-brand-blue focus:border-brand-blue rounded-lg px-3 py-2 text-sm transition-all outline-none text-brand-black";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1";

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'proposals', label: 'Propostas', icon: <FileText className="w-5 h-5" /> },
    { id: 'messages', label: 'Mensagens', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'posts', label: 'Meus Posts', icon: <Camera className="w-5 h-5" /> },
    { id: 'reviews', label: 'Avaliações', icon: <Star className="w-5 h-5" /> },
    { id: 'wallet', label: 'Carteira', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'profile', label: 'Meu Perfil', icon: <UserIcon className="w-5 h-5" /> },
  ];

  const profileTabs = [
     { id: 'general', label: 'Geral', icon: <UserIcon className="w-4 h-4"/> },
     { id: 'metrics', label: 'Métricas', icon: <BarChart2 className="w-4 h-4"/> },
     { id: 'pricing', label: 'Serviços', icon: <DollarSign className="w-4 h-4"/> },
     { id: 'audience', label: 'Público', icon: <Users className="w-4 h-4"/> },
     { id: 'style', label: 'Estilo', icon: <Image className="w-4 h-4"/> },
     { id: 'schedule', label: 'Agenda', icon: <Calendar className="w-4 h-4"/> },
     { id: 'rules', label: 'Regras', icon: <ShieldCheck className="w-4 h-4"/> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-brand-black flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-50">
         <span className="font-bold text-xl text-brand-black">Posts<span className="text-brand-blue">Baratos</span></span>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu /></button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 w-64 bg-white border-r border-gray-200 h-screen z-40 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <span className="font-bold text-xl text-brand-black">Posts<span className="text-brand-blue">Baratos</span></span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id as View); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeView === item.id 
                  ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
              {item.id === 'proposals' && pendingOrders.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingOrders.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 mt-auto">
          <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">
              {menuItems.find(i => i.id === activeView)?.label}
            </h1>
            <p className="text-gray-500 text-sm">
               {activeView === 'profile' ? 'Edite suas informações para atrair mais parceiros.' : activeView === 'wallet' ? 'Gerencie seus ganhos e saques.' : activeView === 'reviews' ? 'Monitore sua reputação.' : `Bem vindo, ${currentUser?.name}`}
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
             {activeView === 'profile' && hasChanges && (
               <div className="flex gap-2">
                  <Button onClick={handleCancelProfile} variant="ghost" size="sm" className="!text-gray-500">Cancelar</Button>
                  <Button onClick={handleSaveProfile} size="sm" className="!bg-green-600 !text-white shadow-green-200 animate-pulse">
                      Salvar Alterações
                  </Button>
               </div>
             )}
             
             <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-bold">{influencer?.handle}</p>
                  {influencer?.verified && <p className="text-xs text-brand-blue font-bold">Verificado</p>}
                </div>
                <img src={currentUser?.avatarUrl || 'https://via.placeholder.com/100'} className="w-10 h-10 rounded-full border border-gray-200 object-cover" alt="Avatar" />
             </div>
          </div>
        </div>

        {/* --- VIEW: DASHBOARD --- */}
        {activeView === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="!bg-white !shadow-sm !border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <DollarSign />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Saldo Disponível</p>
                    <h3 className="text-2xl font-bold text-brand-dark">R$ {availableBalance.toFixed(2)}</h3>
                  </div>
                </div>
              </Card>
              <Card className="!bg-white !shadow-sm !border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-brand-blue">
                    <TrendingUp />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Em Andamento</p>
                    <h3 className="text-2xl font-bold text-brand-dark">{activeOrders.length}</h3>
                  </div>
                </div>
              </Card>
              <Card className="!bg-white !shadow-sm !border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <CheckCircle />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Posts Entregues</p>
                    <h3 className="text-2xl font-bold text-brand-dark">{completedOrders.length}</h3>
                  </div>
                </div>
              </Card>
            </div>
            <h2 className="text-xl font-bold text-brand-dark mb-4">Pedidos Recentes</h2>
            <Card className="!bg-white !shadow-sm !border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-bold text-gray-500">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Empresa</th>
                      <th className="px-6 py-4">Serviço</th>
                      <th className="px-6 py-4">Valor</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {myOrders.length === 0 ? (
                      <tr><td colSpan={5} className="p-6 text-center">Nenhum pedido encontrado.</td></tr>
                    ) : (
                      myOrders.map(o => {
                         const company = getBusinessById(o.businessId);
                         return (
                          <tr key={o.id}>
                            <td className="px-6 py-4 font-mono text-xs text-gray-500">#{o.id}</td>
                            <td className="px-6 py-4">
                               <button onClick={() => openBusinessProfile(o.businessId)} className="font-bold text-brand-blue hover:underline">
                                 {company ? company.name : 'Empresa'}
                               </button>
                            </td>
                            <td className="px-6 py-4 font-bold">{o.serviceType}</td>
                            <td className="px-6 py-4 text-green-600 font-bold">R$ {o.amount}</td>
                            <td className="px-6 py-4"><Badge status={o.status} /></td>
                          </tr>
                         )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {/* --- VIEW: PROPOSALS --- */}
        {activeView === 'proposals' && (
           <div className="space-y-4">
             {pendingOrders.length === 0 ? (
                <Card className="!bg-white !border-gray-200 text-center py-12">
                   <p className="text-gray-500">Nenhuma proposta pendente no momento.</p>
                </Card>
             ) : (
                pendingOrders.map(order => {
                   const company = getBusinessById(order.businessId);
                   return (
                    <Card key={order.id} className="!bg-white !shadow-sm !border-gray-200">
                       <div className="flex justify-between items-start">
                          <div>
                             <h3 className="font-bold text-lg text-brand-dark mb-1">Nova Proposta: {order.serviceType}</h3>
                             <p className="text-sm text-gray-500 mb-4">
                               De: <button onClick={() => openBusinessProfile(order.businessId)} className="font-bold text-brand-blue hover:underline">{company ? company.name : 'Empresa Oculta'}</button>
                             </p>
                             <p className="text-green-600 font-bold text-xl mb-4">R$ {order.amount}</p>
                             <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mb-4">
                                <span className="font-bold block mb-1">Briefing:</span>
                                {order.briefing}
                             </div>
                          </div>
                          <div className="flex flex-col gap-2 min-w-[150px]">
                             <Button onClick={() => updateOrderStatus(order.id, 'IN_PROGRESS')} variant="primary" size="sm" className="!bg-brand-neon">Aceitar Proposta</Button>
                             <Button onClick={() => updateOrderStatus(order.id, 'CANCELLED')} variant="danger" size="sm">Recusar</Button>
                             <Button onClick={() => openBusinessProfile(order.businessId)} variant="outline" size="sm" className="!text-xs">Ver Perfil da Empresa</Button>
                          </div>
                       </div>
                    </Card>
                   )
                })
             )}
           </div>
        )}

        {/* --- VIEW: MESSAGES --- */}
        {activeView === 'messages' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px] max-h-[calc(100vh-200px)]">
            <Card className="!bg-white !shadow-sm !border-gray-200 md:col-span-1 overflow-y-auto p-0">
               <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-500 uppercase text-xs">Conversas</h3>
               </div>
               <div className="divide-y divide-gray-50">
                 {myOrders.map(order => {
                   const company = getBusinessById(order.businessId);
                   return (
                   <div 
                    key={order.id} 
                    onClick={() => setActiveOrderId(order.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${activeOrderId === order.id ? 'bg-blue-50' : ''}`}
                   >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">{company?.name.substring(0,1) || 'E'}</div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-brand-dark">{company?.name || 'Empresa'}</p>
                          <p className="text-xs text-gray-500 truncate">Pedido #{order.id} - {order.status}</p>
                        </div>
                      </div>
                   </div>
                 )})}
                 {myOrders.length === 0 && (
                   <p className="p-4 text-xs text-gray-400 text-center">Nenhuma conversa iniciada.</p>
                 )}
               </div>
            </Card>
            
            <Card className="!bg-white !shadow-sm !border-gray-200 md:col-span-2 flex flex-col p-0 overflow-hidden">
               {activeOrderId ? (
                 <>
                   <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                      <span className="font-bold text-sm text-brand-dark">Chat do Pedido #{activeOrderId}</span>
                      <Button onClick={() => {
                        const ord = orders.find(o => o.id === activeOrderId);
                        if(ord) openBusinessProfile(ord.businessId);
                      }} size="sm" variant="ghost" className="!text-xs text-brand-blue">Ver Perfil Empresa</Button>
                   </div>
                   <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
                      {messages.filter(m => m.orderId === activeOrderId).map(msg => {
                        const isMe = msg.senderId === currentUser?.id;
                        return (
                          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[80%] rounded-xl p-3 text-sm ${isMe ? 'bg-brand-blue text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                                {msg.text}
                             </div>
                          </div>
                        )
                      })}
                   </div>
                   <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Digite sua mensagem..." 
                          className="flex-1 bg-gray-100 border-0 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                        />
                        <Button type="submit" size="sm" className="!bg-brand-neon">Enviar</Button>
                      </div>
                   </form>
                 </>
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                    <p>Selecione uma conversa ao lado</p>
                 </div>
               )}
            </Card>
          </div>
        )}

        {/* --- VIEW: POSTS (DELIVERY) --- */}
        {activeView === 'posts' && (
           <div className="max-w-3xl">
              <Card className="!bg-white !shadow-sm !border-gray-200 mb-6">
                <h3 className="font-bold text-lg text-brand-dark mb-4">Entregar Trabalho</h3>
                
                {activeOrders.length === 0 ? (
                   <p className="text-gray-500">Você não tem pedidos em produção para entregar.</p>
                ) : (
                  <div className="space-y-6">
                     {activeOrders.map(order => {
                       const company = getBusinessById(order.businessId);
                       return (
                        <div key={order.id} className="p-4 border border-gray-200 rounded-xl">
                           <div className="flex justify-between mb-4">
                              <div>
                                 <span className="font-bold text-sm block">Pedido #{order.id} - {order.serviceType}</span>
                                 <span className="text-xs text-gray-500">Para: {company?.name}</span>
                              </div>
                              <span className="text-green-600 font-bold">R$ {order.amount}</span>
                           </div>
                           <div className="flex gap-2">
                              <input 
                                type="text" 
                                placeholder="Cole o link do Story/Reels aqui..." 
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm"
                                value={deliveryLink}
                                onChange={(e) => setDeliveryLink(e.target.value)}
                              />
                              <Button onClick={() => handleDeliver(order.id)} size="sm" className="!bg-brand-neon">Enviar</Button>
                           </div>
                        </div>
                     )})}
                  </div>
                )}
              </Card>
           </div>
        )}

        {/* --- VIEW: REVIEWS (NEW REPUTATION DASHBOARD) --- */}
        {activeView === 'reviews' && (
            <div className="space-y-8 pb-12 animate-in fade-in">
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Summary Column */}
                  <div className="col-span-1 lg:col-span-1 space-y-6">
                      <Card className="!bg-brand-black text-white p-6 relative overflow-hidden flex flex-col justify-center items-center text-center">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Star className="w-32 h-32" />
                        </div>
                        <h2 className="text-6xl font-extrabold mb-2">{averageRating.toFixed(1)}</h2>
                        <div className="flex gap-1 mb-4">
                            {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-5 h-5 ${s <= Math.round(averageRating) ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-700'}`} />
                            ))}
                        </div>
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-gray-300">
                            <CheckCircle className="w-3 h-3 text-brand-blue" /> Influenciador Verificado
                        </div>
                        <p className="text-gray-500 text-xs mt-4">{MOCK_REVIEWS.length} avaliações totais</p>
                      </Card>
                  </div>

                  {/* List Column */}
                  <div className="col-span-1 lg:col-span-3 space-y-4">
                      {MOCK_REVIEWS.length > 0 ? (
                        MOCK_REVIEWS.map(review => (
                            <Card key={review.id} className="!bg-white !shadow-sm !border-gray-200 p-6">
                                {/* Review Item Content */}
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                            {review.clientAvatar ? <img src={review.clientAvatar} alt={review.clientName} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">{review.clientName[0]}</div>}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-brand-dark">{review.clientName}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <span>{new Date(review.date).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-bold">{review.serviceType}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        {[1,2,3,4,5].map(s => (
                                            <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                                    "{review.text}"
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {review.tags.map(tag => (
                                        <span key={tag} className="text-[10px] uppercase font-bold text-brand-blue bg-blue-50 px-2 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                    {review.isRecurring && (
                                        <span className="text-[10px] uppercase font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                            <Repeat className="w-3 h-3"/> Recorrente
                                        </span>
                                    )}
                                </div>
                            </Card>
                        ))
                      ) : (
                          <div className="text-center py-12 text-gray-400">
                              <p>Nenhuma avaliação ainda.</p>
                          </div>
                      )}
                  </div>
               </div>
            </div>
        )}

        {/* --- VIEW: PROFILE (EDITABLE) --- */}
        {activeView === 'profile' && (
           <div className="space-y-6 pb-20">
              <div className="flex overflow-x-auto space-x-1 bg-white p-1 rounded-xl border border-gray-200 no-scrollbar">
                {profileTabs.map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveProfileTab(tab.id as ProfileTab)}
                     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeProfileTab === tab.id ? 'bg-brand-blue text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                   >
                     {tab.icon}
                     {tab.label}
                   </button>
                ))}
             </div>
             
             <Card className="!bg-white !shadow-sm !border-gray-200 min-h-[500px]">
                {/* 1. ABA GERAL */}
                {activeProfileTab === 'general' && (
                   <div className="space-y-8 animate-in fade-in">
                      <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                         <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                            <img src={profileData.avatarUrl || 'https://via.placeholder.com/150'} className="w-32 h-32 rounded-full border-4 border-white shadow-sm object-cover bg-white" />
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                               <span className="text-white font-bold text-xs uppercase tracking-wider">Alterar</span>
                            </div>

                            {/* Botão Permanente de Edição */}
                            <div className="absolute bottom-1 right-1 bg-brand-blue text-white p-2 rounded-full border-4 border-gray-50 shadow-md z-20 hover:bg-brand-blueLight transition-colors">
                               <Camera className="w-5 h-5" />
                            </div>

                            <input type="file" ref={avatarInputRef} className="hidden" accept="image/png, image/jpeg" onChange={(e) => handleImageUpload(e, 'avatar')} />
                         </div>
                         <div className="text-center md:text-left flex-1 w-full">
                            <div className="space-y-2 max-w-lg">
                               <label className={labelClass}>Nome</label>
                               <input type="text" value={profileData.name} onChange={(e) => updateField('name', e.target.value)} className={inputClass} placeholder="Seu Nome" />
                               
                               <label className={labelClass}>Usuário (@)</label>
                               <input type="text" value={profileData.handle} onChange={(e) => updateField('handle', e.target.value)} className={inputClass} placeholder="@seu.usuario" />
                               
                               <div className="flex gap-2">
                                  <div className="flex-1">
                                     <label className={labelClass}>Cidade</label>
                                     <input type="text" value={profileData.location?.city} onChange={(e) => updateNestedField('location', 'city', e.target.value)} className={inputClass} />
                                  </div>
                                  <div className="w-20">
                                     <label className={labelClass}>UF</label>
                                     <input type="text" value={profileData.location?.state} onChange={(e) => updateNestedField('location', 'state', e.target.value)} className={inputClass} />
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div>
                            <h3 className="font-bold text-brand-dark mb-2 text-sm uppercase text-gray-400">Bio</h3>
                            <textarea value={profileData.bio} onChange={(e) => updateField('bio', e.target.value)} className="w-full h-32 p-3 bg-white border border-gray-300 rounded-lg outline-none focus:border-brand-blue resize-none text-brand-black" placeholder="Escreva sobre você..." />
                         </div>
                         <div className="space-y-4">
                            <h3 className="font-bold text-brand-dark mb-2 text-sm uppercase text-gray-400">Redes Conectadas</h3>
                            <div className="space-y-3">
                               {['instagram', 'tiktok', 'youtube'].map(network => {
                                  const handle = (profileData.socialHandles as any)?.[network];
                                  return (
                                    <div key={network} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${handle ? 'bg-white border-gray-200' : 'bg-gray-50 border-transparent grayscale opacity-70'}`}>
                                       <Globe className={`w-5 h-5 ${handle ? 'text-brand-blue' : 'text-gray-400'}`} />
                                       <input 
                                         type="text" 
                                         value={handle || ''} 
                                         onChange={(e) => updateNestedField('socialHandles', network, e.target.value)}
                                         className="flex-1 bg-transparent outline-none text-sm text-brand-black"
                                         placeholder={`Cole seu link ou @ do ${network}`}
                                       />
                                       <span className={`text-[10px] font-bold px-2 py-1 rounded ${handle ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                          {handle ? 'CONECTADO' : 'OFF'}
                                       </span>
                                    </div>
                                  )
                               })}
                            </div>
                         </div>
                      </div>
                   </div>
                )}
                
                {/* 2. ABA MÉTRICAS */}
                {activeProfileTab === 'metrics' && (
                   <div className="space-y-8 animate-in fade-in">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {[{l:'Seguidores', f:'followers'}, {l:'Engajamento (%)', f:'engagementRateManual', nested:'metrics'}, {l:'Média Views', f:'avgViews', nested:'metrics'}, {l:'Média Likes', f:'avgLikes', nested:'metrics'}].map(item => (
                            <div key={item.l} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                               <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{item.l}</label>
                               <input 
                                 type="number"
                                 value={item.nested ? (profileData.metrics as any)?.[item.f] : (profileData as any)[item.f]}
                                 onChange={(e) => item.nested ? updateNestedField('metrics', item.f, Number(e.target.value)) : updateField(item.f as any, Number(e.target.value))}
                                 className="w-full text-center font-bold text-xl bg-white border border-gray-200 rounded p-2 outline-none focus:border-brand-blue text-brand-black"
                               />
                            </div>
                         ))}
                      </div>

                      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex justify-between items-center">
                         <div>
                            <h4 className="font-bold text-blue-900">Mídia Kit</h4>
                            <p className="text-sm text-blue-700">{profileData.metrics?.mediaKitUrl ? 'Arquivo enviado e disponível.' : 'Envie seu PDF para as marcas verem detalhes.'}</p>
                         </div>
                         <div className="relative">
                            <Button size="sm" onClick={() => mediaKitInputRef.current?.click()}>
                               {profileData.metrics?.mediaKitUrl ? 'Atualizar Arquivo' : 'Enviar PDF'}
                            </Button>
                            <input type="file" ref={mediaKitInputRef} className="hidden" accept="application/pdf" onChange={(e) => handleImageUpload(e, 'mediaKit')} />
                         </div>
                      </div>

                      <div>
                         <h3 className="font-bold text-brand-dark mb-4 text-sm uppercase text-gray-400">Alcance por Formato (Estimado)</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['stories', 'reels', 'feed'].map(fmt => (
                               <div key={fmt} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                                  <span className="font-bold text-sm uppercase w-16 text-brand-black">{fmt}</span>
                                  <input 
                                    type="number" 
                                    value={(profileData.metrics?.avgReach as any)?.[fmt] || 0}
                                    onChange={(e) => {
                                       const currentReach = profileData.metrics?.avgReach || {};
                                       updateNestedField('metrics', 'avgReach', { ...currentReach, [fmt]: Number(e.target.value) })
                                    }}
                                    className="flex-1 bg-transparent border-none outline-none text-right font-mono text-gray-900 placeholder-gray-400 appearance-none"
                                    placeholder="0"
                                  />
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                )}

                {/* 3. ABA SERVIÇOS */}
                {activeProfileTab === 'pricing' && (
                   <div className="animate-in fade-in">
                      <div className="flex justify-between items-center mb-6">
                         <h3 className="font-bold text-brand-dark">Tabela de Preços</h3>
                         <Button onClick={() => setIsServiceModalOpen(true)} size="sm">+ Adicionar Serviço</Button>
                      </div>
                      <div className="space-y-3">
                         {profileData.services?.map((service) => (
                            <div key={service.id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                                     {service.platform[0]}
                                  </div>
                                  <div>
                                     <span className="font-bold text-brand-dark block">{service.format}</span>
                                     <span className="text-xs text-gray-500">{service.negotiable ? 'Preço Negociável' : 'Preço Fixo'}</span>
                                  </div>
                               </div>
                               <div className="flex items-center gap-4">
                                  <span className="font-bold text-xl text-brand-blue">R$ {service.price}</span>
                                  <button onClick={() => removeService(service.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"><Trash className="w-4 h-4"/></button>
                               </div>
                            </div>
                         ))}
                         {(!profileData.services || profileData.services.length === 0) && (
                            <p className="text-center text-gray-500 py-8">Nenhum serviço cadastrado.</p>
                         )}
                      </div>
                   </div>
                )}

                {/* 4. ABA PÚBLICO - COM BARRA DE GÊNERO ATUALIZADA */}
                {activeProfileTab === 'audience' && (
                   <div className="animate-in fade-in space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className={labelClass}>Localização Predominante</label>
                            <input type="text" value={profileData.audienceData?.location || ''} onChange={(e) => updateNestedField('audienceData', 'location', e.target.value)} className={inputClass} placeholder="Ex: São Paulo, SP" />
                         </div>
                         <div>
                            <label className={labelClass}>Faixa Etária Principal</label>
                            <select className={inputClass} value={profileData.audienceData?.ageRange || ''} onChange={(e) => updateNestedField('audienceData', 'ageRange', e.target.value)}>
                               <option value="">Selecione...</option>
                               <option value="18-24">18-24 anos</option>
                               <option value="25-34">25-34 anos</option>
                               <option value="35-44">35-44 anos</option>
                               <option value="45+">45+ anos</option>
                            </select>
                         </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                         <label className={labelClass}>Divisão de Gênero (%)</label>
                         
                         {/* Visual Progress Bar */}
                         <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex my-3 relative shadow-inner">
                            <div 
                               className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
                               style={{ width: `${profileData.audienceData?.genderSplit?.male || 0}%` }}
                            />
                            <div 
                               className="h-full bg-pink-500 transition-all duration-500 ease-in-out"
                               style={{ width: `${profileData.audienceData?.genderSplit?.female || 0}%` }}
                            />
                         </div>
                         <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-blue-600">{profileData.audienceData?.genderSplit?.male || 0}% Homens</span>
                            <span className="text-pink-600">{profileData.audienceData?.genderSplit?.female || 0}% Mulheres</span>
                         </div>

                         <div className="flex gap-4 items-center">
                            <div className="flex-1">
                               <label className="text-xs text-blue-600 font-bold block mb-1">Homens</label>
                               <input 
                                  type="number" 
                                  value={profileData.audienceData?.genderSplit?.male || 0} 
                                  onChange={(e) => {
                                     const maleVal = Math.min(100, Math.max(0, Number(e.target.value)));
                                     updateNestedField('audienceData', 'genderSplit', { male: maleVal, female: 100 - maleVal });
                                  }} 
                                  className={inputClass} 
                               />
                            </div>
                            <div className="flex-1">
                               <label className="text-xs text-pink-600 font-bold block mb-1">Mulheres</label>
                               <input 
                                  type="number" 
                                  value={profileData.audienceData?.genderSplit?.female || 0} 
                                  onChange={(e) => {
                                     const femaleVal = Math.min(100, Math.max(0, Number(e.target.value)));
                                     updateNestedField('audienceData', 'genderSplit', { female: femaleVal, male: 100 - femaleVal });
                                  }} 
                                  className={inputClass} 
                               />
                            </div>
                         </div>
                      </div>

                      <div>
                         <label className={labelClass}>Interesses Principais (Separar por vírgula)</label>
                         <textarea className={inputClass + " h-24 resize-none"} value={profileData.audienceData?.topInterests?.join(', ') || ''} onChange={(e) => updateNestedField('audienceData', 'topInterests', e.target.value.split(',').map(s => s.trim()))} placeholder="Ex: Moda, Viagem, Tecnologia..." />
                      </div>
                   </div>
                )}

                {/* 5. ABA ESTILO */}
                {activeProfileTab === 'style' && (
                   <div className="animate-in fade-in space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className={labelClass}>Tom de Voz</label>
                            <input type="text" className={inputClass} value={profileData.contentStyle?.tone || ''} onChange={(e) => updateNestedField('contentStyle', 'tone', e.target.value)} placeholder="Ex: Divertido, Sério..." />
                         </div>
                         <div>
                            <label className={labelClass}>Estética Visual</label>
                            <input type="text" className={inputClass} value={profileData.contentStyle?.aesthetic || ''} onChange={(e) => updateNestedField('contentStyle', 'aesthetic', e.target.value)} placeholder="Ex: Minimalista, Vintage..." />
                         </div>
                      </div>

                      <div>
                         <div className="flex justify-between items-center mb-4">
                            <label className={labelClass}>Portfólio / Galeria</label>
                            <button className="text-xs text-brand-blue font-bold hover:underline" onClick={() => portfolioInputRef.current?.click()}>+ Adicionar Foto</button>
                            <input type="file" ref={portfolioInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'portfolio')} />
                         </div>
                         <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                            {profileData.metrics?.portfolioUrls?.map((url, i) => (
                               <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                                  <img src={url} className="w-full h-full object-cover" />
                                  <button className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                                     const newUrls = profileData.metrics?.portfolioUrls?.filter((_, idx) => idx !== i);
                                     updateNestedField('metrics', 'portfolioUrls', newUrls);
                                  }}>
                                     <Trash className="w-3 h-3" />
                                  </button>
                               </div>
                            ))}
                            <div onClick={() => portfolioInputRef.current?.click()} className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
                               <Plus className="w-8 h-8" />
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {/* 6. ABA AGENDA */}
                {activeProfileTab === 'schedule' && (
                   <div className="animate-in fade-in space-y-6">
                      <div>
                         <label className={labelClass}>Dias Disponíveis para Gravação</label>
                         <div className="flex flex-wrap gap-2 mt-2">
                            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map(day => (
                               <button 
                                 key={day}
                                 onClick={() => toggleArrayItem('schedule', 'daysAvailable', day)}
                                 className={`w-10 h-10 rounded-full text-xs font-bold border flex items-center justify-center transition-all ${profileData.schedule?.daysAvailable?.includes(day) ? 'bg-brand-black text-white border-brand-black scale-110' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
                               >
                                  {day}
                               </button>
                            ))}
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className={labelClass}>Prazo Padrão de Entrega</label>
                            <select className={inputClass} value={profileData.schedule?.standardDeliveryTime || ''} onChange={(e) => updateNestedField('schedule', 'standardDeliveryTime', e.target.value)}>
                               <option value="24h">24h (Express)</option>
                               <option value="48h">48h (Padrão)</option>
                               <option value="3 dias">3 dias</option>
                               <option value="7 dias">7 dias</option>
                            </select>
                         </div>
                         <div>
                            <label className={labelClass}>Capacidade Mensal (Jobs)</label>
                            <input type="number" className={inputClass} value={profileData.schedule?.maxMonthlyCapacity || ''} onChange={(e) => updateNestedField('schedule', 'maxMonthlyCapacity', Number(e.target.value))} />
                         </div>
                      </div>
                   </div>
                )}

                {/* 7. ABA REGRAS */}
                {activeProfileTab === 'rules' && (
                   <div className="animate-in fade-in space-y-6">
                      <div>
                         <label className={labelClass}>Nichos Bloqueados</label>
                         <textarea className={inputClass + " h-20 resize-none"} value={profileData.rules?.blockedNiches?.join(', ') || ''} onChange={(e) => updateNestedField('rules', 'blockedNiches', e.target.value.split(',').map(s => s.trim()))} placeholder="Ex: Cassino, Bebidas Alcoólicas, Política..." />
                      </div>
                      
                      <div>
                         <label className={labelClass}>Política de Revisão</label>
                         <select className={inputClass} value={profileData.rules?.maxRevisions || 1} onChange={(e) => updateNestedField('rules', 'maxRevisions', Number(e.target.value))}>
                            <option value={0}>Sem revisão (O que eu postar, tá postado)</option>
                            <option value={1}>1 Revisão inclusa</option>
                            <option value={2}>2 Revisões inclusas</option>
                            <option value={3}>Revisões ilimitadas</option>
                         </select>
                      </div>
                   </div>
                )}
             </Card>
           </div>
        )}

        {/* --- VIEW: WALLET (FULL FEATURED) --- */}
        {activeView === 'wallet' && (
          <div className="space-y-6 pb-12">
             {/* 1. Saldo Principal */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="!bg-brand-black text-white p-6 relative overflow-hidden flex flex-col justify-between h-40">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <CreditCard className="w-24 h-24" />
                   </div>
                   <div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Saldo Disponível</p>
                      <h2 className="text-3xl font-bold">R$ {availableBalance.toFixed(2)}</h2>
                   </div>
                   <div className="flex gap-2 mt-4">
                      <Button onClick={() => setActiveWalletTab('withdraw')} size="sm" className="!bg-brand-neon !text-white !py-1 text-xs hover:scale-105 transition-transform w-full">
                         <DollarSign className="w-3 h-3 mr-1" /> Sacar Agora
                      </Button>
                   </div>
                </Card>

                <Card className="!bg-white !border-gray-200 p-6 flex flex-col justify-between h-40 relative">
                   <div className="absolute top-4 right-4 bg-yellow-50 text-yellow-700 p-1.5 rounded-lg">
                      <Lock className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-gray-500 text-sm font-medium mb-1">A Receber</p>
                      <h2 className="text-3xl font-bold text-gray-800">R$ {pendingIncome.toFixed(2)}</h2>
                   </div>
                   <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Libera após entrega confirmada
                   </p>
                </Card>

                <Card className="!bg-white !border-gray-200 p-6 flex flex-col justify-between h-40">
                   <div>
                      <p className="text-gray-500 text-sm font-medium mb-3">Última Movimentação</p>
                      {transactions.length > 0 ? (
                         <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${transactions[0].type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                               {transactions[0].type === 'IN' ? <ArrowDownLeft className="w-5 h-5"/> : <ArrowUpRight className="w-5 h-5"/>}
                            </div>
                            <div>
                               <p className="font-bold text-sm text-brand-dark">
                                  {transactions[0].type === 'IN' ? '+' : '-'} R$ {transactions[0].amount.toFixed(2)}
                               </p>
                               <p className="text-xs text-gray-400">{new Date(transactions[0].date).toLocaleDateString()}</p>
                            </div>
                         </div>
                      ) : (
                         <p className="text-sm text-gray-400 italic">Nenhuma movimentação recente.</p>
                      )}
                   </div>
                </Card>
             </div>

             {/* Wallet Tabs */}
             <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar bg-white rounded-t-xl px-2">
                {[
                   { id: 'overview', label: 'Visão Geral', icon: <TrendingUp className="w-4 h-4"/> },
                   { id: 'history', label: 'Extrato', icon: <FileText className="w-4 h-4"/> },
                   { id: 'withdraw', label: 'Saque', icon: <DollarSign className="w-4 h-4"/> },
                   { id: 'settings', label: 'Configurações', icon: <Sliders className="w-4 h-4"/> }
                ].map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveWalletTab(tab.id as WalletTab)}
                     className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeWalletTab === tab.id ? 'border-brand-blue text-brand-blue bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                   >
                     {tab.icon}
                     {tab.label}
                   </button>
                ))}
             </div>

             <Card className="!bg-white !border-gray-200 !rounded-t-none !mt-0 min-h-[400px]">
                {/* 2. Histórico de Transações */}
                {(activeWalletTab === 'history' || activeWalletTab === 'overview') && (
                   <div className="space-y-6 animate-in fade-in">
                      {activeWalletTab === 'overview' && (
                         <div className="h-32 flex items-end justify-between gap-1 px-4 pb-4 border-b border-gray-100 mb-6">
                            {[20, 40, 30, 70, 50, 90, 60, 40, 80, 50, 30, 60].map((h, i) => (
                               <div key={i} className="flex-1 bg-blue-50 hover:bg-brand-blue transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                  <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-1 rounded">{h*10}</div>
                               </div>
                            ))}
                         </div>
                      )}
                      
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-xl">
                         <div className="flex items-center gap-2 w-full md:w-auto">
                            <Filter className="w-4 h-4 text-gray-500"/>
                            <select className="bg-white border border-gray-200 text-sm rounded-lg p-2 outline-none cursor-pointer">
                               <option>Últimos 30 dias</option>
                               <option>Últimos 7 dias</option>
                            </select>
                            <select className="bg-white border border-gray-200 text-sm rounded-lg p-2 outline-none cursor-pointer">
                               <option>Todos os tipos</option>
                               <option>Entradas</option>
                               <option>Saídas</option>
                            </select>
                         </div>
                      </div>

                      <div className="overflow-x-auto">
                         <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-xs">
                               <tr>
                                  <th className="p-4">Data</th>
                                  <th className="p-4">Tipo</th>
                                  <th className="p-4">Descrição</th>
                                  <th className="p-4">Status</th>
                                  <th className="p-4 text-right">Valor</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                               {transactions.map(t => (
                                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                     <td className="p-4 text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                                     <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${t.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                           {t.type === 'IN' ? 'Entrada' : 'Saída'}
                                        </span>
                                     </td>
                                     <td className="p-4 font-medium text-brand-dark">{t.details} <span className="text-gray-400 text-xs block">{t.origin}</span></td>
                                     <td className="p-4"><Badge status={t.status} /></td>
                                     <td className={`p-4 text-right font-bold ${t.type === 'IN' ? 'text-green-600' : 'text-red-500'}`}>
                                        {t.type === 'IN' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                                     </td>
                                  </tr>
                               ))}
                               {transactions.length === 0 && (
                                  <tr><td colSpan={5} className="p-8 text-center text-gray-400">Nenhuma transação encontrada.</td></tr>
                               )}
                            </tbody>
                         </table>
                      </div>
                   </div>
                )}

                {/* 3. Área de Saque */}
                {activeWalletTab === 'withdraw' && (
                   <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
                      <div className="space-y-4">
                         <label className="block text-sm font-bold text-gray-700">Valor do Saque</label>
                         <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                            <input 
                              type="number" 
                              value={withdrawalAmount}
                              onChange={(e) => setWithdrawalAmount(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 text-xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                              placeholder="0.00"
                            />
                         </div>
                         <p className="text-xs text-gray-500 text-right">Disponível: R$ {availableBalance.toFixed(2)}</p>
                      </div>

                      <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <label className="block text-sm font-bold text-gray-700">Método de Recebimento (PIX)</label>
                            <button onClick={() => setIsAddingMethod(!isAddingMethod)} className="text-xs text-brand-blue font-bold hover:underline">
                               {profileData.paymentInfo?.pixKey ? 'Alterar Chave' : 'Adicionar Chave'}
                            </button>
                         </div>
                         
                         {profileData.paymentInfo?.pixKey && !isAddingMethod ? (
                            <div className="p-4 border border-green-200 bg-green-50 rounded-xl flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                     <Zap className="w-5 h-5 text-green-600 fill-green-600"/>
                                  </div>
                                  <div>
                                     <p className="font-bold text-green-900">Chave PIX Ativa</p>
                                     <p className="text-xs text-green-700">{profileData.paymentInfo.pixKey}</p>
                                  </div>
                               </div>
                               <CheckCircle className="text-green-600 w-6 h-6" />
                            </div>
                         ) : (
                            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                               <h4 className="font-bold text-sm mb-3">Configurar PIX</h4>
                               <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    value={newPixKey}
                                    onChange={(e) => setNewPixKey(e.target.value)}
                                    placeholder="CPF, Email, Telefone ou Aleatória"
                                    className="flex-1 border border-gray-300 rounded p-2 text-sm"
                                  />
                                  <Button onClick={() => {
                                     if(newPixKey) {
                                        updateNestedField('paymentInfo', 'pixKey', newPixKey);
                                        setIsAddingMethod(false);
                                        setNewPixKey('');
                                     }
                                  }} size="sm">Salvar</Button>
                               </div>
                            </div>
                         )}
                      </div>

                      <Button onClick={handleWithdrawRequest} fullWidth size="lg" className="!bg-brand-neon hover:!bg-brand-blue shadow-lg shadow-brand-neon/30">
                         Confirmar Saque
                      </Button>
                   </div>
                )}

                {/* 4. Configurações Financeiras */}
                {activeWalletTab === 'settings' && (
                   <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
                      <div className="grid grid-cols-1 gap-6">
                         <div>
                            <h3 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                               <Bell className="w-5 h-5"/> Notificações
                            </h3>
                            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                               <label className="flex items-center justify-between cursor-pointer">
                                  <span className="text-sm font-medium text-gray-700">Ao receber pagamento</span>
                                  <input type="checkbox" checked={financialSettings.notifyPayment} onChange={(e) => setFinancialSettings({...financialSettings, notifyPayment: e.target.checked})} className="w-5 h-5 text-brand-blue rounded focus:ring-brand-blue" />
                               </label>
                               <div className="h-px bg-gray-200"></div>
                               <label className="flex items-center justify-between cursor-pointer">
                                  <span className="text-sm font-medium text-gray-700">Ao concluir saque</span>
                                  <input type="checkbox" checked={financialSettings.notifyWithdraw} onChange={(e) => setFinancialSettings({...financialSettings, notifyWithdraw: e.target.checked})} className="w-5 h-5 text-brand-blue rounded focus:ring-brand-blue" />
                               </label>
                            </div>
                         </div>

                         <div>
                            <h3 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                               <FileText className="w-5 h-5"/> Dados Fiscais
                            </h3>
                            <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                               <div>
                                  <label className={labelClass}>Nome Completo / Razão Social</label>
                                  <input type="text" value={financialSettings.fullName} onChange={(e) => setFinancialSettings({...financialSettings, fullName: e.target.value})} className={inputClass} />
                               </div>
                               <div>
                                  <label className={labelClass}>CPF / CNPJ</label>
                                  <input type="text" value={financialSettings.cpfCnpj} onChange={(e) => setFinancialSettings({...financialSettings, cpfCnpj: e.target.value})} className={inputClass} />
                               </div>
                               <div>
                                  <label className={labelClass}>Endereço Fiscal</label>
                                  <textarea value={financialSettings.taxAddress} onChange={(e) => setFinancialSettings({...financialSettings, taxAddress: e.target.value})} className={inputClass + " h-20 resize-none"} />
                               </div>
                               <Button onClick={handleSaveFinancialSettings} size="sm" className="!bg-brand-black !text-white">Salvar Dados</Button>
                            </div>
                         </div>
                      </div>
                   </div>
                )}
             </Card>
          </div>
        )}

        {/* --- MODALS --- */}
        <Modal isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} title="Adicionar Serviço">
           <div className="space-y-4">
              <div>
                 <label className={labelClass}>Plataforma</label>
                 <select className={inputClass} value={newService.platform} onChange={(e) => setNewService(prev => ({...prev, platform: e.target.value as any}))}>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                 </select>
              </div>
              <div>
                 <label className={labelClass}>Formato</label>
                 <select className={inputClass} value={newService.format} onChange={(e) => setNewService(prev => ({...prev, format: e.target.value as any}))}>
                    <option value="Story">Story</option>
                    <option value="Reels">Reels</option>
                    <option value="Feed">Feed Post</option>
                    <option value="TikTok Video">TikTok Video</option>
                 </select>
              </div>
              <div>
                 <label className={labelClass}>Preço (R$)</label>
                 <input type="number" className={inputClass} value={newService.price || ''} onChange={(e) => setNewService(prev => ({...prev, price: Number(e.target.value)}))} placeholder="0.00" />
              </div>
              <Button onClick={handleAddService} fullWidth className="!bg-brand-black !text-brand-yellow">Salvar Serviço</Button>
           </div>
        </Modal>

        <Modal isOpen={!!selectedBusiness} onClose={() => setSelectedBusiness(null)} title="Perfil da Empresa">
          {selectedBusiness && selectedBusiness.companyProfile && (
            <div className="space-y-6">
               <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"><Building className="w-8 h-8 text-gray-400"/></div>
                  <div><h2 className="text-xl font-bold">{selectedBusiness.name}</h2><p className="text-sm text-gray-500">{selectedBusiness.companyProfile.sector}</p></div>
               </div>
               <p className="text-gray-600 bg-gray-50 p-4 rounded-lg text-sm">{selectedBusiness.companyProfile.description}</p>
            </div>
          )}
        </Modal>

      </main>
    </div>
  );
};