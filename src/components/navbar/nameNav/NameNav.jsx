import React from 'react'
import styles from './name.module.css';
import { useNavigate } from 'react-router-dom';
export default function NameNav() {
  const navigate = useNavigate();
  const signedInUser = JSON.parse(localStorage.getItem('SignedInUser'));

  const onLogout = () => {
    localStorage.removeItem('SignedInUser');
    navigate("/");
  };

  return (
    <div className={`${styles.bg} flex justify-end items-center text-white py-3 px-6 shadow-md`}>
      <span className={`${styles.nameText} font-semibold mr-4`}>
        {signedInUser?.role === 'Student' ? 'Student' : 'Admin'} {signedInUser?.username}
      </span>
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
