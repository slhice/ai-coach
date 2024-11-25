import React, { useState, useEffect } from 'react';
import { Key, AlertCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const [attempts, setAttempts] = useState(() => {
    const saved = sessionStorage.getItem('loginAttempts');
    return saved ? JSON.parse(saved) : { count: 0, lockUntil: null };
  });

  useEffect(() => {
    sessionStorage.setItem('loginAttempts', JSON.stringify(attempts));
  }, [attempts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if account is locked
    if (attempts.lockUntil && new Date().getTime() < attempts.lockUntil) {
      const minutesLeft = Math.ceil((attempts.lockUntil - new Date().getTime()) / (1000 * 60));
      setError(`Account is locked. Try again in ${minutesLeft} minutes`);
      return;
    }

    // Get the stored password and security settings
    const savedConfig = localStorage.getItem('aiCoachConfig');
    const config = savedConfig ? JSON.parse(savedConfig) : {};
    const correctPassword = config.admin?.password || 'admin123';
    const maxAttempts = config.admin?.maxLoginAttempts || 3;
    const lockoutDuration = config.admin?.lockoutDuration || 15;

    if (password === correctPassword) {
      // Reset attempts on successful login
      setAttempts({ count: 0, lockUntil: null });
      sessionStorage.setItem('adminAuthenticated', 'true');
      navigate('/admin');
    } else {
      const newAttempts = attempts.count + 1;
      if (newAttempts >= maxAttempts) {
        // Lock the account
        const lockUntil = new Date().getTime() + (lockoutDuration * 60 * 1000);
        setAttempts({ count: 0, lockUntil });
        setError(`Too many failed attempts. Account locked for ${lockoutDuration} minutes`);
      } else {
        setAttempts({ ...attempts, count: newAttempts });
        setError(`Invalid password. ${maxAttempts - newAttempts} attempts remaining`);
      }
    }
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={attempts.lockUntil && new Date().getTime() < attempts.lockUntil}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};