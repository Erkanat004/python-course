import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Lectures from './pages/Lectures';
import LectureDetail from './pages/LectureDetail';
import Tests from './pages/Tests';
import TestDetail from './pages/TestDetail';
import TestResult from './pages/TestResult';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Compiler from './pages/Compiler';
import './App.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/lectures/:id" element={<LectureDetail />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/tests/:id" element={<TestDetail />} />
          <Route path="/tests/:id/result" element={<TestResult />} />
          <Route path="/compiler" element={<Compiler />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
