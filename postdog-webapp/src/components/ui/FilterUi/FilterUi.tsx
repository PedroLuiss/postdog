import React from 'react';
import styles from './FilterUi.module.scss';
import { SearchIcon } from '../../icons';
import {
    FilterUiProps,
    FilterSearchProps,
    FilterOptionsProps,
    FilterActionsProps,
    FilterTagProps,
    FilterModalUiProps
} from './types/filterUi.types';

const FilterSearch: React.FC<FilterSearchProps> = ({
    value,
    onChange,
    placeholder = 'Escribe el alias o la dirección',
    onKeyDown,
    className = '',
    style = {},
    iconSize = 16
}) => {
    return (
        <div className={`${styles['filter-ui__search-wrapper']} ${className}`} style={style}>
            <SearchIcon
                className={styles['filter-ui__search-icon']}
                width={iconSize}
                height={iconSize}
                strokeColor="#9ca3af"
            />
            <input
                type="text"
                className={styles['filter-ui__input']}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
            />
        </div>
    );
};

const FilterOptions: React.FC<FilterOptionsProps> = ({ children, className = '', style = {} }) => (
    <div className={`${styles['filter-ui__options']} ${className}`} style={style}>
        {children}
    </div>
);

const FilterActions: React.FC<FilterActionsProps> = ({ children, className = '', style = {} }) => (
    <div className={`${styles['filter-ui__actions']} ${className}`} style={style}>
        {children}
    </div>
);

const FilterTag: React.FC<FilterTagProps> = ({ children, className = '', variant = 'default', style = {} }) => (
    <div className={`${styles['filter-ui__tag']} ${styles[`filter-ui__tag--${variant}`]} ${className}`} style={style}>
        {children}
    </div>
);

const FilterModal: React.FC<FilterModalUiProps> = ({
    children,
    title,
    onClear,
    showClear = false,
    className = '',
    headerClassName = '',
    titleClassName = '',
    contentClassName = '',
    clearButtonClassName = '',
    style = {},
    onClose
}) => {
    return (
        <div className={`${styles['filter-ui__modal']} ${className}`} style={style}>
            <div className={`${styles['filter-ui__modal-header']} ${headerClassName}`}>
                {title && <h4 className={`${styles['filter-ui__modal-title']} ${titleClassName}`}>{title}</h4>}
                {showClear && onClear && (
                    <button
                        className={`${styles['filter-ui__modal-clear-button']} ${clearButtonClassName}`}
                        onClick={onClear}
                    >
                        Limpiar
                    </button>
                )}
            </div>
            <div className={`${styles['filter-ui__modal-content']} ${contentClassName}`}>
                {children}
            </div>
        </div>
    );
};

export const FilterUi: React.FC<FilterUiProps> & {
    Search: typeof FilterSearch,
    Options: typeof FilterOptions,
    Actions: typeof FilterActions,
    Tag: typeof FilterTag,
    Modal: typeof FilterModal
} = ({
    children,
    className = ''
}) => {
        return (
            <div className={`${styles['filter-ui']} ${className}`}>
                {children}
            </div>
        );
    };

FilterUi.Search = FilterSearch;
FilterUi.Options = FilterOptions;
FilterUi.Actions = FilterActions;
FilterUi.Tag = FilterTag;
FilterUi.Modal = FilterModal;
