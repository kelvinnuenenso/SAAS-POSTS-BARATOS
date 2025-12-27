import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Button, Card } from './UI';
import { CheckCircle, Camera, User, TrendingUp, DollarSign, Image, Calendar, MessageSquare, Target, AlertTriangle, ArrowLeft } from './Icons';
import { useApp } from '../context/AppContext';
import { Influencer } from '../types';

interface InfluencerOnboardingProps {
  onFinish: () => void;
}

// --- Sub-components (Memoized) ---

const ProgressHeader = React.memo(({ step, totalSteps, progress }: { step: number; totalSteps: number; progress: number }) => (
  <div className="mb-8">
    <div className="flex justify-between text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider">
       <span>Passo {step} de {totalSteps}</span>
       <span>{Math.round(progress)}%</span>
    </div>
    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
       <div className="h-full bg-brand-yellow transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
));

const Step1 = React.memo(({ onNext, onSkip }: { onNext: () => void; onSkip: (e: React.MouseEvent) => void }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in fade-in slide-in-from-bottom-4">
     <div className="w-20 h-20 bg-brand-yellow rounded-full flex items-center justify-center mb-6 shadow-lg shadow-brand-yellow/30">
        <span className="text-4xl">🚀</span>
     </div>
     <h1 className="text-3xl font-extrabold text-brand-black mb-4">Vamos destravar seu perfil!</h1>
     <p className="text-gray-500 text-lg mb-10 max-w-md">
       Para você aparecer nas buscas e receber propostas das melhores empresas, precisamos conhecer você melhor.
     </p>
     <div className="space-y-4 w-full max-w-sm flex flex-col items-center">
        <Button onClick={onNext} fullWidth size="lg" className="!bg-brand-black !text-brand-yellow hover:!bg-brand-dark">
          Começar Agora
        </Button>
        <button 
          type="button" 
          onClick={onSkip} 
          className="text-sm text-gray-400 hover:text-gray-600 underline py-2 px-4 cursor-pointer relative z-50"
        >
          Pular por enquanto (não recomendado)
        </button>
     </div>
  </div>
));

const Step2 = React.memo(({ formData, updateForm, updateNestedForm, isUploading, onAvatarClick, fileInputRef, avatarUploadHandler, errors, getInputClass, ErrorMsg }: any) => (
  <div className="p-8 animate-in fade-in slide-in-from-right-4">
     <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
       <User className="text-brand-yellow fill-brand-yellow" /> Quem é você?
     </h2>
     
     <div className="flex flex-col items-center mb-6">
        <div 
          onClick={onAvatarClick}
          className="relative w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer group overflow-hidden border-2 border-dashed border-gray-300 hover:border-brand-yellow"
        >
           {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-yellow"></div>
           ) : formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
           ) : (
              <Camera className="w-8 h-8 text-gray-400 group-hover:text-brand-yellow" />
           )}
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-white font-bold">TROCAR FOTO</span>
           </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={avatarUploadHandler} accept="image/*" className="hidden" />
        <p className="text-xs text-gray-400 mt-2 font-bold uppercase">Foto de Perfil</p>
     </div>

     <div className="space-y-4">
        <div>
           <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo *</label>
           <input 
             type="text" 
             value={formData.name || ''} 
             onChange={(e) => updateForm('name', e.target.value)}
             className={getInputClass('name')}
             placeholder="Seu nome real"
           />
           <ErrorMsg id="name" />
        </div>
        <div>
           <label className="block text-sm font-bold text-gray-700 mb-1">Nome Artístico / Social *</label>
           <input 
             type="text" 
             value={formData.artisticName || ''} 
             onChange={(e) => updateForm('artisticName', e.target.value)}
             className={getInputClass('artisticName')}
             placeholder="Como você é conhecido nas redes"
           />
           <ErrorMsg id="artisticName" />
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Cidade *</label>
              <input 
                type="text" 
                value={formData.location?.city || ''} 
                onChange={(e) => updateNestedForm('location', 'city', e.target.value)}
                className={getInputClass('location.city')}
              />
              <ErrorMsg id="location.city" />
           </div>
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Estado *</label>
              <input 
                type="text" 
                value={formData.location?.state || ''} 
                onChange={(e) => updateNestedForm('location', 'state', e.target.value)}
                className={getInputClass('location.state')}
              />
              <ErrorMsg id="location.state" />
           </div>
        </div>
        <div>
           <label className="block text-sm font-bold text-gray-700 mb-1">Bio Curta (max 150)</label>
           <textarea 
             maxLength={150}
             value={formData.bio || ''} 
             onChange={(e) => updateForm('bio', e.target.value)}
             className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-yellow h-24 resize-none"
             placeholder="Ex: Apaixonada por moda e lifestyle. Crio conteúdo autêntico..."
           ></textarea>
           <p className="text-right text-xs text-gray-400">{(formData.bio?.length || 0)}/150</p>
        </div>
     </div>
  </div>
));

const Step3 = React.memo(({ formData, updateNestedForm, clearError, errors }: any) => (
  <div className="p-8 animate-in fade-in slide-in-from-right-4">
     <h2 className="text-2xl font-bold mb-2">Suas Redes</h2>
     <p className="text-gray-500 text-sm mb-6">Conecte pelo menos uma rede social principal.</p>
     
     {errors['socialHandles'] && (
       <div className="mb-4 p-3 bg-yellow-50 border border-brand-yellow rounded-lg text-yellow-800 text-sm font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> {errors['socialHandles']}
       </div>
     )}

     <div className="space-y-4">
        {['Instagram', 'TikTok', 'YouTube', 'Kwai', 'Twitter'].map((social) => (
           <div key={social} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-600 text-xs">
                 {social[0]}
              </div>
              <div className="flex-1">
                 <input 
                   type="text" 
                   placeholder={`Usuário do ${social} (ex: @voce)`}
                   value={(formData.socialHandles as any)?.[social.toLowerCase()] || ''}
                   onChange={(e) => {
                     const val = e.target.value;
                     updateNestedForm('socialHandles', social.toLowerCase(), val);
                     // Se for Instagram, atualiza também o handle principal
                     if (social === 'Instagram') {
                       // @ts-ignore - Temporary bypass for onboarding sync
                       formData.handle = val;
                     }
                     clearError('socialHandles');
                   }}
                   className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-yellow"
                 />
              </div>
           </div>
        ))}
     </div>
  </div>
));

const Step4 = React.memo(({ formData, updateForm, updateNestedForm, getInputClass, ErrorMsg }: any) => (
  <div className="p-8 animate-in fade-in slide-in-from-right-4">
     <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><TrendingUp className="text-brand-yellow"/> Métricas *</h2>
     <p className="text-gray-500 text-sm mb-6">Preencha manualmente seus números atuais.</p>
     
     <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Seguidores</label>
              <input 
                type="number" 
                placeholder="0"
                value={formData.followers || ''}
                onChange={(e) => updateForm('followers', parseInt(e.target.value))}
                className={getInputClass('followers') + ' font-bold text-lg'}
              />
              <ErrorMsg id="followers" />
           </div>
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Média Views</label>
              <input 
                type="number" 
                placeholder="0"
                value={formData.metrics?.avgViews || ''}
                onChange={(e) => updateNestedForm('metrics', 'avgViews', parseInt(e.target.value))}
                className={getInputClass('metrics.avgViews') + ' font-bold text-lg'}
              />
              <ErrorMsg id="metrics.avgViews" />
           </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Média Likes</label>
              <input 
                type="number" 
                placeholder="0"
                value={formData.metrics?.avgLikes || ''}
                onChange={(e) => updateNestedForm('metrics', 'avgLikes', parseInt(e.target.value))}
                className={getInputClass('metrics.avgLikes')}
              />
              <ErrorMsg id="metrics.avgLikes" />
           </div>
           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Taxa Engajamento (%)</label>
              <input 
                type="number" 
                step="0.1"
                placeholder="Ex: 4.5"
                value={formData.metrics?.engagementRateManual || ''}
                onChange={(e) => updateNestedForm('metrics', 'engagementRateManual', parseFloat(e.target.value))}
                className={getInputClass('metrics.engagementRateManual')}
              />
              <ErrorMsg id="metrics.engagementRateManual" />
           </div>
        </div>
     </div>
  </div>
));

const Step5 = React.memo(({ formData, updateForm, clearError, errors }: any) => {
  const niches = ['Lifestyle', 'Comédia', 'Saúde', 'Fitness', 'Beleza', 'Empreendedorismo', 'Tech', 'Carros', 'Games', 'Moda', 'Pets', 'Viagem', 'Educação', 'Maternidade'];
  
  return (
    <div className="p-8 animate-in fade-in slide-in-from-right-4">
       <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Target className="text-brand-yellow"/> Seus Nichos *</h2>
       <p className="text-gray-500 text-sm mb-6">Selecione até 3 categorias principais.</p>
       
       {errors['secondaryNiches'] && (
         <div className="mb-4 text-sm font-bold text-yellow-600 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> {errors['secondaryNiches']}
         </div>
       )}

       <div className="flex flex-wrap gap-2 mb-6">
          {niches.map(niche => {
             const isSelected = formData.secondaryNiches?.includes(niche);
             return (
                <button
                   key={niche}
                   onClick={() => {
                      clearError('secondaryNiches');
                      const current = formData.secondaryNiches || [];
                      if (isSelected) {
                         updateForm('secondaryNiches', current.filter((n: string) => n !== niche));
                      } else {
                         if (current.length < 3) updateForm('secondaryNiches', [...current, niche]);
                      }
                   }}
                   className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${isSelected ? 'bg-brand-black text-brand-yellow shadow-lg transform scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                   {niche}
                </button>
             )
          })}
       </div>
       
       <button className="text-brand-blue text-sm font-bold hover:underline">+ Adicionar nicho personalizado</button>
    </div>
  );
});

const Step6 = React.memo(({ formData, updateForm, clearError, errors }: any) => (
  <div className="p-8 animate-in fade-in slide-in-from-right-4">
     <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><DollarSign className="text-brand-yellow"/> Tabela de Preços *</h2>
     <p className="text-gray-500 text-sm mb-6">Defina quanto você quer cobrar (estimativa). Preencha ao menos um.</p>
     
     {errors['pricing'] && (
        <div className="mb-4 p-2 bg-yellow-50 text-yellow-800 rounded border border-yellow-200 text-sm font-bold">
           {errors['pricing']}
        </div>
     )}

     <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
           <span className="font-bold w-24">Feed Post</span>
           <span className="text-gray-400">R$</span>
           <input type="number" className="flex-1 outline-none font-bold text-lg" placeholder="0,00" />
        </div>
        <div className={`flex items-center gap-4 p-3 border rounded-lg ${errors['pricing'] ? 'border-brand-yellow bg-yellow-50/10' : 'border-gray-200'}`}>
           <span className="font-bold w-24">Stories (1)</span>
           <span className="text-gray-400">R$</span>
           <input 
              type="number" 
              value={formData.pricePerPost || ''}
              onChange={(e) => {
                 updateForm('pricePerPost', parseFloat(e.target.value));
                 clearError('pricing');
              }}
              className="flex-1 outline-none font-bold text-lg bg-transparent" 
              placeholder="0,00" 
           />
        </div>
        <div className={`flex items-center gap-4 p-3 border rounded-lg ${errors['pricing'] ? 'border-brand-yellow bg-yellow-50/10' : 'border-gray-200'}`}>
           <span className="font-bold w-24">Reels</span>
           <span className="text-gray-400">R$</span>
           <input 
              type="number" 
              value={formData.pricePerReel || ''}
              onChange={(e) => {
                 updateForm('pricePerReel', parseFloat(e.target.value));
                 clearError('pricing');
              }}
              className="flex-1 outline-none font-bold text-lg bg-transparent" 
              placeholder="0,00" 
           />
        </div>
        
        <div className="flex items-center gap-2 pt-4">
           <input type="checkbox" id="negociar" className="w-5 h-5 text-brand-yellow focus:ring-brand-yellow" defaultChecked />
           <label htmlFor="negociar" className="text-sm font-medium text-gray-700">Aceito negociar valores no chat</label>
        </div>
     </div>
  </div>
));

const Step7 = React.memo(({ formData, updateNestedForm, isUploading, onPortfolioClick, portfolioInputRef, portfolioUploadHandler }: any) => (
  <div className="p-8 animate-in fade-in slide-in-from-right-4">
     <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Image className="text-brand-yellow"/> Portfólio</h2>
     <p className="text-gray-500 text-sm mb-6">Mostre seus melhores trabalhos (Opcional).</p>
     
     <input 
       type="file" 
       ref={portfolioInputRef} 
       onChange={portfolioUploadHandler} 
       accept="image/*,video/*" 
       className="hidden" 
     />

     <div 
        onClick={onPortfolioClick}
        className={`border-2 border-dashed rounded-xl p-8 text-center bg-gray-50 hover:bg-white transition-colors cursor-pointer group ${formData.portfolio && formData.portfolio.length > 0 ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}
     >
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
           {isUploading ? (
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-yellow"></div>
           ) : formData.portfolio && formData.portfolio.length > 0 ? (
             <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
                {formData.portfolio.slice(0, 4).map((url: string, i: number) => (
                   <img key={i} src={url} alt="Portfolio" className="w-full h-full object-cover rounded-[2px]" />
                ))}
             </div>
           ) : (
             <Camera className="w-8 h-8 text-gray-400" />
           )}
        </div>
        <p className="font-bold text-gray-700">
          {isUploading ? 'Enviando...' : formData.portfolio && formData.portfolio.length > 0 ? `${formData.portfolio.length} arquivos enviados` : 'Clique para enviar fotos/vídeos'}
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG ou MP4 (Máx 10MB)</p>
     </div>
     
     <div className="mt-6">
        <label className="block text-sm font-bold text-gray-700 mb-1">Link do Media Kit (Opcional)</label>
        <input 
           type="text" 
           value={formData.metrics?.mediaKitUrl || ''}
           onChange={(e) => {
              updateNestedForm('metrics', 'mediaKitUrl', e.target.value);
           }}
           className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3" 
           placeholder="https://canva.com/..." 
        />
     </div>
  </div>
));

const Step8 = React.memo(({ formData, updateNestedForm, getInputClass, ErrorMsg }: any) => (
  <div className="p-8 animate-in fade-in slide-in-from-right-4">
     <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Calendar className="text-brand-yellow"/> Disponibilidade *</h2>
     
     <div className="space-y-4 mb-6">
        <p className="font-bold text-sm text-gray-700">Tipo de trabalho aceito:</p>
        <div className="flex gap-2">
           {['Campanhas Pagas', 'Permuta', 'Ambos'].map(opt => (
              <button key={opt} onClick={() => updateNestedForm('schedule', 'availabilityType', opt === 'Campanhas Pagas' ? 'Paid' : opt === 'Permuta' ? 'Barter' : 'Both')} className={`flex-1 py-3 rounded-lg border text-sm font-bold ${formData.schedule?.availabilityType === (opt === 'Campanhas Pagas' ? 'Paid' : opt === 'Permuta' ? 'Barter' : 'Both') ? 'bg-brand-black text-white border-brand-black' : 'bg-white text-gray-600 border-gray-200'}`}>
                 {opt}
              </button>
           ))}
        </div>
     </div>
     
     <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Prazo de entrega padrão *</label>
        <select 
           className={getInputClass('schedule.standardDeliveryTime')}
           onChange={(e) => updateNestedForm('schedule', 'standardDeliveryTime', e.target.value)}
           value={formData.schedule?.standardDeliveryTime || ''}
        >
           <option value="" disabled>Selecione...</option>
           <option value="24h">24h</option>
           <option value="48h">48h</option>
           <option value="3 dias">3 dias</option>
           <option value="7 dias">7 dias</option>
        </select>
        <ErrorMsg id="schedule.standardDeliveryTime" />
     </div>
     
     <div className="mt-4">
        <label className="block text-sm font-bold text-gray-700 mb-2">Melhor horário para contato:</label>
        <select 
           className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3"
           onChange={(e) => updateNestedForm('schedule', 'preferredContactTime', e.target.value)}
           value={formData.schedule?.preferredContactTime || 'Any'}
        >
           <option value="Any">Qualquer horário</option>
           <option value="Morning">Manhã</option>
           <option value="Afternoon">Tarde</option>
           <option value="Night">Noite</option>
        </select>
     </div>
  </div>
));

const Step9 = React.memo(({ formData, updateNestedForm, getInputClass, ErrorMsg }: any) => (
  <div className="p-8 animate-in fade-in slide-in-from-right-4">
     <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><MessageSquare className="text-brand-yellow"/> Dados de Contato</h2>
     <p className="text-gray-500 text-sm mb-6">
       Estes dados não serão visíveis no sistema aos usuários e sim dados da plataforma <strong>POSTS BARATOS</strong>.
     </p>
     
     <div className="space-y-4">
        <div>
           <label className="block text-sm font-bold text-gray-700 mb-1">Email Profissional *</label>
           <input 
              type="email" 
              value={formData.contactSettings?.publicEmail || ''}
              onChange={(e) => updateNestedForm('contactSettings', 'publicEmail', e.target.value)}
              className={getInputClass('contactSettings.publicEmail')} 
              placeholder="contato@seumail.com" 
           />
           <ErrorMsg id="contactSettings.publicEmail" />
        </div>
        <div>
           <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp para Contato Interno (Obrigatório)</label>
           <input 
              type="text" 
              value={formData.contactSettings?.whatsapp || ''}
              onChange={(e) => updateNestedForm('contactSettings', 'whatsapp', e.target.value)}
              className={getInputClass('contactSettings.whatsapp')} 
              placeholder="(00) 00000-0000" 
           />
           <ErrorMsg id="contactSettings.whatsapp" />
        </div>
        
        <div className="p-4 bg-yellow-50 border border-brand-yellow/20 rounded-lg">
          <p className="text-xs text-brand-black leading-relaxed font-medium">
            🔒 <strong>Privacidade:</strong> A POSTS BARATOS utiliza esses dados apenas para suporte, pagamentos e avisos. 
            Estes dados <strong>não estão visíveis</strong> para empresas ou outros usuários.
          </p>
        </div>
     </div>
  </div>
));

const Step10 = React.memo(({ onFinish }: { onFinish: () => void }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in zoom-in duration-300">
    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
       <CheckCircle className="w-12 h-12 text-green-600" />
    </div>
    <h1 className="text-3xl font-extrabold text-brand-black mb-4">Perfil Criado com Sucesso! 🎉</h1>
    <p className="text-gray-500 text-lg mb-10 max-w-md">
      Agora você já pode receber propostas. Fique atento às notificações!
    </p>
    <div className="space-y-4 w-full max-w-sm">
       <Button onClick={onFinish} fullWidth size="lg" className="!bg-brand-yellow !text-brand-black font-extrabold hover:brightness-105 shadow-xl shadow-brand-yellow/20">
         Ir para meu Dashboard
       </Button>
       <button className="text-sm text-brand-blue font-bold hover:underline" onClick={onFinish}>
         Ver minha página pública
       </button>
    </div>
 </div>
));

// --- Main Component ---

export const InfluencerOnboarding: React.FC<InfluencerOnboardingProps> = ({ onFinish }) => {
  const { updateUser, currentUser, uploadFile } = useApp();
  const [step, setStep] = useState(1);
  const totalSteps = 10;
  
  // Validation State
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Influencer>>({
    ...currentUser as Influencer,
    onboardingCompleted: false,
    location: (currentUser as Influencer)?.location || { city: '', state: '', country: 'Brasil' },
    socialHandles: (currentUser as Influencer)?.socialHandles || {},
    metrics: (currentUser as Influencer)?.metrics || {},
    schedule: (currentUser as Influencer)?.schedule || {},
    contactSettings: (currentUser as Influencer)?.contactSettings || {},
    secondaryNiches: (currentUser as Influencer)?.secondaryNiches || [],
    portfolio: (currentUser as Influencer)?.portfolio || [],
  });

  const clearError = useCallback((key: string) => {
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  }, [errors]);

  const updateForm = useCallback((key: keyof Influencer, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    clearError(key as string);
  }, [clearError]);

  const updateNestedForm = useCallback((parent: keyof Influencer, key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any || {}),
        [key]: value
      }
    }));
    clearError(`${parent}.${key}`);
  }, [clearError]);

  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file, `${currentUser.id}/avatars`);
      updateForm('avatarUrl', url);
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      alert('Erro ao fazer upload da foto.');
    } finally {
      setIsUploading(false);
    }
  }, [currentUser, uploadFile, updateForm]);

  const handlePortfolioUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file, `${currentUser.id}/portfolio`);
      setFormData(prev => ({
        ...prev,
        portfolio: [...(prev.portfolio || []), url]
      }));
    } catch (error) {
      console.error('Erro ao fazer upload do portfólio:', error);
      alert('Erro ao fazer upload do arquivo.');
    } finally {
      setIsUploading(false);
    }
  }, [currentUser, uploadFile]);

  const validateStep = useCallback((currentStep: number): boolean => {
    const newErrors: {[key: string]: string} = {};
    let isValid = true;

    if (currentStep === 2) {
      if (!formData.name?.trim()) newErrors['name'] = 'Nome completo é obrigatório.';
      if (!formData.artisticName?.trim()) newErrors['artisticName'] = 'Nome artístico é obrigatório.';
      if (!formData.location?.city?.trim()) newErrors['location.city'] = 'Cidade é obrigatória.';
      if (!formData.location?.state?.trim()) newErrors['location.state'] = 'Estado é obrigatório.';
    }

    if (currentStep === 3) {
      const handles = formData.socialHandles || {};
      const hasAtLeastOne = Object.values(handles).some(val => typeof val === 'string' && val.trim() !== '');
      if (!hasAtLeastOne) {
        newErrors['socialHandles'] = 'Preencha pelo menos uma rede social.';
      }
    }

    if (currentStep === 4) {
      if (!formData.followers || formData.followers <= 0) newErrors['followers'] = 'Informe o total de seguidores.';
      if (!formData.metrics?.avgViews) newErrors['metrics.avgViews'] = 'Informe a média de views.';
      if (!formData.metrics?.avgLikes) newErrors['metrics.avgLikes'] = 'Informe a média de likes.';
      if (!formData.metrics?.engagementRateManual) newErrors['metrics.engagementRateManual'] = 'Taxa de engajamento é obrigatória.';
    }

    if (currentStep === 5) {
      if (!formData.secondaryNiches || formData.secondaryNiches.length === 0) {
        newErrors['secondaryNiches'] = 'Selecione pelo menos um nicho.';
      }
    }

    if (currentStep === 6) {
      const hasPostPrice = (formData.pricePerPost || 0) > 0;
      const hasReelPrice = (formData.pricePerReel || 0) > 0;
      
      if (!hasPostPrice && !hasReelPrice) {
        newErrors['pricing'] = 'Defina o preço para pelo menos um formato (Feed ou Stories/Reels).';
      }
    }

    if (currentStep === 8) {
      if (!formData.schedule?.standardDeliveryTime) newErrors['schedule.standardDeliveryTime'] = 'Selecione um prazo de entrega.';
    }

    if (currentStep === 9) {
      if (!formData.contactSettings?.publicEmail?.trim()) newErrors['contactSettings.publicEmail'] = 'Email profissional é obrigatório.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
      if (navigator.vibrate) navigator.vibrate(50);
    }

    return isValid;
  }, [formData]);

  const nextStep = useCallback(() => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo(0, 0);
    }
  }, [step, validateStep, totalSteps]);

  const prevStep = useCallback(() => {
    setStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  }, []);

  const skipToDashboard = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateUser({ ...formData, onboardingCompleted: true }); 
    onFinish();
  }, [formData, updateUser, onFinish]);

  const finishOnboarding = useCallback(() => {
    if (validateStep(step)) {
      updateUser({ ...formData, onboardingCompleted: true });
      onFinish();
    }
  }, [step, validateStep, formData, updateUser, onFinish]);

  const progress = useMemo(() => (step / totalSteps) * 100, [step, totalSteps]);

  const getInputClass = useCallback((errorKey: string) => 
    `w-full bg-gray-50 border rounded-lg p-3 outline-none focus:ring-2 transition-all ${errors[errorKey] ? 'border-brand-yellow focus:ring-brand-yellow ring-1 ring-brand-yellow bg-yellow-50/10' : 'border-gray-200 focus:ring-brand-yellow'}`
  , [errors]);

  const ErrorMsg = useCallback(({ id }: { id: string }) => errors[id] ? (
    <div className="flex items-center gap-1 mt-1 text-xs font-bold text-yellow-600 animate-in slide-in-from-left-1">
      <AlertTriangle className="w-3 h-3" /> {errors[id]}
    </div>
  ) : null, [errors]);

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 onNext={nextStep} onSkip={skipToDashboard} />;
      case 2: return <Step2 formData={formData} updateForm={updateForm} updateNestedForm={updateNestedForm} isUploading={isUploading} onAvatarClick={() => fileInputRef.current?.click()} fileInputRef={fileInputRef} avatarUploadHandler={handleAvatarUpload} errors={errors} getInputClass={getInputClass} ErrorMsg={ErrorMsg} />;
      case 3: return <Step3 formData={formData} updateNestedForm={updateNestedForm} clearError={clearError} errors={errors} />;
      case 4: return <Step4 formData={formData} updateForm={updateForm} updateNestedForm={updateNestedForm} getInputClass={getInputClass} ErrorMsg={ErrorMsg} />;
      case 5: return <Step5 formData={formData} updateForm={updateForm} clearError={clearError} errors={errors} />;
      case 6: return <Step6 formData={formData} updateForm={updateForm} clearError={clearError} errors={errors} />;
      case 7: return <Step7 formData={formData} updateNestedForm={updateNestedForm} isUploading={isUploading} onPortfolioClick={() => portfolioInputRef.current?.click()} portfolioInputRef={portfolioInputRef} portfolioUploadHandler={handlePortfolioUpload} />;
      case 8: return <Step8 formData={formData} updateNestedForm={updateNestedForm} getInputClass={getInputClass} ErrorMsg={ErrorMsg} />;
      case 9: return <Step9 formData={formData} updateNestedForm={updateNestedForm} getInputClass={getInputClass} ErrorMsg={ErrorMsg} />;
      case 10: return <Step10 onFinish={finishOnboarding} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-yellow/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {step > 1 && step < 10 && (
          <ProgressHeader step={step} totalSteps={totalSteps} progress={progress} />
        )}

        <Card className="!bg-white !shadow-2xl !border-0 overflow-hidden min-h-[500px] flex flex-col">
          {renderStep()}

          {step > 1 && step < 10 && (
             <div className="p-8 border-t border-gray-100 flex justify-between bg-gray-50 mt-auto">
                <Button onClick={prevStep} variant="ghost" className="!text-gray-500 hover:!bg-gray-200">
                   Voltar
                </Button>
                <Button onClick={nextStep} className="!bg-brand-black !text-white px-8">
                   Próximo
                </Button>
             </div>
          )}
        </Card>
      </div>
    </div>
  );
};
