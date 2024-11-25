import React from 'react';
import { Mic, Pencil } from 'lucide-react';

interface HeaderProps {
  showNotes: boolean;
  showVirtualChat: boolean;
  onToggleNotes: () => void;
  onToggleVirtualChat: () => void;
  voiceChatEnabled?: boolean;
  appName: string;
  showNotesEnabled?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  showNotes,
  showVirtualChat,
  onToggleNotes,
  onToggleVirtualChat,
  voiceChatEnabled = false,
  appName,
  showNotesEnabled = true
}) => {
  const [config, setConfig] = React.useState(() => {
    const savedConfig = localStorage.getItem('aiCoachConfig');
    return savedConfig ? JSON.parse(savedConfig) : {
      style: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF'
      }
    };
  });

  // Listen for config changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      const newConfig = localStorage.getItem('aiCoachConfig');
      if (newConfig) {
        setConfig(JSON.parse(newConfig));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {config.style.icon ? (
              <img 
                src={config.style.icon} 
                alt={appName} 
                className="w-8 h-8"
              />
            ) : null}
            <h1 className="text-2xl font-bold text-gray-800">{appName || 'AI Coach'}</h1>
          </div>
          <div className="flex items-center space-x-3">
            {showNotesEnabled && (
              <button
                onClick={onToggleNotes}
                style={{
                  backgroundColor: showNotes ? config.style.primaryColor : `${config.style.primaryColor}20`,
                  color: showNotes ? 'white' : config.style.primaryColor
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:opacity-90"
              >
                <Pencil className="w-5 h-5" />
                <span>{showNotes ? 'Hide Notes' : 'Show Notes'}</span>
              </button>
            )}
            
            {voiceChatEnabled && (
              <button
                onClick={onToggleVirtualChat}
                style={{
                  backgroundColor: showVirtualChat ? config.style.primaryColor : `${config.style.primaryColor}20`,
                  color: showVirtualChat ? 'white' : config.style.primaryColor
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:opacity-90"
              >
                <Mic className="w-5 h-5" />
                <span>{showVirtualChat ? 'Hide Voice Chat' : 'Voice Chat'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};