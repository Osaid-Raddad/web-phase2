import React from 'react'
import styles from './sidenavbar.module.css';
import { Link } from 'react-router-dom';
export default function SideNavbar() {
  
    return (
      <div className={`${styles.sidebar}  text-white w-40 min-h-screen`}>
        <ul className={`${styles.mt} flex flex-col p-2 space-y-2`}>
          <li><Link to={"home"} className="hover:bg-gray-700 p-2 block rounded text-white">Home</Link></li>
          <li><Link to={"projects"} className="hover:bg-gray-700 p-2 block rounded text-white">Projects</Link></li>
          <li><Link to={"tasks"} className="hover:bg-gray-700 p-2 block rounded text-white">Tasks</Link></li>
          <li><Link to={"chat"} className="hover:bg-gray-700 p-2 block rounded text-white">Chat</Link></li>
        </ul>
      </div>
    );
  
}
