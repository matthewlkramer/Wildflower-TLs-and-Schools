import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';

interface UserFilterContextType {
  showOnlyMyRecords: boolean;
  setShowOnlyMyRecords: (value: boolean) => void;
  currentUser: string | null;
}

const UserFilterContext = createContext<UserFilterContextType>({
  showOnlyMyRecords: false,
  setShowOnlyMyRecords: () => {},
  currentUser: null,
});

export const useUserFilter = () => {
  const context = useContext(UserFilterContext);
  if (!context) {
    throw new Error('useUserFilter must be used within a UserFilterProvider');
  }
  return context;
};

interface UserFilterProviderProps {
  children: React.ReactNode;
}

export const UserFilterProvider: React.FC<UserFilterProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [showOnlyMyRecords, setShowOnlyMyRecords] = useState(false);

  // Load user filter preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('showOnlyMyRecords');
    if (saved) {
      setShowOnlyMyRecords(JSON.parse(saved));
    }
  }, []);

  // Save user filter preference to localStorage
  useEffect(() => {
    localStorage.setItem('showOnlyMyRecords', JSON.stringify(showOnlyMyRecords));
  }, [showOnlyMyRecords]);

  const value = {
    showOnlyMyRecords,
    setShowOnlyMyRecords,
    currentUser: user?.email || null,
  };

  return (
    <UserFilterContext.Provider value={value}>
      {children}
    </UserFilterContext.Provider>
  );
};