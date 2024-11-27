import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminSettingsProvider } from './contexts/AdminSettingsContext';

function App() {
  return (
    <AdminSettingsProvider>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminLayout />} />
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </Router>
    </AdminSettingsProvider>
  );
}

export default App;