import React from 'react';
import styles from './Backdrop.module.scss';

interface BackdropProps {
  onClick: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({ onClick }) => {
  return <div className={styles['backdrop']} onClick={onClick}></div>;
};

export default Backdrop;