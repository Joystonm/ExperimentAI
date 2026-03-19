import React from 'react';
import { Link } from 'react-router-dom';
import PendulumPreview from '../components/PendulumPreview';
import AstronomyPreview from '../components/AstronomyPreview';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 leading-tight">
                A Modern Virtual Science Lab for Interactive Experiments
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                ExperimentAI allows students and educators to run physics and electrical experiments directly in the browser with real-time simulations and intelligent analysis.
              </p>
              <div className="flex gap-4">
                <Link to="/physics" className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  Start Experimenting
                </Link>
                <Link to="/physics" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors">
                  View Demo
                </Link>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg h-96 flex items-center justify-center overflow-hidden">
              <AstronomyPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Everything you need to run experiments</h2>
            <p className="text-lg text-gray-600">Powerful tools for interactive science education</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Interactive Physics Simulations',
                description: 'Run pendulum, motion, optics, and mechanics experiments in real time.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              {
                title: 'Circuit Builder',
                description: 'Drag and connect electrical components to build and test circuits.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                )
              },
              {
                title: 'Astronomy Exploration',
                description: 'Simulate planetary motion and celestial mechanics.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: 'Experiment Data Insights',
                description: 'View measurements, graphs, and results instantly.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              {
                title: 'Real-time Analysis',
                description: 'Get immediate feedback and intelligent insights on your experiments.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )
              },
              {
                title: 'Educational Resources',
                description: 'Access built-in guides and explanations for every experiment.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview Section with 3D */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">PRODUCT PREVIEW</div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Run Interactive Science Experiments in Your Browser</h2>
              <div className="space-y-4 mb-8">
                <p className="text-gray-600">
                  Users can simulate experiments with realistic physics engines, interact with 3D models, and observe results in real time.
                </p>
                <p className="text-gray-600">
                  No installation required. All experiments run directly in your browser with instant feedback and detailed measurements.
                </p>
              </div>
              <Link to="/physics" className="inline-block px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors">
                Try Demo
              </Link>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg h-96 overflow-hidden">
              <PendulumPreview />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">How it works</h2>
            <p className="text-lg text-gray-600">Get started in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                step: '01', 
                title: 'Choose an Experiment', 
                description: 'Select from physics, circuits, or astronomy experiments',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                )
              },
              { 
                step: '02', 
                title: 'Run the Simulation', 
                description: 'Configure parameters and execute your experiment',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              { 
                step: '03', 
                title: 'Analyze the Results', 
                description: 'View data, graphs, and insights from your simulation',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                )
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-gray-700">
                  {item.icon}
                </div>
                <div className="text-sm font-medium text-gray-500 mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-semibold text-gray-900 mb-4">Start Running Experiments in Minutes</h2>
          <p className="text-lg text-gray-600 mb-8">No installation required. Access the full lab directly in your browser.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-gray-600">© 2026 ExperimentAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
