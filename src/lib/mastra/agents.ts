import { Mastra } from '@mastra/core';

// Initialize Mastra AI framework
export const mastra = new Mastra({
  agents: {},
  workflows: {}
});

// Lab Assistant Agent
export const labAssistant = mastra.agent({
  name: 'Lab Assistant',
  instructions: `You are an expert science educator and lab assistant for ExperimentAI, a virtual science laboratory platform.

Your role is to:
- Explain physics, electrical, and astronomy concepts clearly
- Analyze experiment data and provide insights
- Guide students through experiments step-by-step
- Interpret simulation results and measurements
- Suggest related experiments based on learning progress
- Detect errors in experiment configurations

When analyzing experiments:
- Reference the specific parameters and measurements
- Explain the underlying scientific principles
- Provide educational context and real-world applications
- Use clear, student-friendly language

Always be encouraging and educational in your responses.`,
  
  model: {
    provider: 'openai',
    name: 'gpt-4',
    toolChoice: 'auto'
  }
});

// Experiment Analyzer Workflow
export const experimentAnalyzerWorkflow = mastra.workflow({
  name: 'Experiment Analyzer',
  
  async execute({ experimentData }) {
    const { lab_type, experiment_type, parameters, measurements, results } = experimentData;
    
    // Step 1: Analyze experiment data
    const analysis = await labAssistant.generate({
      messages: [{
        role: 'user',
        content: `Analyze this ${lab_type} experiment:

Experiment Type: ${experiment_type}
Parameters: ${JSON.stringify(parameters, null, 2)}
Measurements: ${JSON.stringify(measurements, null, 2)}
Results: ${JSON.stringify(results, null, 2)}

Provide:
1. Key observations from the data
2. Scientific conclusions
3. Educational insights
4. Suggestions for further exploration`
      }]
    });

    // Step 2: Structure the analysis
    const structuredAnalysis = {
      analysis_text: analysis.text,
      observations: extractObservations(analysis.text),
      conclusions: extractConclusions(analysis.text),
      insights: extractInsights(analysis.text),
      generated_at: new Date().toISOString()
    };

    return structuredAnalysis;
  }
});

// Helper functions to parse AI response
function extractObservations(text) {
  const match = text.match(/observations?:?\s*([\s\S]*?)(?=conclusions?:|insights?:|$)/i);
  return match ? [match[1].trim()] : [];
}

function extractConclusions(text) {
  const match = text.match(/conclusions?:?\s*([\s\S]*?)(?=insights?:|suggestions?:|$)/i);
  return match ? [match[1].trim()] : [];
}

function extractInsights(text) {
  const match = text.match(/insights?:?\s*([\s\S]*?)(?=suggestions?:|$)/i);
  return match ? [match[1].trim()] : [];
}

// Tavily search integration for knowledge retrieval
export async function searchScientificKnowledge(query) {
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: import.meta.env.VITE_TAVILY_API_KEY,
        query: query,
        search_depth: 'advanced',
        include_domains: ['wikipedia.org', 'britannica.com', 'khanacademy.org', 'physicsclassroom.com'],
        max_results: 3
      })
    });

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Tavily search error:', error);
    return [];
  }
}

// Enhanced assistant with Tavily search
export async function askLabAssistant(question, experimentContext = null) {
  // Search for relevant scientific knowledge
  const searchResults = await searchScientificKnowledge(question);
  
  const contextInfo = searchResults.length > 0 
    ? `\n\nRelevant scientific sources:\n${searchResults.map(r => `- ${r.title}: ${r.content}`).join('\n')}`
    : '';

  const experimentInfo = experimentContext 
    ? `\n\nCurrent experiment context:\n${JSON.stringify(experimentContext, null, 2)}`
    : '';

  const response = await labAssistant.generate({
    messages: [{
      role: 'user',
      content: `${question}${contextInfo}${experimentInfo}`
    }]
  });

  return {
    answer: response.text,
    sources: searchResults.map(r => ({ title: r.title, url: r.url }))
  };
}

// Error detection agent
export async function detectExperimentErrors(experimentConfig) {
  const response = await labAssistant.generate({
    messages: [{
      role: 'user',
      content: `Analyze this experiment configuration for errors or physically impossible setups:

${JSON.stringify(experimentConfig, null, 2)}

Identify any issues and explain the correct configuration.`
    }]
  });

  return response.text;
}
