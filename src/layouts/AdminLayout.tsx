import React from 'react';
import { AdminPanel } from '../components/Admin/AdminPanel';
import { useNavigate } from 'react-router-dom';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminPanel onClose={() => navigate('/')} />
    </div>
  );
};