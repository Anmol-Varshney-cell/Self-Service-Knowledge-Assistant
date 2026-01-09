
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'employee' | 'admin';
  onViewChange: (view: 'employee' | 'admin') => void;
  isAdminAuthenticated: boolean;
  onAdminAuth: (password: string) => boolean;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onViewChange, 
  isAdminAuthenticated, 
  onAdminAuth,
  onLogout 
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleAdminToggle = () => {
    if (isAdminAuthenticated) {
      onViewChange('admin');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAdminAuth(password)) {
      setShowAuthModal(false);
      setPassword('');
      setError(false);
      onViewChange('admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">Self-Service Knowledge Assistant</h1>
              <p className="text-xs text-slate-500 font-medium">IndiaSportsHub Portal</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => onViewChange('employee')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  currentView === 'employee' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Employee Portal
              </button>
              <button
                onClick={handleAdminToggle}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                  currentView === 'admin' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {!isAdminAuthenticated && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                <span>Admin Panel</span>
              </button>
            </div>
            {isAdminAuthenticated && (
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Log out Admin"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </nav>
        </div>
      </header>

      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Admin Access</h2>
            <p className="text-slate-500 text-center text-sm mb-6">Enter password to manage policy knowledge.</p>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Password"
                autoFocus
                className={`w-full px-4 py-3 bg-slate-100 border-2 rounded-xl outline-none transition-all ${error ? 'border-red-400' : 'border-transparent focus:border-indigo-500'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-xs text-red-500 font-medium">Incorrect password.</p>}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg transition"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">© 2024 IndiaSportsHub Self-Service Knowledge Assistant. Secure Portal.</p>
        </div>
      </footer>
    </div>
  );
};
