import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please check your email and confirm your account before signing in.');
      } else if (error.message.includes('rate limit')) {
        setError('Too many login attempts. Please try again in a few minutes.');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        setError('Unable to connect to authentication service. Please check your internet connection and Supabase configuration.');
      } else if (error.message.includes('Invalid API key')) {
        setError('Authentication service configuration error. Please contact support.');
      } else {
        setError(error.message || 'Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-between bg-gray-50 border-r border-gray-200 p-12">
          <Link to="/" className="text-2xl font-semibold text-gray-900">
            ExperimentAI
          </Link>
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-4 leading-tight">
              Interactive Science Experiments in Your Browser
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Run physics, electrical, and astronomy experiments with real-time simulations and AI-powered insights.
            </p>
          </div>
          <div className="text-sm text-gray-500">
            © 2026 ExperimentAI. All rights reserved.
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8">
              <Link to="/" className="text-2xl font-semibold text-gray-900">
                ExperimentAI
              </Link>
            </div>
            
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-600">Sign in to continue your experiments</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              <div className="text-center text-sm pt-4 border-t border-gray-200">
                <span className="text-gray-600">Don't have an account? </span>
                <Link to="/signup" className="text-black font-medium hover:underline">
                  Sign up for free
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
