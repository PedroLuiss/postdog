import React from 'react';
import styles from './Header.module.scss';
import HeaderActions from './HeaderActions';
import { useHeaderComponent } from '../hooks/useHeaderComponent';
import { PreferentialRatesModal } from '../../PreferentialRatesModal/PreferentialRatesModal';

interface HeaderProps {
  title: string;
  logoutUser: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, logoutUser }) => {
  const {
    toggleSidebar,
    isUserMenuOpen,
    toggleUserMenu,
    isLogoHovered,
    handleLogoEnter,
    handleLogoLeave,
    userMenuRef,
    isNotificationsMenuOpen,
    toggleNotificationsMenu,
    notificationsMenuRef,
    isPreferentialRatesModalOpen,
    togglePreferentialRatesModal
  } = useHeaderComponent();

  return (
    <header className={styles['header']}>
      <div className={styles['header__container']}>

        <div className={styles['header__left']}>
          <button
            className={styles['header__toggle']}
            onClick={toggleSidebar}
            aria-label="Abrir menú"
          >
            {/* <TextAlignJustify size={24} /> */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu w-6 h-6">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
          <h1 className={styles['header__title']}>{title}</h1>
        </div>

        <HeaderActions
          isLogoHovered={isLogoHovered}
          handleLogoEnter={handleLogoEnter}
          handleLogoLeave={handleLogoLeave}
          toggleUserMenu={toggleUserMenu}
          isUserMenuOpen={isUserMenuOpen}
          userMenuRef={userMenuRef as React.RefObject<HTMLDivElement>}
          isNotificationsMenuOpen={isNotificationsMenuOpen}
          toggleNotificationsMenu={toggleNotificationsMenu}
          notificationsMenuRef={notificationsMenuRef as React.RefObject<HTMLDivElement>}
          togglePreferentialRatesModal={togglePreferentialRatesModal}
        />

        <PreferentialRatesModal
          isOpen={isPreferentialRatesModalOpen}
          onClose={togglePreferentialRatesModal}
        />

      </div>
    </header>
  );
};

export default Header;