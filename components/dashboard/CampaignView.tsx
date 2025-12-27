import React from 'react';
import { Card, Button } from '../UI';
import { Target, FileText, AlertTriangle, ThumbsUp, TrendingUp } from '../Icons';
import { User } from '../../types';

interface CampaignViewProps {
  profileData: User | null;
  setIsCampaignModalOpen: (open: boolean) => void;
}

export const CampaignView: React.FC<CampaignViewProps> = React.memo(({
  profileData,
  setIsCampaignModalOpen
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card className="!bg-white !shadow-sm !border-gray-200">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-brand-dark flex items-center gap-2">
               <Target className="w-5 h-5 text-brand-blue" /> Perfil da Campanha Padrão
             </h3>
             <Button onClick={() => setIsCampaignModalOpen(true)} variant="outline" size="sm">Editar Regras</Button>
          </div>
          
          <div className="space-y-6">
             <div>
               <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Objetivos Principais</h4>
               <div className="flex flex-wrap gap-2">
                  {profileData?.companyProfile?.objectives?.map(obj => (
                    <span key={obj} className="px-3 py-1.5 bg-brand-blue/5 text-brand-blue rounded-lg text-xs font-bold border border-brand-blue/10">
                      {obj}
                    </span>
                  )) || <span className="text-sm text-gray-400">Nenhum objetivo definido.</span>}
               </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Público-Alvo</h4>
                  <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Gênero:</span>
                       <span className="font-bold text-brand-dark">{profileData?.companyProfile?.targetAudience?.gender || 'Todos'}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Idade:</span>
                       <span className="font-bold text-brand-dark">{profileData?.companyProfile?.targetAudience?.ageRange || 'Não definido'}</span>
                     </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Orçamento</h4>
                  <div className="space-y-2">
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Por Campanha:</span>
                       <span className="font-bold text-brand-dark">R$ {profileData?.companyProfile?.budget?.perCampaign || '0'}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-500">Mensal:</span>
                       <span className="font-bold text-brand-dark">R$ {profileData?.companyProfile?.budget?.monthly || '0'}</span>
                     </div>
                  </div>
                </div>
             </div>

             <div>
               <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Interesses / Nichos</h4>
               <div className="flex flex-wrap gap-2">
                  {profileData?.companyProfile?.niche?.map(n => (
                    <span key={n} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">
                      {n}
                    </span>
                  )) || <span className="text-sm text-gray-400">Nenhum nicho definido.</span>}
               </div>
             </div>
          </div>
        </Card>

        <Card className="!bg-white !shadow-sm !border-gray-200">
           <h3 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
             <FileText className="w-5 h-5 text-brand-blue" /> Regras e Diretrizes Gerais
           </h3>
           <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex gap-3">
             <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
             <p className="text-sm text-yellow-800">
               Estas regras são enviadas automaticamente para todos os influenciadores que você contratar. Mantenha-as atualizadas para garantir a qualidade do conteúdo.
             </p>
           </div>
           <div className="mt-6 space-y-4">
              <div className="p-4 border border-gray-100 rounded-lg">
                 <h5 className="font-bold text-sm mb-1">O que NÃO pode faltar:</h5>
                 <p className="text-sm text-gray-600 italic">
                   {profileData?.companyProfile?.guidelines?.mustHave || '"Mencionar o link na bio, usar o cupom PROMO10 e marcar @nossaloja..."'}
                 </p>
              </div>
              <div className="p-4 border border-gray-100 rounded-lg">
                 <h5 className="font-bold text-sm mb-1">Restrições:</h5>
                 <p className="text-sm text-gray-600 italic">
                   {profileData?.companyProfile?.guidelines?.restrictions || '"Não falar de concorrentes diretos, não usar palavrões..."'}
                 </p>
              </div>
           </div>
        </Card>
      </div>

      <div className="space-y-6">
         <Card className="!bg-white !shadow-sm !border-gray-200">
           <h3 className="font-bold text-brand-dark mb-4">Dicas de ROI</h3>
           <div className="space-y-4">
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <ThumbsUp className="w-4 h-4" />
                 </div>
                 <p className="text-xs text-gray-500">Influenciadores com menos de 50k seguidores costumam ter 3x mais engajamento real.</p>
              </div>
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                 </div>
                 <p className="text-xs text-gray-500">Campanhas recorrentes (1 post/semana) convertem 40% melhor que posts isolados.</p>
              </div>
           </div>
         </Card>

         <Card className="!bg-brand-dark !text-white !border-none">
           <h3 className="font-bold mb-2">Precisa de ajuda?</h3>
           <p className="text-sm text-gray-400 mb-4">Nossos especialistas podem ajudar a criar sua estratégia de campanha.</p>
           <Button fullWidth variant="primary" size="sm" className="!bg-brand-blue">Falar com Consultor</Button>
         </Card>
      </div>
    </div>
  );
});
