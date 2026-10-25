import React from 'react';
import styles from './Sidebar.module.scss';
import logo from "../../../assets/Logos/PostDog-Logo.png";

const SidebarHeader: React.FC = () => {
  return (
    <div className={styles['sidebar__header']}>
      <img src={logo} alt="PostDog" />
    </div>
  );
};

export default SidebarHeader;