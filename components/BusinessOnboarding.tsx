import React, { useState } from 'react';
import { Button, Card } from './UI';
import { Building, Globe, Users, Target, Megaphone, DollarSign, Image, MessageSquare, CheckCircle, Search, TrendingUp, Zap, AlertTriangle } from './Icons';
import { useApp } from '../context/AppContext';
import { User, CompanyProfile } from '../types';

interface BusinessOnboardingProps {
  onFinish: () => void;
}

export const BusinessOnboarding: React.FC<BusinessOnboardingProps> = ({ onFinish }) => {
  const { updateUser, currentUser } = useApp();
  const [step, setStep] = useState(1);
  const totalSteps = 12;
  const [isCustomSector, setIsCustomSector] = useState(false);
  const [logoUploaded, setLogoUploaded] = useState(false);
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const [formData, setFormData] = useState<Partial<User>>({
    ...currentUser,
    companyProfile: {
      ...currentUser?.companyProfile,
      niche: [],
      objectives: [],
      desiredDeliverables: [],
      budget: {},
      targetAudience: {},
      influencerPreferences: { niches: [], audienceSize: [] },
      contact: {},
      location: { city: '', state: '' }
    }
  });

  const clearError = (key: string) => {
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const updateCompanyProfile = (key: keyof CompanyProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      companyProfile: {
        ...(prev.companyProfile || {}),
        [key]: value
      }
    }));
    clearError(key as string);
  };

  const updateNestedProfile = (parent: keyof CompanyProfile, key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      companyProfile: {
        ...(prev.companyProfile || {}),
        [parent]: {
          ...(prev.companyProfile?.[parent] as any || {}),
          [key]: value
        }
      }
    }));
    clearError(`${parent}.${key}`);
  };

  const toggleSelection = (key: keyof CompanyProfile, item: string) => {
    const current = (formData.companyProfile?.[key] as string[]) || [];
    if (current.includes(item)) {
      updateCompanyProfile(key, current.filter(i => i !== item));
    } else {
      updateCompanyProfile(key, [...current, item]);
    }
    clearError(key as string);
  };

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
     const val = e.target.value;
     if (val === 'Outro') {
        setIsCustomSector(true);
        updateCompanyProfile('sector', '');
     } else {
        setIsCustomSector(false);
        updateCompanyProfile('sector', val);
     }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: {[key: string]: string} = {};
    let isValid = true;

    if (currentStep === 2) {
      if (!formData.name?.trim()) newErrors['name'] = 'Nome da empresa é obrigatório.';
      if (!formData.companyProfile?.cnpj?.trim()) newErrors['cnpj'] = 'CNPJ (ou CPF) é obrigatório.';
      if (!formData.companyProfile?.sector?.trim()) newErrors['sector'] = 'Selecione o setor de atuação.';
      if (!formData.companyProfile?.location?.city?.trim()) newErrors['location.city'] = 'Cidade é obrigatória.';
      if (!formData.companyProfile?.location?.state?.trim()) newErrors['location.state'] = 'Estado é obrigatório.';
    }

    if (currentStep === 4) {
      if (!formData.companyProfile?.objectives || formData.companyProfile.objectives.length === 0) {
        newErrors['objectives'] = 'Selecione pelo menos um objetivo.';
      }
    }

    if (currentStep === 5) {
      if (!formData.companyProfile?.targetAudience?.ageRange) newErrors['targetAudience.ageRange'] = 'Selecione a faixa etária.';
      if (!formData.companyProfile?.targetAudience?.gender) newErrors['targetAudience.gender'] = 'Selecione o gênero predominante.';
    }

    if (currentStep === 6) {
      if (!formData.companyProfile?.niche || formData.companyProfile.niche.length === 0) {
        newErrors['niche'] = 'Selecione pelo menos uma categoria de nicho.';
      }
    }

    if (currentStep === 7) {
      if (!formData.companyProfile?.budget?.monthly || formData.companyProfile.budget.monthly <= 0) {
        newErrors['budget.monthly'] = 'Informe um orçamento mensal válido.';
      }
      if (!formData.companyProfile?.budget?.priceRange) {
        newErrors['budget.priceRange'] = 'Selecione a faixa de preço por influenciador.';
      }
    }

    if (currentStep === 8) {
      if (!formData.companyProfile?.desiredDeliverables || formData.companyProfile.desiredDeliverables.length === 0) {
        newErrors['desiredDeliverables'] = 'Selecione o que você precisa contratar.';
      }
    }

    if (currentStep === 9) {
      if (!formData.companyProfile?.influencerPreferences?.type) {
        newErrors['influencerPreferences.type'] = 'Selecione o tipo de criador.';
      }
    }

    if (currentStep === 10) {
      if (!formData.companyProfile?.contact?.responsibleName?.trim()) newErrors['contact.responsibleName'] = 'Nome do responsável é obrigatório.';
      if (!formData.companyProfile?.contact?.email?.trim()) newErrors['contact.email'] = 'Email comercial é obrigatório.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
      if (navigator.vibrate) navigator.vibrate(50);
    }

    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  };

  // Direct skip without confirmation dialog to ensure functionality
  const skipToDashboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Directly finish onboarding with current data
    updateUser({ ...formData, onboardingCompleted: true });
    onFinish();
  };

  const finishOnboarding = () => {
    updateUser({ ...formData, onboardingCompleted: true });
    onFinish();
  };

  const progress = (step / totalSteps) * 100;
  const getInputClass = (errorKey: string) => `w-full bg-gray-50 border rounded-lg p-3 outline-none focus:ring-2 transition-all ${errors[errorKey] ? 'border-brand-yellow focus:ring-brand-yellow ring-1 ring-brand-yellow bg-yellow-50/10' : 'border-gray-200 focus:ring-brand-yellow'}`;
  const ErrorMsg = ({ id }: { id: string }) => errors[id] ? (
    <div className="flex items-center gap-1 mt-1 text-xs font-bold text-yellow-600 animate-in slide-in-from-left-1">
      <AlertTriangle className="w-3 h-3" /> {errors[id]}
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-brand-black text-brand-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-yellow/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {step > 1 && step < 12 && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider">
               <span>Configuração {step} de {totalSteps}</span>
               <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
               <div className="h-full bg-brand-yellow transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        <Card className="!bg-white !shadow-2xl !border-0 overflow-hidden min-h-[550px] flex flex-col">
          {step === 1 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in fade-in slide-in-from-bottom-4">
               <div className="w-20 h-20 bg-brand-black rounded-full flex items-center justify-center mb-6 shadow-xl border-2 border-brand-yellow">
                  <TrendingUp className="w-10 h-10 text-brand-yellow" />
               </div>
               <h1 className="text-3xl font-extrabold text-brand-black mb-4">Vamos preparar sua empresa!</h1>
               <p className="text-gray-500 text-lg mb-10 max-w-md">
                 Em poucos passos você ativa sua empresa, cria campanhas e recebe recomendações automáticas de influenciadores que cabem no seu orçamento.
               </p>
               <div className="space-y-4 w-full max-w-sm flex flex-col items-center">
                  <Button onClick={nextStep} fullWidth size="lg" className="!bg-brand-yellow !text-brand-black font-bold hover:brightness-105">
                    Começar Agora
                  </Button>
                  <button 
                    type="button" 
                    onClick={skipToDashboard} 
                    className="text-sm text-gray-400 hover:text-gray-600 underline py-2 px-4 cursor-pointer relative z-50"
                  >
                    Pular e configurar depois
                  </button>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4">
               <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                 <Building className="text-brand-yellow" /> Dados da Empresa
               </h2>
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Nome da Empresa *</label>
                     <input 
                       type="text" 
                       value={formData.name || ''} 
                       onChange={(e) => {
                         setFormData({...formData, name: e.target.value});
                         clearError('name');
                       }}
                       className={getInputClass('name')}
                       placeholder="Razão Social ou Nome Fantasia"
                     />
                     <ErrorMsg id="name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">CNPJ/CPF *</label>
                        <input 
                          type="text" 
                          value={formData.companyProfile?.cnpj || ''} 
                          onChange={(e) => updateCompanyProfile('cnpj', e.target.value)}
                          className={getInputClass('cnpj')}
                        />
                        <ErrorMsg id="cnpj" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Website</label>
                        <input 
                          type="text" 
                          value={formData.companyProfile?.website || ''} 
                          onChange={(e) => updateCompanyProfile('website', e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-yellow"
                          placeholder="https://"
                        />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Setor de Atuação *</label>
                     <select 
                       className={getInputClass('sector')}
                       onChange={handleSectorChange}
                       defaultValue=""
                     >
                        <option value="" disabled>Selecione...</option>
                        <option value="Moda">Moda / Vestuário</option>
                        <option value="Varejo">Varejo / E-commerce</option>
                        <option value="Serviços">Serviços</option>
                        <option value="Tecnologia">Tecnologia / SaaS</option>
                        <option value="Saúde">Saúde e Bem-estar</option>
                        <option value="Educação">Educação</option>
                        <option value="Outro">Outro (Especificar)</option>
                     </select>
                     <ErrorMsg id="sector" />
                     {isCustomSector && (
                        <input 
                           type="text" 
                           placeholder="Digite seu setor..."
                           className="w-full bg-white border border-brand-yellow mt-2 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-yellow animate-in fade-in"
                           onChange={(e) => updateCompanyProfile('sector', e.target.value)}
                        />
                     )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Cidade *</label>
                        <input 
                          type="text"
                          value={formData.companyProfile?.location?.city || ''}
                          onChange={(e) => updateNestedProfile('location', 'city', e.target.value)} 
                          className={getInputClass('location.city')}
                        />
                        <ErrorMsg id="location.city" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Estado *</label>
                        <input 
                          type="text" 
                          value={formData.companyProfile?.location?.state || ''}
                          onChange={(e) => updateNestedProfile('location', 'state', e.target.value)}
                          className={getInputClass('location.state')}
                        />
                        <ErrorMsg id="location.state" />
                     </div>
                  </div>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4">
               <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Image className="text-brand-yellow"/> Logo da Empresa</h2>
               <p className="text-gray-500 text-sm mb-6">Isso ajuda os influenciadores a reconhecerem sua marca. (Opcional)</p>
               
               <div 
                  onClick={() => {
                     setLogoUploaded(!logoUploaded);
                  }}
                  className={`border-2 border-dashed rounded-xl p-12 text-center bg-gray-50 hover:bg-white transition-colors cursor-pointer group ${logoUploaded ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}
               >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                     {logoUploaded ? <CheckCircle className="w-10 h-10 text-green-500" /> : <Building className="w-10 h-10 text-gray-400" />}
                  </div>
                  <p className="font-bold text-gray-700">{logoUploaded ? 'Logo Recebido!' : 'Clique para enviar seu logo'}</p>
                  <p className="text-xs text-gray-400 mt-1">PNG ou JPG (Transparente preferível)</p>
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4">
               <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Target className="text-brand-yellow"/> Objetivos *</h2>
               <p className="text-gray-500 text-sm mb-6">O que você busca com marketing de influência?</p>
               
               {errors['objectives'] && (
                  <div className="mb-4 text-yellow-600 font-bold text-sm flex items-center gap-1">
                     <AlertTriangle className="w-4 h-4" /> {errors['objectives']}
                  </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Aumentar Seguidores', 'Aumentar Vendas', 'Tráfego para Site', 'Awareness / Branding', 'Reviews de Produtos', 'Lançamento', 'Conteúdo UGC'].map(obj => {
                     const isSelected = formData.companyProfile?.objectives?.includes(obj);
                     return (
                        <button
                           key={obj}
                           onClick={() => {
                              clearError('objectives');
                              const current = formData.companyProfile?.objectives || [];
                              if (isSelected) updateCompanyProfile('objectives', current.filter(o => o !== obj));
                              else updateCompanyProfile('objectives', [...current, obj]);
                           }}
                           className={`p-4 rounded-lg border text-left text-sm font-bold transition-all ${isSelected ? 'border-brand-yellow bg-yellow-50 text-brand-black' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                           {obj}
                        </button>
                     )
                  })}
               </div>
            </div>
          )}

          {step === 5 && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4">
               <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Users className="text-brand-yellow"/> Público-Alvo *</h2>
               <p className="text-gray-500 text-sm mb-6">Quem compra de você? Isso ajuda no match.</p>
               
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Faixa Etária Principal *</label>
                     <select 
                        className={getInputClass('targetAudience.ageRange')}
                        onChange={(e) => updateNestedProfile('targetAudience', 'ageRange', e.target.value)}
                        value={formData.companyProfile?.targetAudience?.ageRange || ''}
                     >
                        <option value="" disabled>Selecione...</option>
                        <option>18-24 anos</option>
                        <option>25-34 anos</option>
                        <option>35-44 anos</option>
                        <option>45+ anos</option>
                     </select>
                     <ErrorMsg id="targetAudience.ageRange" />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Gênero Predominante *</label>
                     <div className="flex gap-2">
                        {['Todos', 'Mulheres', 'Homens'].map(g => (
                           <button 
                              key={g}
                              className={`flex-1 py-2 rounded-lg border text-sm font-bold ${formData.companyProfile?.targetAudience?.gender === g ? 'bg-brand-black text-white' : 'bg-white text-gray-500'}`}
                              onClick={() => updateNestedProfile('targetAudience', 'gender', g)}
                           >
                              {g}
                           </button>
                        ))}
                     </div>
                     <ErrorMsg id="targetAudience.gender" />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Interesses do Público</label>
                     <textarea 
                        id="targetInterests"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 h-20 resize-none" 
                        placeholder="Ex: Futebol, Maquiagem, Tecnologia, Investimentos..."
                        onChange={(e) => updateNestedProfile('targetAudience', 'interests', [e.target.value])}
                     ></textarea>
                  </div>
               </div>
            </div>
          )}

          {step === 6 && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4">
               <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Search className="text-brand-yellow"/> Seu Nicho *</h2>
               <p className="text-gray-500 text-sm mb-6">Em quais categorias sua empresa se encaixa?</p>
               
               {errors['niche'] && (
                  <div className="mb-4 text-yellow-600 font-bold text-sm flex items-center gap-1">
                     <AlertTriangle className="w-4 h-4" /> {errors['niche']}
                  </div>
               )}

               <div className="flex flex-wrap gap-2">
                  {['Moda', 'Beleza', 'Tech', 'Games', 'Alimentação', 'Saúde', 'Fitness', 'Automotivo', 'Educação', 'Pet', 'Decoração', 'Viagem', 'Business'].map(niche => {
                     const isSelected = formData.companyProfile?.niche?.includes(niche);
                     return (
                        <button
                           key={niche}
                           onClick={() => toggleSelection('niche', niche)}
                           className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${isSelected ? 'bg-brand-black text-brand-yellow shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                           {niche}
                        </button>
                     )
                  })}
               </div>
            </div>
          )}

          {step === 7 && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4">
               <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><DollarSign className="text-brand-yellow"/> Orçamento *</h2>
               <p className="text-gray-500 text-sm mb-6">Quanto você pretende investir (estimativa).</p>
               
               <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                     <span className="font-bold text-sm text-gray-600 w-32">Budget Mensal</span>
                     <span className="text-gray-400">R$</span>
                     <input 
                        type="number" 
                        className="flex-1 outline-none font-bold text-lg text-brand-black" 
                        placeholder="0,00" 
                        onChange={(e) => updateNestedProfile('budget', 'monthly', parseFloat(e.target.value))}
                     />
                  </div>
                  <ErrorMsg id="budget.monthly" />

                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Quanto deseja pagar por influenciador? *</label>
                     <div className="grid grid-cols-2 gap-2">
                        {['Até R$50', 'R$50 - R$150', 'R$150 - R$300', 'R$300+'].map(range => (
                           <button 
                              key={range}
                              onClick={() => updateNestedProfile('budget', 'priceRange', range)}
                              className={`p-3 rounded-lg border text-sm font-bold ${formData.companyProfile?.budget?.priceRange === range ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white text-gray-500'}`}
                           >
                              {range}
                           </button>
                        ))}
                     </div>
                     <ErrorMsg id="budget.priceRange" />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                     <input 
                        type="checkbox" 
                        id="negotiate" 
                        className="w-5 h-5 text-brand-yellow" 
                        onChange={(e) => updateNestedProfile('budget', 'acceptsNegotiation', e.target.checked)}
                     />
                     <label htmlFor="negotiate" className="text-sm font-medium text-gray-700">Aceito negociar valores</label>
                  </div>
               </div>
            </div>
          )}

          {step === 8 && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4">
               <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Megaphone className="text-brand-yellow"/> O que você precisa? *</h2>
               <p className="text-gray-500 text-sm mb-6">Tipos de conteúdo que você mais contrata.</p>
               
               {errors['desiredDeliverables'] && (
                  <div className="mb-4 text-yellow-600 font-bold text-sm flex items-center gap-1">
                     <AlertTriangle className="w-4 h-4" /> {errors['desiredDeliverables']}
                  </div>
               )}

               <div className="grid grid-cols-2 gap-3">
                  {['Stories (24h)', 'Reels / TikTok', 'Post no Feed', 'Vídeo Longo', 'UGC (Sem postar)', 'Lives', 'Combos'].map(item => {
                     const isSelected = formData.companyProfile?.desiredDeliverables?.includes(item);
                     return (
                        <button
                           key={item}
                           onClick={() => {
                              clearError('desiredDeliverables');
                              const current = formData.companyProfile?.desiredDeliverables || [];
                              if (isSelected) updateCompanyProfile('desiredDeliverables', current.filter(i => i !== item));
                              else updateCompanyProfile('desiredDeliverables', [...current, item]);
                           }}
                           className={`p-3 rounded-lg border text-sm font-bold transition-all ${isSelected ? 'bg-brand-blue text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                           {item}
                        </button>
                     )
                  })}
               </div>
            </div>
          )}

          {step === 9 && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4">
               <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Users className="text-brand-yellow"/> Preferências *</h2>
               <p className="text-gray-500 text-sm mb-6">Que tipo de perfil você busca?</p>
               
               <div className="space-y-6">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Tamanho da Audiência</label>
                     <div className="flex flex-col gap-2">
                        {['Micro (5k - 50k)', 'Médio (50k - 200k)', 'Macro (200k+)'].map(size => (
                           <label key={size} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input type="checkbox" className="w-5 h-5 text-brand-yellow" />
                              <span className="text-sm font-medium text-gray-700">{size}</span>
                           </label>
                        ))}
                     </div>
                  </div>
                  
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Criador *</label>
                     <div className="flex gap-2">
                        {['Influencer', 'UGC Creator', 'Ambos'].map(type => (
                           <button 
                              key={type}
                              className={`flex-1 py-2 rounded-lg border text-sm font-bold ${formData.companyProfile?.influencerPreferences?.type === type ? 'bg-brand-black text-white' : 'bg-white text-gray-500'}`}
                              onClick={() => updateNestedProfile('influencerPreferences', 'type', type)}
                           >
                              {type}
                           </button>
                        ))}
                     </div>
                     <ErrorMsg id="influencerPreferences.type" />
                  </div>
               </div>
            </div>
          )}

          {step === 10 && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4">
               <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><MessageSquare className="text-brand-yellow"/> Contato *</h2>
               <p className="text-gray-500 text-sm mb-6">Quem os influenciadores devem procurar?</p>
               
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Responsável *</label>
                     <input 
                        type="text" 
                        className={getInputClass('contact.responsibleName')} 
                        placeholder="Seu nome" 
                        onChange={(e) => updateNestedProfile('contact', 'responsibleName', e.target.value)}
                     />
                     <ErrorMsg id="contact.responsibleName" />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Email Comercial *</label>
                     <input 
                        type="email" 
                        className={getInputClass('contact.email')} 
                        placeholder="contato@empresa.com" 
                        onChange={(e) => updateNestedProfile('contact', 'email', e.target.value)}
                     />
                     <ErrorMsg id="contact.email" />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp (Opcional)</label>
                     <input 
                        type="text" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-yellow" 
                        placeholder="(00) 00000-0000" 
                        onChange={(e) => updateNestedProfile('contact', 'whatsapp', e.target.value)}
                     />
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                     <input type="checkbox" className="w-5 h-5 text-brand-yellow" onChange={(e) => updateNestedProfile('contact', 'allowDirectContact', e.target.checked)}/>
                     <p className="text-xs text-gray-500 font-medium">Permitir que influenciadores entrem em contato direto (fora da plataforma).</p>
                  </div>
               </div>
            </div>
          )}

          {step === 11 && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4">
               <div className="bg-brand-yellow/10 p-4 rounded-xl mb-6">
                  <h2 className="text-xl font-bold mb-1 flex items-center gap-2 text-brand-black">
                    <Zap className="text-brand-black" /> Criar Primeira Campanha
                  </h2>
                  <p className="text-sm text-gray-600">Opcional. Você pode criar isso depois no dashboard.</p>
               </div>
               
               <div className="space-y-4 opacity-100">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Nome da Campanha</label>
                     <input type="text" className="w-full bg-white border border-gray-200 rounded-lg p-3" placeholder="Ex: Lançamento Coleção Verão" />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Briefing Curto</label>
                     <textarea className="w-full bg-white border border-gray-200 rounded-lg p-3 h-20 resize-none" placeholder="O que o influencer deve fazer?"></textarea>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Orçamento para essa ação</label>
                     <input type="number" className="w-full bg-white border border-gray-200 rounded-lg p-3" placeholder="R$ 0,00" />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                     <Button variant="secondary" fullWidth onClick={nextStep}>Pular esta etapa</Button>
                     <Button variant="primary" fullWidth className="!bg-brand-black !text-brand-yellow" onClick={nextStep}>Criar Campanha</Button>
                  </div>
               </div>
            </div>
          )}

          {step === 12 && (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in zoom-in duration-300">
               <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle className="w-12 h-12 text-green-600" />
               </div>
               <h1 className="text-3xl font-extrabold text-brand-black mb-4">Tudo Pronto! 🚀</h1>
               <p className="text-gray-500 text-lg mb-10 max-w-md">
                 Seu perfil de empresa foi criado. Agora você pode buscar influenciadores e criar campanhas reais.
               </p>
               <div className="space-y-4 w-full max-w-sm">
                  <Button onClick={finishOnboarding} fullWidth size="lg" className="!bg-brand-yellow !text-brand-black font-extrabold hover:brightness-105 shadow-xl shadow-brand-yellow/20">
                    Ver Influenciadores Recomendados
                  </Button>
                  <button className="text-sm text-brand-blue font-bold hover:underline" onClick={finishOnboarding}>
                    Ir para o Dashboard
                  </button>
               </div>
            </div>
          )}

          {step > 1 && step < 11 && (
             <div className="p-8 border-t border-gray-100 flex justify-between bg-gray-50 mt-auto">
                <Button onClick={prevStep} variant="ghost" className="!text-gray-500 hover:!bg-gray-200">
                   Voltar
                </Button>
                <div>
                   <button type="button" onClick={skipToDashboard} className="mr-6 text-sm text-gray-400 hover:text-gray-600 font-medium">Pular</button>
                   <Button onClick={nextStep} className="!bg-brand-black !text-white px-8">
                      Próximo
                   </Button>
                </div>
             </div>
          )}

        </Card>
      </div>
    </div>
  );
};