import React, { useState, useEffect } from 'react';
import styles from './signIn.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Slide } from 'react-toastify';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(false);
  const navigate = useNavigate();
  
  
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('SignedInUser'));
    if (savedUser?.staySignedIn) {
      toast.success(`Welcome Back ${savedUser.username}!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
        });
      navigate('/app'); 
    }
  }, [navigate]);

  const handleSignIn = (e) => {
    e.preventDefault();

    const admins = JSON.parse(localStorage.getItem('Admins')) || [];
    const students = JSON.parse(localStorage.getItem('Students')) || [];

    
    const foundAdmin = admins.find(
      (admin) => admin.username === username && admin.password === password
    );

    
    const foundStudent = students.find(
      (student) => student.username === username && student.password === password
    );

    if (foundAdmin || foundStudent) {
      const role = foundAdmin ? 'Admin' : 'Student';
      const user = { username, role, staySignedIn };

      localStorage.setItem('SignedInUser', JSON.stringify(user));
      const i = JSON.parse(localStorage.getItem('SignedInUser'));
      toast.success(`Signed in successfully ${i.username}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
        });
      navigate('/app'); 
    } else {
      toast.error('Invalid username or password!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
        });
    }
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center p-8">
      <form
        onSubmit={handleSignIn}
        className={`bg-zinc-900 rounded-lg shadow-md w-80 text-white ${styles.pad}`}
      >
        <h2 className="text-xl font-bold mb-4">Sign In</h2>

        <label className="block mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full p-2 rounded bg-zinc-800 ${styles.input}`}
          required
        />

        <label className="block mt-4 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-2 rounded bg-zinc-800 ${styles.input}`}
          required
        />

        <div className="flex items-center justify-between mt-4">
          <div className="cont">
            <input
              type="checkbox"
              id="stay"
              checked={staySignedIn}
              onChange={(e) => setStaySignedIn(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="stay">Stay Signed In</label>

          </div>
          <Link to={'/signup'} className={styles.LinkHover}>Sign Up</Link>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 mt-4 p-2 rounded text-white font-semibold text-center block"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
