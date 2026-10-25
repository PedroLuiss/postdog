import { useState, useEffect, useRef } from 'react';
import { useSidebar } from '../../../context/SidebarContext';

export const useHeaderComponent = () => {
  const { toggleSidebar } = useSidebar();

  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isNotificationsMenuOpen, setNotificationsMenuOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isPreferentialRatesModalOpen, setPreferentialRatesModalOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsMenuRef = useRef<HTMLDivElement>(null);

  const toggleUserMenu = () => {
    setNotificationsMenuOpen(false);
    setUserMenuOpen((prev) => !prev);
  };

  const toggleNotificationsMenu = () => {
    setUserMenuOpen(false);
    setNotificationsMenuOpen((prev) => !prev);
  };

  const handleLogoEnter = () => setIsLogoHovered(true);
  const handleLogoLeave = () => setIsLogoHovered(false);

  const togglePreferentialRatesModal = () => {
    setUserMenuOpen(false);
    setNotificationsMenuOpen(false);
    setPreferentialRatesModalOpen((prev) => !prev);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(event.target as Node)) {
        setNotificationsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    toggleSidebar,
    isUserMenuOpen,
    toggleUserMenu,
    isNotificationsMenuOpen,
    toggleNotificationsMenu,
    isLogoHovered,
    handleLogoEnter,
    handleLogoLeave,
    userMenuRef,
    notificationsMenuRef,
    isPreferentialRatesModalOpen,
    togglePreferentialRatesModal
  };
};