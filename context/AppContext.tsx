import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Influencer, Order, Message, UserRole } from '../types';

// Mock Data
const MOCK_INFLUENCERS: Influencer[] = [
  { 
    id: 'inf1', 
    name: 'Ana Silva', 
    email: 'ana@email.com', 
    role: UserRole.INFLUENCER, 
    handle: '@anasilva.fit', 
    niche: 'Fitness', 
    followers: 24000, 
    engagementRate: 4.5, 
    pricePerPost: 80, 
    pricePerReel: 150, 
    avatarUrl: 'https://picsum.photos/100/100?random=1', 
    rating: 4.8, 
    verified: true, 
    balance: 450, 
    bio: 'Dicas de treino e alimentação saudável para mulheres reais. Foco em vida saudável sem neuras.', 
    platform: 'Instagram', 
    sizeCategory: 'Micro',
    onboardingCompleted: true, // Already onboarded
    // Expanded Profile Mock
    artisticName: 'Ana Fit',
    secondaryNiches: ['Saúde', 'Lifestyle', 'Nutrição'],
    socialHandles: { instagram: '@anasilva.fit', tiktok: '@anafit_tiktok', youtube: '@anafit_channel' },
    languages: ['Português', 'Inglês Básico'],
    location: { city: 'São Paulo', state: 'SP', country: 'Brasil' },
    gender: 'Feminino',
    metrics: {
      followersByPlatform: { instagram: 24000, tiktok: 12000, youtube: 3000 },
      avgReach: { reels: 8500, stories: 1200, feed: 3000 },
      avgViews: 5000,
      avgLikes: 800,
      engagementRateManual: 4.5,
      brandsWorkedWith: ['Nike', 'Growth', 'Insider'],
      portfolioUrls: ['https://picsum.photos/200/300?random=10', 'https://picsum.photos/200/300?random=11', 'https://picsum.photos/200/300?random=12']
    },
    services: [
      { id: 's1', platform: 'Instagram', format: 'Story', price: 80, negotiable: true },
      { id: 's2', platform: 'Instagram', format: 'Reels', price: 150, promoPrice: 130, negotiable: false },
      { id: 's3', platform: 'Instagram', format: 'Combo Stories', price: 200, negotiable: true },
    ],
    audienceData: {
      location: 'São Paulo, SP',
      ageRange: '25-34',
      topInterests: ['Academia', 'Dietas', 'Moda Esportiva'],
      genderSplit: { male: 20, female: 80 },
      estimatedClass: 'B'
    },
    contentStyle: {
      tone: 'Motivacional',
      aesthetic: 'Clean e Minimalista',
      productionFrequency: '5x por semana',
      editingLevel: 'Média',
      favoriteFormats: ['Reels de Treino', 'Vlog Diário']
    },
    schedule: {
      daysAvailable: ['Segunda', 'Quarta', 'Sexta'],
      standardDeliveryTime: '48h',
      busyMode: false,
      maxMonthlyCapacity: 20,
      availabilityType: 'Paid',
      preferredContactTime: 'Morning'
    },
    rules: {
      noGoContent: ['Bebidas Alcoólicas', 'Jogos de Azar'],
      blockedNiches: ['Apostas', 'Política'],
      forbiddenWords: ['Milagre', 'Emagrecimento Rápido'],
      revisionPolicy: '1 revisão gratuita inclusa',
      maxRevisions: 2
    },
    paymentInfo: {
      pixKey: 'ana@email.com',
      bankAccount: 'Nubank - Ag 0001 cc 12345-6',
      document: '***.***.***-**'
    },
    contactSettings: {
      publicEmail: 'contato@anasilva.com',
      whatsapp: '(11) 99999-9999',
      allowDirectContact: true
    }
  },
  { id: 'inf2', name: 'João Tech', email: 'joao@email.com', role: UserRole.INFLUENCER, handle: '@joaotech_review', niche: 'Tecnologia', followers: 12500, engagementRate: 6.2, pricePerPost: 120, pricePerReel: 250, avatarUrl: 'https://picsum.photos/100/100?random=2', rating: 5.0, verified: true, balance: 1200, bio: 'Reviews sinceros de gadgets e setup.', platform: 'YouTube', sizeCategory: 'Micro', onboardingCompleted: true, location: { city: 'Curitiba', state: 'PR', country: 'Brasil' }, services: [{ id: 's4', platform: 'YouTube', format: 'Long Video', price: 500, negotiable: true }] },
  { id: 'inf3', name: 'Mariana Beauty', email: 'mari@email.com', role: UserRole.INFLUENCER, handle: '@marimakeup', niche: 'Beleza', followers: 45000, engagementRate: 3.1, pricePerPost: 200, pricePerReel: 350, avatarUrl: 'https://picsum.photos/100/100?random=3', rating: 4.7, verified: false, balance: 800, bio: 'Tutoriais de maquiagem artística e skincare.', platform: 'TikTok', sizeCategory: 'Mid', onboardingCompleted: true, location: { city: 'Rio de Janeiro', state: 'RJ', country: 'Brasil' } },
];

// Initialize Mock Business with structure for onboarding
const MOCK_BUSINESS: User = {
  id: 'biz1',
  name: 'Empresa X',
  email: 'contato@empresax.com',
  role: UserRole.BUSINESS,
  avatarUrl: '',
  balance: 0,
  onboardingCompleted: false, // Default is false, will force flow
  companyProfile: {
    description: "Somos uma startup de moda sustentável focada em peças de algodão orgânico.",
    niche: ['Moda', 'Sustentabilidade'],
    size: 'Pequena',
    website: "www.empresax.com.br",
    cnpj: "00.000.000/0001-00",
    sector: "Varejo",
    location: { city: "São Paulo", state: "SP" },
    logoUrl: "",
    objectives: ['Aumentar Vendas', 'Awareness / Branding'],
    targetAudience: {
      ageRange: "25-34 anos",
      gender: "Female",
      interests: ["Moda Consciente", "Natureza", "Yoga"]
    },
    budget: {
      monthly: 5000,
      priceRange: "R$150 - R$300",
      acceptsNegotiation: true
    },
    desiredDeliverables: ['Reels / TikTok', 'Stories (24h)'],
    influencerPreferences: {
      type: "Influencer",
      audienceSize: ["Micro (10k - 100k)"]
    },
    contact: {
      responsibleName: "Carlos Gerente",
      email: "carlos@empresax.com",
      whatsapp: "(11) 98888-8888",
      allowDirectContact: false
    }
  }
};

const MOCK_BUSINESSES: User[] = [MOCK_BUSINESS];

interface AppContextType {
  currentUser: User | Influencer | null;
  influencers: Influencer[];
  orders: Order[];
  messages: Message[];
  login: (role: UserRole) => Promise<User>;
  logout: () => void;
  createOrder: (influencerId: string, serviceType: 'Story' | 'Reels', amount: number, briefing: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], deliveryUrl?: string) => void;
  sendMessage: (orderId: string, text: string) => void;
  updateUser: (data: Partial<User | Influencer>) => void;
  getBusinessById: (id: string) => User | undefined;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | Influencer | null>(null);
  const [influencers, setInfluencers] = useState<Influencer[]>(MOCK_INFLUENCERS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  // In a real app, businesses would be fetched
  const [businesses, setBusinesses] = useState<User[]>(MOCK_BUSINESSES); 

  // Updated Login Function: Returns the User object for immediate routing decisions
  const login = async (role: UserRole): Promise<User> => {
    return new Promise((resolve) => {
      let user: User | Influencer;

      if (role === UserRole.BUSINESS) {
        // For demo purposes, we always return the mock business (which has onboardingCompleted: false initially)
        // In a real app, this would fetch from API
        user = businesses[0];
      } else {
        // Create a FRESH un-onboarded influencer for testing the flow
        user = {
           id: `new-inf-${Date.now()}`,
           name: '',
           email: 'novo@influencer.com',
           role: UserRole.INFLUENCER,
           handle: '',
           niche: '',
           followers: 0,
           engagementRate: 0,
           pricePerPost: 0,
           pricePerReel: 0,
           rating: 0,
           verified: false,
           balance: 0,
           bio: '',
           platform: 'Instagram',
           sizeCategory: 'Nano',
           onboardingCompleted: false // TRIGGER ONBOARDING
        };
        // Add to list so data persists in session if they fill it out
        setInfluencers(prev => [...prev, user as Influencer]);
      }
      
      setCurrentUser(user);
      resolve(user);
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUser = (data: Partial<User | Influencer>) => {
     if (!currentUser) return;
     const updatedUser = { ...currentUser, ...data };
     
     // Update local state
     setCurrentUser(updatedUser as User | Influencer);
     
     // Update in global lists if necessary
     if (updatedUser.role === UserRole.INFLUENCER) {
        setInfluencers(prev => prev.map(inf => inf.id === currentUser.id ? (updatedUser as Influencer) : inf));
     }
     
     // Update the Mock business reference for this session
     if (updatedUser.role === UserRole.BUSINESS) {
       setBusinesses(prev => prev.map(b => b.id === currentUser.id ? (updatedUser as User) : b));
     }
  };

  const createOrder = (influencerId: string, serviceType: 'Story' | 'Reels', amount: number, briefing: string) => {
    if (!currentUser) return;
    
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      businessId: currentUser.id,
      influencerId,
      serviceType,
      amount,
      status: 'PENDING',
      briefing,
      createdAt: new Date().toISOString()
    };
    
    setOrders(prev => [newOrder, ...prev]);
    
    // Initial system message
    sendMessage(newOrder.id, `PEDIDO CRIADO: ${serviceType} - R$ ${amount}. Aguardando aceite.`);
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], deliveryUrl?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status, deliveryUrl: deliveryUrl || o.deliveryUrl };
      }
      return o;
    }));

    if (status === 'IN_PROGRESS') sendMessage(orderId, 'Proposta aceita! Iniciando produção.');
    if (status === 'DELIVERED') sendMessage(orderId, `Conteúdo entregue: ${deliveryUrl}`);
    if (status === 'COMPLETED') sendMessage(orderId, 'Pedido aprovado e finalizado! Pagamento liberado.');
  };

  const sendMessage = (orderId: string, text: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      orderId,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getBusinessById = (id: string) => {
    return businesses.find(b => b.id === id);
  };

  return (
    <AppContext.Provider value={{ currentUser, influencers, orders, messages, login, logout, createOrder, updateOrderStatus, sendMessage, updateUser, getBusinessById }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);