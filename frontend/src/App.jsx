import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState('login');

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Loading session...</p>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  if (screen === 'register') {
    return <Register onNavigateToLogin={() => setScreen('login')} />;
  }

  return <Login onNavigateToRegister={() => setScreen('register')} />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
