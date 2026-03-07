# ExperimentAI

ExperimentAI is an AI-powered virtual science laboratory that allows students to perform physics, electrical, and astronomy experiments in an interactive browser-based environment. It combines real-time simulations with AI assistance to help users understand scientific concepts through hands-on experimentation.

## ✨ Features

- **🤖 AI Lab Assistant** - Provides explanations, experiment guidance, and analysis of results
- **⚗️ Interactive Physics Simulations** - Perform experiments such as pendulums, springs, motion, and optics
- **⚡ 2D Circuit Builder** - Drag-and-drop electrical components and create working circuits
- **🌌 Astronomy Exploration Lab** - Simulate celestial motion and space phenomena
- **📊 Real-time Experiment Data** - View measurements, graphs, and experiment outputs instantly
- **📚 Educational Explanations** - AI-generated insights to help students understand results
- **🔐 Authentication System** - Secure login/signup with Supabase

## 🛠️ Tech Stack

- **Frontend**: React 18, React Three Fiber, Three.js
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (Authentication & Database)
- **Build Tool**: Vite

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env file with Supabase credentials
cp .env.example .env
# Edit .env and add your Supabase URL and anon key

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔑 Environment Setup

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your [Supabase project settings](https://supabase.com/dashboard).

## 🔬 How It Works

ExperimentAI provides three main laboratory environments:

1. **Physics Lab** - 3D simulations of mechanics and optics experiments with real-time measurements
2. **Circuit Builder** - Interactive electrical circuit design with live feedback
3. **Astronomy Lab** - Explore celestial mechanics and gravitational interactions

Each lab features AI-powered assistance to guide learning and explain scientific concepts.

## 🎯 Future Improvements

- Enhanced AI explanations with natural language processing
- More experiment types (chemistry, biology simulations)
- Collaborative lab sessions for multiple users
- Export experiment data and generate reports
- Mobile app version
- VR/AR support for immersive learning
