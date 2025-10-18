import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Lectures from './pages/Lectures';
import LectureDetail from './pages/LectureDetail';
import Tests from './pages/Tests';
import TestDetail from './pages/TestDetail';
import TestResult from './pages/TestResult';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/lectures/:id" element={<LectureDetail />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/tests/:id" element={<TestDetail />} />
          <Route path="/tests/:id/result" element={<TestResult />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
