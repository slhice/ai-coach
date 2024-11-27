import React from 'react';
import { createRoot } from 'react-dom/client';
import { FloatingWidget } from './FloatingWidget';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <React.StrictMode>
    <FloatingWidget />
  </React.StrictMode>
);