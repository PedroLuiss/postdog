import React from 'react';
import { Search, Plus } from 'lucide-react';
import styles from './PackageFilter.module.scss';
import ButtonUi from '../../ui/Button/ButtonUi';

interface PackageFilterProps {
  onSearch: (value: string) => void;
  onAddClick: () => void;
}

export const PackageFilter: React.FC<PackageFilterProps> = ({ onSearch, onAddClick }) => {

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const timeoutId = setTimeout(() => onSearch(value), 500);
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className={styles['package-filter']}>
      <div className={styles['package-filter__row']}>
        
        <div className={styles['package-filter__search-group']}>
          <Search className={styles['package-filter__icon']} />
           <input 
                type="text" 
                className={styles['package-filter__input']}
                placeholder="Escribe el alias o contenido del paquete"
                onChange={handleInputChange}
            />
        </div>

        <div className={styles['package-filter__actions']}>
          <ButtonUi 
            variant="primary" 
            icon={<Plus size={16} />} 
            onClick={onAddClick}
            fullWidth 
          >
            Agregar paquete
          </ButtonUi>
        </div>

      </div>
    </div>
  );
};