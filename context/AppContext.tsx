import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Influencer, Order, Message, UserRole, ServiceType } from '../types';
import { supabase } from './supabaseClient';

interface AppContextType {
  currentUser: User | Influencer | null;
  influencers: Influencer[];
  orders: Order[];
  messages: Message[];
  loading: boolean;
  login: (role: UserRole) => Promise<User>;
  logout: () => void;
  createOrder: (influencerId: string, serviceType: 'Story' | 'Reels' | 'Feed', amount: number, briefing: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status'], deliveryUrl?: string) => Promise<void>;
  sendMessage: (orderId: string, text: string) => Promise<void>;
  updateUser: (data: Partial<User | Influencer>) => Promise<void>;
  uploadFile: (file: File, path: string) => Promise<string>;
  getBusinessById: (id: string) => Promise<User | undefined>;
  fetchAllUsers: () => Promise<(User | Influencer)[]>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

// Helper function for consistent profile formatting
const formatUserProfile = (userData: any): User | Influencer => {
  const formatted: any = {
    ...userData,
    companyProfile: userData.company_profile,
    onboardingCompleted: userData.onboarding_completed,
    avatarUrl: userData.avatar_url,
    pricePerPost: userData.price_per_post,
    pricePerReel: userData.price_per_reel,
    sizeCategory: userData.size_category,
    engagementRate: userData.engagement_rate,
    audienceData: userData.audience_data,
    contentStyle: userData.content_style,
    paymentInfo: userData.payment_info,
    contactSettings: userData.contact_settings,
    socialHandles: userData.social_handles,
    secondaryNiches: userData.secondary_niches,
    artisticName: userData.artistic_name,
    portfolio: userData.portfolio || [],
  };

  // Clean up snake_case fields to keep state consistent
  const snakeFields = [
    'company_profile', 'onboarding_completed', 'avatar_url', 
    'price_per_post', 'price_per_reel', 'size_category', 
    'engagement_rate', 'audience_data', 'content_style', 
    'payment_info', 'contact_settings', 'social_handles', 
    'secondary_niches', 'artistic_name'
  ];
  
  snakeFields.forEach(field => {
    delete formatted[field];
  });

  return formatted as User | Influencer;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | Influencer | null>(null);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    // Escuta mudanças na autenticação (login, logout, refresh de token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        localStorage.removeItem('pb_user');
      }
    });

    fetchInitialData();

    // Iniciar Realtime Subscriptions
    const ordersSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async (payload) => {
        console.log('Order change detected:', payload);
        if (currentUser) {
          const newOrder = payload.new as any;
          if (newOrder.business_id === currentUser.id || newOrder.influencer_id === currentUser.id) {
            await fetchUserSpecificData(currentUser.id);
          }
        }
      })
      .subscribe();

    const messagesSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        console.log('New message detected:', payload);
        if (currentUser) {
          const newMsg = payload.new as any;
          // Verificar se a mensagem pertence a um pedido do usuário atual
          const { data: order } = await supabase.from('orders').select('business_id, influencer_id').eq('id', newMsg.order_id).single();
          if (order && (order.business_id === currentUser.id || order.influencer_id === currentUser.id)) {
            const formattedMsg: Message = {
              ...newMsg,
              orderId: newMsg.order_id,
              senderId: newMsg.sender_id,
              timestamp: newMsg.created_at
            };
            setMessages(prev => {
              if (prev.find(m => m.id === formattedMsg.id)) return prev;
              return [...prev, formattedMsg];
            });
          }
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(ordersSubscription);
      supabase.removeChannel(messagesSubscription);
    };
  }, []);

  const fetchUserProfile = useCallback(async (userId: string) => {
    console.log('fetchUserProfile iniciado para:', userId);
    try {
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      if (userData) {
        if (userData.status === 'SUSPENDED') {
          await logout();
          throw new Error('Sua conta foi suspensa pela administração.');
        }

        const formattedUser = formatUserProfile(userData);
        setCurrentUser(formattedUser);
        localStorage.setItem('pb_user', JSON.stringify(formattedUser));
        fetchUserSpecificData(userData.id).catch(err => console.error('Erro ao buscar dados específicos:', err));
        return formattedUser;
      }
    } catch (error) {
      console.error('Erro fatal em fetchUserProfile:', error);
    }
    return null;
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: infData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', UserRole.INFLUENCER);
      
      if (infData) {
        setInfluencers(infData.map(inf => formatUserProfile(inf) as Influencer));
      }

      const storedUser = localStorage.getItem('pb_user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
        setLoading(false);
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  const fetchUserSpecificData = useCallback(async (userId: string) => {
    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .or(`business_id.eq.${userId},influencer_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (orderData) {
      const formattedOrders = orderData.map(o => ({
        ...o,
        businessId: o.business_id,
        influencerId: o.influencer_id,
        serviceType: o.service_type,
        deliveryUrl: o.delivery_url,
        createdAt: o.created_at
      }));
      setOrders(formattedOrders);

      if (formattedOrders.length > 0) {
        const orderIds = formattedOrders.map(o => o.id);
        const { data: msgData } = await supabase
          .from('messages')
          .select('*')
          .in('order_id', orderIds)
          .order('created_at', { ascending: true });
        
        if (msgData) {
          setMessages(msgData.map(m => ({
            ...m,
            orderId: m.order_id,
            senderId: m.sender_id,
            timestamp: m.created_at
          })));
        }
      }
    }
  }, []);

  const login = useCallback(async (role: UserRole, email?: string, password?: string, fullName?: string): Promise<User> => {
    setLoading(true);
    try {
      if (!email || !password) throw new Error('Email e senha são obrigatórios');

      if (fullName) {
        const finalRole = email === 'resultadoelevado@gmail.com' ? UserRole.ADMIN : role;
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role: finalRole, full_name: fullName } }
        });

        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error('Falha no cadastro');
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signUpData.user.id)
          .single();
          
        const formatted = profile ? formatUserProfile(profile) : {
          id: signUpData.user.id,
          email: signUpData.user.email,
          role: finalRole,
          name: fullName,
          balance: 0,
          onboarding_completed: false
        } as User;

        setCurrentUser(formatted);
        localStorage.setItem('pb_user', JSON.stringify(formatted));
        return formatted;
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) throw new Error('USER_NOT_FOUND');
        throw signInError;
      }

      const authUser = signInData.user;
      if (!authUser) throw new Error('Falha na autenticação');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (!profile) {
        const finalRole = (email === 'resultadoelevado@gmail.com' || authUser.email === 'resultadoelevado@gmail.com') ? UserRole.ADMIN : role;
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: authUser.id,
            email: authUser.email,
            role: finalRole,
            name: fullName || authUser.user_metadata?.full_name || '',
            balance: 0,
            onboarding_completed: false
          }])
          .select()
          .single();
        
        if (createError) throw createError;
        const formatted = formatUserProfile(newProfile);
        setCurrentUser(formatted);
        localStorage.setItem('pb_user', JSON.stringify(formatted));
        return formatted;
      }

      if (profile.status === 'SUSPENDED') {
        await logout();
        throw new Error('Sua conta está suspensa.');
      }

      const formattedUser = formatUserProfile(profile);
      setCurrentUser(formattedUser);
      localStorage.setItem('pb_user', JSON.stringify(formattedUser));
      return formattedUser as User;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    localStorage.removeItem('pb_user');
  }, []);

  const updateUser = useCallback(async (data: Partial<User | Influencer>) => {
    if (!currentUser) return;

    const dbUpdate: any = { ...data };
    // Map frontend fields to DB columns
    const mapping: Record<string, string> = {
      companyProfile: 'company_profile',
      onboardingCompleted: 'onboarding_completed',
      avatarUrl: 'avatar_url',
      audienceData: 'audience_data',
      contentStyle: 'content_style',
      paymentInfo: 'payment_info',
      contactSettings: 'contact_settings',
      socialHandles: 'social_handles',
      secondaryNiches: 'secondary_niches',
      artisticName: 'artistic_name',
      pricePerPost: 'price_per_post',
      pricePerReel: 'price_per_reel',
      sizeCategory: 'size_category',
      engagementRate: 'engagement_rate',
      portfolio: 'portfolio'
    };

    Object.keys(mapping).forEach(key => {
      if (key in data) {
        dbUpdate[mapping[key]] = (data as any)[key];
        delete dbUpdate[key];
      }
    });

    const { data: updated, error } = await supabase
      .from('profiles')
      .update(dbUpdate)
      .eq('id', currentUser.id)
      .select()
      .single();

    if (error) throw error;

    const formattedUser = formatUserProfile(updated);
    setCurrentUser(formattedUser);
    localStorage.setItem('pb_user', JSON.stringify(formattedUser));
    
    if (formattedUser.role === UserRole.INFLUENCER) {
      setInfluencers(prev => prev.map(inf => inf.id === currentUser.id ? (formattedUser as Influencer) : inf));
    }
  }, [currentUser]);

  const uploadFile = useCallback(async (file: File, path: string): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Erro no upload:', error);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }, []);

  const createOrder = useCallback(async (influencerId: string, serviceType: ServiceType, amount: number, briefing: string) => {
    if (!currentUser) return;
    
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        business_id: currentUser.id,
        influencer_id: influencerId,
        service_type: serviceType,
        amount,
        status: 'PENDING',
        briefing
      }])
      .select()
      .single();

    if (error) throw error;

    const formattedOrder: Order = {
      ...data,
      businessId: data.business_id,
      influencerId: data.influencer_id,
      serviceType: data.service_type,
      createdAt: data.created_at
    };

    setOrders(prev => [formattedOrder, ...prev]);
    await sendMessage(formattedOrder.id, `PEDIDO CRIADO: ${serviceType} - R$ ${amount}. Aguardando aceite.`);
  }, [currentUser]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status'], deliveryUrl?: string) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, delivery_url: deliveryUrl })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, deliveryUrl: deliveryUrl || o.deliveryUrl } : o));

    if (status === 'IN_PROGRESS') await sendMessage(orderId, 'Proposta aceita! Iniciando produção.');
    if (status === 'DELIVERED') await sendMessage(orderId, `Conteúdo entregue: ${deliveryUrl}`);
    if (status === 'COMPLETED') await sendMessage(orderId, 'Pedido aprovado e finalizado! Pagamento liberado.');
  }, []);

  const sendMessage = useCallback(async (orderId: string, text: string) => {
    if (!currentUser) return;
    
    const { data, error } = await supabase
      .from('messages')
      .insert([{ order_id: orderId, sender_id: currentUser.id, text }])
      .select()
      .single();

    if (error) throw error;

    const formattedMsg: Message = {
      ...data,
      orderId: data.order_id,
      senderId: data.sender_id,
      timestamp: data.created_at
    };

    setMessages(prev => [...prev, formattedMsg]);
  }, [currentUser]);

  const getBusinessById = useCallback(async (id: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
    return data ? formatUserProfile(data) : undefined;
  }, []);

  const fetchAllUsers = useCallback(async () => {
    if (currentUser?.role !== UserRole.ADMIN) return [];
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) return [];
    return data.map(u => formatUserProfile(u));
  }, [currentUser]);

  return (
    <AppContext.Provider value={{ 
      currentUser, 
      influencers, 
      orders, 
      messages, 
      loading,
      login, 
      logout, 
      createOrder, 
      updateOrderStatus, 
      sendMessage, 
      updateUser, 
      uploadFile,
      getBusinessById,
      fetchAllUsers
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);