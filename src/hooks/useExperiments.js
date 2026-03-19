import { usePowerSync } from '../context/PowerSyncContext';
import { useAuth } from '../context/AuthContext';
import { analyzeExperiment } from '../lib/mastra/agents';
import { supabase } from '../lib/supabaseClient';

export const useExperiments = () => {
  const { db } = usePowerSync();
  const { user } = useAuth();

  // Create new experiment (stored locally first)
  const createExperiment = async (experimentData) => {
    const experiment = {
      id: crypto.randomUUID(),
      user_id: user.id,
      ...experimentData,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.execute(
      `INSERT INTO experiments (id, user_id, lab_type, experiment_type, title, parameters, results, measurements, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        experiment.id,
        experiment.user_id,
        experiment.lab_type,
        experiment.experiment_type,
        experiment.title,
        JSON.stringify(experiment.parameters || {}),
        JSON.stringify(experiment.results || {}),
        JSON.stringify(experiment.measurements || []),
        experiment.status,
        experiment.created_at,
        experiment.updated_at
      ]
    );

    return experiment;
  };

  // Update experiment
  const updateExperiment = async (id, updates) => {
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = Object.values(updates).map(val => 
      typeof val === 'object' ? JSON.stringify(val) : val
    );

    await db.execute(
      `UPDATE experiments SET ${setClause}, updated_at = ? WHERE id = ?`,
      [...values, new Date().toISOString(), id]
    );
  };

  // Complete experiment and trigger AI analysis
  const completeExperiment = async (id) => {
    // Get experiment data
    const result = await db.getAll('SELECT * FROM experiments WHERE id = ?', [id]);
    const experiment = result[0];

    if (!experiment) return;

    // Update status
    await updateExperiment(id, {
      status: 'completed',
      completed_at: new Date().toISOString()
    });

    // Trigger AI analysis workflow
    try {
      const analysis = await analyzeExperiment({
        lab_type: experiment.lab_type,
        experiment_type: experiment.experiment_type,
        parameters: JSON.parse(experiment.parameters),
        measurements: JSON.parse(experiment.measurements),
        results: JSON.parse(experiment.results)
      });

      // Store analysis
      await db.execute(
        `INSERT INTO experiment_analyses (id, experiment_id, analysis_text, observations, conclusions, insights, generated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          id,
          analysis.analysis_text,
          JSON.stringify(analysis.observations),
          JSON.stringify(analysis.conclusions),
          JSON.stringify(analysis.insights),
          analysis.generated_at
        ]
      );

      // Create notebook entry
      await createNotebookEntry({
        experiment_id: id,
        title: experiment.title,
        content: `Experiment completed on ${new Date().toLocaleDateString()}`,
        ai_explanation: analysis.analysis_text
      });

      return analysis;
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  // Get user's experiments
  const getExperiments = async () => {
    const results = await db.getAll(
      'SELECT * FROM experiments WHERE user_id = ? ORDER BY created_at DESC',
      [user.id]
    );
    return results.map(exp => ({
      ...exp,
      parameters: JSON.parse(exp.parameters || '{}'),
      results: JSON.parse(exp.results || '{}'),
      measurements: JSON.parse(exp.measurements || '[]')
    }));
  };

  // Get single experiment
  const getExperiment = async (id) => {
    const results = await db.getAll('SELECT * FROM experiments WHERE id = ?', [id]);
    if (results.length === 0) return null;
    
    const exp = results[0];
    return {
      ...exp,
      parameters: JSON.parse(exp.parameters || '{}'),
      results: JSON.parse(exp.results || '{}'),
      measurements: JSON.parse(exp.measurements || '[]')
    };
  };

  // Create notebook entry
  const createNotebookEntry = async (entryData) => {
    const entry = {
      id: crypto.randomUUID(),
      user_id: user.id,
      ...entryData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.execute(
      `INSERT INTO notebook_entries (id, user_id, experiment_id, title, content, ai_explanation, graphs, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.id,
        entry.user_id,
        entry.experiment_id,
        entry.title,
        entry.content || '',
        entry.ai_explanation || '',
        JSON.stringify(entry.graphs || []),
        entry.created_at,
        entry.updated_at
      ]
    );

    return entry;
  };

  // Get notebook entries
  const getNotebookEntries = async () => {
    const results = await db.getAll(
      'SELECT * FROM notebook_entries WHERE user_id = ? ORDER BY created_at DESC',
      [user.id]
    );
    return results.map(entry => ({
      ...entry,
      graphs: JSON.parse(entry.graphs || '[]')
    }));
  };

  return {
    createExperiment,
    updateExperiment,
    completeExperiment,
    getExperiments,
    getExperiment,
    createNotebookEntry,
    getNotebookEntries
  };
};
