import React from 'react';
import { Modal, Button } from '../UI';
import { User } from '../../types';
import { Target, FileText, AlertCircle, CheckCircle, Info } from '../Icons';

interface CampaignEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: any;
  updateCompanyNestedProfile: (parent: string, field: string, value: any) => void;
  onSave: () => void;
}

export const CampaignEditModal: React.FC<CampaignEditModalProps> = ({
  isOpen,
  onClose,
  profileData,
  updateCompanyNestedProfile,
  onSave
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Regras da Campanha" maxWidth="max-w-3xl">
      <div className="space-y-8">
        <div className="bg-brand-blue/5 p-4 rounded-xl border border-brand-blue/10 flex gap-3">
          <Info className="w-5 h-5 text-brand-blue shrink-0" />
          <p className="text-xs text-gray-600 leading-relaxed">
            Estas regras serão exibidas para todos os influenciadores que você contratar. Defina diretrizes claras para garantir a qualidade das postagens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-blue" /> Objetivo Principal
              </h3>
              <textarea
                value={profileData?.companyProfile?.campaignRules?.objective || ''}
                onChange={(e) => updateCompanyNestedProfile('campaignRules', 'objective', e.target.value)}
                placeholder="Ex: Gerar reconhecimento de marca e tráfego para o site..."
                className="w-full h-24 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-blue resize-none"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> O que FAZER (Do's)
              </h3>
              <textarea
                value={profileData?.companyProfile?.campaignRules?.dos || ''}
                onChange={(e) => updateCompanyNestedProfile('campaignRules', 'dos', e.target.value)}
                placeholder="Ex: Usar iluminação natural, mostrar o produto em uso, mencionar o cupom..."
                className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-blue resize-none"
              />
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" /> O que NÃO fazer (Don'ts)
              </h3>
              <textarea
                value={profileData?.companyProfile?.campaignRules?.donts || ''}
                onChange={(e) => updateCompanyNestedProfile('campaignRules', 'donts', e.target.value)}
                placeholder="Ex: Não usar filtros exagerados, não mencionar concorrentes, não falar palavrões..."
                className="w-full h-24 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-blue resize-none"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-blue" /> Requisitos Técnicos
              </h3>
              <textarea
                value={profileData?.companyProfile?.campaignRules?.technicalRequirements || ''}
                onChange={(e) => updateCompanyNestedProfile('campaignRules', 'technicalRequirements', e.target.value)}
                placeholder="Ex: Formato vertical 9:16, áudio nítido, duração mínima de 15s..."
                className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-blue resize-none"
              />
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={onSave} className="!bg-brand-black !text-white px-8">Salvar Alterações</Button>
        </div>
      </div>
    </Modal>
  );
};
