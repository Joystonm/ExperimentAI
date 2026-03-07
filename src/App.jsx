import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LabProvider } from './context/LabContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Physics from './pages/Physics';
import Playground from './pages/Playground';
import Astronomy from './pages/Astronomy';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <LabProvider>
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<ProtectedRoute><Navbar /><Home /></ProtectedRoute>} />
              <Route path="/physics" element={<ProtectedRoute><Navbar /><Physics /></ProtectedRoute>} />
              <Route path="/playground" element={<ProtectedRoute><Navbar /><Playground /></ProtectedRoute>} />
              <Route path="/astronomy" element={<ProtectedRoute><Navbar /><Astronomy /></ProtectedRoute>} />
            </Routes>
          </div>
        </LabProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
