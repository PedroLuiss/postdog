import React from 'react';
import styles from './Header.module.scss';
import logo_white from "../../../assets/Logos/pug_white.png";
import logo_red from "../../../assets/Logos/pug_red.png";
import chihuahuaImg from "../../../assets/img/plans/Chiguagua.png";
import chihuahuaWhiteImg from "../../../assets/img/plans/ChiiguaguaWhiter.png";
import huskyImg from "../../../assets/img/plans/Husky.png";
import huskyWhiteImg from "../../../assets/img/plans/HuskyWhiter.png";
import pitbullImg from "../../../assets/img/plans/Pitbull.png";
import pitbullWhiteImg from "../../../assets/img/plans/PitbullWhiter.png";
import pugImg from "../../../assets/Logos/pug_red.png";
import pugWhiteImg from "../../../assets/Logos/pug_white.png";
import { Wallet, Bell, User } from 'lucide-react';
import ButtonUi from '../../../components/ui/Button/ButtonUi';
import useBuyCredits from './Hook/useBuyCredits';
import { SkeletonLoader } from '../../../components/ui/SkeletonLoader/SkeletonLoader';
import { BuyCreditsFormModal } from '../ModalCredits/BuyCreditsFormModal/BuyCreditsFormModal';
import { BuyCreditsModal } from '../ModalCredits/BuyCreditsModal/BuyCreditsModal';
import { useWalletContext } from '../../../context/WalletContext';
import { useAppContext } from '../../../context/AppContext';
import { useRealTimeNotificationsContext } from '../../../context/RealTimeNotificationContext';
import NotificationsMenu from './NotificationsMenu/NotificationsMenu';

interface HeaderActionsProps {
  isLogoHovered: boolean;
  handleLogoEnter: () => void;
  handleLogoLeave: () => void;
  toggleUserMenu: () => void;
  isUserMenuOpen: boolean;
  userMenuRef: React.RefObject<HTMLDivElement>;
  isNotificationsMenuOpen: boolean;
  toggleNotificationsMenu: () => void;
  notificationsMenuRef: React.RefObject<HTMLDivElement>;
  togglePreferentialRatesModal: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  isLogoHovered,
  handleLogoEnter,
  handleLogoLeave,
  toggleUserMenu,
  isUserMenuOpen,
  userMenuRef,
  isNotificationsMenuOpen,
  toggleNotificationsMenu,
  notificationsMenuRef,
  togglePreferentialRatesModal
}) => {
  const { isModalOpen, openModal, closeModal } = useBuyCredits();
  const { balance, isLoading } = useWalletContext();
  const { unreadCount, markAllAsRead } = useRealTimeNotificationsContext();
  const prevIsOpen = React.useRef(isNotificationsMenuOpen);

  React.useEffect(() => {
    if (prevIsOpen.current && !isNotificationsMenuOpen) {
      if (unreadCount > 0) {
        markAllAsRead();
      }
    }
    prevIsOpen.current = isNotificationsMenuOpen;
  }, [isNotificationsMenuOpen, unreadCount, markAllAsRead]);

  const context = useAppContext();
  const user = context?.user?.user || context?.user;
  const isVerified = user?.isVerified === true;
  const currentPlan = user?.plan || 'chihuahua';

  const getPlanIcon = (plan: string, isWhiter: boolean) => {
    switch (plan?.toLowerCase()) {
      case 'chihuahua': return isWhiter ? chihuahuaWhiteImg : chihuahuaImg;
      case 'husky': return isWhiter ? huskyWhiteImg : huskyImg;
      case 'pitbull': return isWhiter ? pitbullWhiteImg : pitbullImg;
      case 'pug': return isWhiter ? pugWhiteImg : pugImg;
      default: return isWhiter ? logo_white : logo_red;
    }
  };

  const planIcon = getPlanIcon(currentPlan, !isLogoHovered);

  return (
    <div className={styles['header__actions']}>
      <ButtonUi
        variant="dark-red"
        icon={<Wallet size={16} />}
        iconPosition="right"
        onClick={openModal}
        className={styles['header__btn--wallet']}
      >
        <span className={styles['header__wallet-text']}>
          <span>$</span>
          {isLoading || !balance ? (
            <SkeletonLoader
              type="wallet"
              width={80}
              height={15}
            />
          ) : (
            <>
              <span className={styles['header__balance-amount']}>
                {parseFloat(balance.balance).toFixed(2)}
              </span>
              <span className={styles['header__balance-currency']}>
                {` ${balance.currency}`}
              </span>
            </>
          )}
        </span>
      </ButtonUi>

      {isVerified ? (
        <BuyCreditsFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      ) : (
        <BuyCreditsModal
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}


      <ButtonUi
        variant="icon-circle"
        icon={<img 
          src={planIcon} 
          alt="Insignia" 
          className={styles['header__insignia-img']} 
          style={{ transform: currentPlan?.toLowerCase() !== 'pug' ? 'scale(2.2)' : 'none' }}
        />}
        iconPosition="right"
        onMouseEnter={handleLogoEnter}
        onMouseLeave={handleLogoLeave}
        onClick={isVerified ? togglePreferentialRatesModal : openModal}
      />

      <div className={styles['header__relative']} ref={notificationsMenuRef}>
        <ButtonUi
          variant="icon-circle"
          icon={<Bell size={16} className={unreadCount > 0 ? styles['header__shake'] : ''} />}
          iconPosition="right"
          onClick={toggleNotificationsMenu}
        />

        {unreadCount > 0 && (
          <span className={styles['header__badge']}>
            {unreadCount > 9 ? '+9' : unreadCount}
          </span>
        )}

        {isNotificationsMenuOpen && <NotificationsMenu />}
      </div>

      <div className={styles['header__relative']} ref={userMenuRef}>
        <ButtonUi
          variant="icon-circle"
          icon={<User size={16} />}
          iconPosition="right"
          onClick={toggleUserMenu}
        />

        {isUserMenuOpen && (
          <div className={styles['header__menu']}>
            <div style={{ padding: '1rem' }}>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default HeaderActions;