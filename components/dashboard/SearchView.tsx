import React from 'react';
import { Card } from '../UI';
import { Search, Sliders } from '../Icons';
import { Influencer } from '../../types';
import { InfluencerCard } from './InfluencerCard';

interface SearchViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterNiche: string;
  setFilterNiche: (niche: string) => void;
  filterSize: string;
  setFilterSize: (size: string) => void;
  filterPlatform: string;
  setFilterPlatform: (platform: string) => void;
  filteredInfluencers: Influencer[];
  setSelectedInfluencer: (inf: Influencer) => void;
  setIsCheckoutOpen: (open: boolean) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  searchQuery,
  setSearchQuery,
  filterNiche,
  setFilterNiche,
  filterSize,
  setFilterSize,
  filterPlatform,
  setFilterPlatform,
  filteredInfluencers,
  setSelectedInfluencer,
  setIsCheckoutOpen
}) => {
  return (
    <>
      <Card className="mb-8 !bg-white !shadow-sm !border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-brand-blue font-bold text-sm uppercase">
             <Sliders className="w-4 h-4" /> Preferências de Influenciadores
          </div>
          <div className="relative flex-1 max-w-md">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
              type="text" 
              placeholder="Buscar por nome ou @user..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-blue"
             />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nicho</label>
            <select 
              value={filterNiche}
              onChange={(e) => setFilterNiche(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
            >
              <option value="Todos">Todos os nichos</option>
              <option value="Fitness">Fitness</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Beleza">Beleza</option>
              <option value="Finanças">Finanças</option>
              <option value="Games">Games</option>
              <option value="Moda">Moda</option>
              <option value="Culinária">Culinária</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tamanho</label>
            <select 
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
            >
              <option value="Todos">Todos</option>
              <option value="Nano">Nano (1k - 10k)</option>
              <option value="Micro">Micro (10k - 100k)</option>
              <option value="Mid">Mid (100k - 500k)</option>
              <option value="Macro">Macro (500k+)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Plataforma</label>
            <select 
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
            >
              <option value="Todos">Todas</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>
        </div>
      </Card>

      {filteredInfluencers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <Search className="w-12 h-12 mx-auto text-gray-200 mb-4" />
          <h3 className="text-lg font-bold text-brand-dark">Nenhum influenciador encontrado</h3>
          <p className="text-gray-500">Tente ajustar seus filtros ou busca.</p>
          <button 
            onClick={() => { setFilterNiche('Todos'); setFilterSize('Todos'); setFilterPlatform('Todos'); setSearchQuery(''); }}
            className="mt-4 text-brand-blue font-bold hover:underline text-sm"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInfluencers.map((inf) => (
            <InfluencerCard 
              key={inf.id} 
              influencer={inf} 
              onViewDetails={setSelectedInfluencer} 
              onHire={(inf) => { setSelectedInfluencer(inf); setIsCheckoutOpen(true); }}
            />
          ))}
        </div>
      )}
    </>
  );
};
