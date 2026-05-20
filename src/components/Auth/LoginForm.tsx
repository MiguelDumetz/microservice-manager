import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = login(email, password);
    if (err) { setError(err); return; }
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-slate-400">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-400"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" className="w-full justify-center">Log in</Button>
      <p className="text-sm text-slate-400 text-center">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignup} className="text-white hover:underline">
          Sign up
        </button>
      </p>
    </form>
  );
}

export default LoginForm;
