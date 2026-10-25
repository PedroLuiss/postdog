import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { navItems } from '../../../config/sidebar.config';
import styles from './Sidebar.module.scss';
import { useAppContext } from '../../../context/AppContext';

interface SidebarNavProps {
  isSidebarOpen: boolean;
  openGroup: string;
  currentLocation: any;
  handleGroupClick: (group: string) => void;
  closeSidebarOnMobile: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({
  isSidebarOpen,
  openGroup,
  currentLocation,
  handleGroupClick,
  closeSidebarOnMobile,
}) => {
  const { user } = useAppContext();
  const userRole = (user?.role || '').toUpperCase();

  const filteredItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  return (
    <nav className={styles['sidebar__nav']}>
      {filteredItems.map((item) => {
        const hasSubItems = !!item.subItems;
        
        const isActiveGroup = hasSubItems && item.subItems?.some(sub => 
            currentLocation.pathname.startsWith(sub.path)
        );

        const isListOpen = isSidebarOpen && openGroup === item.name;

        return (
          <div key={item.name}>
            {hasSubItems ? (
              <>
                <button 
                  type="button"
                  className={`${styles['sidebar__navItem']} ${isActiveGroup ? styles['sidebar__navItem--active'] : ''}`}
                  onClick={() => handleGroupClick(item.name)}
                >
                  <div className={styles['sidebar__navContent']}>
                    {item.icon}
                    <span className={styles['sidebar__navLabel']}>{item.name}</span>
                  </div>
                  {isSidebarOpen && (
                    <ChevronRight 
                      size={16} 
                      className={`${styles['sidebar__arrow']} ${isListOpen ? styles['sidebar__arrow--open'] : ''}`} 
                    />
                  )}
                </button>
                
                <div className={`${styles['sidebar__subList']} ${isListOpen ? styles['sidebar__subList--open'] : ''}`}>
                  {item.subItems?.filter(sub => !sub.roles || sub.roles.includes(userRole)).map((sub) => (
                    <NavLink
                      key={sub.name}
                      to={sub.path}
                      className={({ isActive }) => 
                        `${styles['sidebar__subNavLink']} ${isActive ? styles['sidebar__subNavLink--active'] : ''}`
                      }
                      onClick={closeSidebarOnMobile} 
                    >
                      {sub.icon}
                      <span>{sub.name}</span>
                    </NavLink>
                  ))}
                </div>
              </>
            ) : (
              <NavLink 
                to={item.path!} 
                className={({ isActive }) => `${styles['sidebar__navItem']} ${isActive ? styles['sidebar__navItem--active'] : ''}`}
                onClick={closeSidebarOnMobile}
              >
                <div className={styles['sidebar__navContent']}>
                  {item.icon}
                  <span className={styles['sidebar__navLabel']}>{item.name}</span>
                </div>
              </NavLink>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default SidebarNav;