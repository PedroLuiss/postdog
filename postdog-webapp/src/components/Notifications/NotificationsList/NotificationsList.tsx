import React from 'react';
import styles from './NotificationsList.module.scss';
import { BellOff, Search } from 'lucide-react';
import { getIcon, formatNotificationTime } from './utils';
import { getNotificationIcon } from '../../../utils/getNotificationIcon.utils';
import { NotificationItemSkeleton } from '../../ui/SkeletonUi/NotificationItemSkeleton/NotificationItemSkeleton';
import { FILTER_OPTIONS } from './constant';
import { useNotificationsList } from './hooks/useNotificationsList';

export const NotificationsList: React.FC = () => {
  const {
    notifications,
    loading,
    isFetchingMore,
    search,
    filterType,
    setFilterType,
    markAsRead,
    markAllAsRead,
    observerTarget,
    handleSearchChange
  } = useNotificationsList();

  return (
    <div className={styles['notifications-container']}>
      <div className={styles['notifications-header']}>
        <div className={styles['notifications-header__content']}>
          <h2 className={styles['notifications-header__title']}>Todas tus notificaciones</h2>
          <p className={styles['notifications-header__subtitle']}>Mantente al tanto de tus envíos y facturación</p>
        </div>
        <button
          className={styles['notifications-header__action']}
          onClick={markAllAsRead}
        >
          Marcar todas como leídas
        </button>
      </div>

      <div className={styles['notifications-filters']}>
        <div className={styles['search-box']}>
          <Search size={18} className={styles['search-box__icon']} />
          <input
            type="text"
            placeholder="Buscar notificaciones..."
            className={styles['search-box__input']}
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className={styles['filter-tabs']}>
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`${styles['filter-tab']} ${filterType === option.value ? styles['filter-tab--active'] : ''}`}
              onClick={() => setFilterType(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles['notifications-list']}>
        {loading && notifications.length === 0 ? (
          [...Array(5)].map((_, i) => (
            <NotificationItemSkeleton key={i} />
          ))
        ) : notifications.length > 0 ? (
          <>
            {notifications.map((n) => {
              const remainsUnread = n.readAt === null;
              const isGlobal = n.isGlobal === true;
              const priorityClass = isGlobal ? styles[`notification-item--${n.priority?.toLowerCase() || 'low'}`] : '';
              return (
              <div
                key={n.uid}
                className={`${styles['notification-item']} ${remainsUnread ? styles['notification-item--unread'] : ''} ${priorityClass}`}
                onClick={() => remainsUnread && markAsRead(n.uid)}
              >
                <div className={styles['notification-item__icon-container']}>
                  <div className={styles['notification-item__icon-wrapper']}>
                    {n.data?.type === 'ADMIN_NOTICE'? getNotificationIcon(true, n.data.icon) : isGlobal ? getNotificationIcon(true, n.icon) : getIcon(n.type)}
                  </div>
                </div>

                <div className={styles['notification-item__content']}>
                  <div className={styles['notification-item__top']}>
                    <h4 className={styles['notification-item__title']}>{n.title}</h4>
                    <span className={styles['notification-item__time']}>
                      {formatNotificationTime(n.createdAt)}
                    </span>
                  </div>
                  <div className={styles['notification-item__bottom']}>
                    <p className={styles['notification-item__body']}>{n.body}</p>
                    {n.readAt === null && <span className={styles['notification-item__unread-dot']} />}
                  </div>
                </div>
              </div>
              );
            })}

            <div ref={observerTarget} className={styles['notifications-list__loader']}>
              {isFetchingMore && (
                <div className={styles['notifications-list__fetching']}>
                  {[...Array(3)].map((_, i) => (
                    <NotificationItemSkeleton key={i} />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={styles['notifications-empty']}>
            <div className={styles['notifications-empty__icon']}>
              <BellOff size={48} />
            </div>
            <h3 className={styles['notifications-empty__title']}>No hay notificaciones</h3>
            <p className={styles['notifications-empty__text']}>
              {search || filterType !== 'ALL' 
                ? 'No se encontraron notificaciones con los filtros aplicados.' 
                : 'Te avisaremos cuando pase algo importante.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};