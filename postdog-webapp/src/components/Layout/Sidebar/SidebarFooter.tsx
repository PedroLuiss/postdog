import React from 'react';
import { NavLink } from 'react-router-dom';
import { CircleHelp, LogOut } from 'lucide-react';
import styles from './Sidebar.module.scss';

interface SidebarFooterProps {
  logoutUser?: () => void;
  closeSidebarOnMobile: () => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ logoutUser, closeSidebarOnMobile }) => {
  return (
    <div className={styles['sidebar__footer']}>
      <NavLink
        to="/help"
        className={styles['sidebar__navItem']}
        onClick={closeSidebarOnMobile}
      >
        <div className={styles['sidebar__navContent']}>
          <CircleHelp size={20} />
          <span className={styles['sidebar__navLabel']}>Ayuda</span>
        </div>
      </NavLink>

      <button className={styles['sidebar__navItem']} onClick={logoutUser}>
        <div className={styles['sidebar__navContent']}>
          <LogOut size={20} />
          <span className={styles['sidebar__navLabel']}>Cerrar sesión</span>
        </div>
      </button>
    </div>
  );
};

export default SidebarFooter;