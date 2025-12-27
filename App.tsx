import React, { useState, lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { UserRole, User } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';

const LandingPage = lazy(() => import('./components/LandingPage').then(m => ({ default: m.LandingPage })));
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const InfluencerDashboard = lazy(() => import('./components/InfluencerDashboard').then(m => ({ default: m.InfluencerDashboard })));
const AdminCRM = lazy(() => import('./components/AdminCRM').then(m => ({ default: m.AdminCRM })));
const InfluencerOnboarding = lazy(() => import('./components/InfluencerOnboarding').then(m => ({ default: m.InfluencerOnboarding })));
const BusinessOnboarding = lazy(() => import('./components/BusinessOnboarding').then(m => ({ default: m.BusinessOnboarding })));
const Login = lazy(() => import('./components/Login').then(m => ({ default: m.Login })));
const AdminBar = lazy(() => import('./components/AdminBar').then(m => ({ default: m.AdminBar })));

export type ViewState = 'landing' | 'login' | 'business-dashboard' | 'business-onboarding' | 'influencer-dashboard' | 'influencer-onboarding' | 'admin-dashboard';

const ViewLoader = () => null;

const Main: React.FC = () => {
  const { currentUser, loading, logout } = useApp();
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [roleIntent, setRoleIntent] = useState<UserRole>(UserRole.BUSINESS);
  
  // Log para depuração de navegação
  React.useEffect(() => {
    console.log('App state updated:', { currentView, loading, user: currentUser?.email, role: currentUser?.role });
  }, [currentView, loading, currentUser]);

  // Redirecionamento automático apenas uma vez quando o usuário loga
  React.useEffect(() => {
    if (!loading && currentUser && currentView === 'landing') {
      console.log('Auto-redirecting logged user...');
      handleLoginSuccess(currentUser as User);
    }
  }, [currentUser, loading]); // Removido currentView da dependência para evitar loops se a landing for forçada

  const navigate = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleLoginIntent = (role: UserRole) => {
    setRoleIntent(role);
    navigate('login');
  };

  // Central Logic for Routing after Login
  const handleLoginSuccess = (user: User) => {
    // 1. Administradores sempre vão para o dashboard admin
    if (user.role === UserRole.ADMIN) {
      navigate('admin-dashboard');
      return;
    }

    // 2. Check if user needs onboarding
    if (!user.onboardingCompleted) {
      if (user.role === UserRole.BUSINESS) {
        navigate('business-onboarding');
      } else {
        navigate('influencer-onboarding');
      }
      return;
    }

    // 2. If onboarding is complete, go to dashboard based on role
    const userRole = user.role as UserRole;
    if (userRole === UserRole.ADMIN) {
      navigate('admin-dashboard');
    } else if (userRole === UserRole.BUSINESS) {
      navigate('business-dashboard');
    } else {
      navigate('influencer-dashboard');
    }
  };

  // Callback when onboarding is skipped or finished
  // This just updates the view, the component itself updates the User state via Context
  const handleInfluencerFinish = () => {
    navigate('influencer-dashboard');
  };

  const handleBusinessFinish = () => {
    navigate('business-dashboard');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView('landing');
  };

  return (
    <Suspense fallback={<ViewLoader />}>
      <AdminBar onNavigate={navigate} currentView={currentView} />
      
      {currentView === 'landing' && (
        <LandingPage 
          onNavigateLogin={() => handleLoginIntent(UserRole.BUSINESS)}
          onNavigateBusiness={() => handleLoginIntent(UserRole.BUSINESS)}
          onNavigateInfluencer={() => handleLoginIntent(UserRole.INFLUENCER)}
        />
      )}
      
      {currentView === 'login' && (
        <Login 
          roleIntent={roleIntent}
          onLoginSuccess={handleLoginSuccess}
          onBack={() => navigate('landing')}
        />
      )}

      {currentView === 'influencer-onboarding' && (
        <InfluencerOnboarding onFinish={handleInfluencerFinish} />
      )}

      {currentView === 'business-onboarding' && (
        <BusinessOnboarding onFinish={handleBusinessFinish} />
      )}

      {currentView === 'business-dashboard' && (
        <Dashboard onLogout={handleLogout} />
      )}

      {currentView === 'influencer-dashboard' && (
        <InfluencerDashboard onLogout={handleLogout} />
      )}

      {currentView === 'admin-dashboard' && (
        <AdminCRM onLogout={handleLogout} />
      )}
    </Suspense>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <AppProvider>
      <Main />
    </AppProvider>
  </ErrorBoundary>
);

export default App;