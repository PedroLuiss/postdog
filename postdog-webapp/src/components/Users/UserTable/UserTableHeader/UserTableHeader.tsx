import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import styles from '../UserTable.module.scss';
import type { UserTableHeaderProps } from './types';

export const UserTableHeader: React.FC<UserTableHeaderProps> = ({
    onSelectAll, isSelectedAll, onSort, sortBy, sortOrder, isVendor
}) => {
    const renderSortIcon = (field: string) => {
        if (sortBy !== field) return <ArrowUpDown size={14} className={styles['users-table-card__sort-icon']} />;
        return sortOrder === 'ASC' 
            ? <ArrowUp size={14} className={styles['users-table-card__sort-icon--active']} /> 
            : <ArrowDown size={14} className={styles['users-table-card__sort-icon--active']} />;
    };

    return (
        <thead className={styles['users-table-card__thead']}>
            <tr>
                <th className={styles['users-table-card__th--check']}>
                    <input 
                        type="checkbox" 
                        className={styles['users-table-card__checkbox']} 
                        onChange={(e) => onSelectAll(e.target.checked)}
                        checked={isSelectedAll}
                        disabled={isVendor}
                        style={{ cursor: isVendor ? 'not-allowed' : 'pointer' }}
                    />
                </th>
                <th className={styles['users-table-card__th']} onClick={() => onSort('first_name')}>
                    <div className={styles['users-table-card__th-content']}>
                        Nombre {renderSortIcon('first_name')}
                    </div>
                </th>
                <th className={styles['users-table-card__th']} onClick={() => onSort('email')}>
                    <div className={styles['users-table-card__th-content']}>
                        Correo {renderSortIcon('email')}
                    </div>
                </th>
                <th className={styles['users-table-card__th']} onClick={() => onSort('phone_number')}>
                    <div className={styles['users-table-card__th-content']}>
                        Teléfono {renderSortIcon('phone_number')}
                    </div>
                </th>
                <th className={styles['users-table-card__th']} onClick={() => onSort('isVerified')}>
                    <div className={styles['users-table-card__th-content']}>
                        Verificado {renderSortIcon('isVerified')}
                    </div>
                </th>
                <th className={styles['users-table-card__th']} onClick={() => onSort('role_id')}>
                    <div className={styles['users-table-card__th-content']}>
                        Rol {renderSortIcon('role_id')}
                    </div>
                </th>
                <th className={styles['users-table-card__th']} onClick={() => onSort('plan')}>
                    <div className={styles['users-table-card__th-content']}>
                        Plan {renderSortIcon('plan')}
                    </div>
                </th>
                <th className={styles['users-table-card__th']}>Último envío</th>
                <th className={styles['users-table-card__th']} onClick={() => onSort('created_at')}>
                    <div className={styles['users-table-card__th-content']}>
                        Registro {renderSortIcon('created_at')}
                    </div>
                </th>
                <th className={styles['users-table-card__th']}></th>
            </tr>
        </thead>
    );
};
