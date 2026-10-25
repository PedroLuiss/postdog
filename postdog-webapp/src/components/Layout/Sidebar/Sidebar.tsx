import React from 'react';
import styles from './Sidebar.module.scss';
import { Plus } from 'lucide-react';

import { useSidebarComponent } from '../hooks/useSidebarComponent';

import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';
import SidebarFooter from './SidebarFooter';

interface SidebarProps {
  logoutUser?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ logoutUser }) => {
  const {
    isSidebarOpen,
    openGroup,
    sidebarRef,
    currentLocation,
    handleGroupClick,
    redirectQuotePage,
    closeSidebarOnMobile
  } = useSidebarComponent();

  return (
    <aside 
      ref={sidebarRef}
      className={`${styles['sidebar']} ${isSidebarOpen ? styles['sidebar--open'] : ''}`}
    >
      <SidebarHeader />

      <div className={styles['sidebar__ctaWrapper']}>
        <button className={styles['sidebar__cta']} onClick={redirectQuotePage}>
          <Plus size={20} />
          <span>Crear envío</span>
        </button>
      </div>

      <SidebarNav 
        isSidebarOpen={isSidebarOpen}
        openGroup={openGroup}
        currentLocation={currentLocation}
        handleGroupClick={handleGroupClick}
        closeSidebarOnMobile={closeSidebarOnMobile}
      />

      <SidebarFooter 
        logoutUser={logoutUser} 
        closeSidebarOnMobile={closeSidebarOnMobile} 
      />
    </aside>
  );
};

export default Sidebar;