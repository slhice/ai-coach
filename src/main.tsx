import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FloatingWidget } from './FloatingWidget';
import { AdminPanel } from './components/admin/AdminPanel';
import { LoginPage } from './components/admin/LoginPage';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<FloatingWidget />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  </React.StrictMode>
);