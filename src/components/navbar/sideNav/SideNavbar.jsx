import React from 'react'
import styles from './sidenavbar.module.css';
import { Link } from 'react-router-dom';
export default function SideNavbar() {
  
    return (
      
      <div className={`${styles.sidebar}  text-white w-40 min-h-screen`}>
        
        <ul className={`${styles.mt} flex flex-col p-2 space-y-2`}>
          <div className={`${styles.line} mt-2`}></div>
          <li><Link to={"home"} className={` ${styles.a} p-2 block rounded text-white mb-2 mt-2`}>Home</Link></li>
          <li><Link to={"projects"} className={` ${styles.a} p-2 block rounded text-white mb-2 `}>Projects</Link></li>
          <li><Link to={"tasks"} className={` ${styles.a}  p-2 block rounded text-white mb-2`}>Tasks</Link></li>
          <li><Link to={"chat"} className={` ${styles.a}  p-2 block rounded text-white `}>Chat</Link></li>
        </ul>
      </div>
    );
  
}
