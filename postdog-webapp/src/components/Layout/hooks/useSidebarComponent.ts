import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../../context/SidebarContext';
import { navItems } from '../../../config/sidebar.config';

export const useSidebarComponent = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const currentLocation = useLocation();
  const navigate = useNavigate();

  const findGroupNameByPath = useCallback((path: string) => {
    const activeItem = navItems.find(item => 
      item.subItems?.some(sub => path.startsWith(sub.path))
    );
    return activeItem ? activeItem.name : '';
  }, []);

  const [openGroup, setOpenGroup] = useState<string>(() => findGroupNameByPath(window.location.pathname));
  
  const sidebarRef = useRef<HTMLElement>(null);
  const lastPathname = useRef(currentLocation.pathname);

  useEffect(() => {
    if (!isSidebarOpen) {
      setOpenGroup('');
      return;
    }

    const currentGroupName = findGroupNameByPath(currentLocation.pathname);
    const previousGroupName = findGroupNameByPath(lastPathname.current);

    if (currentGroupName !== previousGroupName) {
      setOpenGroup(currentGroupName);
    }

    lastPathname.current = currentLocation.pathname;
  }, [currentLocation.pathname, isSidebarOpen, findGroupNameByPath]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth <= 1023 && isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        toggleSidebar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, toggleSidebar]);

  const handleGroupClick = (group: string) => {
    if (!isSidebarOpen) {
      toggleSidebar();
      setOpenGroup(group);
      return;
    }
    setOpenGroup(prev => (prev === group ? '' : group));
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 1023) toggleSidebar();
  };

  const redirectQuotePage = () => {
    navigate('/shipping/quote');
    if (window.innerWidth <= 1023) toggleSidebar();
  };

  return {
    isSidebarOpen,
    openGroup,
    sidebarRef,
    currentLocation,
    handleGroupClick,
    redirectQuotePage,
    closeSidebarOnMobile
  };
};