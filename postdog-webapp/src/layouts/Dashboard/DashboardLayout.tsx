import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import styles from './DashboardLayout.module.scss';
import Sidebar from '../../components/Layout/Sidebar/Sidebar';
import Header from '../../components/Layout/Header/Header';
import Backdrop from '../../components/Layout/Backdrop/Backdrop'; 

import { useSidebar } from '../../context/SidebarContext';
import { useAppContext } from '../../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children, title }) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar(); 
  const appContext = useAppContext();
  const appUser = appContext?.user;
  

  return (
    // !appUser ? (
    //   <Navigate to="/login" />
    // ) : (
    <div className={styles['layout']}>
      
      {isSidebarOpen && <Backdrop onClick={toggleSidebar} />}

      <div className={styles['layout__sidebar']}>
        <Sidebar logoutUser={appContext?.logoutUser} />
      </div>

      <div className={styles['layout__main']}>
        <Header logoutUser={appContext?.logoutUser || (() => {})} title={title} />
        <main className={styles['layout__content']}>
          {children}
        </main>
        
      </div>
    </div>
    // )
  );
};
export default DashboardLayout;