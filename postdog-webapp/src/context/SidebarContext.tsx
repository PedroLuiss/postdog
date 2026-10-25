import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { SubmenuData } from '../types/dashboard.type'; 

interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  submenuData: SubmenuData;
  setSubmenu: (data: SubmenuData) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1023);
  const [submenuData, setSubmenuData] = useState<SubmenuData>({ items: null, title: null });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1023) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const setSubmenu = (data: SubmenuData) => {
    setSubmenuData(data);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, submenuData, setSubmenu }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};