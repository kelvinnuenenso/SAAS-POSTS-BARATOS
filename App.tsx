import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { InfluencerDashboard } from './components/InfluencerDashboard';
import { InfluencerOnboarding } from './components/InfluencerOnboarding';
import { BusinessOnboarding } from './components/BusinessOnboarding';
import { Login } from './components/Login';
import { UserRole, User } from './types';

export type ViewState = 'landing' | 'login' | 'business-dashboard' | 'business-onboarding' | 'influencer-dashboard' | 'influencer-onboarding';

const Main: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [roleIntent, setRoleIntent] = useState<UserRole>(UserRole.BUSINESS);
  
  // We use currentView to control the UI, not just currentUser from context, 
  // because we want precise control over the onboarding flow transitions.

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
    // 1. Check if user needs onboarding
    if (!user.onboardingCompleted) {
      if (user.role === UserRole.BUSINESS) {
        navigate('business-onboarding');
      } else {
        navigate('influencer-onboarding');
      }
      return;
    }

    // 2. If onboarding is complete, go to dashboard based on role
    if (user.role === UserRole.BUSINESS) {
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

  return (
    <>
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
        <Dashboard onLogout={() => navigate('landing')} />
      )}

      {currentView === 'influencer-dashboard' && (
        <InfluencerDashboard onLogout={() => navigate('landing')} />
      )}
    </>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <Main />
  </AppProvider>
);

export default App;