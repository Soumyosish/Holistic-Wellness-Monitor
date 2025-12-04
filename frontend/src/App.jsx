// landingpage.jsx
import React from 'react';
import { 
  HashRouter as Router,  // This is correct
  Routes, 
  Route} from 'react-router-dom';
import LandingPage from '../src/components/LandingPage';
import Dashboard from '../src/components/DashBoard';

// Main App Component
const App = () => {
  return (
    <Router>  {/* This should work now */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;