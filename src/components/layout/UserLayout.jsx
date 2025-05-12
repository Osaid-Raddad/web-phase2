import React from 'react';
import NameNav from '../navbar/nameNav/NameNav';
import SideNavbar from '../navbar/sideNav/SideNavbar';
import { Outlet } from 'react-router-dom';
import styles from './user.module.css';

export default function UserLayout() {
  return (
    <div className="flex  text-white"> 
        
        <SideNavbar />
     
      <div className="flex flex-col flex-1">
        <NameNav/>
        <div className={styles.line}></div>
        <div className={`${styles.bg} p-6 flex-1 overflow-y-auto`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
