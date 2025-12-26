import React, { useState } from 'react';
import { Button, Card, SectionBadge } from './UI';
import { CheckCircle, Star, ShieldCheck, Zap, TrendingUp, DollarSign, Menu, Search } from './Icons';

interface LandingPageProps {
  onNavigateLogin: () => void;
  onNavigateBusiness: () => void;
  onNavigateInfluencer: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigateLogin, 
  onNavigateBusiness, 
  onNavigateInfluencer 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-brand-black text-white selection:bg-brand-blue selection:text-white overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center font-bold text-xl">P</div>
              <span className="font-bold text-xl tracking-tight">Posts<span className="text-brand-blue">Baratos</span></span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#como-funciona" className="text-sm font-medium hover:text-brand-blue transition-colors">Como Funciona</a>
              <a href="#beneficios" className="text-sm font-medium hover:text-brand-blue transition-colors">Benefícios</a>
              <a href="#depoimentos" className="text-sm font-medium hover:text-brand-blue transition-colors">Depoimentos</a>
              <a href="#precos" className="text-sm font-medium hover:text-brand-blue transition-colors">Preços</a>
              <div className="flex items-center gap-4 ml-4">
                <button onClick={onNavigateLogin} className="text-sm font-medium hover:text-white text-gray-400">Login</button>
                <Button onClick={onNavigateBusiness} variant="primary" size="sm">Começar Agora</Button>
              </div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-400 hover:text-white">
                <Menu />
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden glass border-t border-white/10 absolute top-20 left-0 w-full p-4 flex flex-col gap-4">
              <a href="#como-funciona" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-gray-300">Como Funciona</a>
              <a href="#beneficios" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-gray-300">Benefícios</a>
              <a href="#precos" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-gray-300">Preços</a>
              <div className="h-px bg-white/10 my-2"></div>
              <button onClick={onNavigateLogin} className="text-left text-sm font-medium text-gray-300">Login</button>
              <Button onClick={onNavigateBusiness} variant="primary" size="sm" fullWidth>Começar Agora</Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionBadge>Marketplace #1 de Micro-influenciadores</SectionBadge>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Encontre Influenciadores que <br className="hidden md:block"/>
            <span className="gradient-text">Cobram Barato e Vendem Muito</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-10 leading-relaxed">
            Pare de queimar dinheiro com agências. Contrate perfis reais a partir de <strong>R$ 50,00</strong> com segurança total e sistema de garantia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button onClick={onNavigateBusiness} variant="primary" size="lg" className="glow w-full sm:w-auto">
              Encontrar Influenciadores Agora
            </Button>
            <Button onClick={onNavigateInfluencer} variant="secondary" size="lg" className="w-full sm:w-auto">
              Quero ser Influenciador
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://picsum.photos/40/40?random=${i}`} alt="User" className="w-10 h-10 rounded-full border-2 border-brand-black" />
              ))}
            </div>
            <p className="flex items-center gap-2">
              <Star className="w-4 h-4 text-brand-blue fill-brand-blue" />
              <span className="text-white font-bold">4.9/5</span> de satisfação em +12.000 posts entregues.
            </p>
          </div>
        </div>
      </section>

      {/* Problem / Agitation */}
      <section className="py-20 bg-brand-dark border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">O velho jogo do marketing acabou.</h2>
          <p className="text-lg text-gray-400 mb-12">
            Você está cansado de enviar directs e ser ignorado? Ou receber orçamentos de R$ 5.000 por um story que não converte?
            <br/><br/>
            O segredo do ROI está na <strong>micro-influência</strong>: pessoas reais, com audiências engajadas, que cobram preços justos.
            Nós resolvemos a dor de cabeça de negociar, pagar e confiar.
          </p>
        </div>
      </section>

      {/* Visual / How it Works */}
      <section id="como-funciona" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">O "Uber" dos Influenciadores.</h2>
              <p className="text-gray-400 mb-8 text-lg">
                Simplificamos tudo. Sem contratos longos, sem burocracia.
              </p>
              
              <div className="space-y-8">
                {[
                  { title: 'Busque', desc: 'Filtre por nicho (Moda, Tech, Fitness) e preço máximo.', icon: <Search /> },
                  { title: 'Contrate com Escrow', desc: 'Seu dinheiro fica seguro com a gente até o post sair.', icon: <ShieldCheck /> },
                  { title: 'Receba Resultados', desc: 'O influencer posta, você aprova e libera o pagamento.', icon: <TrendingUp /> }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Mockup Cards */}
              <div className="absolute inset-0 bg-brand-blue/20 blur-[60px] rounded-full"></div>
              <div className="relative space-y-4">
                <Card className="flex items-center gap-4 transform translate-x-4">
                  <img src="https://picsum.photos/60/60?random=10" className="rounded-full w-14 h-14" alt="Influencer" />
                  <div className="flex-1">
                    <h4 className="font-bold">Ana Júlia</h4>
                    <p className="text-xs text-gray-400">Moda & Lifestyle • 15k seguidores</p>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-brand-blue">R$ 80,00</span>
                    <span className="text-xs text-gray-500">por Story</span>
                  </div>
                </Card>
                <Card className="flex items-center gap-4 transform -translate-x-4 border-brand-blue/30 shadow-lg shadow-brand-blue/10">
                  <img src="https://picsum.photos/60/60?random=11" className="rounded-full w-14 h-14" alt="Influencer" />
                  <div className="flex-1">
                    <h4 className="font-bold">Pedro Tech</h4>
                    <p className="text-xs text-gray-400">Tecnologia • 42k seguidores</p>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-brand-blue">R$ 150,00</span>
                    <span className="text-xs text-gray-500">por Reels</span>
                  </div>
                  <div className="absolute -top-3 -right-3 bg-brand-blue text-white text-xs px-2 py-1 rounded-full font-bold">Contratado</div>
                </Card>
                <Card className="flex items-center gap-4 transform translate-x-2">
                  <img src="https://picsum.photos/60/60?random=12" className="rounded-full w-14 h-14" alt="Influencer" />
                  <div className="flex-1">
                    <h4 className="font-bold">Fit Carol</h4>
                    <p className="text-xs text-gray-400">Fitness • 20k seguidores</p>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-brand-blue">R$ 90,00</span>
                    <span className="text-xs text-gray-500">por Story</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section id="beneficios" className="py-24 bg-brand-dark border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Por que usar o PostsBaratos?</h2>
            <p className="text-gray-400">Desenvolvemos a plataforma pensando na segurança do seu dinheiro e na velocidade da sua campanha.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:bg-white/5 transition-colors">
              <DollarSign className="w-10 h-10 text-brand-blue mb-6" />
              <h3 className="text-xl font-bold mb-3">Extremamente Econômico</h3>
              <p className="text-gray-400">Preços tabelados e claros. Você sabe exatamente quanto vai gastar antes de começar.</p>
            </Card>
            <Card className="p-8 hover:bg-white/5 transition-colors">
              <Zap className="w-10 h-10 text-brand-blue mb-6" />
              <h3 className="text-xl font-bold mb-3">Contratação Relâmpago</h3>
              <p className="text-gray-400">Esqueça e-mails e reuniões. Feche parcerias em menos de 3 minutos na plataforma.</p>
            </Card>
            <Card className="p-8 hover:bg-white/5 transition-colors">
              <ShieldCheck className="w-10 h-10 text-brand-blue mb-6" />
              <h3 className="text-xl font-bold mb-3">Proteção Escrow</h3>
              <p className="text-gray-400">O influenciador só recebe depois que você aprovar a publicação. Risco zero.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simples e Transparente</h2>
            <p className="text-gray-400">Escolha como você quer participar.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Business Plan */}
            <Card className="relative overflow-hidden border-2 border-brand-blue/50">
              <div className="absolute top-0 right-0 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-bl-lg">MAIS PROCURADO</div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Para Negócios</h3>
                <p className="text-gray-400 mb-6">Que querem vender mais.</p>
                
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-extrabold text-white">R$ 0</span>
                  <span className="text-gray-400 ml-2">/mensalidade</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-300"><CheckCircle className="w-5 h-5 text-brand-blue mr-3" /> Acesso gratuito à busca</li>
                  <li className="flex items-center text-gray-300"><CheckCircle className="w-5 h-5 text-brand-blue mr-3" /> Chat ilimitado com influencers</li>
                  <li className="flex items-center text-gray-300"><CheckCircle className="w-5 h-5 text-brand-blue mr-3" /> Proteção Escrow inclusa</li>
                  <li className="flex items-center text-gray-300"><CheckCircle className="w-5 h-5 text-brand-blue mr-3" /> Taxa de 10% apenas ao contratar</li>
                </ul>

                <Button onClick={onNavigateBusiness} fullWidth variant="primary">Criar Conta Grátis</Button>
              </div>
            </Card>

            {/* Influencer Plan */}
            <Card className="border border-white/10">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Para Influenciadores</h3>
                <p className="text-gray-400 mb-6">Que querem monetizar.</p>
                
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-extrabold text-white">Grátis</span>
                  <span className="text-gray-400 ml-2">para começar</span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-300"><CheckCircle className="w-5 h-5 text-gray-500 mr-3" /> Crie seu perfil em minutos</li>
                  <li className="flex items-center text-gray-300"><CheckCircle className="w-5 h-5 text-gray-500 mr-3" /> Receba propostas direto no app</li>
                  <li className="flex items-center text-gray-300"><CheckCircle className="w-5 h-5 text-gray-500 mr-3" /> Pagamento garantido</li>
                  <li className="flex items-center text-gray-300"><CheckCircle className="w-5 h-5 text-gray-500 mr-3" /> Taxa de 15% sobre ganhos</li>
                </ul>

                <Button onClick={onNavigateInfluencer} fullWidth variant="secondary">Cadastrar Perfil</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-blue/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Pare de Queimar Dinheiro.</h2>
          <p className="text-xl text-gray-300 mb-10">
            Comece a vender com a força da recomendação hoje mesmo.<br/>
            Junte-se a mais de 5.000 empresas que já usam o PostsBaratos.
          </p>
          <Button onClick={onNavigateBusiness} variant="primary" size="lg" className="px-12 py-6 text-xl shadow-2xl shadow-brand-blue/40 hover:scale-105 transform transition-transform">
            QUERO COMEÇAR AGORA
          </Button>
          <p className="mt-6 text-sm text-gray-500">Garantia de 7 dias ou seu dinheiro de volta.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-brand-black text-center text-gray-500 text-sm">
        <p>&copy; 2024 PostsBaratos. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};