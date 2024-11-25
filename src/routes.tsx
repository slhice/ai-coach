import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { AdminPanel } from './components/admin/AdminPanel';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/admin',
    element: <AdminPanel />
  }
]);