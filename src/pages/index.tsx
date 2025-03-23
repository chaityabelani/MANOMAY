import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/LoginForm';

const HomePage = () => {
  const { user, login, logout, isLoading } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    setShowLoginForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My App</h1>
        
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span>Welcome, {user.name || user.email}</span>
              <button
                onClick={() => logout()}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                disabled={isLoading}
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isLoading}
            >
              Login
            </button>
          )}
        </div>
      </header>

      <main>
        {showLoginForm && !user ? (
          <div className="flex justify-center mt-8">
            <LoginForm 
              onLogin={handleLogin} 
              onCancel={() => setShowLoginForm(false)} 
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl mb-4">
              {user ? 'You are logged in!' : 'Welcome to our application'}
            </h2>
            <p className="text-gray-600">
              {user 
                ? 'You now have access to all features of our application.' 
                : 'Please login to access all features.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage; 