import React from 'react';
import styles from './NotificationsMenu.module.scss';
import { BellOff } from 'lucide-react';
import { formatNotificationTime } from './utils';
import { useNotificationsMenu } from './hooks/useNotificationsMenu';
import { getNotificationIcon } from '../../../../utils/getNotificationIcon.utils';
import { getIcon } from '../../../Notifications/NotificationsList/utils';

const NotificationsMenu: React.FC = () => {
  const {
    recentNotifications,
    unreadCount,
    markAllAsRead,
    handleMarkAsRead,
    handleViewAll,
    loading,
    isFetchingMore,
    hasMore,
    loadMore
  } = useNotificationsMenu();

  const observerTarget = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, loadMore]);

  return (
    <div className={styles['notifications-menu']}>
      <div className={styles['notifications-menu__pointer']} />

      <div className={styles['notifications-menu__header']}>
        <h3 className={styles['notifications-menu__header-title']}>Notificaciones</h3>
        
        {unreadCount > 0 && (
          <button 
            className={styles['notifications-menu__header-link']}
            onClick={markAllAsRead}
          >
            Marcar como leídas
          </button>
        )}
      </div>

      <div className={styles['notifications-menu__list']}>
        {loading && recentNotifications.length === 0 ? (
          <div className={styles['notifications-menu__loading-more']}>
            <div className={styles['loader']} />
          </div>
        ) : recentNotifications.length > 0 ? (
          recentNotifications.map((n) => {
            const isGlobal = n.isGlobal === true;
            const priorityClass = isGlobal ? styles[`notification-item--${n.priority?.toLowerCase() || 'low'}`] : '';
            const isUnread = n.readAt === null;

            return (
              <div 
                key={n.uid} 
                className={`${styles['notification-item']} ${isUnread ? styles['notification-item--unread'] : ''} ${priorityClass}`}
                onClick={() => isUnread && handleMarkAsRead(n.uid)}
              >
                <div className={styles['notification-item__icon-wrapper']}>
                  {n.data?.type === 'ADMIN_NOTICE'? getNotificationIcon(true, n.data.icon) : isGlobal ? getNotificationIcon(true, n.icon) : getIcon(n.type)}
                  {isUnread && <div className={styles['notification-item__unread-dot']} />}
                </div>

                <div className={styles['notification-item__content']}>
                  <p className={styles['notification-item__title']}>{n.title}</p>
                  <p className={styles['notification-item__body']}>{n.body}</p>
                  <p className={styles['notification-item__time']}>
                    {formatNotificationTime(n.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles['notifications-menu__empty']}>
            <BellOff size={24} />
            <p>No tienes alertas recientes</p>
          </div>
        )}

        <div ref={observerTarget} style={{ height: '10px' }} />
        
        {isFetchingMore && (
          <div className={styles['notifications-menu__loading-more']}>
            <div className={styles['loader']} />
          </div>
        )}
      </div>

      <div className={styles['notifications-menu__footer']}>
        {/* <button 
          className={styles['notifications-menu__footer-link']}
          onClick={handleViewAll}
        >
          Ver todas tus notificaciones
        </button> */}
      </div>
    </div>
  );
};

export default NotificationsMenu;