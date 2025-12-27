import React, { useState, useCallback, useMemo } from 'react';
import { Modal } from './UI';
import { Search, MessageSquare, Target, BarChart, Settings, ShoppingBag } from './Icons';
import { Influencer } from '../types';
import { useApp } from '../context/AppContext';

// Optimized Sub-components
import { Sidebar } from './dashboard/Sidebar';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { SearchView } from './dashboard/SearchView';
import { OrdersView } from './dashboard/OrdersView';
import { MessagesView } from './dashboard/MessagesView';
import { FinanceView } from './dashboard/FinanceView';
import { CampaignView } from './dashboard/CampaignView';
import { SettingsView } from './dashboard/SettingsView';
import { InfluencerProfileModal } from './dashboard/InfluencerProfileModal';
import { CheckoutModal } from './dashboard/CheckoutModal';
import { CampaignEditModal } from './dashboard/CampaignEditModal';

type View = 'search' | 'orders' | 'messages' | 'finance' | 'settings' | 'campaign';

export const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { influencers, currentUser, createOrder, orders, messages, sendMessage, updateOrderStatus, updateUser, uploadFile } = useApp();
  const [activeView, setActiveView] = useState<View>('search');

  // States for Modals
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'metrics' | 'audience' | 'portfolio' | 'services'>('overview');
  
  // Checkout Form State
  const [serviceType, setServiceType] = useState<'Story' | 'Reels'>('Story');
  const [briefing, setBriefing] = useState('');

  // Chat State
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  // Profile Data for Settings
  const [profileData, setProfileData] = useState(currentUser);
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    if (currentUser) setProfileData(currentUser);
  }, [currentUser]);

  // Search Filters
  const [filterSize, setFilterSize] = useState('Todos');
  const [filterPlatform, setFilterPlatform] = useState('Todos');
  const [filterNiche, setFilterNiche] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Optimized Handlers
  const handleSaveProfile = useCallback(async () => {
    if (profileData) {
      try {
        await updateUser(profileData);
        alert('Configurações salvas com sucesso!');
      } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar configurações.');
      }
    }
  }, [profileData, updateUser]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      try {
        setIsUploading(true);
        const url = await uploadFile(file, `${currentUser.id}/avatar`);
        const updatedProfile = { ...profileData, avatarUrl: url };
        setProfileData(updatedProfile as any);
        await updateUser(updatedProfile);
        alert('Foto de perfil atualizada!');
      } catch (error) {
        console.error('Erro no upload:', error);
        alert('Erro ao fazer upload da imagem.');
      } finally {
        setIsUploading(false);
      }
    }
  }, [currentUser, profileData, uploadFile, updateUser]);

  const updateCompanyProfile = useCallback((field: string, value: any) => {
    setProfileData((prev: any) => ({
      ...prev,
      companyProfile: {
        ...prev.companyProfile,
        [field]: value
      }
    }));
  }, []);

  const updateCompanyNestedProfile = useCallback((parent: string, field: string, value: any) => {
    setProfileData((prev: any) => ({
      ...prev,
      companyProfile: {
        ...prev.companyProfile,
        [parent]: {
          ...prev.companyProfile?.[parent],
          [field]: value
        }
      }
    }));
  }, []);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeOrderId && messageInput.trim()) {
      await sendMessage(activeOrderId, messageInput);
      setMessageInput('');
    }
  }, [activeOrderId, messageInput, sendMessage]);

  const handleConfirmOrder = useCallback(async () => {
    if (selectedInfluencer) {
      const price = serviceType === 'Story' ? selectedInfluencer.pricePerPost : selectedInfluencer.pricePerReel;
      await createOrder(selectedInfluencer.id, serviceType, price, briefing);
      setIsCheckoutOpen(false);
      setSelectedInfluencer(null);
      setBriefing('');
      setActiveView('orders');
    }
  }, [selectedInfluencer, serviceType, createOrder, briefing]);

  // Derived States
  const myOrders = useMemo(() => orders.filter(o => o.businessId === currentUser?.id), [orders, currentUser]);

  const filteredInfluencers = useMemo(() => {
    return influencers.filter(inf => {
      const matchesSearch = inf.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            inf.handle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSize = filterSize === 'Todos' || inf.sizeCategory === filterSize;
      const matchesPlatform = filterPlatform === 'Todos' || inf.platform === filterPlatform;
      const matchesNiche = filterNiche === 'Todos' || inf.niche === filterNiche;
      return matchesSearch && matchesSize && matchesPlatform && matchesNiche;
    });
  }, [influencers, searchQuery, filterSize, filterPlatform, filterNiche]);

  const totalSpent = useMemo(() => myOrders.reduce((acc, o) => acc + o.amount, 0), [myOrders]);
  const activeCampaigns = useMemo(() => myOrders.filter(o => o.status === 'IN_PROGRESS' || o.status === 'PENDING').length, [myOrders]);

  const menuItems = useMemo(() => [
    { id: 'search', label: 'Buscar Influencers', icon: <Search className="w-5 h-5" /> },
    { id: 'campaign', label: 'Campanha & Regras', icon: <Target className="w-5 h-5" /> },
    { id: 'orders', label: 'Meus Pedidos', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'messages', label: 'Mensagens', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'finance', label: 'Financeiro', icon: <BarChart className="w-5 h-5" /> },
    { id: 'settings', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
  ], []);

  const activeViewLabel = useMemo(() => menuItems.find(i => i.id === activeView)?.label || '', [menuItems, activeView]);

  return (
    <div className="min-h-screen bg-brand-gray text-brand-black flex">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        menuItems={menuItems} 
        onLogout={onLogout} 
      />

      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <DashboardHeader 
          activeViewLabel={activeViewLabel} 
          currentUser={currentUser} 
          onLogout={onLogout} 
        />

        {activeView === 'search' && (
          <SearchView 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterNiche={filterNiche}
            setFilterNiche={setFilterNiche}
            filterSize={filterSize}
            setFilterSize={setFilterSize}
            filterPlatform={filterPlatform}
            setFilterPlatform={setFilterPlatform}
            filteredInfluencers={filteredInfluencers}
            setSelectedInfluencer={setSelectedInfluencer}
            setIsCheckoutOpen={setIsCheckoutOpen}
          />
        )}

        {activeView === 'orders' && (
          <OrdersView 
            myOrders={myOrders}
            influencers={influencers}
            setActiveOrderId={setActiveOrderId}
            setActiveView={setActiveView}
            updateOrderStatus={updateOrderStatus}
          />
        )}

        {activeView === 'messages' && (
          <MessagesView 
            myOrders={myOrders}
            influencers={influencers}
            messages={messages}
            activeOrderId={activeOrderId}
            setActiveOrderId={setActiveOrderId}
            currentUser={currentUser}
            messageInput={messageInput}
            setMessageInput={setMessageInput}
            handleSendMessage={handleSendMessage}
          />
        )}

        {activeView === 'finance' && (
          <FinanceView 
            currentUser={currentUser}
            totalSpent={totalSpent}
            activeCampaigns={activeCampaigns}
            myOrders={myOrders}
          />
        )}

        {activeView === 'campaign' && (
          <CampaignView 
            profileData={profileData}
            setIsCampaignModalOpen={setIsCampaignModalOpen}
          />
        )}

        {activeView === 'settings' && (
          <SettingsView 
            profileData={profileData}
            setProfileData={setProfileData}
            updateCompanyProfile={updateCompanyProfile}
            handleImageUpload={handleImageUpload}
            handleSaveProfile={handleSaveProfile}
            isUploading={isUploading}
            currentUser={currentUser}
          />
        )}
      </main>

      <InfluencerProfileModal 
        selectedInfluencer={selectedInfluencer}
        onClose={() => { setSelectedInfluencer(null); setActiveProfileTab('overview'); }}
        activeProfileTab={activeProfileTab}
        setActiveProfileTab={setActiveProfileTab}
        onHire={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedInfluencer={selectedInfluencer}
        serviceType={serviceType}
        setServiceType={setServiceType}
        briefing={briefing}
        setBriefing={setBriefing}
        onConfirm={handleConfirmOrder}
      />

      <CampaignEditModal 
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        profileData={profileData}
        updateCompanyNestedProfile={updateCompanyNestedProfile}
        onSave={() => { handleSaveProfile(); setIsCampaignModalOpen(false); }}
      />
    </div>
  );
};
