import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
      <LabProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/physics" element={<Physics />} />
                    <Route path="/playground" element={<Playground />} />
                    <Route path="/astronomy" element={<Astronomy />} />
                  </Routes>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </LabProvider>
    </AuthProvider>
  );
}

export default App;
