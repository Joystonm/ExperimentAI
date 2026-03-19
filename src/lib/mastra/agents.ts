// Simplified AI integration without Mastra (client-side compatible)

// Lab Assistant using Groq with Tavily
export async function askLabAssistant(question, experimentContext = null) {
  try {
    // Search for relevant scientific knowledge with Tavily
    const searchResults = await searchScientificKnowledge(question);
    
    const contextInfo = searchResults.length > 0 
      ? `\n\nRelevant scientific sources:\n${searchResults.map(r => `- ${r.title}: ${r.content}`).join('\n')}`
      : '';

    const experimentInfo = experimentContext 
      ? `\n\nCurrent experiment context:\n${JSON.stringify(experimentContext, null, 2)}`
      : '';

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'system',
          content: `You are an expert science educator and lab assistant for ExperimentAI. Explain physics, electrical, and astronomy concepts clearly. Analyze experiment data and provide insights. Guide students through experiments step-by-step.`
        }, {
          role: 'user',
          content: `${question}${contextInfo}${experimentInfo}`
        }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    return {
      answer: data.choices[0].message.content,
      sources: searchResults.map(r => ({ title: r.title, url: r.url }))
    };
  } catch (error) {
    console.error('AI Assistant error:', error);
    return {
      answer: 'Sorry, I encountered an error. Please try again.',
      sources: []
    };
  }
}

// Experiment Analyzer using Groq with Tavily
export async function analyzeExperiment(experimentData) {
  try {
    const { lab_type, experiment_type, parameters, measurements, results } = experimentData;
    
    // Search for relevant scientific information
    const searchQuery = `${experiment_type} physics experiment analysis`;
    const searchResults = await searchScientificKnowledge(searchQuery);
    
    const scientificContext = searchResults.length > 0
      ? `\n\nScientific Context:\n${searchResults.map(r => `- ${r.title}: ${r.content.substring(0, 200)}`).join('\n')}`
      : '';
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'system',
          content: 'You are a science educator analyzing student experiments. Provide structured analysis with observations, conclusions, and insights.'
        }, {
          role: 'user',
          content: `Analyze this ${lab_type} experiment:

Experiment Type: ${experiment_type}
Parameters: ${JSON.stringify(parameters, null, 2)}
Measurements: ${JSON.stringify(measurements, null, 2)}
Results: ${JSON.stringify(results, null, 2)}${scientificContext}

Provide:
1. Key observations from the data
2. Scientific conclusions
3. Educational insights
4. Suggestions for further exploration`
        }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const analysisText = data.choices[0].message.content;

    return {
      analysis_text: analysisText,
      observations: extractObservations(analysisText),
      conclusions: extractConclusions(analysisText),
      insights: extractInsights(analysisText),
      generated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Experiment analysis error:', error);
    return {
      analysis_text: 'Analysis failed. Please try again.',
      observations: [],
      conclusions: [],
      insights: [],
      generated_at: new Date().toISOString()
    };
  }
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

// Error detection using Groq
export async function detectExperimentErrors(experimentConfig) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'user',
          content: `Analyze this experiment configuration for errors or physically impossible setups:

${JSON.stringify(experimentConfig, null, 2)}

Identify any issues and explain the correct configuration.`
        }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error detection failed:', error);
    return 'Error detection unavailable.';
  }
}

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
