import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button, Card } from './UI';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ChevronLeft, 
  Building, 
  User, 
  CheckCircle,
  AlertCircle
} from './Icons';
import { UserRole, User as UserType } from '../types';

interface LoginProps {
  roleIntent: UserRole;
  onLoginSuccess: (user: UserType) => void;
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ roleIntent, onLoginSuccess, onBack }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validação de nome obrigatório no cadastro
    if (!isLoginMode && !fullName.trim()) {
      setError('O nome completo é obrigatório para o cadastro.');
      setIsLoading(false);
      return;
    }
    
    try {
      const user = await login(roleIntent, email, password, fullName);
      setIsLoading(false);
      onLoginSuccess(user);
    } catch (err: any) {
      console.error("Auth failed", err);
      
      // Se o erro for USER_NOT_FOUND, trocamos para o modo cadastro automaticamente
      if (err.message === 'USER_NOT_FOUND') {
        setIsLoginMode(false);
        setError('Conta não encontrada. Preencha seu nome para criar uma conta grátis!');
      } else {
        setError(err.message);
      }
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
        <Card className="!bg-brand-black/40 !backdrop-blur-xl border-white/10 p-8 shadow-2xl shadow-brand-blue/5">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-blue/20 mb-4 cursor-pointer" onClick={onBack}>
              {roleIntent === UserRole.BUSINESS ? (
                <Building className="w-8 h-8 text-brand-blue" />
              ) : (
                <User className="w-8 h-8 text-brand-blue" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLoginMode ? 'Bem-vindo de volta' : 'Crie sua conta grátis'}
            </h2>
            <p className="text-gray-400">
              {isLoginMode 
                ? `Acesse sua conta como ${roleIntent === UserRole.BUSINESS ? 'Empresa' : 'Influenciador'}`
                : `Comece agora como ${roleIntent === UserRole.BUSINESS ? 'Empresa' : 'Influenciador'}`
              }
            </p>
          </div>
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nome Completo (Obrigatório)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="text" 
                    required={!isLoginMode}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              size="lg"
              disabled={isLoading}
              className="mt-2"
            >
              {isLoading 
                ? (isLoginMode ? 'Entrando...' : 'Criando conta...') 
                : (isLoginMode ? 'Entrar na Plataforma' : 'Criar Conta Grátis')
              }
            </Button>

            <div className="text-center pt-4 border-t border-white/5">
              <p className="text-gray-400 text-sm">
                {isLoginMode ? (
                  <>
                    Não tem uma conta?{' '}
                    <button 
                      type="button"
                      onClick={() => {
                        setIsLoginMode(false);
                        setError(null);
                      }}
                      className="text-brand-blue font-semibold hover:underline"
                    >
                      Criar conta grátis
                    </button>
                  </>
                ) : (
                  <>
                    Já tem uma conta?{' '}
                    <button 
                      type="button"
                      onClick={() => {
                        setIsLoginMode(true);
                        setError(null);
                      }}
                      className="text-brand-blue font-semibold hover:underline"
                    >
                      Fazer login
                    </button>
                  </>
                )}
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};