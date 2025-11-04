import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import OnboardingQuiz from './pages/OnboardingQuiz';
import Dashboard from './pages/Dashboard';
import FAQ from './pages/FAQ';
import History from './pages/History';

function App() {
  return (
    <Router>
      <Navbar />
      {/* This main tag has no padding, allowing pages to control their own layout */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quiz" element={<OnboardingQuiz />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
