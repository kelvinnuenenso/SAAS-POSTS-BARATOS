import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Card, Button, Badge } from './UI';
import { Users, Search, Filter, ShieldCheck, Mail, Phone, Building, User as UserIcon, ArrowLeft, RefreshCw, Eye, Target, Star, MapPin, Globe } from './Icons';
import { useApp } from '../context/AppContext';
import { User, Influencer, UserRole } from '../types';
import { supabase } from '../context/supabaseClient';

// --- Sub-components (Memoized) ---

const UserRow = React.memo(({ user, onSelect }: { user: User | Influencer; onSelect: (u: User | Influencer) => void }) => {
  const isInfluencer = user.role === UserRole.INFLUENCER;
  const influencer = isInfluencer ? (user as Influencer) : null;
  
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <img 
            src={user.avatarUrl || 'https://via.placeholder.com/40'} 
            className="w-10 h-10 rounded-full object-cover border border-gray-200" 
            alt={user.name}
          />
          <div>
            <p className="font-bold text-gray-800 text-sm">{user.name}</p>
            {isInfluencer && <p className="text-xs text-brand-blue font-bold">{influencer?.handle}</p>}
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${isInfluencer ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
          {isInfluencer ? 'Influencer' : 'Empresa'}
        </span>
      </td>
      <td className="p-4">
        <div className="space-y-1">
          <p className="text-xs flex items-center gap-1.5 text-gray-600">
            <Mail className="w-3 h-3" /> {user.email}
          </p>
          <p className="text-xs flex items-center gap-1.5 text-gray-600">
            <Phone className="w-3 h-3" /> 
            {isInfluencer ? (influencer?.contactSettings?.whatsapp || 'N/A') : (user.companyProfile?.contact?.whatsapp || 'N/A')}
          </p>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${user.status === 'SUSPENDED' ? 'bg-red-500' : user.onboardingCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
          <span className="text-xs font-medium text-gray-500">
            {user.status === 'SUSPENDED' ? 'Suspenso' : user.onboardingCompleted ? 'Ativo' : 'Onboarding'}
          </span>
        </div>
      </td>
      <td className="p-4 text-right">
        <Button size="sm" variant="ghost" className="text-brand-blue" onClick={() => onSelect(user)}>
          <Eye className="w-4 h-4 mr-1" /> Detalhes
        </Button>
      </td>
    </tr>
  );
});

const StatCard = React.memo(({ label, value, colorClass }: { label: string; value: number; colorClass?: string }) => (
  <Card className={`p-4 !bg-white ${colorClass || ''}`}>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <h3 className={`text-2xl font-black ${colorClass ? '' : 'text-gray-900'}`}>{value}</h3>
  </Card>
));

const UserDetailsModal = React.memo(({ 
  user, 
  onClose, 
  onSuspend, 
  loading 
}: { 
  user: User | Influencer; 
  onClose: () => void; 
  onSuspend: (id: string) => void;
  loading: boolean;
}) => {
  const isInfluencer = user.role === UserRole.INFLUENCER;
  const isSuspended = user.status === 'SUSPENDED';

  return (
    <div className="fixed inset-0 bg-brand-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200 !bg-white !text-gray-900 shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
            <UserIcon className="text-brand-blue" /> Detalhes do Perfil (Admin View)
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-6 h-6 rotate-180 md:rotate-0" />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Profile Overview */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <img 
              src={user.avatarUrl || 'https://via.placeholder.com/100'} 
              className="w-24 h-24 rounded-2xl object-cover border-4 border-gray-100 shadow-md" 
              alt={user.name}
            />
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{user.name}</h4>
                <Badge status={user.onboardingCompleted ? 'COMPLETED' : 'PENDING'} />
              </div>
              <p className="text-brand-blue font-bold mb-4 bg-blue-50 px-3 py-1 rounded-full inline-block text-xs uppercase tracking-wider">
                {isInfluencer ? (user as Influencer).handle : 'Perfil Empresarial'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">E-mail Registrado</p>
                  <p className="text-sm font-bold text-gray-800 flex items-center justify-center md:justify-start gap-2">
                    <Mail className="w-4 h-4 text-brand-blue" /> {user.email}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">WhatsApp de Contato</p>
                  <p className="text-sm font-bold text-gray-800 flex items-center justify-center md:justify-start gap-2">
                    <Phone className="w-4 h-4 text-green-600" /> 
                    {isInfluencer 
                      ? (user as Influencer).contactSettings?.whatsapp || 'Não informado'
                      : (user as User).companyProfile?.contact?.whatsapp || 'Não informado'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Specific Info */}
          {isInfluencer ? (
            <div className="space-y-6">
              <div>
                <h5 className="font-black text-gray-900 mb-4 pb-2 border-b-2 border-gray-100 uppercase text-xs tracking-widest">Métricas do Influencer</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-100">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Seguidores</p>
                    <p className="text-xl font-black text-blue-800">{(user as Influencer).followers?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl border-2 border-purple-100">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Engajamento</p>
                    <p className="text-xl font-black text-purple-800">{(user as Influencer).engagementRate}%</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-100">
                    <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Preço Base</p>
                    <p className="text-xl font-black text-green-800">R$ {(user as Influencer).pricePerPost || '0'}</p>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-black text-gray-900 mb-2 text-xs uppercase tracking-widest">Bio do Influencer</h5>
                <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border-2 border-gray-100 leading-relaxed italic">
                  "{(user as Influencer).bio || 'Nenhuma bio informada.'}"
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h5 className="font-black text-gray-900 mb-4 pb-2 border-b-2 border-gray-100 uppercase text-xs tracking-widest">Informações da Empresa</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Setor de Atuação</p>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <Building className="w-4 h-4 text-brand-blue" /> {(user as User).companyProfile?.sector || 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Tamanho da Empresa</p>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-blue" /> {(user as User).companyProfile?.size || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-black text-gray-900 mb-2 text-xs uppercase tracking-widest">Sobre a Empresa</h5>
                <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border-2 border-gray-100 leading-relaxed italic">
                  "{(user as User).companyProfile?.description || 'Nenhuma descrição informada.'}"
                </div>
              </div>
            </div>
          )}

          <div className="pt-8 mt-4 border-t-2 border-gray-100 flex flex-col md:flex-row gap-4">
            <Button 
              fullWidth 
              onClick={onClose}
              className="!bg-gray-900 hover:!bg-black !text-white !py-4 font-black uppercase tracking-widest text-xs"
            >
              Fechar Detalhes
            </Button>
            <Button 
              fullWidth 
              variant="outline"
              onClick={() => onSuspend(user.id)}
              disabled={loading}
              className={`!py-4 font-black uppercase tracking-widest text-xs border-2 ${isSuspended ? 'border-green-600 text-green-600 hover:bg-green-50' : 'border-red-600 text-red-600 hover:bg-red-50'}`}
            >
              {loading ? 'Processando...' : isSuspended ? 'Reativar Usuário' : 'Suspender Usuário'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
});

export const AdminCRM: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { currentUser, fetchAllUsers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'BUSINESS' | 'INFLUENCER'>('ALL');
  const [selectedUser, setSelectedUser] = useState<User | Influencer | null>(null);
  const [allUsers, setAllUsers] = useState<(User | Influencer)[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const users = await fetchAllUsers();
      setAllUsers(users.sort((a, b) => (b.id > a.id ? 1 : -1)));
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchAllUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSuspendUser = useCallback(async (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    const isCurrentlySuspended = user.status === 'SUSPENDED';
    const action = isCurrentlySuspended ? 'reativar' : 'suspender';
    
    if (!window.confirm(`Tem certeza que deseja ${action} este usuário?`)) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({ status: isCurrentlySuspended ? 'ACTIVE' : 'SUSPENDED' })
        .eq('id', userId);

      if (error) throw error;
      
      alert(`Usuário ${isCurrentlySuspended ? 'reativado' : 'suspendido'} com sucesso!`);
      await loadUsers();
      if (selectedUser?.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, status: isCurrentlySuspended ? 'ACTIVE' : 'SUSPENDED' } : null);
      }
    } catch (error: any) {
      console.error('Erro ao mudar status:', error);
      alert('Erro ao processar: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [allUsers, loadUsers, selectedUser]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (user as Influencer).handle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'ALL' || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [allUsers, searchTerm, filterRole]);

  const stats = useMemo(() => ({
    total: allUsers.length,
    influencers: allUsers.filter(u => u.role === UserRole.INFLUENCER).length,
    businesses: allUsers.filter(u => u.role === UserRole.BUSINESS).length,
    suspended: allUsers.filter(u => u.status === 'SUSPENDED').length
  }), [allUsers]);

  if (currentUser?.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full text-center p-8">
          <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Acesso Restrito</h1>
          <p className="text-gray-600 mb-6">Você não tem permissão para acessar esta área do sistema.</p>
          <Button onClick={onLogout} fullWidth>Sair</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-brand-black text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-brand-yellow p-2 rounded-lg">
              <ShieldCheck className="text-brand-black w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PostsBaratos <span className="text-brand-yellow">CRM Admin</span></h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Painel de Controle Interno</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden md:inline">Olá, <strong>{currentUser.name}</strong></span>
            <Button onClick={onLogout} variant="ghost" size="sm" className="!text-white hover:!bg-white/10 border border-white/20">Sair</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-brand-blue" /> Gestão de Usuários
            </h2>
            <p className="text-gray-500 text-sm">Visualize e gerencie todos os perfis cadastrados na plataforma.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={loadUsers} disabled={loading} className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> {loading ? '' : 'Atualizar'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total de Usuários" value={stats.total} />
          <StatCard label="Influenciadores" value={stats.influencers} colorClass="border-l-4 border-l-purple-500 !text-purple-600" />
          <StatCard label="Empresas" value={stats.businesses} colorClass="border-l-4 border-l-blue-500 !text-blue-600" />
          <StatCard label="Suspensos" value={stats.suspended} colorClass="border-l-4 border-l-red-500 !text-red-600" />
        </div>

        <Card className="mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar por nome, email ou @handle..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {(['ALL', 'INFLUENCER', 'BUSINESS'] as const).map(role => (
                <button 
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filterRole === role ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {role === 'ALL' ? 'Todos' : role === 'INFLUENCER' ? 'Influencers' : 'Empresas'}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="p-4">Usuário</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Contato (CRM)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand-blue" />
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400">Nenhum usuário encontrado com os filtros atuais.</td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <UserRow key={user.id} user={user} onSelect={setSelectedUser} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
          onSuspend={handleSuspendUser}
          loading={loading}
        />
      )}
    </div>
  );
};
