import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Check } from 'lucide-react';
import styles from './PaginationUi.module.scss';

interface PaginationUiProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
}

export const PaginationUi: React.FC<PaginationUiProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onRowsPerPageChange
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const options = [5, 10, 20, 50, 100];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const to = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className={styles['pagination']}>
            <div className={styles['pagination__left']}>
                <div className={styles['pagination__stats']}>
                    Mostrando {from} a {to} de {totalItems} envíos
                </div>

                <div className={styles['pagination__rows-per-page']}>
                    <span className={styles['pagination__rows-label']}>Filas por página:</span>
                    
                    <div className={styles['pagination__select-wrapper']} ref={menuRef}>
                        <button 
                            type="button" 
                            role="combobox"
                            className={styles['pagination__select-trigger']}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className={styles['pagination__select-value']}>{itemsPerPage}</span>
                            <ChevronDown size={16} className={styles['pagination__select-icon']} />
                        </button>

                        {isMenuOpen && (
                            <div className={styles['pagination__dropdown']}>
                                {options.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        className={`
                                            ${styles['pagination__option']} 
                                            ${itemsPerPage === option ? styles['pagination__option--active'] : ''}
                                        `}
                                        onClick={() => {
                                            onRowsPerPageChange(option);
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        <span>{option}</span>
                                        {itemsPerPage === option && <Check size={14} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles['pagination__nav']}>
                <button 
                    className={styles['pagination__nav-btn']}
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <ChevronLeft size={16} />
                    <span className={styles['pagination__nav-btn-text']}>Anterior</span>
                </button>

                <div className={styles['pagination__page-info']}>
                    Página {currentPage} de {totalPages}
                </div>

                <button 
                    className={styles['pagination__nav-btn']}
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <span className={styles['pagination__nav-btn-text']}>Siguiente</span>
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};