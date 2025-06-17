import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ExpensesSummary from './components/expenses/ExpensesSummary';
import ExpenseDetail from './components/expenses/ExpenseDetail';
import './App.css';

type AppView = 'summary' | 'detail';
type AuthView = 'login' | 'register';

const AppContent: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('summary');
  const [authView, setAuthView] = useState<AuthView>('login');
  const [selectedCategory, setSelectedCategory] = useState<{id: number, name: string} | null>(null);

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    setSelectedCategory({ id: categoryId, name: categoryName });
    setCurrentView('detail');
  };

  const handleBackToSummary = () => {
    setSelectedCategory(null);
    setCurrentView('summary');
  };

  // Si no está autenticado, mostrar formularios de login/registro
  if (!isAuthenticated) {
    if (authView === 'register') {
      return <RegisterForm onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <LoginForm onSwitchToRegister={() => setAuthView('register')} />;
  }

  // Si está autenticado, mostrar la aplicación principal
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">💰 Ahorrista</h1>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Hola, {user?.email}</span>
            <button
              onClick={logout}
              className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-300 rounded hover:bg-red-50"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 mb-20">
        {currentView === 'summary' && (
          <ExpensesSummary onCategoryClick={handleCategoryClick} />
        )}
        
        {currentView === 'detail' && selectedCategory && (
          <ExpenseDetail
            categoryId={selectedCategory.id}
            categoryName={selectedCategory.name}
            onBack={handleBackToSummary}
          />
        )}
      </main>

      {/* Navigation Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-around py-3">
          <button
            onClick={() => setCurrentView('summary')}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentView === 'summary' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 Resumen
          </button>
          
          <button className="px-4 py-2 text-gray-400 cursor-not-allowed">
            ➕ Nuevo Gasto
          </button>
          
          <button className="px-4 py-2 text-gray-400 cursor-not-allowed">
            🎯 Metas
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;