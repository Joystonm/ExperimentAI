import React, { useState, useEffect } from 'react';
import { usePowerSync } from '../context/PowerSyncContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';

const LabNotebook = () => {
  const { db } = usePowerSync();
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    if (!user) return;
    loadEntries();
    const interval = setInterval(loadEntries, 2000);
    return () => clearInterval(interval);
  }, [db, user]);

  const loadEntries = async () => {
    if (!user) return;
    try {
      // Try local SQLite first (PowerSync), fall back to Supabase
      let results = [];
      if (db) {
        results = await db.getAll(
          'SELECT * FROM notebook_entries WHERE user_id = ? ORDER BY created_at DESC',
          [user.id]
        );
      }
      // If local is empty, fetch directly from Supabase
      if (results.length === 0) {
        const { data, error } = await supabase
          .from('notebook_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (!error && data) results = data;
      }
      console.log('Loaded notebook entries:', results);
      const parsedEntries = results.map(entry => ({
        ...entry,
        graphs: typeof entry.graphs === 'string' ? JSON.parse(entry.graphs || '[]') : (entry.graphs || [])
      }));
      setEntries(parsedEntries);
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Lab Notebook</h1>
          <p className="text-gray-600">Your experiment records and AI-generated insights</p>
        </div>

        {entries.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notebook entries yet</h3>
            <p className="text-gray-600">Complete experiments to automatically generate notebook entries</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Entries List */}
            <div className="md:col-span-1 space-y-3">
              {entries.map((entry) => (
                <motion.button
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedEntry?.id === entry.id
                      ? 'bg-white border-black shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{entry.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </p>
                </motion.button>
              ))}
            </div>

            {/* Entry Detail */}
            <div className="md:col-span-2">
              {selectedEntry ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{selectedEntry.title}</h2>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedEntry.created_at).toLocaleString()}
                    </p>
                  </div>

                  {selectedEntry.content && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Experiment Notes</h3>
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedEntry.content}</p>
                    </div>
                  )}

                  {selectedEntry.ai_explanation && (
                    <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <h3 className="text-base font-semibold text-gray-900">AI Analysis</h3>
                      </div>
                      <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                        {selectedEntry.ai_explanation.split('\n').map((line, idx) => {
                          // Handle headers
                          if (line.startsWith('####')) {
                            return <h4 key={idx} className="text-base font-semibold text-gray-900 mt-4 mb-2">{line.replace(/####/g, '').trim()}</h4>;
                          }
                          if (line.startsWith('###')) {
                            return <h3 key={idx} className="text-lg font-semibold text-gray-900 mt-5 mb-3">{line.replace(/###/g, '').trim()}</h3>;
                          }
                          // Handle bullet points
                          if (line.trim().startsWith('- **')) {
                            const content = line.replace(/^- \*\*/, '').replace(/\*\*:/, ':');
                            return <li key={idx} className="ml-4 mb-2 text-gray-700">{content}</li>;
                          }
                          if (line.trim().startsWith('- ')) {
                            return <li key={idx} className="ml-4 mb-2 text-gray-700">{line.replace(/^- /, '')}</li>;
                          }
                          // Handle bold text
                          if (line.includes('**')) {
                            const parts = line.split('**');
                            return (
                              <p key={idx} className="mb-2">
                                {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-900">{part}</strong> : part)}
                              </p>
                            );
                          }
                          // Regular paragraphs
                          if (line.trim()) {
                            return <p key={idx} className="mb-2">{line}</p>;
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}

                  {selectedEntry.graphs && Array.isArray(selectedEntry.graphs) && selectedEntry.graphs.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Graphs & Visualizations</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedEntry.graphs.map((graph, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <p className="text-sm text-gray-600">{graph.title || `Graph ${idx + 1}`}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <p className="text-gray-500">Select an entry to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabNotebook;
