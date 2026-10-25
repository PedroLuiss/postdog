import { useRef, useEffect, useMemo } from 'react';
import { UserTableRow } from '../UserTableRow/UserTableRow';
import { UserMobileCard } from '../UserMobileCard/UserMobileCard';
import { UseUserTableProps } from '../types';

export const useUserTable = ({
    users,
    selectedUserIds,
    onToggleSelect,
    onAction,
    isVendor,
    hasMore,
    isFetchingMore,
    onLoadMore
}: UseUserTableProps) => {
    const observerTarget = useRef<HTMLTableRowElement>(null);
    const observerTargetMobile = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const desktopTarget = observerTarget.current;
        const mobileTarget = observerTargetMobile.current;
        
        const observer = new IntersectionObserver(
            entries => {
                const isIntersecting = entries.some(entry => entry.isIntersecting);
                if (isIntersecting && hasMore && !isFetchingMore) {
                    onLoadMore();
                }
            },
            { 
                threshold: 0.1 
            }
        );

        if (desktopTarget) observer.observe(desktopTarget);
        if (mobileTarget) observer.observe(mobileTarget);
        
        return () => observer.disconnect();
    }, [hasMore, isFetchingMore, onLoadMore]);

    const isSelectedAll = users.length > 0 && selectedUserIds.length === users.length;

    const userRows = useMemo(() => {
        return users.map((user) => (
            <UserTableRow 
                key={user.uid} 
                user={user} 
                isSelected={selectedUserIds.includes(user.uid)}
                onToggleSelect={onToggleSelect}
                onAction={onAction}
                isVendor={isVendor}
            />
        ));
    }, [users, selectedUserIds, onToggleSelect, onAction, isVendor]);

    const mobileCards = useMemo(() => {
        return users.map((user) => (
            <UserMobileCard
                key={user.uid}
                user={user}
                isSelected={selectedUserIds.includes(user.uid)}
                onToggleSelect={onToggleSelect}
                onAction={onAction}
                isVendor={isVendor}
            />
        ));
    }, [users, selectedUserIds, onToggleSelect, onAction, isVendor]);

    return {
        observerTarget,
        observerTargetMobile,
        scrollContainerRef,
        isSelectedAll,
        userRows,
        mobileCards
    };
};