import React, { useState, useRef, useEffect } from 'react';

interface UseSwipeToDismissProps {
    onClose: () => void;
    threshold?: number;
    open: boolean;
}

export const useSwipeToDismiss = ({
    onClose,
    threshold = 100,
    open
}: UseSwipeToDismissProps) => {
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);

    const onStart = (clientX: number) => {
        setIsDragging(true);
        startX.current = clientX - dragOffset;
    };

    const onMove = (clientX: number) => {
        if (!isDragging) return;
        const currentOffset = Math.max(0, clientX - startX.current);
        setDragOffset(currentOffset);
    };

    const onEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        if (dragOffset > threshold) {
            onClose();
        } else {
            setDragOffset(0);
        }
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => onMove(e.clientX);
        const handleTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX);
        const handleEnd = () => onEnd();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchend', handleEnd);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, dragOffset]);

    useEffect(() => {
        if (open) {
            setDragOffset(0);
        }
    }, [open]);

    const opacity = Math.max(0, 1 - dragOffset / (threshold * 3));
    const transform = `translateX(${dragOffset}px) scale(${Math.max(0.95, 1 - dragOffset / 1000)})`;

    return {
        dragOffset,
        isDragging,
        onMouseDown: (e: React.MouseEvent) => onStart(e.clientX),
        onTouchStart: (e: React.TouchEvent) => onStart(e.touches[0].clientX),
        opacity,
        transform
    };
};
