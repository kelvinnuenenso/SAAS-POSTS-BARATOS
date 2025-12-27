import React from 'react';
import { Card, Button } from '../UI';
import { User as UserIcon, BarChart2, DollarSign, Users, Image, Calendar, ShieldCheck, Camera, Plus, Trash, Globe, Target, Sliders, PieChart, Sparkles, Paperclip, ChevronDown } from '../Icons';
import { Influencer, InfluencerService } from '../../types';

type ProfileTab = 'general' | 'metrics' | 'pricing' | 'audience' | 'style' | 'schedule' | 'rules';

interface ProfileViewProps {
  activeProfileTab: ProfileTab;
  setActiveProfileTab: (tab: ProfileTab) => void;
  profileData: Influencer;
  updateField: (field: keyof Influencer, value: any) => void;
  updateNestedField: (parent: keyof Influencer, field: string, value: any) => void;
  toggleArrayItem: (parent: keyof Influencer, field: string, item: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, target: 'avatar' | 'portfolio' | 'mediaKit') => void;
  onRemoveService: (id: string) => void;
  onOpenServiceModal: () => void;
  isUploading: boolean;
  avatarInputRef: React.RefObject<HTMLInputElement>;
  portfolioInputRef: React.RefObject<HTMLInputElement>;
  mediaKitInputRef: React.RefObject<HTMLInputElement>;
}

export const ProfileView: React.FC<ProfileViewProps> = React.memo(({ 
  activeProfileTab, 
  setActiveProfileTab, 
  profileData, 
  updateField, 
  updateNestedField, 
  toggleArrayItem, 
  onImageUpload, 
  onRemoveService, 
  onOpenServiceModal, 
  isUploading, 
  avatarInputRef, 
  portfolioInputRef, 
  mediaKitInputRef 
}) => {
  const profileTabs = [
     { id: 'general', label: 'Geral', icon: <UserIcon className="w-4 h-4"/> },
     { id: 'metrics', label: 'Métricas', icon: <BarChart2 className="w-4 h-4"/> },
     { id: 'pricing', label: 'Serviços', icon: <DollarSign className="w-4 h-4"/> },
     { id: 'audience', label: 'Público', icon: <Users className="w-4 h-4"/> },
     { id: 'style', label: 'Estilo', icon: <Image className="w-4 h-4"/> },
     { id: 'schedule', label: 'Agenda', icon: <Calendar className="w-4 h-4"/> },
     { id: 'rules', label: 'Regras', icon: <ShieldCheck className="w-4 h-4"/> },
  ];

  const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1";
  const inputClass = "w-full bg-white border border-gray-300 hover:border-brand-blue focus:border-brand-blue rounded-lg px-3 py-2 text-sm transition-all outline-none text-brand-black";

  return (
    <div className="space-y-6">
       <div className="flex border-b border-gray-200 overflow-x-auto">
          {profileTabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveProfileTab(tab.id as ProfileTab)}
               className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeProfileTab === tab.id ? 'border-brand-blue text-brand-blue bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
             >
               {tab.icon}
               {tab.label}
             </button>
          ))}
       </div>

       <Card className="!bg-white !border-gray-200 !rounded-t-none !mt-0 min-h-[500px] p-6">
          {/* TAB: GENERAL */}
          {activeProfileTab === 'general' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
                <div className="space-y-6">
                   <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="relative group">
                         <img src={profileData.avatarUrl || 'https://via.placeholder.com/150'} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" alt="Avatar" />
                         <button 
                           onClick={() => avatarInputRef.current?.click()}
                           disabled={isUploading}
                           className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                         >
                            <Camera className="w-6 h-6" />
                         </button>
                         <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => onImageUpload(e, 'avatar')} />
                      </div>
                      <div>
                         <h3 className="font-bold text-lg">{profileData.name}</h3>
                         <p className="text-sm text-gray-500">{profileData.handle}</p>
                         <button onClick={() => avatarInputRef.current?.click()} className="text-xs text-brand-blue font-bold mt-2 hover:underline">Alterar foto de perfil</button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                         <label className={labelClass}>Nome Artístico</label>
                         <input type="text" value={profileData.name} onChange={(e) => updateField('name', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                         <label className={labelClass}>Username/Handle</label>
                         <input type="text" value={profileData.handle} onChange={(e) => updateField('handle', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                         <label className={labelClass}>Nicho Principal</label>
                         <select value={profileData.niche} onChange={(e) => updateField('niche', e.target.value)} className={inputClass}>
                            <option>Moda</option>
                            <option>Beleza</option>
                            <option>Lifestyle</option>
                            <option>Tecnologia</option>
                            <option>Educação</option>
                            <option>Gamer</option>
                            <option>Finanças</option>
                            <option>Saúde/Fitness</option>
                         </select>
                      </div>
                      <div>
                         <label className={labelClass}>Plataforma Principal</label>
                         <select value={profileData.platform} onChange={(e) => updateField('platform', e.target.value)} className={inputClass}>
                            <option>Instagram</option>
                            <option>TikTok</option>
                            <option>YouTube</option>
                         </select>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div>
                      <label className={labelClass}>Bio / Descrição</label>
                      <textarea 
                        value={profileData.bio} 
                        onChange={(e) => updateField('bio', e.target.value)} 
                        className={inputClass + " h-32 resize-none"}
                        placeholder="Conte um pouco sobre seu trabalho e que tipo de parcerias você busca..."
                      />
                   </div>
                   <div>
                      <label className={labelClass}>Cidade/Estado</label>
                      <input type="text" value={profileData.location?.city || ''} onChange={(e) => updateNestedField('location', 'city', e.target.value)} className={inputClass} />
                   </div>
                </div>
             </div>
          )}

          {/* TAB: METRICS */}
          {activeProfileTab === 'metrics' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
                <div className="space-y-6">
                   <h3 className="font-bold text-brand-dark flex items-center gap-2"><PieChart className="w-5 h-5"/> Números Atuais</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className={labelClass}>Seguidores</label>
                         <input type="number" value={profileData.followers} onChange={(e) => updateField('followers', Number(e.target.value))} className={inputClass} />
                      </div>
                      <div>
                         <label className={labelClass}>Taxa de Engajamento (%)</label>
                         <input type="number" value={profileData.engagementRate} onChange={(e) => updateField('engagementRate', Number(e.target.value))} className={inputClass} />
                      </div>
                   </div>
                   
                   <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-4">
                      <h4 className="font-bold text-sm text-blue-900 flex items-center gap-2">
                         <Paperclip className="w-4 h-4"/> Mídia Kit (PDF/Link)
                      </h4>
                      {profileData.metrics?.mediaKitUrl ? (
                         <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                            <span className="text-xs text-blue-600 truncate max-w-[200px] font-medium">{profileData.metrics.mediaKitUrl}</span>
                            <button onClick={() => mediaKitInputRef.current?.click()} className="text-[10px] font-bold text-brand-blue uppercase hover:underline">Substituir</button>
                         </div>
                      ) : (
                         <Button onClick={() => mediaKitInputRef.current?.click()} variant="ghost" fullWidth size="sm" className="!border-dashed !border-blue-300 !text-blue-600">
                            Fazer Upload do Mídia Kit
                         </Button>
                      )}
                      <input type="file" ref={mediaKitInputRef} className="hidden" accept=".pdf,image/*" onChange={(e) => onImageUpload(e, 'mediaKit')} />
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="font-bold text-brand-dark flex items-center gap-2"><Globe className="w-5 h-5"/> Alcance Médio</h3>
                   <div className="space-y-4">
                      <div>
                         <label className={labelClass}>Visualizações Médias (Stories)</label>
                         <input type="number" value={profileData.metrics?.avgStoriesViews} onChange={(e) => updateNestedField('metrics', 'avgStoriesViews', Number(e.target.value))} className={inputClass} />
                      </div>
                      <div>
                         <label className={labelClass}>Visualizações Médias (Reels/Vídeo)</label>
                         <input type="number" value={profileData.metrics?.avgReelsViews} onChange={(e) => updateNestedField('metrics', 'avgReelsViews', Number(e.target.value))} className={inputClass} />
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* TAB: PRICING */}
          {activeProfileTab === 'pricing' && (
             <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center">
                   <h3 className="font-bold text-brand-dark">Seus Serviços e Preços</h3>
                   <Button onClick={onOpenServiceModal} size="sm" className="!bg-brand-black !text-brand-yellow">
                      <Plus className="w-4 h-4 mr-2"/> Adicionar Serviço
                   </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {profileData.services?.map((service) => (
                      <div key={service.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-brand-blue transition-colors group relative">
                         <button onClick={() => onRemoveService(service.id)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash className="w-4 h-4"/>
                         </button>
                         <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold bg-brand-blue text-white px-2 py-0.5 rounded uppercase">{service.platform}</span>
                            <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded uppercase">{service.format}</span>
                         </div>
                         <p className="text-xl font-bold text-brand-dark">R$ {service.price}</p>
                         {service.negotiable && <p className="text-[10px] text-green-600 font-bold mt-1 uppercase">Preço Negociável</p>}
                      </div>
                   ))}
                   {(!profileData.services || profileData.services.length === 0) && (
                      <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                         <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-2"/>
                         <p className="text-gray-500 text-sm">Você ainda não cadastrou nenhum serviço.</p>
                      </div>
                   )}
                </div>
             </div>
          )}

          {/* TAB: AUDIENCE */}
          {activeProfileTab === 'audience' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
                <div className="space-y-6">
                   <h3 className="font-bold text-brand-dark flex items-center gap-2"><Users className="w-5 h-5"/> Gênero Predominante</h3>
                   <div className="grid grid-cols-3 gap-2">
                      {['Feminino', 'Masculino', 'Misto'].map(gender => (
                         <button 
                           key={gender}
                           onClick={() => updateNestedField('audienceData', 'gender', gender)}
                           className={`p-3 rounded-xl border text-sm font-bold transition-all ${profileData.audienceData?.gender === gender ? 'bg-brand-blue border-brand-blue text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-brand-blue'}`}
                         >
                            {gender}
                         </button>
                      ))}
                   </div>

                   <h3 className="font-bold text-brand-dark mt-8">Faixa Etária Principal</h3>
                   <div className="grid grid-cols-2 gap-2">
                      {['13-17', '18-24', '25-34', '35-44', '45-54', '55+'].map(age => (
                         <button 
                           key={age}
                           onClick={() => updateNestedField('audienceData', 'ageRange', age)}
                           className={`p-3 rounded-xl border text-sm font-bold transition-all ${profileData.audienceData?.ageRange === age ? 'bg-brand-blue border-brand-blue text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-brand-blue'}`}
                         >
                            {age} anos
                         </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="font-bold text-brand-dark flex items-center gap-2"><Target className="w-5 h-5"/> Principais Cidades</h3>
                   <textarea 
                     value={profileData.audienceData?.topCities?.join(', ')} 
                     onChange={(e) => updateNestedField('audienceData', 'topCities', e.target.value.split(',').map(s => s.trim()))}
                     className={inputClass + " h-24 resize-none"}
                     placeholder="Ex: São Paulo, Rio de Janeiro, Belo Horizonte..."
                   />
                   <p className="text-[10px] text-gray-400 italic">Separe as cidades por vírgula.</p>
                </div>
             </div>
          )}

          {/* TAB: STYLE */}
          {activeProfileTab === 'style' && (
             <div className="space-y-8 animate-in fade-in">
                <div>
                   <h3 className="font-bold text-brand-dark mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5"/> Estilo de Conteúdo</h3>
                   <div className="flex flex-wrap gap-2">
                      {['Engraçado', 'Informativo', 'Estético/Minimalista', 'Lifestyle Real', 'Tutorial/Educativo', 'Review/Unboxing', 'Vlog', 'High-End/Luxo'].map(style => (
                         <button 
                           key={style}
                           onClick={() => toggleArrayItem('contentStyle', 'tags', style)}
                           className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${profileData.contentStyle?.tags?.includes(style) ? 'bg-brand-black border-brand-black text-brand-yellow' : 'bg-white border-gray-200 text-gray-500 hover:border-brand-blue'}`}
                         >
                            {style}
                         </button>
                      ))}
                   </div>
                </div>

                <div>
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-brand-dark flex items-center gap-2"><Image className="w-5 h-5"/> Portfólio / Fotos Recentes</h3>
                      <Button onClick={() => portfolioInputRef.current?.click()} size="sm" variant="ghost" className="!text-brand-blue">
                         <Plus className="w-4 h-4 mr-1"/> Adicionar Foto
                      </Button>
                      <input type="file" ref={portfolioInputRef} className="hidden" accept="image/*" onChange={(e) => onImageUpload(e, 'portfolio')} />
                   </div>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {profileData.portfolio?.map((img, idx) => (
                         <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-gray-200 relative group">
                            <img src={img} className="w-full h-full object-cover" alt="Portfolio" />
                            <button 
                              onClick={() => updateField('portfolio', profileData.portfolio?.filter((_, i) => i !== idx))}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                               <Trash className="w-3 h-3"/>
                            </button>
                         </div>
                      ))}
                      <button 
                        onClick={() => portfolioInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-brand-blue hover:text-brand-blue transition-all"
                      >
                         <Plus className="w-6 h-6 mb-1"/>
                         <span className="text-[10px] font-bold uppercase">Upload</span>
                      </button>
                   </div>
                </div>
             </div>
          )}

          {/* TAB: SCHEDULE */}
          {activeProfileTab === 'schedule' && (
             <div className="max-w-xl animate-in fade-in">
                <h3 className="font-bold text-brand-dark mb-6 flex items-center gap-2"><Calendar className="w-5 h-5"/> Disponibilidade para Publis</h3>
                <div className="space-y-4">
                   <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <label className="flex items-center justify-between cursor-pointer">
                         <div>
                            <p className="font-bold text-sm text-brand-dark">Agenda Aberta</p>
                            <p className="text-xs text-gray-500">Empresas podem solicitar pedidos a qualquer momento.</p>
                         </div>
                         <input type="checkbox" checked={profileData.schedule?.isAvailable} onChange={(e) => updateNestedField('schedule', 'isAvailable', e.target.checked)} className="w-6 h-6 text-brand-blue rounded focus:ring-brand-blue" />
                      </label>
                   </div>
                   
                   <div>
                      <label className={labelClass}>Avisos de Agenda (Opcional)</label>
                      <textarea 
                        value={profileData.schedule?.notes} 
                        onChange={(e) => updateNestedField('schedule', 'notes', e.target.value)}
                        className={inputClass + " h-24 resize-none"}
                        placeholder="Ex: Não realizo postagens aos domingos. Agenda de Dezembro lotada."
                      />
                   </div>
                </div>
             </div>
          )}

          {/* TAB: RULES */}
          {activeProfileTab === 'rules' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
                <div className="space-y-6">
                   <h3 className="font-bold text-brand-dark flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> O que eu NÃO divulgo</h3>
                   <div className="flex flex-wrap gap-2">
                      {['Jogos de Azar', 'Bebidas Alcoólicas', 'Cigarros/Vapes', 'Conteúdo Adulto', 'Cripto/NFTs', 'Polis/Religião'].map(item => (
                         <button 
                           key={item}
                           onClick={() => toggleArrayItem('contactSettings', 'restrictedNiches', item)}
                           className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${profileData.contactSettings?.restrictedNiches?.includes(item) ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-500 hover:border-brand-blue'}`}
                         >
                            {item}
                         </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="font-bold text-brand-dark flex items-center gap-2"><Sliders className="w-5 h-5"/> Preferências de Contato</h3>
                   <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer">
                         <input type="checkbox" checked={profileData.contactSettings?.allowDirectMessages} onChange={(e) => updateNestedField('contactSettings', 'allowDirectMessages', e.target.checked)} className="w-4 h-4 text-brand-blue rounded" />
                         <span className="text-sm font-medium">Permitir mensagens antes do pedido</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer">
                         <input type="checkbox" checked={profileData.contactSettings?.showEmailToBusinesses} onChange={(e) => updateNestedField('contactSettings', 'showEmailToBusinesses', e.target.checked)} className="w-4 h-4 text-brand-blue rounded" />
                         <span className="text-sm font-medium">Mostrar email para empresas parceiras</span>
                      </label>
                   </div>
                </div>
             </div>
          )}
       </Card>
    </div>
  );
});
