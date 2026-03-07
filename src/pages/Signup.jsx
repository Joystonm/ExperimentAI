import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const data = await signup(email, password, name);
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        setError('Please check your email to confirm your account before signing in.');
        setLoading(false);
        return;
      }
      
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.message.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (error.message.includes('rate limit')) {
        setError('Too many signup attempts. Please try again in a few minutes.');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        setError('Unable to connect to authentication service. Please check your internet connection and Supabase configuration.');
      } else if (error.message.includes('Invalid API key')) {
        setError('Authentication service configuration error. Please contact support.');
      } else {
        setError(error.message || 'Failed to create account. Please try again.');
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
              Start Your Scientific Journey Today
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Join thousands of students and educators exploring physics, circuits, and astronomy through interactive simulations.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-900 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Real-time physics simulations</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-900 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Interactive circuit builder</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-900 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">AI-powered experiment insights</span>
              </div>
            </div>
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
                Create your account
              </h2>
              <p className="text-gray-600">Get started with ExperimentAI for free</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                  placeholder="John Doe"
                />
              </div>

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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <div className="text-center text-sm pt-4 border-t border-gray-200">
                <span className="text-gray-600">Already have an account? </span>
                <Link to="/login" className="text-black font-medium hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
