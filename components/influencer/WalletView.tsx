import React from 'react';
import { Card, Button, Badge } from '../UI';
import { CreditCard, History, Wallet, Zap, CheckCircle, Filter, Bell, FileText } from '../Icons';
import { Influencer } from '../../types';

type WalletTab = 'overview' | 'history' | 'withdraw' | 'settings';

interface WalletViewProps {
  activeWalletTab: WalletTab;
  setActiveWalletTab: (tab: WalletTab) => void;
  availableBalance: number;
  transactions: any[];
  withdrawalAmount: string;
  setWithdrawalAmount: (amount: string) => void;
  onWithdrawRequest: () => void;
  profileData: Influencer;
  updateNestedField: (parent: keyof Influencer, field: string, value: any) => void;
  isAddingMethod: boolean;
  setIsAddingMethod: (adding: boolean) => void;
  newPixKey: string;
  setNewPixKey: (key: string) => void;
  financialSettings: any;
  setFinancialSettings: (settings: any) => void;
  onSaveFinancialSettings: () => void;
}

export const WalletView: React.FC<WalletViewProps> = React.memo(({ 
  activeWalletTab, 
  setActiveWalletTab, 
  availableBalance, 
  transactions, 
  withdrawalAmount, 
  setWithdrawalAmount, 
  onWithdrawRequest, 
  profileData, 
  updateNestedField, 
  isAddingMethod, 
  setIsAddingMethod, 
  newPixKey, 
  setNewPixKey, 
  financialSettings, 
  setFinancialSettings, 
  onSaveFinancialSettings 
}) => {
  const walletTabs = [
    { id: 'overview', label: 'Resumo', icon: <Wallet className="w-4 h-4"/> },
    { id: 'history', label: 'Transações', icon: <History className="w-4 h-4"/> },
    { id: 'withdraw', label: 'Sacar', icon: <Zap className="w-4 h-4"/> },
    { id: 'settings', label: 'Configurações', icon: <CreditCard className="w-4 h-4"/> },
  ];

  const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1";
  const inputClass = "w-full bg-white border border-gray-300 hover:border-brand-blue focus:border-brand-blue rounded-lg px-3 py-2 text-sm transition-all outline-none text-brand-black";

  return (
    <div className="space-y-6">
       <div className="flex border-b border-gray-200 overflow-x-auto">
          {walletTabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveWalletTab(tab.id as WalletTab)}
               className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeWalletTab === tab.id ? 'border-brand-blue text-brand-blue bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
             >
               {tab.icon}
               {tab.label}
             </button>
          ))}
       </div>

       <Card className="!bg-white !border-gray-200 !rounded-t-none !mt-0 min-h-[400px]">
          {(activeWalletTab === 'history' || activeWalletTab === 'overview') && (
             <div className="space-y-6 animate-in fade-in">
                {activeWalletTab === 'overview' && (
                   <div className="h-32 flex items-end justify-between gap-1 px-4 pb-4 border-b border-gray-100 mb-6">
                      {[20, 40, 30, 70, 50, 90, 60, 40, 80, 50, 30, 60].map((h, i) => (
                         <div key={i} className="flex-1 bg-blue-50 hover:bg-brand-blue transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-1 rounded">{h*10}</div>
                         </div>
                      ))}
                   </div>
                )}
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-xl">
                   <div className="flex items-center gap-2 w-full md:w-auto">
                      <Filter className="w-4 h-4 text-gray-500"/>
                      <select className="bg-white border border-gray-200 text-sm rounded-lg p-2 outline-none cursor-pointer">
                         <option>Últimos 30 dias</option>
                         <option>Últimos 7 dias</option>
                      </select>
                   </div>
                </div>

                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-xs">
                         <tr>
                            <th className="p-4">Data</th>
                            <th className="p-4">Tipo</th>
                            <th className="p-4">Descrição</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Valor</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {transactions.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                               <td className="p-4 text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                               <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${t.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                     {t.type === 'IN' ? 'Entrada' : 'Saída'}
                                  </span>
                               </td>
                               <td className="p-4 font-medium text-brand-dark">{t.details} <span className="text-gray-400 text-xs block">{t.origin}</span></td>
                               <td className="p-4"><Badge status={t.status} /></td>
                               <td className={`p-4 text-right font-bold ${t.type === 'IN' ? 'text-green-600' : 'text-red-500'}`}>
                                  {t.type === 'IN' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                               </td>
                            </tr>
                         ))}
                         {transactions.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-400">Nenhuma transação encontrada.</td></tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

          {activeWalletTab === 'withdraw' && (
             <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in p-6">
                <div className="space-y-4">
                   <label className="block text-sm font-bold text-gray-700">Valor do Saque</label>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                      <input 
                        type="number" 
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 text-xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                        placeholder="0.00"
                      />
                   </div>
                   <p className="text-xs text-gray-500 text-right">Disponível: R$ {availableBalance.toFixed(2)}</p>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <label className="block text-sm font-bold text-gray-700">Método de Recebimento (PIX)</label>
                      <button onClick={() => setIsAddingMethod(!isAddingMethod)} className="text-xs text-brand-blue font-bold hover:underline">
                         {profileData.paymentInfo?.pixKey ? 'Alterar Chave' : 'Adicionar Chave'}
                      </button>
                   </div>
                   
                   {profileData.paymentInfo?.pixKey && !isAddingMethod ? (
                      <div className="p-4 border border-green-200 bg-green-50 rounded-xl flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                               <Zap className="w-5 h-5 text-green-600 fill-green-600"/>
                            </div>
                            <div>
                               <p className="font-bold text-green-900">Chave PIX Ativa</p>
                               <p className="text-xs text-green-700">{profileData.paymentInfo.pixKey}</p>
                            </div>
                         </div>
                         <CheckCircle className="text-green-600 w-6 h-6" />
                      </div>
                   ) : (
                      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                         <h4 className="font-bold text-sm mb-3">Configurar PIX</h4>
                         <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={newPixKey}
                              onChange={(e) => setNewPixKey(e.target.value)}
                              placeholder="CPF, Email, Telefone ou Aleatória"
                              className="flex-1 border border-gray-300 rounded p-2 text-sm"
                            />
                            <Button onClick={() => {
                               if(newPixKey) {
                                  updateNestedField('paymentInfo', 'pixKey', newPixKey);
                                  setIsAddingMethod(false);
                                  setNewPixKey('');
                               }
                            }} size="sm">Salvar</Button>
                         </div>
                      </div>
                   )}
                </div>

                <Button onClick={onWithdrawRequest} fullWidth size="lg" className="!bg-brand-neon hover:!bg-brand-blue shadow-lg shadow-brand-neon/30">
                   Confirmar Saque
                </Button>
             </div>
          )}

          {activeWalletTab === 'settings' && (
             <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in p-6">
                <div className="grid grid-cols-1 gap-6">
                   <div>
                      <h3 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                         <Bell className="w-5 h-5"/> Notificações
                      </h3>
                      <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                         <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm font-medium text-gray-700">Ao receber pagamento</span>
                            <input type="checkbox" checked={financialSettings.notifyPayment} onChange={(e) => setFinancialSettings({...financialSettings, notifyPayment: e.target.checked})} className="w-5 h-5 text-brand-blue rounded focus:ring-brand-blue" />
                         </label>
                         <div className="h-px bg-gray-200"></div>
                         <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm font-medium text-gray-700">Ao concluir saque</span>
                            <input type="checkbox" checked={financialSettings.notifyWithdraw} onChange={(e) => setFinancialSettings({...financialSettings, notifyWithdraw: e.target.checked})} className="w-5 h-5 text-brand-blue rounded focus:ring-brand-blue" />
                         </label>
                      </div>
                   </div>

                   <div>
                      <h3 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                         <FileText className="w-5 h-5"/> Dados Fiscais
                      </h3>
                      <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                         <div>
                            <label className={labelClass}>Nome Completo / Razão Social</label>
                            <input type="text" value={financialSettings.fullName} onChange={(e) => setFinancialSettings({...financialSettings, fullName: e.target.value})} className={inputClass} />
                         </div>
                         <div>
                            <label className={labelClass}>CPF / CNPJ</label>
                            <input type="text" value={financialSettings.cpfCnpj} onChange={(e) => setFinancialSettings({...financialSettings, cpfCnpj: e.target.value})} className={inputClass} />
                         </div>
                         <div>
                            <label className={labelClass}>Endereço Fiscal</label>
                            <textarea value={financialSettings.taxAddress} onChange={(e) => setFinancialSettings({...financialSettings, taxAddress: e.target.value})} className={inputClass + " h-20 resize-none"} />
                         </div>
                         <Button onClick={onSaveFinancialSettings} size="sm" className="!bg-brand-black !text-white">Salvar Dados</Button>
                      </div>
                   </div>
                </div>
             </div>
          )}
       </Card>
    </div>
  );
});
