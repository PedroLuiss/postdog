import { useEffect, useRef, ChangeEvent } from 'react';
import { useRealTimeNotificationsContext } from '../../../../context/RealTimeNotificationContext';

export const useNotificationsList = () => {
  const context = useRealTimeNotificationsContext();
  
  const {
    hasMore,
    isFetchingMore,
    loading,
    loadMore,
    setSearch
  } = context;

  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentTarget = observerTarget.current;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isFetchingMore, loading, loadMore]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return {
    ...context,
    observerTarget,
    handleSearchChange
  };
};