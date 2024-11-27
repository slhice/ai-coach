import React, { useState } from 'react';
import { AdminSettings } from '../../../types/admin';
import { AlertCircle } from 'lucide-react';

interface SecurityTabProps {
  settings: AdminSettings;
  onUpdate: (settings: AdminSettings) => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ settings, onUpdate }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (field: keyof typeof settings.security, value: string | number) => {
    const newSettings = {
      ...settings,
      security: {
        ...settings.security,
        [field]: value,
      },
    };
    onUpdate(newSettings);
  };

  const handlePasswordChange = () => {
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (currentPassword !== settings.security.password) {
      setPasswordError('Current password is incorrect');
      return;
    }

    if (!newPassword) {
      setPasswordError('New password is required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    handleChange('password', newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {passwordError && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              {passwordError}
            </div>
          )}
          <button
            onClick={handlePasswordChange}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Change Password
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Login Security</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Login Attempts
            </label>
            <input
              type="number"
              value={settings.security.maxAttempts}
              onChange={(e) => handleChange('maxAttempts', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lockout Duration (minutes)
            </label>
            <input
              type="number"
              value={settings.security.lockoutDuration}
              onChange={(e) => handleChange('lockoutDuration', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
              min="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};