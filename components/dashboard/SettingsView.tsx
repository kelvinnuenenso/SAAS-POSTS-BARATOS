import React from 'react';
import { Button } from '../UI';
import { Image as ImageIcon } from '../Icons';
import { User } from '../../types';

interface SettingsViewProps {
  profileData: User | null;
  setProfileData: (val: any) => void;
  updateCompanyProfile: (field: string, value: any) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveProfile: () => void;
  isUploading: boolean;
  currentUser: User | null;
}

export const SettingsView: React.FC<SettingsViewProps> = React.memo(({
  profileData,
  setProfileData,
  updateCompanyProfile,
  handleImageUpload,
  handleSaveProfile,
  isUploading,
  currentUser
}) => {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
         <div className="p-6 border-b border-gray-100">
           <h3 className="font-bold text-brand-dark">Perfil da Empresa</h3>
           <p className="text-sm text-gray-500">Informações básicas que os influenciadores verão sobre você.</p>
         </div>
         <div className="p-6 space-y-6">
           <div className="flex items-center gap-6">
              <div className="relative">
                {profileData?.avatarUrl ? (
                  <img src={profileData.avatarUrl} alt={profileData.name} className="w-20 h-20 rounded-xl object-cover border-2 border-gray-100" />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-2xl text-gray-400 border-2 border-dashed border-gray-200">
                    {profileData?.name?.charAt(0) || 'E'}
                  </div>
                )}
                <label className={`absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
                  <input type="file" className="hidden" onChange={handleImageUpload} disabled={isUploading} accept="image/*" />
                  <ImageIcon className="w-4 h-4 text-gray-600" />
                </label>
              </div>
              <div className="flex-1">
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome da Empresa</label>
                 <input 
                   type="text" 
                   value={profileData?.name || ''}
                   onChange={(e) => setProfileData((prev: any) => ({ ...prev, name: e.target.value }))}
                   className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Website</label>
                <input 
                  type="url" 
                  value={profileData?.companyProfile?.website || ''}
                  onChange={(e) => updateCompanyProfile('website', e.target.value)}
                  placeholder="https://sualoja.com.br"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Instagram</label>
                <input 
                  type="text" 
                  value={profileData?.companyProfile?.socialInstagram || ''}
                  onChange={(e) => updateCompanyProfile('socialInstagram', e.target.value)}
                  placeholder="@seunegocio"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição Curta</label>
                 <textarea 
                  value={profileData?.companyProfile?.description || ''}
                  onChange={(e) => updateCompanyProfile('description', e.target.value)}
                  placeholder="Fale um pouco sobre sua marca..."
                  className="w-full h-24 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                 ></textarea>
              </div>
           </div>
         </div>
         <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
           <Button onClick={handleSaveProfile} variant="primary" size="sm">Salvar Alterações</Button>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
         <div className="p-6 border-b border-gray-100">
           <h3 className="font-bold text-brand-dark">Segurança e Conta</h3>
           <p className="text-sm text-gray-500">Gerencie seu acesso e notificações.</p>
         </div>
         <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-2">
               <div>
                  <p className="font-bold text-sm">Email de Acesso</p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
               </div>
               <Button variant="outline" size="sm">Alterar</Button>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-gray-50">
               <div>
                  <p className="font-bold text-sm">Senha</p>
                  <p className="text-xs text-gray-500">Última alteração há 3 meses</p>
               </div>
               <Button variant="outline" size="sm">Redefinir</Button>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-gray-50">
               <div>
                  <p className="font-bold text-sm">Notificações WhatsApp</p>
                  <p className="text-xs text-gray-500">Receber avisos de novos posts</p>
               </div>
               <div className="w-12 h-6 bg-brand-blue rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
               </div>
            </div>
         </div>
      </div>

      <div className="p-4 flex justify-center">
         <button className="text-xs text-red-500 font-bold hover:underline">Excluir minha conta permanentemente</button>
      </div>
    </div>
  );
});
