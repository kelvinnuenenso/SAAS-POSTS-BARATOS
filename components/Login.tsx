import React, { useState } from 'react';
import { Button, Card } from './UI';
import { UserRole, User } from '../types'; // Update import path
import { useApp } from '../context/AppContext'; // Import hook

interface LoginProps {
  roleIntent: UserRole;
  onLoginSuccess: (user: User) => void;
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ roleIntent, onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call and get the User object back
    try {
      // Small delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = await login(roleIntent); 
      setIsLoading(false);
      onLoginSuccess(user); // Pass the user to App.tsx for decision making
    } catch (error) {
      console.error("Login failed", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md p-4 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6 cursor-pointer" onClick={onBack}>
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center font-bold text-xl">P</div>
            <span className="font-bold text-xl tracking-tight">Posts<span className="text-brand-blue">Baratos</span></span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Bem-vindo de volta</h2>
          <p className="text-gray-400">
            Acesse sua conta de {roleIntent === 'BUSINESS' ? 'Empresa' : 'Influenciador'}
          </p>
        </div>

        <Card className="border border-white/10 shadow-2xl shadow-brand-blue/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Senha</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              size="lg"
              disabled={isLoading}
              className="mt-2"
            >
              {isLoading ? 'Entrando...' : 'Entrar na Plataforma'}
            </Button>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-500">Não tem conta? </span>
              <button type="button" onClick={handleSubmit} className="text-sm text-brand-blue font-bold hover:underline">
                Criar conta grátis
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};