import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthModalProps {
  onClose: () => void;
}

function AuthModal({ onClose }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>('login');

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">
            {view === 'login' ? 'Log in' : 'Create an account'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>
        {view === 'login' ? (
          <LoginForm onSuccess={onClose} onSwitchToSignup={() => setView('signup')} />
        ) : (
          <SignupForm onSuccess={onClose} onSwitchToLogin={() => setView('login')} />
        )}
      </div>
    </div>
  );
}

export default AuthModal;
