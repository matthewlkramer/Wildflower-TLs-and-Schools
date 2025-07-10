import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserFilterContextType {
  showOnlyMyRecords: boolean;
  setShowOnlyMyRecords: (value: boolean) => void;
  currentUser: string | null;
  setCurrentUser: (user: string | null) => void;
}

const UserFilterContext = createContext<UserFilterContextType>({
  showOnlyMyRecords: false,
  setShowOnlyMyRecords: () => {},
  currentUser: null,
  setCurrentUser: () => {},
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
  const [showOnlyMyRecords, setShowOnlyMyRecords] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Load user filter preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('showOnlyMyRecords');
    if (saved) {
      setShowOnlyMyRecords(JSON.parse(saved));
    }

    // For demo purposes, set a default user
    // In a real app, this would come from authentication
    const savedUser = localStorage.getItem('currentUser');
    setCurrentUser(savedUser || 'demo-user');
  }, []);

  // Save user filter preference to localStorage
  useEffect(() => {
    localStorage.setItem('showOnlyMyRecords', JSON.stringify(showOnlyMyRecords));
  }, [showOnlyMyRecords]);

  const value = {
    showOnlyMyRecords,
    setShowOnlyMyRecords,
    currentUser,
    setCurrentUser,
  };

  return (
    <UserFilterContext.Provider value={value}>
      {children}
    </UserFilterContext.Provider>
  );
};